
const { connection , syskeypair }  = require ( '../config/solana' )
const SOL_USDC_POOL_ID = "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"
const main = async ()=>{
	const info = await connection.getAccountInfo(new PublicKey(SOL_USDC_POOL_ID)) 

}
