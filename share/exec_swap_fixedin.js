const {
	Market,
	Liquidity,
	TokenAmount,
	jsonInfo2PoolKeys,
	buildSimpleTransaction
} = require('@raydium-io/raydium-sdk');
const {
	Keypair,
	VersionedTransaction,
	PublicKey,
} = require('@solana/web3.js')
const bs58 = require('bs58')
const {
	connection,
	makeTxVersion,
	addLookupTableInfo
} = require( './config' )
const {
	getWalletTokenAccount,
	formatAmmKeysById,
	sleepTime
} = require('./util' )
const bs58 = require ( 'bs58' )

async function execSwap ( input ) {
	let { // poolInfo		, 
		amountIn
		, myKeyPair
		, poolKeys
	} = input 
	const myPublicKey = myKeyPair.publicKey	
	console.log("maxAmouttIn", maxAmountIn)
	const walletTokenAccounts = await getWalletTokenAccount(connection, myPublicKey)
	let instruction = await Liquidity.makeSwapFixedInInstruction ({
		amountIn,
		poolKeys,
		userKeys : myKeyPair ,
		minAmountOut : 1 // : amountOut,		
	} )
	const { innerTransactions } = instruction
	const willSendTx = await buildSimpleTransaction({
		connection,
		makeTxVersion,
		payer: myPublicKey,
		innerTransactions,
		addLookupTableInfo: addLookupTableInfo,
	})
	const txids = [];
	for (const iTx of willSendTx) {
		if (iTx instanceof VersionedTransaction) {
			iTx.sign([myKeyPair]);
			txids.push(await connection.sendTransaction(iTx, { skipPreflight: true }));
		} else {
			txids.push(await connection.sendTransaction(iTx, [myKeyPair], { skipPreflight: true }));
		}
	}
	console.log("swapped for ", myPublicKey)
	console.log("txids : ", txids)
	return txids
}

module.exports = {
	execSwap
}
