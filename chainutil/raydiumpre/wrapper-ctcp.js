
const axios=require ('axios')
const { generateSlug } = require('random-word-slugs') // const { getrandomint } = require ( './util/common' )
const { getrandomint } = require ( '../util/common' )
const { create_token_create_pool } = require ( './create_token_create_pool') // ./chainutil/raydiumpre/create_token_create_pool' )
 symbol = generateSlug(2,{format:'camel'}) + getrandomint({min:0,max:9999,format:'string',digits:4})
let { conv_keypair_to_address } = require ('../../util/solana' ) // const { myKeyPair } = require ( '../config/solana' )
let { myKeyPair } = require ( './config' ) // ./chainutil/raydiumpre/config' )
const db=require( '../../models' )
const MAX_LEN_TOKEN_SYMBOL = 6
const MAX_LEN_TOKEN_NAME = 10
const MIN_AMOUNT_TO_POOL = 10000
const wrapper_create_token_create_pool = async ({
	amount , 
	decimals , 
	metadata , 
	name ,
	symbol , 	
	addQuoteAmountNumber ,
})=>{
	amount = +amount	
	if ( Number.isFinite( amount) && amount >= MIN_AMOUNT_TO_POOL ){}
	else { console.log (`INVALID AMOUNT ARG@WRAPPER-CTCP`) ; return null }
	decimals = +decimals
	if ( Number.isFinite( decimals) && decimals >= 0 ){}
	else { console.log (`INVALID DECIMALS ARG ARG@WRAPPER-CTCP`) ; return null }
	name = name.substr(0, MAX_LEN_TOKEN_SYMBOL ) 
	symbol = symbol.toUpperCase().substr(0, MAX_LEN_TOKEN_SYMBOL )
	tokenInfo = {
		amount , // : 10000, 
		decimals , // : decimals ,
		metadata : ( metadata? metadata : null ),
		symbol  , 	//	tokenName : symbol //	 , name : symbol , // 
		name 
	}
//	addQuote AmountNumber ='0.1' // myKeyPair
	calleraddress = conv_keypair_to_address( myKeyPair )
	let resp = await create_token_create_pool ({
		calleraddress : conv_keypair_to_address( myKeyPair ),
		tokenInfo ,
		addQuoteAmountNumber , //: '0.1',
		myKeyPair
	} ) // .then( resp =>{ resp = resp } )	
	await db[ 'pool' ].create ( { 
		poolinfo : JSON.stringify( resp.poolInfo ) ,
		programid : resp?.poolInfo?.programId.toString() ,
		marketid : resp?.poolInfo?.marketId.toString() ,
		marketprogramid : resp?.poolInfo?.marketProgramId.toString() ,
		tokenaddress : resp?.mintAddress
	})
	await db02[ 'token' ].create ( {
		address : resp?.mintAddress ,
		programid : resp?.baseToken?.programId.toString(),
		pooladdress : resp?.targetPoolPubkey.toString(),
	})	
	return resp
}
module.exports ={ 
	wrapper_create_token_create_pool
}
// const main = async ()=>{	axios.post (`http://localhost/onchain/`) }
// main()
// calleraddress = conv_keypair_to_address( myKeyPair ) // tokenInfo 
// let { baseToken , quoteToken , poolId , poolInfo } = await create_token_create_pool ({
// 	calleraddress : conv_keypair_to_address( myKeyPair ),
// 	tokenInfo ,
// 	addQuote AmountNumber : '0.1',
// 	myKeyPair
// } )
