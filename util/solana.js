
const bs58 = require ( 'bs58' )
const { getOrCreateAssociatedTokenAccount } = require ( '@solana/spl-token' )
let {	Connection,	Keypair,	PublicKey,	clusterApiUrl} = require('@solana/web3.js')
// const bs58 = require('bs58')
const {
	Currency,
	Token,
	TxVersion,
	TOKEN_PROGRAM_ID,
	LOOKUP_TABLE_CACHE,
} = require('@raydium-io/raydium-sdk')
require('dotenv').config () // ({ path: `.env.${process.env.NETWORK}` })
//const connection = new Connection( process.env.RPC_URL ) // helius
const { connection , syskeypair }  = require ( '../config/solana' )

const tokenexists = async ({ tokenaddress }) =>{
	try { const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, syskeypair, tokenaddress , syskeypair.publicKey ); return true
	} catch(err){ console.log(err); return flase }
}
const generaterandomaccount = ()=>{
  let kp = Keypair.generate()  // console.log(  );   // console.log(  )
  let address = kp.publicKey.toBase58()
  let privatekey = bs58.default.encode( kp.secretKey )
	return { address , privatekey }
}
const generaterandomhex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
const generaterandomtxhash = ()=>{ //	let txhashhex=  generaterandomhex ( 64)	
	let txhashhex=  generaterandomhex ( 128 )	
	return  bs58.default.encode(new Buffer.from( txhashhex , 'hex'))
}
const conv_keypair_to_readable=key=>{ return { publickey: key?.publicKey.toString() , secretkey : bs58. key?.secretkey }}
const conv_keypair_to_address =key=>{ return key?.publicKey.toString() } // { publickey: key?.publicKey.toString() ,  }}
const conv_keypair_to_secretkey=key=>{ return bs58.key?.secretkey } // { secretkey : bs58. key?.secretkey }}

module.exports = {
	tokenexists ,
	generaterandomaccount ,
	generaterandomhex , 
	generaterandomtxhash ,
	conv_keypair_to_readable ,
	conv_keypair_to_address  ,
	conv_keypair_to_secretkey ,
}

