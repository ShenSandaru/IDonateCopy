use validators/donation.{donation_validator}
use validators/ngo_verification.{ngo_verification_validator}  
use validators/nft_receipt.{nft_minting_validator}

validator donation_spend(
  datum: validators/donation.DonationDatum,
  redeemer: validators/donation.DonationRedeemer,
  ctx: ScriptContext,
) {
  donation_validator(datum, redeemer, ctx)
}

validator ngo_verification_spend(
  datum: validators/ngo_verification.NGODatum,
  redeemer: validators/ngo_verification.NGORedeemer,
  ctx: ScriptContext,
) {
  ngo_verification_validator(datum, redeemer, ctx)
}

validator nft_mint(
  redeemer: validators/nft_receipt.NFTRedeemer,
  ctx: ScriptContext,
) {
  nft_minting_validator(redeemer, ctx)
}
