"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename); // const env = 'production' // 'developmentDesktop20191004' //  //   // process.env.NODE_ENV ||
const env = process.env.NODE_ENV || "development"; //test 'developmentpc' //  // 'development'// 'production' //
const config = require("../config/dbconfig.json")[env]; // ./apiServe // __dirname
// let config
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      ...config,
      dialect: "mariadb", // mariadb',
      //    , port : '37375'
      //      dialectOptions: { timezone: 'Etc/GMT-9' },
      define: { timestamps: false },
      logging: false,
      pool: {
        max: 500,
        //        max: 96000 , //  8000, // 500
        min: 0,
        //        acquire: 90000, // 10000 , // 60000,
        acquire: 60000, // 6000, // 10000 , // 60000,
        //        idle: 1000, // 10000,
        idle: 10000, // 10000,
      },
    }
    //  , define: {timestamps: false}
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// db[ 'tokenstatic' ].hashOne ( db[ 'tokendynamic' ] , {   foreignKey : '' ,  targetKey : '' , })
// db[ 'tokendynamic'].belongsTo(db[ 'tokenstatic' ] , { foreignKey : '' , targetKey : '' } ) 

// db[ 'tokendynamic' ].hasOne ( db[ 'tokenstatic' ] , {   foreignKey : 'id' ,  sourceKey : 'tokenid' , })
// db[ 'tokenstatic'  ].belongsTo(db[ 'tokendynamic' ] , { foreignKey : 'id' , targetKey : 'tokenid' } ) 

// db[ 'tokenbonding'].hasOne ( db[ 'tokenstatic' ] , {   foreignKey : 'id' ,  sourceKey : 'tokenid' , })
// db[ 'tokenstatic'].belongsTo(db[ 'tokenbonding' ] , { foreignKey : 'id' , targetKey : 'tokenid' } ) 

// // db[ 'comment'    ].hasOne ( db[ 'tokenstatic'] , { foreignKey : 'id' , sourceKey : 'itemid' } )
// // db[ 'tokenstatic'].belongsTo ( db['comment'] , {foreignKey : 'id' , targetKey : 'itemid'  })

// db[ 'comment'    ].hasOne ( db[ 'tokenstatic'] , { foreignKey : 'id' , sourceKey : 'itemid' } )
// db[ 'tokenstatic'].belongsTo ( db['comment'] , {foreignKey : 'id' , targetKey : 'itemid'  })

// db[ 'tokenstatic' ].hasOne ( db[ 'user'] , { foreignKey: 'id' , sourceKey : 'creatorid' } )
// db[ 'user'        ].belongsTo ( db[ 'tokenstatic'], {foreignKey : 'id' , targetKey : 'creatorid' } )

// db[ 'logtrade' ].hasOne ( db[ 'tokenstatic' ] , {   foreignKey : 'id' ,  sourceKey : 'tokenid' , })
// db[ 'tokenstatic'  ].belongsTo(db[ 'logtrade' ] , { foreignKey : 'id' , targetKey : 'tokenid' } ) 

// db[ 'logtrade' ].hasOne ( db[ 'user' ] , {   foreignKey : 'id' ,  sourceKey : 'transactorid' , })
// db[ 'user'  ].belongsTo(db[ 'logtrade' ] , { foreignKey : 'id' , targetKey : 'transactorid' } ) 

// db[ 'holding' ].hasOne ( db[ 'tokenstatic' ] , { foreignKey : 'id' ,  sourceKey : 'tokenid' , } )
// db[ 'tokenstatic' ].belongsTo ( db[ 'holding' ] , { foreignKey : 'id' , targetKey : 'tokenid' } )

// db[ 'holding' ].hasOne ( db[ 'user' ] , { foreignKey : 'id' ,  sourceKey : 'userid' , } )
// db[ 'user' ].belongsTo ( db[ 'holding' ] , { foreignKey : 'id' , targetKey : 'userid' } )

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

