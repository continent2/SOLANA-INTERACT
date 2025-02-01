/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    privatekey: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    urllogo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    programid: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    pooladdress: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'token'
  });
};
