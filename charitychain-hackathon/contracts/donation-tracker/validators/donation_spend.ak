use cardano/script_context.{ScriptContext}
use validators/donation.{DonationDatum, DonationRedeemer, donation_validator}

validator donation_spend(
  datum: DonationDatum,
  redeemer: DonationRedeemer,
  ctx: ScriptContext,
) {
  donation_validator(datum, redeemer, ctx)
}
