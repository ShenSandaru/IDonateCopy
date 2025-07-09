use cardano/script_context.{ScriptContext}
use validators/ngo_verification.{NGODatum, NGORedeemer, ngo_verification_validator}

validator ngo_spend(
  datum: NGODatum,
  redeemer: NGORedeemer,
  ctx: ScriptContext,
) {
  ngo_verification_validator(datum, redeemer, ctx)
}
