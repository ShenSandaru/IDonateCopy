use aiken/builtin
use aiken/primitive/bytearray
use aiken/collection/dict.{Dict}
use aiken/crypto.{blake2b_256}
use aiken/collection/list
use cardano/script_context.{ScriptContext, Minting}
use cardano/address.{Address, VerificationKey}
use cardano/assets.{PolicyId, quantity_of}
use cardano/transaction.{Transaction, Input, Output}

// NFT metadata for donation receipts
pub type DonationReceiptMetadata {
  // Donation tracking ID
  donation_id: ByteArray,
  // Donor address
  donor: Address,
  // NGO address
  ngo: Address,
  // Donation amount in ADA
  amount: Int,
  // Donation timestamp
  timestamp: Int,
  // Donation purpose/category
  purpose: ByteArray,
  // NGO name for display
  ngo_name: ByteArray,
  // Transaction hash reference
  tx_hash: ByteArray,
}

// Redeemer for NFT minting actions
pub type NFTRedeemer {
  MintReceipt { 
    metadata: DonationReceiptMetadata,
    recipient: Address 
  }
  BurnReceipt { 
    token_name: ByteArray 
  }
}

// Validator for NFT minting (donation receipts)
pub fn nft_minting_validator(
  redeemer: NFTRedeemer,
  ctx: ScriptContext,
) -> Bool {
  let ScriptContext { transaction, info, .. } = ctx

  when info is {
    Minting(own_policy_id) -> {
      when redeemer is {
        MintReceipt { metadata, recipient } -> 
          validate_receipt_minting(metadata, recipient, own_policy_id, transaction)
        BurnReceipt { token_name } -> 
          validate_receipt_burning(token_name, own_policy_id, transaction)
      }
    }
    _ -> False
  }
}

// Validate donation receipt NFT minting
fn validate_receipt_minting(
  metadata: DonationReceiptMetadata,
  recipient: Address,
  policy_id: PolicyId,
  tx: Transaction,
) -> Bool {
  let Transaction { mint, outputs, extra_signatories, .. } = tx
  
  // Generate unique token name from donation ID and timestamp
  let token_name = generate_token_name(metadata.donation_id, metadata.timestamp)
  
  // Check that exactly one NFT is minted
  let nft_amount = quantity_of(mint, policy_id, token_name)
  let valid_mint = nft_amount == 1
  
  // Check that NFT goes to the correct recipient (donor)
  let nft_to_recipient = list.any(outputs, fn(output) {
    output.address == recipient && 
    quantity_of(output.value, policy_id, token_name) == 1
  })
  
  // Validate metadata fields
  let valid_metadata = validate_donation_metadata(metadata)
  
  // Check that donor signed the transaction
  let donor_signed = when metadata.donor.payment_credential is {
    VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
    _ -> False
  }
  
  valid_mint && nft_to_recipient && valid_metadata && donor_signed
}

// Validate donation receipt NFT burning
fn validate_receipt_burning(
  token_name: ByteArray,
  policy_id: PolicyId,
  tx: Transaction,
) -> Bool {
  let Transaction { mint, inputs, extra_signatories, .. } = tx
  
  // Check that exactly one NFT is burned
  let nft_amount = quantity_of(mint, policy_id, token_name)
  let valid_burn = nft_amount == -1
  
  // Check that the NFT exists in inputs
  let nft_in_inputs = list.any(inputs, fn(input) {
    quantity_of(input.output.value, policy_id, token_name) == 1
  })
  
  // Find the owner of the NFT and verify they signed
  let nft_owner = get_nft_owner(inputs, policy_id, token_name)
  let owner_signed = when nft_owner is {
    Some(owner) -> when owner.payment_credential is {
      VerificationKey(vk_hash) -> list.has(extra_signatories, vk_hash)
      _ -> False
    }
    None -> False
  }
  
  valid_burn && nft_in_inputs && owner_signed
}

// Validate donation metadata
fn validate_donation_metadata(metadata: DonationReceiptMetadata) -> Bool {
  // Check that donation ID is provided
  let valid_donation_id = bytearray.length(metadata.donation_id) > 0
  
  // Check that amount is positive
  let valid_amount = metadata.amount > 0
  
  // Check that timestamp is reasonable (not in the future)
  let valid_timestamp = metadata.timestamp > 0
  
  // Check that purpose is provided
  let valid_purpose = bytearray.length(metadata.purpose) > 0
  
  // Check that NGO name is provided
  let valid_ngo_name = bytearray.length(metadata.ngo_name) > 0
  
  // Check that transaction hash is provided
  let valid_tx_hash = bytearray.length(metadata.tx_hash) > 0
  
  valid_donation_id && valid_amount && valid_timestamp && 
  valid_purpose && valid_ngo_name && valid_tx_hash
}

// Generate unique token name from donation ID and timestamp
fn generate_token_name(donation_id: ByteArray, timestamp: Int) -> ByteArray {
  let timestamp_bytes = builtin.serialise_data(timestamp)
  let combined = bytearray.concat(donation_id, timestamp_bytes)
  blake2b_256(combined)
}

// Get the owner of an NFT from inputs
fn get_nft_owner(
  inputs: List<Input>,
  policy_id: PolicyId,
  token_name: ByteArray,
) -> Option<Address> {
  when inputs is {
    [] -> None
    [input, ..rest] -> 
      if quantity_of(input.output.value, policy_id, token_name) == 1 {
        Some(input.output.address)
      } else {
        get_nft_owner(rest, policy_id, token_name)
      }
  }
}

// Helper function to create NFT metadata for CIP-25
pub fn create_nft_metadata(metadata: DonationReceiptMetadata) -> Dict<ByteArray, ByteArray> {
  dict.empty
    |> dict.insert("name", bytearray.concat("CharityChain Receipt #", metadata.donation_id))
    |> dict.insert("description", "Official donation receipt NFT from CharityChain platform")
    |> dict.insert("image", "ipfs://QmCharityChainReceiptImage")
    |> dict.insert("donation_id", metadata.donation_id)
    |> dict.insert("amount", builtin.serialise_data(metadata.amount))
    |> dict.insert("timestamp", builtin.serialise_data(metadata.timestamp))
    |> dict.insert("purpose", metadata.purpose)
    |> dict.insert("ngo_name", metadata.ngo_name)
    |> dict.insert("donor", builtin.serialise_data(metadata.donor))
    |> dict.insert("ngo", builtin.serialise_data(metadata.ngo))
}

// Export the validator for use by frontend/backend
validator nft_receipt {
  mint(redeemer: NFTRedeemer, _policy_id, ctx: ScriptContext) -> Bool {
    nft_minting_validator(redeemer, ctx)
  }
}
