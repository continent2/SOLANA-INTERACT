
// const dotenv=require("dotenv")
const { Connection, Keypair, LAMPORTS_PER_SOL }=require("@solana/web3.js")
const { DEFAULT_DECIMALS, PumpFunSDK }=require("pumpdotfun-sdk")
const NodeWallet=require("@coral-xyz/anchor/dist/cjs/nodewallet")
const { AnchorProvider }=require("@coral-xyz/anchor")
const bs58 = require ( 'bs58' )
// dotenv.config()
const { getProvider , createAndBuyToken , buyTokens , sellTokens } = require ( './util' )
// let { getProvider , createAndBuyToken , buyTokens , sellTokens } = require ( './util/pumpfunsdk/util' )
require("dotenv").config()
const init=async ()=>{
	const sdk = new PumpFunSDK(provider)
	const connection = provider.connection
	const testAccount =  Keypair.fromSecretKey(bs58.default.decode( process.env.PRIVATE_KEY ))
}

const main = async ( { testAccount } ) => {
	if ( testAccount ){}
	else {		testAccount =  Keypair.fromSecretKey(bs58.default.decode( process.env.PRIVATE_KEY ))	
	}
  try {		
    const provider = getProvider()
    const sdk = new PumpFunSDK( provider )
    const connection = provider.connection		//    const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
    const mint = Keypair.generate() // getOrCreateKeypair(KEYS_FOLDER, "mint");
console.log ( { 
	mintaddress : mint.publicKey.toString() , 
	mintprivatekey : bs58.default.encode( mint.secretKey)
} )
//   mintaddress: 'hYdpypgtT1ZwbZnBmTwuxC36hJALyWAJxQxi8XMrD6R',  mintprivatekey: 'ntp5eGL3v6emtV7XbqJc5S59yKYgiLJ2VHRsoA8qbi3opHzxmUjeBmavdruYS7y8NBy7RqstfSV5EGeeiSY7aTB'
    let bondingCurveAccount = await sdk.getBondingCurveAccount( mint.publicKey )
//		sdk.getBondingCurveAccount( mint.publicKey ).then( resp0=>{ bondingCurveAccount = resp0 } )
    if ( ! bondingCurveAccount ) {
      await createAndBuyToken( { sdk, testAccount, mint } )
      bondingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    }
console.log ( { bondingCurveAccount } )
		return { 
			mintaddress : mint.publicKey.toString() , 
			mintprivatekey : bs58.default.encode( key.secretKey) ,
			bondingCurveAccount
		}
    // if ( bondingCurveAccount ) {
    //   await buyTokens(sdk, testAccount, mint);
    //   await sellTokens(sdk, testAccount, mint);
    // }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

//    await printSOLBalance(connection, testAccount.publicKey, "Test Account keypair");
//    const globalAccount = await sdk.getGlobalAccount();
//    console.log(globalAccount);
// const currentSolBalance = await connection.getBalance(testAccount.publicKey);
// if (currentSolBalance === 0) {
//   console.log("Please send some SOL to the test-account:", testAccount.publ icKey.toBase58());
//   return;
// }
//    console.log(await sdk.getGlobalAccount());


