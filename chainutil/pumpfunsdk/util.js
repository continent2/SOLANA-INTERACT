

const dotenv=require("dotenv")
const { Connection, Keypair, LAMPORTS_PER_SOL }=require("@solana/web3.js")
const { DEFAULT_DECIMALS, PumpFunSDK }=require("pumpdotfun-sdk")
const NodeWallet=require("@coral-xyz/anchor/dist/cjs/nodewallet")
const { AnchorProvider }=require("@coral-xyz/anchor")
const  bs58 = require ( 'bs58')
const { generateSlug } = require( "random-word-slugs" )
dotenv.config()

const getProvider = () => {
  if ( !process.env.HELIUS_RPC_URL ) {    throw new Error("Please set HELIUS_RPC_URL in .env file");
  }
  const connection = new Connection(process.env.HELIUS_RPC_URL || "");
	let provider= new AnchorProvider ( connection )
	provider.wallet = Keypair.fromSecretKey(  bs58.default.decode(process.env.PRIVATE_KEY ))
	return provider
}
const SLIPPAGE_BASIS_POINTS = 1000n;
const createAndBuyToken = async ( { sdk, testAccount, mint , tokenMetadata } ) => {
  if(tokenMetadata){}
	else {			let name = generateSlug(2, { format: "camel" })
		tokenMetadata = {
		  name ,
		  symbol: name ,
		  description: name ,//		  filePath: "example/basic/random.png",
		}	
	}
	console.log ( { tokenMetadata })
  const createResults = await sdk.createAndBuy(
    testAccount,
    mint,
    tokenMetadata,
    BigInt(0.0001 * LAMPORTS_PER_SOL),
    SLIPPAGE_BASIS_POINTS,
    {
      unitLimit: 250000,
      unitPrice: 250000,
    }
  )
  if ( createResults.success ) {
    console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
//    printSPLBalance(sdk.connection, mint.publicKey, testAccount.publicKey);
  } else {
    console.log("Create and Buy failed");
  }
}

const buyTokens = async (sdk, testAccount, mint) => {
  const buyResults = await sdk.buy(
    testAccount,
    mint.publicKey,
    BigInt(0.0001 * LAMPORTS_PER_SOL),
    SLIPPAGE_BASIS_POINTS,
    {
      unitLimit: 250000,
      unitPrice: 250000,
    }
  );

  if (buyResults.success) {
    printSPLBalance(sdk.connection, mint.publicKey, testAccount.publicKey);
    console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
  } else {
    console.log("Buy failed");
  }
};

const sellTokens = async (sdk, testAccount, mint) => {
  const currentSPLBalance = await getSPLBalance(
    sdk.connection,
    mint.publicKey,
    testAccount.publicKey
  );
  console.log("currentSPLBalance", currentSPLBalance);

  if (currentSPLBalance) {
    const sellResults = await sdk.sell(
      testAccount,
      mint.publicKey,
      BigInt(currentSPLBalance * Math.pow(10, DEFAULT_DECIMALS)),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      }
    );

    if (sellResults.success) {
      await printSOLBalance(sdk.connection, testAccount.publicKey, "Test Account keypair");
      printSPLBalance(sdk.connection, mint.publicKey, testAccount.publicKey, "After SPL sell all");
      console.log("Bonding curve after sell", await sdk.getBondingCurveAccount(mint.publicKey));
    } else {
      console.log("Sell failed");
    }
  }
};

const getBondingCurveAccount = async ( { mintpublicKey } )=>{
	let bondingCurveAccount = await sdk.getBondingCurveAccount( mintpublicKey ) // mint.publicKey );
	if ( ! bondingCurveAccount) {
		await createAndBuyToken(sdk, testAccount, mint);
		bondingCurveAccount = await sdk.getBondingCurveAccount ( mintpublicKey ) // mint.publicKey);
	}
	return bondingCurveAccount
}
// async getBondingCurveAccount(
// 	mint: PublicKey,
// 	commitment: Commitment = DEFAULT_COMMITMENT
// ) {
// 	const tokenAccount = await this.connection.getAccountInfo(
// 		this.getBondingCurvePDA(mint),
// 		commitment
// 	);
// 	if (!tokenAccount) {
// 		return null;
// 	}
// 	return BondingCurveAccount.fromBuffer(tokenAccount!.data);
// }

module.exports = { 
	getProvider ,
	createAndBuyToken ,
	buyTokens ,
	sellTokens ,

}
// const wallet = new NodeWallet(new Keypair());
//	const wallet = new NodeWallet( Keypair.fromSecretKey( process?.env?.PRIVATE_KEY ) )
//	const wallet =  Keypair.fromSecretKey( process?.env?.PRIVATE_KEY ) 
//	const wallet = new NodeWallet(  process?.env?.PRIVATE_KEY ) 
//	const wallet = NodeWallet(  process?.env?.PRIVATE_KEY ) 
// const wallet = new NodeWallet(new Keypair( Keypair.fromSecretKey( process?.env?.PRIVATE_KEY ) ) )
//	const wallet = new NodeWallet( Keypair.fromSecretKey(  bs58.default.decode(process.env.PRIVATE_KEY )) ) 
	//const wallet = NodeWallet( Keypair.fromSecretKey(  bs58.default.decode(process.env.PRIVATE_KEY )) ) 
//  return new AnchorProvider ( connection, wallet, { commitment: "finalized" } )
