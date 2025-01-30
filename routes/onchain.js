var express = require('express');
var router = express.Router();
const { resperr , respok } = require( '../util/rest' ) 
const { createToken } = require ( '../chainutil/raydiumpre/create_token' )
const { message } =require ( '../config/message' )
let {
	Connection,
	Keypair,
	PublicKey,
	clusterApiUrl
} = require( '@solana/web3.js' )
const bs58 = require ( 'bs58' )
require( 'dotenv').config() 
router.post ( async ( req , res )=>{
	let {
		name,
		symbol,
		urllogo,
	} = req?.body
  if (     name && 		symbol && 		urllogo  ){ }
  else { resperr ( res , message?.MSG_ARGMISSING ) ; return }
  const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode (process.env.PRIVATE_KEY)));
  let resp = await createToken( { tokenInfo , myKeyPair })
  if ( resp?.txhash ){}
  else {resperr( res, message?.MSG_TXFAIL) ; return }
  let { address , } =resp
  respok ( res, message?.MSG_CREATED, null , { address } )
})
module.exports = router
