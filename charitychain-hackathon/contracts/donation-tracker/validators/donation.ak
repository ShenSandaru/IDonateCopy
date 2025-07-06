use aiken/builtin
use aiken/primitive/bytearray
use aiken/cbor
use aiken/collection/dict
use aiken/crypto.{blake2b_224, blake2b_256}
use aiken/collection/list
use aiken/option
use cardano/transaction.{
  Input, Output, Transaction, TransactionId,
}
use cardano/script_context.{ScriptContext, ScriptInfo}
use cardano/address.{
  Address, Inline, PaymentCredential, ScriptCredential,
}
use cardano/assets.{lovelace_of}

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
}

pub type AllocationBreakdown {
  administration: Int,  // Percentage (0-100)
  aid_delivery: Int,    // Percentage (0-100)
  logistics: Int,       // Percentage (0-100)
}

// Redeemer for donation actions
pub type DonationRedeemer {
  CreateDonation
  UpdateAllocation { new_allocation: AllocationBreakdown }
  WithdrawFunds { amount: Int, purpose: ByteArray }
  VerifySpending { recipient: Address, amount: Int }
}

// Validator for donation tracking
pub fn donation_validator(
  datum: DonationDatum,
  redeemer: DonationRedeemer,
  ctx: ScriptContext,
) -> Bool {
  let ScriptContext { transaction, info, .. } = ctx

  when info is {
    Spending { output, datum: _ } -> {
      when redeemer is {
        CreateDonation -> validate_donation_creation(datum, transaction)
        UpdateAllocation { new_allocation } -> 
          validate_allocation_update(datum, new_allocation, transaction)
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
fn validate_donation_creation(datum: DonationDatum, tx: Transaction) -> Bool {
  let Transaction { inputs, outputs, .. } = tx
  
  // Check that allocation percentages sum to 100
  let total_allocation = datum.allocation.administration + 
                        datum.allocation.aid_delivery + 
                        datum.allocation.logistics
  
  // Validate allocation breakdown
  let valid_allocation = total_allocation == 100 &&
                        datum.allocation.administration >= 0 &&
                        datum.allocation.aid_delivery >= 0 &&
                        datum.allocation.logistics >= 0
  
  // Check that donation amount is positive
  let valid_amount = datum.amount > 0
  
  // Check that tracking ID is provided
  let valid_tracking = bytearray.length(datum.tracking_id) > 0
  
  valid_allocation && valid_amount && valid_tracking
}

// Validate allocation update (only NGO can update)
fn validate_allocation_update(
  datum: DonationDatum,
  new_allocation: AllocationBreakdown,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that new allocation percentages sum to 100
  let total_allocation = new_allocation.administration + 
                        new_allocation.aid_delivery + 
                        new_allocation.logistics
  
  // Validate new allocation breakdown
  let valid_allocation = total_allocation == 100 &&
                        new_allocation.administration >= 0 &&
                        new_allocation.aid_delivery >= 0 &&
                        new_allocation.logistics >= 0
  
  // Check that NGO signed the transaction
  let ngo_signed = list.has(extra_signatories, datum.ngo)
  
  valid_allocation && ngo_signed
}

// Validate fund withdrawal (only NGO can withdraw)
fn validate_fund_withdrawal(
  datum: DonationDatum,
  amount: Int,
  purpose: ByteArray,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, outputs, .. } = tx
  
  // Check that NGO signed the transaction
  let ngo_signed = list.has(extra_signatories, datum.ngo)
  
  // Check that withdrawal amount is valid
  let valid_amount = amount > 0 && amount <= datum.amount
  
  // Check that purpose is provided
  let valid_purpose = bytearray.length(purpose) > 0
  
  // Verify funds go to NGO address
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
  let ngo_signed = list.has(extra_signatories, datum.ngo)
  
  // Check that spending amount is valid
  let valid_amount = amount > 0 && amount <= datum.amount
  
  // Verify funds go to specified recipient
  let funds_to_recipient = list.any(outputs, fn(output) {
    output.address == recipient && 
    lovelace_of(output.value) >= amount
  })
  
  ngo_signed && valid_amount && funds_to_recipient
}

// Helper function to check if address is valid
fn is_valid_address(addr: Address) -> Bool {
  when addr.payment_credential is {
    ScriptCredential(_) -> True
    _ -> True
  }
}

// Export the validator
pub fn donation_script() -> Bool {
  True
}
