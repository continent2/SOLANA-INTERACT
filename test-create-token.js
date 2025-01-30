
let tokenInfo = {
	tokenName : 'TEST00' ,
	symbol : 'TEST00' ,
	metadata : 'https://realpump.xyz/public/cow.png',
	decimals : 6 ,
	amount : 10000_0000
}

const { createToken } = require ( './create_token' )
const main = async ()=>{
	let resp = await createToken( tokenInfo )
	console.log ( resp?.address  , resp?.txhash )	
}
main()
