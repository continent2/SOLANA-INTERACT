
const anchor =require('@project-serum/anchor')
const assert =require("assert")
const { PublicKey } =require('@solana/web3.js')
const { AccountLayout, MintLayout, Token, TOKEN_PROGRAM_ID } =require('@solana/spl-token')
const TOKEN_PROGRAM_PUBKEY = new anchor.web3.PublicKey( TOKEN_PROGRAM_ID )
const SWAP_ACCOUNT_SPACE = 324

const generateTokenMint = async (provider , authority ) => { // provider: anchor.Provider, authority: PublicKey) => {
	const mint = anchor.web3.Keypair.generate();
	const instructions = [ 		//create account with mint account layout
		anchor.web3.SystemProgram.createAccount({
			fromPubkey: provider.wallet.publicKey,
			newAccountPubkey: mint.publicKey,
			space: MintLayout.span,
			lamports: await provider.connection.getMinimumBalanceForRentExemption(MintLayout.span),
			programId: TOKEN_PROGRAM_ID,
		}),
		// initialize mint account
		Token.createInitMintInstruction(			
			TOKEN_PROGRAM_ID,			// program id
			mint.publicKey,// mint pub key			
			9,// decimals			
			authority,// mint authority			
			null // freeze authority - note this must be null for token-swap pool
		),
	]
	const tx = new anchor.web3.Transaction();
	tx.add(...instructions);
	await provider.send(tx, [mint]);
	return mint;
}

const generateNewSignerAccount = async ( provider ) => { // async (provider: anchor.Provider) => {
  return generateNewGenericAccount(provider, provider.wallet.publicKey, 8 + 8, anchor.web3.SystemProgram.programId, 10);
}
const generateNewGenericAccount = async (//  provider: anchor.Provider, fromPubkey: PublicKey, space: number, programId: PublicKey, extraLamports: number
	provider , fromPubkey , space , programId , extraLamports
) => {
  const newAccount = anchor.web3.Keypair.generate();   // Create account transaction.
  const tx = new anchor.web3.Transaction();
  tx.add(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: fromPubkey,
      newAccountPubkey: newAccount.publicKey,
      space,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        space
      ) + extraLamports,
      programId
    })
  );
  await provider.send(tx, [newAccount]);
  return newAccount;
}
const generateTokenAccount = async (provider , mint , owner ) => { // provider: anchor.Provider, mint: anchor.web3.Keypair, owner: PublicKey) => {
	const tokenAccount = anchor.web3.Keypair.generate();
	const instructions = [ 		//create account with token account layout
		anchor.web3.SystemProgram.createAccount({
			fromPubkey: provider.wallet.publicKey,
			newAccountPubkey: tokenAccount.publicKey,
			space: AccountLayout.span,
			lamports: await provider.connection.getMinimumBalanceForRentExemption(AccountLayout.span),
			programId: TOKEN_PROGRAM_ID,
		}),		
		Token.createInitAccountInstruction( //initialize token account for specified mint			
			TOKEN_PROGRAM_ID, // program id			
			mint.publicKey, // mint pub key			
			tokenAccount.publicKey, // token account pub key			
			owner, // owner
		),
	]
	const tx = new anchor.web3.Transaction();
	tx.add(...instructions);
	await provider.send(tx, [tokenAccount]);
	return tokenAccount;
}

const generateTestLinearSwapAccounts = async ( {	
	programId , 
	cTokenInitialSupply , 
	feeAuthority , 					
	destinationAuthority , 		
	rTokenMintAuthority ,
	cTokenMintAuthority ,
	rTokenMint ,
	cTokenMint
}  ) => { // (programId: PublicKey, cTokenInitialSupply: number) => {
	// TODO: doing these in separate txns is really slow, could probably be optimized
	// owner of token A and token B mint, unrelated to swapAuthority
	// const rTokenMintAuthority = await generateNewSignerAccount(provider);
	// const cTokenMintAuthority = await generateNewSignerAccount(provider);
	// const rTokenMint = await generateTokenMint(provider, rTokenMintAuthority.publicKey);
	// const cTokenMint = await generateTokenMint(provider, cTokenMintAuthority.publicKey);
	///   0. `[writable, signer]` New Token-swap to create.
	const tokenSwap = await generateNewGenericAccount(provider, provider.wallet.publicKey, SWAP_ACCOUNT_SPACE, programId, 0);
	///   1. `[]` swap authority derived =require(`create_program_address(&[Token-swap account])`
	// corresponds to processor.rs Pubkey::find_program_address(&[&swap_info.key.to_bytes()], program_id);
	const swapAuthority = (await anchor.web3.PublicKey.findProgramAddress([tokenSwap.publicKey.toBuffer()], programId))[0];
	///   2. `[]` token_a Account. Must be non zero, owned by swap authority.
	///   3. `[]` token_b Account. Must be non zero, owned by swap authority.
	const rTokenSwapAccount = await generateTokenAccount(provider, rTokenMint, swapAuthority);
	// note we must start with 0 RLY so no need to mint any token A here
	const cTokenSwapAccount = await generateTokenAccount(provider, cTokenMint, swapAuthority);
	await mintToAccount(provider, cTokenMintAuthority, cTokenMint, cTokenSwapAccount.publicKey, cTokenInitialSupply);
	const rToken = new Token(provider.connection, rTokenMint.publicKey, TOKEN_PROGRAM_ID, rTokenMintAuthority);
	const cToken = new Token(provider.connection, cTokenMint.publicKey, TOKEN_PROGRAM_ID, cTokenMintAuthority);
	///   4. `[writable]` Pool Token Mint. Must be empty, owned by swap authority.
	const poolTokenMint = await generateTokenMint(provider, swapAuthority);
	const poolToken = new Token(provider.connection, poolTokenMint.publicKey, TOKEN_PROGRAM_ID, tokenSwap);
	///   5. `[]` Pool Token Account to deposit trading and withdraw fees.
	///   Must be empty, not owned by swap authority
	// const feeAuthority = await generateNewSignerAccount(provider);
	const feeTokenAccount = await generateTokenAccount(provider, poolTokenMint, feeAuthority.publicKey);
	///   6. `[writable]` Pool Token Account to deposit the initial pool token
	///   supply.  Must be empty, not owned by swap authority.
	const destinationAuthority = await generateNewSignerAccount(provider);
	const destinationTokenAccount = await generateTokenAccount(provider, poolTokenMint, destinationAuthority.publicKey);
	return {
		rTokenMintAuthority,
		cTokenMintAuthority,
		rTokenMint,
		cTokenMint,
		tokenSwap,
		swapAuthority,
		rTokenSwapAccount,
		cTokenSwapAccount,
		rToken,
		cToken,
		poolTokenMint,
		poolToken,
		feeAuthority,
		feeTokenAccount,
		destinationAuthority,
		destinationTokenAccount,
	};
};

module.exports = { 
	generateTokenMint ,
	generateNewSignerAccount ,
	generateTokenAccount ,
	generateNewGenericAccount	,
	generateTestLinearSwapAccounts
}