let {
	Token,
	Percent,
	TokenAmount,
	TOKEN_PROGRAM_ID
} = require( '@raydium-io/raydium-sdk' )
const db = require ( '../../models' )
const { execSwap } = require ( './exec_swap_fixedin' )
const { myKeyPair } = require ( './config' )
const wrapper_execswap = async ({
	// inputToken ,
	// outputToken ,
	baseToken ,
	amountIn 
})=> {	console.log("\nExecuting Swap...")
	// let swapTokenAmountTotal = addBaseAmountNumber / 100 * swapAmountInPercent; // => 2000 	// let swapTokenAmountWallet = swapTokenAmountTotal / walletArray.length;
	// console.log("swapTokenAmountWallet", swapTokenAmountTotal) 	// let inputToken = quoteToken // WSOL	// let outputToken = baseToken // custom token	// let outputTokenAmount = new TokenAmount(outputToken, swapTokenAmountWallet * 10 ** outputToken.decimals)
	// let outputTokenAmount = new TokenAmount(outputToken, new BN(swapTokenAmountTotal).mul(new BN(10).pow(new BN(outputToken.decimals))))
	const resppool = await db[ 'pool' ].findOne({raw:true, where : { tokenaddress : baseToken } } )
	if ( resppool?.poolinfo ){}
	else { console.log(`POOL INFO NOT FOUND`); return null }
	let slippage = new Percent( 30 , 100) //     let slippage = new Percent(1, 100)
	let resp = await execSwap( {
		amountIn ,
		myKeyPair ,
		poolKeys : JSON.parse( poolinfo ) 
// 			targetPool,
// 			inputToken,
// 			outputTokenAmount,
// 			slippage,
// 			wallet: process.env.PRIVATE_KEY,
// 			poolInfo,
// //			marketInfo,
// 			baseToken,
// 			quoteToken,
// 			addBaseAmount,
// 			addQuoteAmount    
		}) // then( resp0 =>{ resp = resp0 })
	console.log("Distributing Tokens...")
}
module.exports ={ 
	wrapper_execswap
}
// let res = await execSwap({
//     targetPool,
//     inputToken,
//     outputTokenAmount,
//     slippage,
//     wallet: process.env.PRIVATE_KEY,
//     poolInfo,
//     marketInfo,
//     baseToken,
//     quoteToken,
//     addBaseAmount,
//     addQuoteAmount
// })
