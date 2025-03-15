
// 52wg4GtrRZUoH6LhvfNHWovhkuZHcKmsKWEfHZ8dUhcnoBsBv2Wzi8Vgb69TaUnRrJQnVuEJfLb32Dnin2tHv4HT
// 5cmCuunUH6vvsBMnMq8e7DJLi4LXYoWvkn9VNS9w6jJz9Q8nj5MK6t3mnWE9Ecen9auQaDMNfno2DcZxWJpMPkmu

const axios = require ( 'axios')
const txhash='5hWZgGsT599z6fofPssvKEK2YyPueHzpu9dsg1ZrpFK7L3y3Vd8eMhLx16tE7AGyWgSRSh4SExoCUhXPW5CWhB1u'
const nettype='devnet'
const db = require ( '../models' )
const getamount = str =>{ //	let iCalContent = "DATE:20091201T220000\r\nSUMMARY:Dad's birthday";
	let result = /\d+$/gm.exec( str )
	console.log(result && result[1]);
	return result [ 0 ] // 	return result [ 1 ]
}

// CREATE TABLE `txfetchresponsedata` (
//   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
//   `createdat` datetime DEFAULT current_timestamp(),
//   `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
//   rawdata text , 
//   txhash varchar(100) ,
//   timestamp bigint ,
//   primary key ( id )
// );
const db=require ( '../models')
const parse_resp = async ( { resp , tokenid } ) =>{ console.log ( resp?.data ) 
	let Nfield = resp?.data?.result?.meta?.logMessages?.length
	let arr=	resp?.data?.result?.meta?.logMessages[ Nfield - 3].split( '\n'  ) 
	let N = arr?.length
	let type 
	let amounttoken
	let amountsol
	let price 
	let resptoken =await  db[ 'tokenstatic'].findOne ( {raw:true ,  where : { id : tokenid } } )
	for ( let idx = 0 ; idx < N ; idx ++ ){ let line = arr[ idx ]
		switch ( idx ){
			case 0 : 
				if ( line.match ( /buy/i )){	type='BUY' }
				else if ( line.match ( /sell/i )){	type='SELL' }
			break
			case 1 : break
			case 2 : break
			case 3 : 
				amounttoken = getamount ( line ) 
			break
			case 4 : break
			case 5 : break
			case 6 : 
				amountsol = getamount ( line ) 
			break
			default : break
		}
	}
	price = +amountsol / +amounttoken
	let amountnormalized = +amounttoken / ( Number.isFinite( +resptoken?.decimal ) ? 10**( +resptoken?.decimal ) : 1 )
	return { type , 
		amount : amountnormalized  , 
		amountnormalized , // : amounttoken ,  
		amountunnormalized : amounttoken ,  
		price : ''+price } // , amountsol
}
const parse_tx = async ( { txhash ,nettype , tokenid } ) =>{
	let resp = await axios.post ( ( nettype == 'devnet' ? `https://api.devnet.solana.com` : `https://api.solana.com` ) ,
		{
			"jsonrpc": "2.0",
			"id": 1,
			"method": "getTransaction",
			"params": [
				txhash , // "5hWZgGsT599z6fofPssvKEK2YyPueHzpu9dsg1ZrpFK7L3y3Vd8eMhLx16tE7AGyWgSRSh4SExoCUhXPW5CWhB1u",
				"json"
			]
		}
	)
	await db[ 'txfetchresponsedata' ].create ( { 
		rawdata : JSON.stringify ( resp?.data , null, 0 ) , 
		txhash , // : '' ,
//		timestamp : moment ,
		nettype
	 })
	return ( await parse_resp ( { resp , tokenid } ) )
//	console.log ( resp )
//	return resp
}
// const { parse_tx } = require ( './test/parse')
// parse_tx ( { txhash : "5hWZgGsT599z6fofPssvKEK2YyPueHzpu9dsg1ZrpFK7L3y3Vd8eMhLx16tE7AGyWgSRSh4SExoCUhXPW5CWhB1u" ,nettype : 'devnet' } ).then(console.log)
module.exports = { parse_tx } // const parse_tx = async ( { txhash ,nettype  } ) =>{
// => { type: 'BUY', amount: '4372266443', price: '0.0022871430939461618' }
// main()

//  -s -X POST -H "Content-Type: application/json" -d '
//   {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getTransaction",
//     "params": [
//       "2nBhEBYYvfaAe16UMNqRHre4YNSskvuYgx3M6E4JP1oDYvZEJHvoPzyUidNgNX5r9sTyN1J9UxtbCXy2rqYcuyuv",
//       "json"
//     ]
//   }
// '
/* const main = async ( txhash )=>{
	let resp = await axios.post ( `https://api.devnet.solana.com` , 
		{
			"jsonrpc": "2.0",
			"id": 1,
			"method": "getTransaction",
			"params": [
				txhash , // "5hWZgGsT599z6fofPssvKEK2YyPueHzpu9dsg1ZrpFK7L3y3Vd8eMhLx16tE7AGyWgSRSh4SExoCUhXPW5CWhB1u",
				"json"
			]
		}
	)
	console.log ( resp )
	return resp
}
resp?.data.result.meta.logMessages[ N - 3].split( '\n'  ) 
[
  'Program log: Buy transaction:', // 0
  'X1 (initial supply): 0', // 1 
  'Y1 (initial price): 100000', // 2
  'delta(X) (tokens minted): +4372266443', // 3
  'X2 (final supply): 4372266443',
  'Y2 (final price): 4428543',
  'net SOL amount (total spent): 9999999'
]
> 
resp?.data.result.meta.logMessages[ N - 3]
'Program log: Buy transaction:\n' +
  'X1 (initial supply): 0\n' +
  'Y1 (initial price): 100000\n' +
  'delta(X) (tokens minted): +4372266443\n' +
  'X2 (final supply): 4372266443\n' +
  'Y2 (final price): 4428543\n' +
  'net SOL amount (total spent): 9999999'
> 
*/
// const main__ = async ()=>{
// 	let resp = await axios.post ( `https://api.devnet.solana.com` , 
// 		{
// 			"jsonrpc": "2.0",
// 			"id": 1,
// 			"method": "getTransaction",
// 			"params": [
// 				"5hWZgGsT599z6fofPssvKEK2YyPueHzpu9dsg1ZrpFK7L3y3Vd8eMhLx16tE7AGyWgSRSh4SExoCUhXPW5CWhB1u",
// 				"json"
// 			]
// 		}
// 	)
// 	console.log ( resp )
// 	return resp
// }
