use aiken/collection/list
use cardano/script_context.{ScriptContext, Spending}
use cardano/address.{Address, VerificationKey}
use cardano/assets.{lovelace_of}
use cardano/transaction.{Transaction, Output}

// Datum for donation tracking
pub type DonationDatum {
  // Donor information
  donor: Address,
  // NGO receiving the donation
  ngo: Address,
  // Amount donated in ADA
  amount: Int,
  // Timestamp of donation
  timestamp: Int,
  // Allocation breakdown (administration, aid, logistics percentages)
  allocation: AllocationBreakdown,
  // Donation purpose/category
  purpose: ByteArray,
  // Tracking ID for off-chain reference
  tracking_id: ByteArray,
  // Status of the donation
  status: DonationStatus,
}

// Allocation breakdown for fund usage
pub type AllocationBreakdown {
  administration: Int,
  aid_delivery: Int,
  logistics: Int,
}

// Status of donations
pub type DonationStatus {
  Pending
  Allocated
  Completed
  Disputed
}

// Redeemer for donation operations
pub type DonationRedeemer {
  CreateDonation
  AllocateFunds { new_allocation: AllocationBreakdown }
  WithdrawFunds { amount: Int, purpose: ByteArray }
  VerifySpending { recipient: Address, amount: Int }
}

// Main validator for donation contract
pub fn donation_validator(
  datum: DonationDatum,
  redeemer: DonationRedeemer,
  ctx: ScriptContext,
) -> Bool {
  let ScriptContext { transaction, info, .. } = ctx

  when info is {
    Spending { output: _, datum: _ } -> {
      when redeemer is {
        CreateDonation -> validate_donation_creation(datum, transaction)
        AllocateFunds { new_allocation } -> 
          validate_fund_allocation(datum, new_allocation, transaction)
        WithdrawFunds { amount, purpose } -> 
          validate_fund_withdrawal(datum, amount, purpose, transaction)
        VerifySpending { recipient, amount } -> 
          validate_spending_verification(datum, recipient, amount, transaction)
      }
    }
    _ -> False
  }
}

// Validate donation creation
fn validate_donation_creation(datum: DonationDatum, _tx: Transaction) -> Bool {
  // Basic validation for donation creation
  let valid_amount = datum.amount > 0
  let valid_timestamp = datum.timestamp > 0
  let valid_tracking_id = datum.tracking_id != ""
  let valid_initial_status = datum.status == Pending
  
  valid_amount && valid_timestamp && valid_tracking_id && valid_initial_status
}

// Validate fund allocation
fn validate_fund_allocation(
  datum: DonationDatum,
  new_allocation: AllocationBreakdown,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that total allocation is 100%
  let total_allocation = new_allocation.administration + new_allocation.aid_delivery + new_allocation.logistics
  let valid_allocation = total_allocation == 100 &&
                        new_allocation.administration >= 0 &&
                        new_allocation.aid_delivery >= 0 &&
                        new_allocation.logistics >= 0
  
  // Check that NGO signed the transaction
  let ngo_signed = when datum.ngo.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  valid_allocation && ngo_signed
}

// Validate fund withdrawal (only NGO can withdraw)
fn validate_fund_withdrawal(
  datum: DonationDatum,
  amount: Int,
  _purpose: ByteArray,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, outputs, .. } = tx
  
  // Check that NGO signed the transaction
  let ngo_signed = when datum.ngo.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that withdrawal amount is valid
  let valid_amount = amount > 0 && amount <= datum.amount
  
  // Check that purpose is provided
  let valid_purpose = True // Simplified validation
  
  // Check that funds go to NGO address
  let funds_to_ngo = list.any(outputs, fn(output) {
    output.address == datum.ngo && 
    lovelace_of(output.value) >= amount
  })
  
  ngo_signed && valid_amount && valid_purpose && funds_to_ngo
}

// Validate spending verification
fn validate_spending_verification(
  datum: DonationDatum,
  recipient: Address,
  amount: Int,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, outputs, .. } = tx
  
  // Check that NGO signed the transaction
  let ngo_signed = when datum.ngo.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that spending amount is valid
  let valid_amount = amount > 0 && amount <= datum.amount
  
  // Verify funds go to specified recipient
  let funds_to_recipient = list.any(outputs, fn(output) {
    output.address == recipient && 
    lovelace_of(output.value) >= amount
  })
  
  ngo_signed && valid_amount && funds_to_recipient
}

// Export the validator for use by frontend/backend
validator donation {
  spend(datum: Option<DonationDatum>, redeemer: DonationRedeemer, _output_reference, ctx: ScriptContext) -> Bool {
    when datum is {
      Some(d) -> donation_validator(d, redeemer, ctx)
      None -> False
    }
  }
}
