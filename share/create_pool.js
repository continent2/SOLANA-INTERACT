 const {
	Liquidity,
	MAINNET_PROGRAM_ID,
	DEVNET_PROGRAM_ID,
} = require( '@raydium-io/raydium-sdk' )
const BN = require('bn.js');

const {
	connection,
	makeTxVersion,
	CONFIG_PROGRAM_ID,
	myKeyPair,
} = require( './config.js' )
const {
	buildAndSendTx,
	getWalletTokenAccount,
} = require( './util.js' )

/** marketId: params.targetMarketId,
baseMintInfo: params.baseToken,
quoteMintInfo: params.quoteToken,
baseAmount: params.addBaseAmount,
quoteAmount: params.addQuoteAmount,
startTime: new BN(Math.floor(params.startTime)),
tokenAccounts: params.walletTokenAccounts,
*/ 
async function createPool(params) {
    let {
        baseToken,
        quoteToken,
        addBaseAmount,
        addQuoteAmount,
        startTime ,
        myKeyPair , //        walletTokenAccounts,
//        targetMarketId,
    } = params
	// const RAYDIUM_PROGRAM_ID = process.env.NETWORK == 'mainnet' ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID
	const RAYDIUM_PROGRAM_ID =  DEVNET_PROGRAM_ID
	const myPublicKey = myKeyPair.publicKey
    const walletTokenAccounts = await getWalletTokenAccount(connection, myPublicKey)
	const initPoolInstructionResponse = await Liquidity.makeCreatePoolV4InstructionV2Simple({
		connection: connection,
		programId: RAYDIUM_PROGRAM_ID.AmmV4,		// programId: CONFIG_PROGRAM_ID.AMM_OWNER,
		marketInfo: {
			marketId: params.targetMarketId,
			programId: RAYDIUM_PROGRAM_ID.OPENBOOK_MARKET
		},
		baseMintInfo: params.baseToken,
		quoteMintInfo: params.quoteToken,
		baseAmount: params.addBaseAmount,
		quoteAmount: params.addQuoteAmount,
		startTime: new BN(Math.floor(params.startTime)),
		ownerInfo: {
			feePayer: myPublicKey,
			wallet: myPublicKey,
			tokenAccounts: walletTokenAccounts, // params.
			useSOLBalance: true // if has WSOL mint
		},
		associatedOnly: false,		// computeBudgetConfig?,
		checkCreateATAOwner: true,
		makeTxVersion: makeTxVersion,		// lookupTableCache?,
		feeDestinationId: CONFIG_PROGRAM_ID.CREATE_POOL_FEE_ADDRESS
	})
	const poolInfo = initPoolInstructionResponse.address
	const poolId = poolInfo.ammId
	const { innerTransactions } = initPoolInstructionResponse
	const txids = await buildAndSendTx(innerTransactions, { skipPreflight: true })
	console.log("Pool Created")
	console.log("Pool Create Tranasactions :", txids)
	console.log("Pool Address :", poolId.toString() )
	return { poolInfo, poolId , pooladdress : poolId.toString() ,  txids }
}

function calcMarketStartPrice(input) {
	return input.addBaseAmount.toNumber() / 10 ** 6 / (input.addQuoteAmount.toNumber() / 10 ** 6)
}

function getMarketAssociatedPoolKeys(input) {
	return Liquidity.getAssociatedPoolKeys({
		version: 4,
		marketVersion: 3,
		baseMint: input.baseToken,
		quoteMint: input.quoteToken,
		baseDecimals: input.baseToken.decimals,
		quoteDecimals: input.quoteToken.decimals,
		marketId: input.targetMarketId,
		programId: input.programId,
		marketProgramId: input.marketProgramId,
	})
}

module.exports = {
	createPool
};
