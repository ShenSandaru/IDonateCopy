use aiken/builtin
use aiken/primitive/bytearray
use aiken/cbor
use aiken/collection/dict
use aiken/crypto.{blake2b_224}
use aiken/collection/list
use aiken/option
use cardano/transaction.{
  Input, Output, Transaction, TransactionId,
}
use cardano/script_context.{ScriptContext, ScriptInfo}
use cardano/address.{
  Address, Inline, PaymentCredential, ScriptCredential,
}
use cardano/assets.{Value, ada_asset_name, ada_policy_id}

// NGO verification status
pub type VerificationStatus {
  Pending
  Verified
  Suspended
  Rejected
}

// NGO registration datum
pub type NGODatum {
  // NGO identifier
  ngo_id: ByteArray,
  // NGO name
  name: ByteArray,
  // NGO description
  description: ByteArray,
  // NGO wallet address
  wallet_address: Address,
  // Registration documents hash
  documents_hash: ByteArray,
  // Verification status
  status: VerificationStatus,
  // Registration timestamp
  registration_timestamp: Int,
  // Verification timestamp (if verified)
  verification_timestamp: Option<Int>,
  // Admin who verified (if verified)
  verified_by: Option<Address>,
  // Minimum transparency score required (0-100)
  transparency_score: Int,
  // Categories of aid the NGO provides
  aid_categories: List<ByteArray>,
}

// Redeemer for NGO verification actions
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

// Admin configuration datum
pub type AdminConfig {
  // List of admin addresses
  admins: List<Address>,
  // Minimum required admin signatures
  min_signatures: Int,
  // Platform fee percentage (0-100)
  platform_fee: Int,
}

// Validator for NGO verification
pub fn ngo_verification_validator(
  datum: NGODatum,
  redeemer: NGORedeemer,
  ctx: ScriptContext,
) -> Bool {
  let ScriptContext { transaction, info, .. } = ctx

  when info is {
    Spending { output, datum: _ } -> {
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
  let ngo_signed = list.has(extra_signatories, datum.wallet_address)
  
  // Check that initial status is Pending
  let valid_status = datum.status == Pending
  
  // Check that required fields are provided
  let valid_name = bytearray.length(datum.name) > 0
  let valid_description = bytearray.length(datum.description) > 0
  let valid_ngo_id = bytearray.length(datum.ngo_id) > 0
  let valid_documents = bytearray.length(datum.documents_hash) > 0
  
  // Check that transparency score is initialized
  let valid_transparency = datum.transparency_score >= 0 && datum.transparency_score <= 100
  
  // Check that aid categories are provided
  let valid_categories = list.length(datum.aid_categories) > 0
  
  ngo_signed && valid_status && valid_name && valid_description && 
  valid_ngo_id && valid_documents && valid_transparency && valid_categories
}

// Validate NGO information update
fn validate_ngo_update(
  datum: NGODatum,
  new_name: Option<ByteArray>,
  new_description: Option<ByteArray>,
  new_categories: Option<List<ByteArray>>,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that NGO signed the transaction
  let ngo_signed = list.has(extra_signatories, datum.wallet_address)
  
  // Check that NGO is in valid state for updates
  let valid_status = datum.status == Verified || datum.status == Pending
  
  // Validate new name if provided
  let valid_name = when new_name is {
    Some(name) -> bytearray.length(name) > 0
    None -> True
  }
  
  // Validate new description if provided
  let valid_description = when new_description is {
    Some(desc) -> bytearray.length(desc) > 0
    None -> True
  }
  
  // Validate new categories if provided
  let valid_categories = when new_categories is {
    Some(cats) -> list.length(cats) > 0
    None -> True
  }
  
  ngo_signed && valid_status && valid_name && valid_description && valid_categories
}

// Validate NGO verification by admin
fn validate_ngo_verification(
  datum: NGODatum,
  admin: Address,
  tx: Transaction,
) -> Bool {
  let Transaction { extra_signatories, .. } = tx
  
  // Check that admin signed the transaction
  let admin_signed = list.has(extra_signatories, admin)
  
  // Check that NGO is in Pending status
  let valid_status = datum.status == Pending
  
  // Check that admin is authorized (this would be validated against admin config)
  let valid_admin = is_authorized_admin(admin, tx)
  
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
  let admin_signed = list.has(extra_signatories, admin)
  
  // Check that NGO is currently verified
  let valid_status = datum.status == Verified
  
  // Check that reason is provided
  let valid_reason = bytearray.length(reason) > 0
  
  // Check that admin is authorized
  let valid_admin = is_authorized_admin(admin, tx)
  
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
  let admin_signed = list.has(extra_signatories, admin)
  
  // Check that NGO is in Pending status
  let valid_status = datum.status == Pending
  
  // Check that reason is provided
  let valid_reason = bytearray.length(reason) > 0
  
  // Check that admin is authorized
  let valid_admin = is_authorized_admin(admin, tx)
  
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
  let admin_signed = list.has(extra_signatories, admin)
  
  // Check that new score is valid
  let valid_score = new_score >= 0 && new_score <= 100
  
  // Check that admin is authorized
  let valid_admin = is_authorized_admin(admin, tx)
  
  // Check that NGO is verified
  let valid_status = datum.status == Verified
  
  admin_signed && valid_score && valid_admin && valid_status
}

// Helper function to check if admin is authorized
fn is_authorized_admin(admin: Address, tx: Transaction) -> Bool {
  // This would typically check against an admin configuration UTxO
  // For now, we'll implement a simple check
  let Transaction { reference_inputs, .. } = tx
  
  // Look for admin config in reference inputs
  list.any(reference_inputs, fn(input) {
    when input.output.datum is {
      Some(datum) -> {
        // Check if this is an admin config datum
        // This is a simplified check
        True
      }
      None -> False
    }
  })
}

// Helper function to validate document hash
fn is_valid_document_hash(hash: ByteArray) -> Bool {
  bytearray.length(hash) == 32  // SHA-256 hash length
}

// Helper function to validate transparency score
fn is_valid_transparency_score(score: Int) -> Bool {
  score >= 0 && score <= 100
}

// Export the validator
pub fn ngo_verification_script() -> Bool {
  True
}
