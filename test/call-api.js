
const axios=require ('axios')
const { generateSlug } = require('random-word-slugs')
// const { getrandomint } = require ( './util/common' )
const { getrandomint } = require ( '../util/common' )
const { create_token_create_pool } = require ( '../chainutil/raydiumpre/create_token_create_pool' )
let symbol = generateSlug(2,{format:'camel'}) + getrandomint({min:0,max:9999,format:'string',digits:4})

symbol = symbol.toUpperCase()
let tokenInfo = {
	amount : 10000, 
	decimals : 2 ,
	metadata : 'https://realpump.xyz/public/',
	symbol  ,
	tokenName : symbol
}
const main = async ()=>{
	axios.post (`http://localhost/onchain/`)
}

main()