use aiken/collection/list
use aiken/primitive/bytearray
use cardano/script_context.{ScriptContext, Spending}
use cardano/address.{Address, VerificationKey}
use cardano/transaction.{Transaction}

// NGO verification status
pub type VerificationStatus {
  Pending
  Verified
  Suspended
}

// NGO verification datum
pub type NGODatum {
  // NGO information
  ngo_id: ByteArray,
  name: ByteArray,
  description: ByteArray,
  wallet_address: Address,
  categories: List<ByteArray>,
  contact_info: ByteArray,
  verification_documents: List<ByteArray>,
  // Verification details
  status: VerificationStatus,
  verification_date: Option<Int>,
  transparency_score: Int,
  admin_notes: ByteArray,
}

// Redeemer for NGO verification operations
pub type NGORedeemer {
  RegisterNGO
  UpdateNGOInfo { 
    new_name: Option<ByteArray>, 
    new_description: Option<ByteArray>, 
    new_categories: Option<List<ByteArray>> 
  }
  VerifyNGO { admin: Address }
  SuspendNGO { admin: Address, reason: ByteArray }
  RejectNGO { admin: Address, reason: ByteArray }
  UpdateTransparencyScore { admin: Address, new_score: Int }
}

// Main validator for NGO verification
pub fn ngo_verification_validator(
  datum: NGODatum,
  redeemer: NGORedeemer,
  ctx: ScriptContext,
) -> Bool {
  let ScriptContext { transaction, info, .. } = ctx

  when info is {
    Spending { output: _, datum: _ } -> {
      when redeemer is {
        RegisterNGO -> validate_ngo_registration(datum, transaction)
        UpdateNGOInfo { new_name, new_description, new_categories } -> 
          validate_ngo_update(datum, new_name, new_description, new_categories, transaction)
        VerifyNGO { admin } -> 
          validate_ngo_verification(datum, admin, transaction)
        SuspendNGO { admin, reason } ->
          validate_ngo_suspension(datum, admin, reason, transaction)
        RejectNGO { admin, reason } ->
          validate_ngo_rejection(datum, admin, reason, transaction)
        UpdateTransparencyScore { admin, new_score } ->
          validate_transparency_update(datum, admin, new_score, transaction)
      }
    }
    _ -> False
  }
}

// Validate NGO registration
fn validate_ngo_registration(datum: NGODatum, tx: Transaction) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that NGO signed the transaction
  let ngo_signed = when datum.wallet_address.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that initial status is Pending
  let valid_status = datum.status == Pending
  
  // Check that required fields are provided
  let valid_name = bytearray.length(datum.name) > 0
  let valid_description = bytearray.length(datum.description) > 0
  let valid_categories = list.length(datum.categories) > 0
  let valid_ngo_id = bytearray.length(datum.ngo_id) > 0
  
  ngo_signed && valid_status && valid_name && valid_description && valid_categories && valid_ngo_id
}

// Validate NGO information update
fn validate_ngo_update(
  datum: NGODatum,
  _new_name: Option<ByteArray>,
  _new_description: Option<ByteArray>,
  _new_categories: Option<List<ByteArray>>,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that NGO signed the transaction
  let ngo_signed = when datum.wallet_address.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that NGO is in valid state for updates
  let valid_status = datum.status == Verified || datum.status == Pending
  
  ngo_signed && valid_status
}

// Validate NGO verification by admin
fn validate_ngo_verification(
  datum: NGODatum,
  admin: Address,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that admin signed the transaction
  let admin_signed = when admin.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that NGO is in Pending status
  let valid_status = datum.status == Pending
  
  // Check that admin is authorized (simplified check)
  let valid_admin = True // In real implementation, check against admin registry
  
  admin_signed && valid_status && valid_admin
}

// Validate NGO suspension
fn validate_ngo_suspension(
  datum: NGODatum,
  admin: Address,
  reason: ByteArray,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that admin signed the transaction
  let admin_signed = when admin.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that NGO is currently verified
  let valid_status = datum.status == Verified
  
  // Check that reason is provided
  let valid_reason = bytearray.length(reason) > 0
  
  // Check that admin is authorized (simplified check)
  let valid_admin = True
  
  admin_signed && valid_status && valid_reason && valid_admin
}

// Validate NGO rejection
fn validate_ngo_rejection(
  datum: NGODatum,
  admin: Address,
  reason: ByteArray,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that admin signed the transaction
  let admin_signed = when admin.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that NGO is in Pending status
  let valid_status = datum.status == Pending
  
  // Check that reason is provided
  let valid_reason = bytearray.length(reason) > 0
  
  // Check that admin is authorized (simplified check)
  let valid_admin = True
  
  admin_signed && valid_status && valid_reason && valid_admin
}

// Validate transparency score update
fn validate_transparency_update(
  datum: NGODatum,
  admin: Address,
  new_score: Int,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that admin signed the transaction
  let admin_signed = when admin.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  // Check that new score is valid
  let valid_score = new_score >= 0 && new_score <= 100
  
  // Check that admin is authorized (simplified check)
  let valid_admin = True
  
  // Check that NGO is verified
  let valid_status = datum.status == Verified
  
  admin_signed && valid_score && valid_admin && valid_status
}

// Export the validator for use by frontend/backend
validator ngo_verification {
  spend(datum: Option<NGODatum>, redeemer: NGORedeemer, _output_reference, ctx: ScriptContext) -> Bool {
    when datum is {
      Some(d) -> ngo_verification_validator(d, redeemer, ctx)
      None -> False
    }
  }
}
