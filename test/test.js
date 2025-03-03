
const { createToken } = require ( '../chainutil/raydiumpre/create_token' )
const { myKeyPair } = require ( '../config/solana' )

const main = async ()=>{
	let {
		publickey , 
		secretkey  ,
		txhash
	} = await createToken( { tokenInfo : { 
		decimals , // : 2 ,
		metadata : 'https://realpump.xyz/public/' , // : 'https://realpump.xyz/public/',
		symbol : 'TEST00'  , 	//	tokenName : symbol //	 , name : symbol , // 
		name : 'TEST00', // : symbol
	}, myKeyPair } ) 
console.log ( 
	{
		publickey , 
		secretkey  ,
		txhash
	} )
}
// conv_keypair_to_readable=key=>{ return { publickey: key?.publicKey.toString() , secretkey : bs58. key?.secretkey }}
/*
PROGRAM ID : EciuhtQMoVxJx8swvMPEEgHSSZp4PhsZ6NYowv84ZCnr
Buffer Account	8n99XBmTYkDdeHc1fMwyierwgHR642s9vAav6qWUfvfZ
Program Account	 EciuhtQMoVxJx8swvMPEEgHSSZp4PhsZ6NYowv84ZCnr
Program Data Account	9Ttoc2oD2Mu6GPW49f7GQZFnYUjD3rag2einF6oULZfa
DEPLOYER 	FkqjQinskC3E8LAFkGzHCP6PHGHL2eaixyVA377TpmDm
Spill Account	 FkqjQinskC3E8LAFkGzHCP6PHGHL2eaixyVA377TpmDm
*/
