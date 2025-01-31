let fs = require('fs');
let readline = require('readline');
let { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js') // 1 000 000 000
let {
    Token,
    Percent,
    TokenAmount,
    TOKEN_PROGRAM_ID
} = require( '@raydium-io/raydium-sdk' )
let { createToken } = require('./create_token')
let { createMarket } = require('./create_market')
let { createPool } = require('./create_pool')
// let { execSwap } = require('./src/exec_swap.js')
let {
    connection,
//    myKeyPair,
    DEFAULT_TOKEN,
} = require('./config')
let {
    getWalletTokenAccount,
    sleepTime
} = require('./util')
// let prompt = require('prompt-sync')({ sigint: true });
let BN = require('bn.js');
// require('dotenv').config({ path: `.env.${process.env.NETWORK}` })
require('dotenv').config() 
// let secretKeyString = fs.readFileSync('./id.json', 'utf8');
// let secretKey = Uint8Array.from(JSON.parse(secretKeyString));
// let keypair = solanaWeb3.Keypair.fromSecretKey(secretKey);
let minimumSOLBalance = 4;
// main({ amount : 10000_0000,
//     decimals : 6 ,
//     metadata ,
//     symbol : 'TST00',
//     tokenName : 'TST00'
// })
async function create_token_create_pool ({
    calleraddress ,
    tokenInfo ,
    addQuoteAmountNumber ,
    myKeyPair
}) {
    let { amount, // < 18446744073709551615n
        decimals, // 1<= decimals<= 9
        metadata ,
        symbol,
        tokenName 
    } = tokenInfo     // get account SOL balance
    let address = calleraddress // new PublicKey(process.env.PUBLIC_KEY );
    let balance = await connection.getBalance(address);
    let balanceInSol = balance / LAMPORTS_PER_SOL;
    console.log( `Deployer account Balance: ${balanceInSol} SOL\n` );
    if (balanceInSol < minimumSOLBalance) {
        console.log("Insufficient SOL balance in the account. Please ensure a minimum of", minimumSOLBalance, "SOL is secured to prevent transaction failures.");
        return null // process.exit( 1 );
    }
    console.log( "...Token Info Input..." )
//    let amount = Number(prompt('amount(default: 10000): ')) || 10000;
  //  let decimals = Number(prompt('decimals(default: 9): ')) || 9;
    while ( decimals > 9 || decimals < 1 ) {
        console.log( "Invalid decimal value, should be a value between 1 and 9" )
        return null // decimals = Number(prompt('decimals(default: 9): ')) || 9;
    }
    if ( amount * 10 ** decimals > 18446744073709551615n) {
        console.log("invalid supply and decimal value, total supply should be less than 18,446,744,073,709,551,615, including decimals")
        return null 
    }
    console.log("\n...Market Info Input...")
    let lotTickMap = {
        0.001: 0.001,
        0.01: 0.0001,
        0.1: 0.00001,
        1: 0.000001,
        10: 0.0000001,
        100: 0.00000001,
        1000: 0.000000001,
        10000: 0.0000000001
    }
    // let lotSize = Number(prompt('Lot Size(Choose higher for larger token supply, default: 1): ')) || 1;
    let lotSize = 1
    if (!Object.keys(lotTickMap).includes(lotSize.toString())) {
        // If not valid, prompt again
        console.log("Invalid lot size, should be one of following values.")
        console.log(Object.keys(lotTickMap))
        return;
    }
    let tickSize = lotTickMap[lotSize]
    console.log("Associated Tick Size :", tickSize);
    console.log("...Pool Info Input...")
    let addBaseAmountNumber = amount // Number(prompt(`token amount for pool(default: ${amount}): `)) || amount;
    if (addBaseAmountNumber > amount) {
        console.log("Invalid value, should be less than total token supply")
        return;
    }
//    let addQuoteAmountNumber = Number(prompt('SOL amount for pool(default: 1): ')) || 1;
    let totalSOLBalanceRequired = minimumSOLBalance + (addQuoteAmountNumber * 2)
    if (totalSOLBalanceRequired > balanceInSol) {
        console.log("Insufficient SOL balance to create the pool. Please ensure a minimum of", totalSOLBalanceRequired, "SOL is secured to prevent transaction failures. It will also used to secure token supply");
        return null ;
    }
    let poolLockTime = 0 // Number(prompt('pool available after _hours(default: 0): ')) || 0;
    console.log("...Swap Info Input...")
    let swapAmountInPercent = 20 // Number(prompt('Token amount to secure in percent(default: 20): ')) || 20;
    // Token info input
    console.log( "Creating Token..." )
    let mintAddress = await createToken( tokenInfo )
    // createToken(tokenInfo).then(resp0=>{ mintAddress = resp0} )
    let baseToken = new Token(TOKEN_PROGRAM_ID, new PublicKey(mintAddress), tokenInfo.decimals, tokenInfo.symbol, tokenInfo.tokenName)
    let quoteToken = DEFAULT_TOKEN.WSOL
    console.log( "Creating Market..." )
    let { marketId: targetMarketId, marketInfo } = await createMarket( {
        baseToken,
        quoteToken,
        lotSize ,
        tickSize ,
        wallet : myKeyPair ,
    } )
/******************************* BM */
    // create pool
    let OFFSET_DECIMALS = 3
    let addBaseAmount  = new BN(addBaseAmountNumber ).mul(new BN(10).pow(new BN(tokenInfo.decimals))); // custom token // '10000000000000'
    let addQuoteAmount = new BN( parseInt( addQuoteAmountNumber * 10**OFFSET_DECIMALS)).mul(new BN(10).pow(new BN( 9 - OFFSET_DECIMALS ))); // WSOL // '1000000000'
    console.log("addBaseAmount", addBaseAmount   )
    console.log("addQuoteAmount", addQuoteAmount )
    let startTime = Math.floor(Date.now() / 1000 ) + poolLockTime * 60 * 60    // let startTime = Math.floor(Date.now() / 1000) // start immediately
    // check if minted token appeared in wallet
    let walletTokenAccounts
    let found = false
    while ( ! found ) { // INTENTIONAL DELAY
        walletTokenAccounts = await getWalletTokenAccount ( connection, myKeyPair.publicKey ) // PublicKey [PublicKey(A6fwh735ZmyV7JvRE7D4XJoWxxbE3Y8bjonGiRYDvyEz)] {            _bn: <BN: 872d1e8bf8d2e12a487dca57c9d736227c367a641afb5c844ba67e799c6f55f3>
        walletTokenAccounts.forEach((tokenAccount) => {
            if (tokenAccount.accountInfo.mint.toString() == mintAddress) {
                found = true;
                console.log("new token checked.\n")
                return;
            }
        });
        if (!found) {
            console.log("checking new token in wallet...")
            await sleepTime(1000); // Wait for 1 seconds before retrying
        }
    }
    console.log("Creating Pool...")
    let { poolId: targetPoolPubkey, poolInfo } = await createPool({
        baseToken,
        quoteToken,
        addBaseAmount,
        addQuoteAmount,
        targetMarketId,
        startTime,
        walletTokenAccounts
    })
    return { baseToken , quoteToken , poolId , poolInfo }
    
//    createPool({        baseToken,        quoteToken,        addBaseAmount,        addQuoteAmount,        targetMarketId,        startTime,        walletTokenAccounts }).then(resp0=>{ resp = resp0 })
    // let targetPool = '9cAk6wsiehHoPyEwUJ9Vy8fpb5iHz5uCupgAMRKxVfbN' // replace pool id
    let targetPool = targetPoolPubkey.toString()
/************************   SWAP */
    console.log("\nExecuting Swap...")
    let swapTokenAmountTotal = addBaseAmountNumber / 100 * swapAmountInPercent; // => 2000
    // let swapTokenAmountWallet = swapTokenAmountTotal / walletArray.length;
    console.log("swapTokenAmountWallet", swapTokenAmountTotal)
    let inputToken = quoteToken // WSOL
    let outputToken = baseToken // custom token
    // let outputTokenAmount = new TokenAmount(outputToken, swapTokenAmountWallet * 10 ** outputToken.decimals)
    let outputTokenAmount = new TokenAmount(outputToken, new BN(swapTokenAmountTotal).mul(new BN(10).pow(new BN(outputToken.decimals))))
    let slippage = new Percent( 30 , 100) //     let slippage = new Percent(1, 100)

    // let res = await execSwap({
    //     targetPool,
    //     inputToken,
    //     outputTokenAmount,
    //     slippage,
    //     wallet: process.env.PRIVATE_KEY,
    //     poolInfo,
    //     marketInfo,
    //     baseToken,
    //     quoteToken,
    //     addBaseAmount,
    //     addQuoteAmount
    // })
    execSwap({        
        targetPool,        
        inputToken,        
        outputTokenAmount,        
        slippage,
        wallet: process.env.PRIVATE_KEY,        
        poolInfo,        
        marketInfo,        
        baseToken,        
        quoteToken,        
        addBaseAmount,
        addQuoteAmount    }).then( resp0 =>{ resp = resp0 })
    console.log("Distributing Tokens...")
    // read wallet private keys from file
    let walletArray = [];
    let readInterface = readline.createInterface({
        input: fs.createReadStream('wallets.txt'), // Specify the path to your file here
        output: process.stdout,
        console: false
    });

    readInterface.on('line', function (line) {
        walletArray.push(line);
    });

    // readInterface.on('close', async function () {
    //     // file read finished

    //     // let baseToken = new Token(TOKEN_PROGRAM_ID, new PublicKey("D8VCsDwkTBMTAcsBLF9UZ8vYD4U7FvcJp1fMi9n9QqhE"), tokenInfo.decimals, tokenInfo.symbol, tokenInfo.tokenName)
    //     // let quoteToken = DEFAULT_TOKEN.WSOL
    //     console.log("\nswap wallet count", walletArray.length)

    //     for (let wallet of walletArray) {
    //         let res = await execSwap({
    //             targetPool,
    //             inputToken,
    //             outputTokenAmount,
    //             slippage,
    //             wallet
    //         })
    //     }
    // });

}
module.exports= { 
    create_token_create_pool
}

//    let symbol = prompt('symbol(default: "TMT"): ') || 'TMT';
//    let tokenName = prompt('token name(default: "Test Mock Token"): ') || 'Test Mock Token';
    // let tokenInfo = {
    //     amount,
    //     decimals,
    //     metadata: "",
    //     symbol,
    //     tokenName
    // }
