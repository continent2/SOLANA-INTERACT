const { generateSlug } = require( "random-word-slugs" )
let symbol = generateSlug(2, { format: "camel" })
symbol =  symbol.toUpperCase().substring(0,6)
const getrandomint = ({ min, max , format , digits } ) => {
	min = Math.ceil ( min )
	max = Math.floor (max)
	let num = Math.floor(Math.random() * (max - min + 1)) + min
	switch ( format){
		case 'string' : return String( num ) .padStart ( digits , '0');break
		default : return num ; break
	}
}
let {
	Connection,
	Keypair,
	PublicKey,
	clusterApiUrl
} = require('@solana/web3.js')
const bs58 = require('bs58')
const PRIVATE_KEY='1Li7pA9PNb2RbGKHftwFNzWtKTR9hkqSSYxcozSEBrk46UFcbHma3XMK16ZxcLc5y8bAVg8Krn4sXDgpQMVs1xf'
// const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode(process.env.PRIVATE_KEY)));
const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode( PRIVATE_KEY)));

const { createToken } = require ( './chainutil/raydiumpre/create_token' )
const main = async ()=>{
	let amount = getrandomint({min:1,max:100}) * 10000_0000
	let tokenInfo = {
		amount , // : getrandomint({min:1,max:100}) * 10000_0000
		name : symbol.toUpperCase().substring(0,6) ,
		symbol : symbol ,
		metadata : 'https://realpump.xyz/public/cow.png',
		decimals : getrandomint({min:1,max:6 }) ,
	}	
	console.log ({tokenInfo})	
	setTimeout(async () => {
		let resp = await createToken( { tokenInfo , myKeyPair } )		
		console.log ( resp?.address  , resp?.txhash )		
	}, 5*1000 );
//	return 
}
main()
/*let tokenInfo = {
	tokenName : 'TEST00' ,
	symbol : 'TEST00' ,
	metadata : 'https://realpump.xyz/public/cow.png',
	decimals : 6 ,
	amount : 10000_0000
}
*/
