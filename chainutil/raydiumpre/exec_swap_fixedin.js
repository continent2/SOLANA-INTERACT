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
const { conv_keypair_to_secretkey } = require('../../util/solana' )
// const bs58 = require ( 'bs58' )

async function execSwap ( input ) {
	let { // poolInfo		, 
		amountIn
		, myKeyPair
		, poolKeys
	} = input 

//	console.log("swap pool info", inp ut.poolInfo)	
//	console.log("swap market info", in put.marketInfo)
//	console.log("swap started for", inp ut.wallet);
//	const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode(in put.wallet)));
	const myPublicKey = myKeyPair.publicKey	
	// -------- pre-action: get pool info --------
	// let targetPoolInfo;
	// while (true) {
	// 	try {
	// 		targetPoolInfo = await formatAmmKeysById(input.targetPool)
	// 		if (targetPoolInfo) {
	// 			console.log("targetPoolInfo", targetPoolInfo)
	// 			break; // If successful, exit the loop
	// 		}
	// 	} catch (error) {
	// 		console.error('pool not found, retrying...');
	// 	}
	// 	await sleepTime(1000); // Wait for 1 seconds before retrying
	// }
	// const poolKeys = jsonInfo2PoolKeys(targetPoolInfo)
	// console.log("poolKeys", poolKeys)
	// -------- step 1: coumpute amount out --------
	// let poolInfo;
	// while (true) {
	// 	try {
	// 		poolInfo = await Liquidity.fetchInfo({ connection, poolKeys })
	// 		if (poolInfo) {
	// 			console.log("swap poolInfo", poolInfo)
	// 			break; // If successful, exit the loop
	// 		}
	// 	} catch (error) {
	// 		console.error('cannot fetch swap info, retrying...');
	// 	}
	// 	await sleepTime(3000); // Wait for 1 seconds before retrying
	// }
	// const { amountIn, maxAmountIn } = Liquidity.computeAmountIn({
	// 	poolKeys: poolKeys,
	// 	poolInfo: poolInfo,
	// 	amountOut: in put.outputTokenAmount,
	// 	currencyIn: inp ut.inputToken,
	// 	slippage: inp ut.slippage,
	// })
	// hard_coded	// const maxAmountIn = new TokenAmount(inpu t.inputToken, 100000000000)
	console.log("maxAmouttIn", maxAmountIn)
	const walletTokenAccounts = await getWalletTokenAccount(connection, myPublicKey)
//	const instruction = await Liquidity.makeSwapInstructionSimple({
	let instruction = await Liquidity.makeSwapFixedInInstruction ({
		amountIn,
		poolKeys,
		userKeys : myKeyPair ,
		minAmountOut : 1 // : amountOut,		
	} )
	// 	connection,
	// 	poolKeys,
	// 	userKeys: {
	// 		tokenAccounts: walletTokenAccounts,
	// 		owner: myPublicKey
	// 	},
	// 	amountIn: maxAmountIn,
	// 	amountOut: in put.outputTokenAmount,
	// 	fixedSide: 'out',
	// 	makeTxVersion,
	// })
	const { innerTransactions } = instruction
	// const txids = await buildAndSendTx(innerTransactions, { skipPreflight: true })
	// console.log("txids", txids)
	// return txids
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
/** * @param {*} input     execSwap({
	poolInfo,
	marketInfo,
	wallet: process.env.PRIVATE_KEY,
        targetPool,
        inputToken,
        outputTokenAmount,
        slippage,
        marketInfo,
        baseToken,
        quoteToken,
        addBaseAmount,
        addQuoteAmount    }).then( resp0 =>{ resp = resp0 })
 * @returns txids
 */
