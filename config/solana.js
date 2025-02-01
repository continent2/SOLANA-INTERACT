const bs58 = require('bs58')
let {	Connection,	Keypair,	PublicKey,	clusterApiUrl} = require('@solana/web3.js')
// const {
//     Currency,
//     Token,
//     TxVersion,
//     TOKEN_PROGRAM_ID,
//     LOOKUP_TABLE_CACHE,
// } = require('@raydium-io/raydium-sdk')
// require('dotenv').config () // ({ path: `.env.${process.env.NETWORK}` })
// const connection = new Connection(process.env.RPC_URL) // helius
// const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode(process.env.PRIVATE_KEY)));

const connection = new Connection( 'https://api.devnet.solana.com' )  // helius
const PRIVATE_KEY='1Li7pA9PNb2RbGKHftwFNzWtKTR9hkqSSYxcozSEBrk46UFcbHma3XMK16ZxcLc5y8bAVg8Krn4sXDgpQMVs1xf'
// const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode(process.env.PRIVATE_KEY)));
const myKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode( PRIVATE_KEY)));

const syskeypair = myKeyPair

const {
	Currency,
	Token,
	TxVersion,
	TOKEN_PROGRAM_ID,
	LOOKUP_TABLE_CACHE,
} = require('@raydium-io/raydium-sdk')

const DEFAULT_TOKEN = {
		'SOL': new Currency(9, 'USDC', 'USDC'),
		'WSOL': new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
}

module.exports = {
	connection  ,
	myKeyPair,
	syskeypair ,
	DEFAULT_TOKEN
}
