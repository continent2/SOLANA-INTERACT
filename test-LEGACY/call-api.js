
const axios=require ('axios')
const { generateSlug } = require('random-word-slugs')
// const { getrandomint } = require ( './util/common' )
const { getrandomint } = require ( '../util/common' )
const { create_token_create_pool } = require ( '../chainutil/raydiumpre/create_token_create_pool' )
 symbol = generateSlug(2,{format:'camel'}) + getrandomint({min:0,max:9999,format:'string',digits:4})
let { conv_keypair_to_address } = require ('../util/solana' )
// const { myKeyPair } = require ( '../config/solana' )
let { myKeyPair } = require ( '../chainutil/raydiumpre/config' )
symbol = symbol.toUpperCase().substr(0,6)
tokenInfo = {
	amount : 10000, 
	decimals : 2 ,
	metadata : 'https://realpump.xyz/public/',
	name ,
	symbol  ,
}
addQuoteAmountNumber ='0.1' // myKeyPair
calleraddress = conv_keypair_to_address( myKeyPair )
create_token_create_pool ({
	amount : 10000, 
	decimals : 2 ,
	metadata : 'https://realpump.xyz/public/',
	name ,
	symbol  ,
	// calleraddress : conv_keypair_to_address( myKeyPair ),
	// tokenInfo ,
	// addQuoteAmountNumber : '0.1',
	// myKeyPair
} ).then( resp =>{ resp0 = resp } )

const db=require( '../models' )
db[ 'pool' ].create ( { 
	poolinfo : JSON.stringify( resp0.poolInfo ) ,
	programid : resp0?.poolInfo?.programId.toString() ,
	marketid : resp0?.poolInfo?.marketId.toString() ,
	marketprogramid : resp0?.poolInfo?.marketProgramId.toString() ,
	tokenaddress : resp0?.mintAddress
})
db02[ 'token' ].create ( {
	address : resp0?.mintAddress ,
	programid : resp0?.baseToken?.programId.toString(),
	pooladdress : resp0?.targetPoolPubkey.toString(),
})
const main = async ()=>{
	axios.post (`http://localhost/onchain/`)
}

main()
// calleraddress = conv_keypair_to_address( myKeyPair ) // tokenInfo 
// let { baseToken , quoteToken , poolId , poolInfo } = await create_token_create_pool ({
// 	calleraddress : conv_keypair_to_address( myKeyPair ),
// 	tokenInfo ,
// 	addQuoteAmountNumber : '0.1',
// 	myKeyPair
// } )
