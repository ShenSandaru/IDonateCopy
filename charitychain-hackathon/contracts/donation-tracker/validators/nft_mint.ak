use cardano/script_context.{ScriptContext}
use validators/nft_receipt.{NFTRedeemer, nft_minting_validator}

validator nft_mint(
  redeemer: NFTRedeemer,
  ctx: ScriptContext,
) {
  nft_minting_validator(redeemer, ctx)
}
