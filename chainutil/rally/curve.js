
const anchor =require('@project-serum/anchor')
const assert =require("assert")
const { PublicKey } =require('@solana/web3.js')
const { AccountLayout, MintLayout, Token, TOKEN_PROGRAM_ID } =require('@solana/spl-token')
const TOKEN_PROGRAM_PUBKEY = new anchor.web3.PublicKey(TOKEN_PROGRAM_ID)
const SWAP_ACCOUNT_SPACE = 324
const { generateTestLinearSwapAccounts , generateTokenAccount , generateNewSignerAccount , generateTokenMint , generateNewGenericAccount } = require ( './util' )
const main = async ({
	feeAuthority , 					// <= generateNewSignerAccount(provider);
	destinationAuthority , 	// <= generateNewSignerAccount(provider);
	rTokenMint ,
	cTokenMint	
//	destinationTokenAccount
})=>{
	const program = anchor.workspace.TokenBondingCurve
	const {
		tokenSwap,		//  <= generateNewGenericAccount
		swapAuthority,	// <= PDA ( tokenSwap )
		rTokenSwapAccount,	// <=  generateTokenAccount(provider, rTokenMint, swapAuthority)
		cTokenSwapAccount,	//
		poolTokenMint,	// <= generateTokenMint(provider, swapAuthority);
		feeTokenAccount,	// <= generateTokenAccount(provider, poolTokenMint, feeAuthority.publicKey)
		destinationTokenAccount,	//

//		rTokenMintAuthority,
	//	cTokenMintAuthority,
		//rTokenMint,
//		cTokenMint,
		poolToken,
//		feeAuthority,
//		destinationAuthority,
		rToken,
		cToken,
	} = await generateTestLinearSwapAccounts({ 
		programId: program.programId, 
		cTokenInitialSupply : 500 * 10 ** 8  ,
		feeAuthority ,
		destinationAuthority ,
		// rTokenMintAuthority ,
		// cTokenMintAuthority ,
		rTokenMint ,
		cTokenMint	
	} )

	let slope_numerator = new anchor.BN(1) 
	let slope_denominator = new anchor.BN(200000000)
	let r0_numerator = new anchor.BN(150)  // since R and C both have 8 decimals, we don't need to do any scaling here (starts at 50 base RLY price for every 1 base CC)
	let r0_denominator = new anchor.BN(3)  // not reducing to test out division
	
	const tx = await program.rpc.initializeLinearPrice(
		slope_numerator,
		slope_denominator,
		r0_numerator,
		r0_denominator,
		{
			accounts: {
				tokenSwap: tokenSwap.publicKey,
				swapAuthority: swapAuthority,
				tokenA: rTokenSwapAccount.publicKey,
				tokenB: cTokenSwapAccount.publicKey,
				pool: poolTokenMint.publicKey,
				fee: feeTokenAccount.publicKey,
				destination: destinationTokenAccount.publicKey,
				tokenProgram: TOKEN_PROGRAM_PUBKEY,
			},
			signers: [ tokenSwap ],
		});

	console.log("Your transaction signature", tx);

}

module.exports= { 
	
}
