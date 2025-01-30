
// var validurl = require('valid-url');
// const validateurl = str=>{
//   if ( validurl.isUri( str ) ){    return true   } // console.log('Looks like an URI');
//   else {    return false  } // console.log('Not a URI');
// }

const URL = require("url").URL
const validateurl = (str) => {
    try {
      new URL( str );
      return true;
    } catch (err) {
      return false;
    }
}

const {PublicKey} =require( '@solana/web3.js' )

const validatesolanaaddress = ( publickey )=>{    // const owner = new PublicKey("DS2tt4BX7YwCw7yrDNwbAdnYrxjeCPeGJbHmZEYC8RTb");
  const owner = new PublicKey( publickey )
  return PublicKey.isOnCurve( owner.toBytes() )  // true   // console.log(PublicKey.isOnCurve(owner.toString())); // true
}
const validatesolanatxhash = txhash => txhash && txhash?.length >= 80

const validateemail =email=> {  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
module.exports= {
  validateurl
  , validatesolanaaddress 
  , validatesolanatxhash
  , validateemail
}
