var express = require('express');
var router = express.Router();
const { resperr , respok } = require( '../util/rest' ) 
const { createToken } = require ( '../chainutil/raydiumpre/create_token' )
const { message } =require ( '../config/message' )
let {	Connection,	Keypair,	PublicKey,	clusterApiUrl } = require( '@solana/web3.js' )
const bs58 = require ( 'bs58' )
require( 'dotenv').config() 
const { validatesolanaaddress } = require ( '../util/validate');
const { tokenexists , conv_keypair_to_address } = require('../util/solana');
const { createPool } = require('../chainutil/raydiumpre/create_pool');
const { DEFAULT_TOKEN, syskeypair, myKeyPair } = require ( '../config/solana' )
const {  Currency,  Token,  TxVersion,  TOKEN_PROGRAM_ID,  LOOKUP_TABLE_CACHE, } = require('@raydium-io/raydium-sdk')
const WSOL_ADDRESS = 'So11111111111111111111111111111111111111112'
const BN = require('bn.js');
const INIT_POOL_BASE_AMOUNT = new BN( (1_0000_0000 * 10**9 ).toString() )
const INIT_POOL_QUOTE_AMOUNT = new BN ( ( 10**8  ).toString()) // => 0.1
const db = require ( '../models' )
const { create_token_create_pool } = require ( '../chainutil/raydiumpre/create_token_create_pool' )
const { generateSlug } = require('random-word-slugs')
const MAP_BUYSELL_TYPES = { buy : 1 , sell : 1 }
// const { getrandomint } =require('../util/common' )
const { wrapper_create_token_create_pool } = require( '../chainutil/raydiumpre/wrapper-ctcp' )
const { wrapper_execswap } = require ( '../chainutil/raydiumpre/exec_swap_fixedin' )
// const { myKeyPair} = require ( '../chainutil/raydiumpre/config')
// router.get ( '/' , async(req,res)=>{
//   console.log (`hello world`)
//   respok ( res )
// })
// let tokenInfo = {
// 	amount : 10000, 
// 	decimals : 2 ,
// 	metadata : 'https://realpump.xyz/public/',
// 	symbol  ,
// 	name : symbol
// }
// import { RP_PROGRAM_ID } from 'utils/constants';
// export const RP_PROGRAM_ID = '55CoHrcKfaQAti2McBt37iuuErrv5oqs54trMnCJeFGu';
const anchor = require("@coral-xyz/anchor")
const { parse_tx } = require ( '../test/parse_tx' )
router.get ( '/tradeinfo/:txhash/:nettype/:tokenid' , async (req,res)=>{
  let { txhash , nettype , tokenid } = req?.params
  switch ( nettype ){
    case 'devnet' : 
    case 'mainnet' :
    break
    default : resperr ( res, `INVALID-NETTPE`, null , {reason : `nettype must be either devnet or mainnet`})
    break
  }
  let amount 
  let amountinbasecurrency 
  let amountinquotecurrency 
  let price
  let parseddata = await parse_tx ( { txhash , nettype , tokenid })
  respok ( res , null , null , { ... parseddata } ) // amount , price
})
router.get ( '/address/pda/:mintaddress/:programid' , async (req,res)=>{
  let { mintaddress , programid } = req?.params
  if ( programid == '_'){ programid = '55CoHrcKfaQAti2McBt37iuuErrv5oqs54trMnCJeFGu' }
  else {}
  const mintpubkey = new PublicKey( mintaddress )
  const RP_PROGRAM_ID_PUB = new PublicKey( programid ); // RP_PROGRAM_ID
  const [ tokenmintpda ] = await PublicKey.findProgramAddress(
    [Buffer.from('token_mint'), mintpubkey.toBuffer()], // mintPubkey.toBuffer()],
    RP_PROGRAM_ID_PUB,
  );
  console.log('Derived tokenmintpda:', tokenmintpda.toBase58());
  const [ metadatapda ] = anchor.web3.PublicKey.findProgramAddressSync(
    [ Buffer.from("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
//      mint.publicKey.toBuffer(),
      mintpubkey.toBuffer()
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
  );
  respok ( res, null , null  , { tokenmintpda , metadatapda } )
} )
router.post ( '/poolandtoken' , async (req,res)=>{
  let { 
    amount, // < 18446744073709551615n
    decimals, // 1<= decimals<= 9
    metadata ,
    name ,
    symbol,
    addQuoteAmountNumber
  } = req?.body
  // if ( amount ){}
  // else {amount = 10000}
  // if (  decimals){}
  // else {decimals = 2 } 
  // if (metadata){}
  // else {metadata = 'https://realpump.xyz/public/'}  
  // if( symbol){}
  // else { symbol = generateSlug(2,{format:'camel'}) + getrandomint({min:0,max:9999,format:'string',digits:4}) }
  // if ( name ){}
  // else { name = symbol }
  if ( amount && decimals && metadata && name && symbol ) {}
  else { resperr ( res , message?.MSG_ARGINVALID) ; return } //  let { baseToken , quoteToken , poolId , poolInfo } 
//  let resp = await create_token_create_pool ( {
  let resp = await wrapper_create_token_create_pool ( {
    amount, // < 18446744073709551615n
    decimals, // 1<= decimals<= 9
    metadata ,
    name ,
    symbol,
    addQuoteAmountNumber //    calleraddress : conv_keypair_to_address ( myKeyPair ),//    tokenInfo : req?.body ,  //  addQuoteAmountNumber : '0.1' ,    // myKeyPair , // : '',
  } )
  respok( res, message?.MSG_CREATED , null , { ... resp } ) 
})
router.post ( '/buysell/:type/:tokenaddress/:pooladdress/:amountin' , async (req,res)=>{
  let { type,  tokenaddress ,pooladdress , amountin } = req?.params
  if ( MAP_BUYSELL_TYPES[ type ]){}
  else { resperr( res , message?.MSG_ARGINVALID ) ; return }  
  let txids = await wrapper_execswap ( {
    baseToken : tokenaddress ,
    amountIn   : amountin
  } )
  respok ( res, null,null ,{ txids }) 
} )
router.post ( '/pool/:tokenaddress', async ( req,res)=>{
  let { tokenaddress } =req?.params
  if ( validatesolanaaddress( tokenaddress)){}
  else { resperr(res, message?.MSG_ARGINVALID ) ; return }
  if ( await tokenexists ( {tokenaddress })){}
  else {resperr(res, message?.MSG_DATANOTFOUND ) ; return }
  let baseToken = new Token ( TOKEN_PROGRAM_ID , new PublicKey( tokenaddress ) , 9, 'WSOL' , 'WSOL' )
  let quotetoken= DEFAULT_TOKEN?.WSOL
  let {     poolInfo, poolId , pooladdress  ,  txids   } = await createPool ({ 
    baseToken ,
    quoteToken  ,
    addBaseAmount : INIT_POOL_BASE_AMOUNT ,
    addQuoteAmount :INIT_POOL_QUOTE_AMOUNT  ,
    startTime  : 0 , // => RIGHT AWAY
    myKeyPair  : syskeypair , //        walletTokenAccounts,
  } )
  respok ( res , null , null , { pooladdress })
  await db[ 'pool'].create ({
    base : tokenaddress ,
    quote  : WSOL_ADDRESS ,
    initbaseamount : INIT_POOL_BASE_AMOUNT ,
    initquoteamount :INIT_POOL_QUOTE_AMOUNT ,
    authority    : conv_keypair_to_address ( syskeypair ) ,
    pooladdress  ,
    txhash : JSON.stringify ( txids )
  })

}) 
router.post ( '/token' , async ( req , res )=>{
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
router.post ( '/tokenandpool' , async (req,res)=>{
} )

module.exports = router
