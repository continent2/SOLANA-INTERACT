const getrandomint = ({ min, max , format , digits } ) => {
	min = Math.ceil ( min )
	max = Math.floor (max)
	let num = Math.floor(Math.random() * (max - min + 1)) + min
	switch ( format){
		case 'string' : return String( num ) .padStart ( digits , '0');break
		default : return num ; break
	}
}
module.exports= { 
	getrandomint
}
