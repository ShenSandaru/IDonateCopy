use aiken/primitive/bytearray
use aiken/builtin
use aiken/crypto.{blake2b_256}
use aiken/collection/list
use cardano/address.{Address}

// Common types used across all validators

// Donation status tracking
pub type DonationStatus {
  Active
  Completed
  Cancelled
  Disputed
}

// Fund allocation categories
pub type AllocationCategory {
  Administration
  AidDelivery
  Logistics
  Emergency
  Overhead
}

// Transparency levels
pub type TransparencyLevel {
  Basic      // 0-25%
  Standard   // 26-50%
  Advanced   // 51-75%
  Complete   // 76-100%
}

// Platform configuration
pub type PlatformConfig {
  // Platform admin addresses
  admins: List<Address>,
  // Platform fee percentage (0-100)
  platform_fee: Int,
  // Minimum donation amount in lovelace
  min_donation: Int,
  // Maximum donation amount in lovelace
  max_donation: Int,
  // Platform treasury address
  treasury: Address,
}

// Error codes for validation failures
pub type ValidationError {
  InvalidAmount
  InvalidAllocation
  UnauthorizedSigner
  InvalidTimestamp
  InvalidMetadata
  InsufficientFunds
  InvalidStatus
  DuplicateEntry
  InvalidAddress
  InvalidSignature
}

// Utility functions

// Convert transparency score to transparency level
pub fn score_to_transparency_level(score: Int) -> TransparencyLevel {
  if score >= 76 {
    Complete
  } else if score >= 51 {
    Advanced
  } else if score >= 26 {
    Standard
  } else {
    Basic
  }
}

// Validate percentage (0-100)
pub fn is_valid_percentage(value: Int) -> Bool {
  value >= 0 && value <= 100
}

// Validate ADA amount (positive and within limits)
pub fn is_valid_ada_amount(amount: Int, min_amount: Int, max_amount: Int) -> Bool {
  amount > 0 && amount >= min_amount && amount <= max_amount
}

// Validate timestamp (not in the future, reasonable past)
pub fn is_valid_timestamp(timestamp: Int, current_time: Int) -> Bool {
  timestamp > 0 && timestamp <= current_time
}

// Validate bytearray length
pub fn is_valid_bytearray_length(data: ByteArray, min_length: Int, max_length: Int) -> Bool {
  let length = bytearray.length(data)
  length >= min_length && length <= max_length
}

// Calculate platform fee
pub fn calculate_platform_fee(amount: Int, fee_percentage: Int) -> Int {
  (amount * fee_percentage) / 100
}

// Validate allocation breakdown sums to 100%
pub fn is_valid_allocation_breakdown(
  administration: Int,
  aid_delivery: Int,
  logistics: Int,
) -> Bool {
  let total = administration + aid_delivery + logistics
  total == 100 && 
  administration >= 0 && 
  aid_delivery >= 0 && 
  logistics >= 0
}

// Generate unique identifier from multiple inputs
pub fn generate_unique_id(
  primary: ByteArray,
  secondary: ByteArray,
  timestamp: Int,
) -> ByteArray {
  let timestamp_bytes = builtin.serialise_data(timestamp)
  let combined = bytearray.concat(primary, bytearray.concat(secondary, timestamp_bytes))
  hash.blake2b_256(combined)
}

// Validate donation purpose categories
pub fn is_valid_purpose_category(category: ByteArray) -> Bool {
  let valid_categories = [
    "education",
    "healthcare",
    "disaster_relief",
    "poverty_alleviation",
    "environmental",
    "human_rights",
    "community_development",
    "emergency_aid",
    "water_sanitation",
    "food_security"
  ]
  
  list.any(valid_categories, fn(valid_cat) {
    bytearray.compare(category, valid_cat) == Equal
  })
}

// Constants for the platform
pub const min_donation_amount: Int = 1_000_000  // 1 ADA in lovelace
pub const max_donation_amount: Int = 1_000_000_000_000  // 1 million ADA in lovelace
pub const platform_fee_percentage: Int = 2  // 2% platform fee
pub const min_transparency_score: Int = 50  // Minimum 50% transparency for verification
pub const max_allocation_admin: Int = 20  // Maximum 20% for administration
pub const min_allocation_aid: Int = 60  // Minimum 60% for aid delivery
