/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pool', {
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
    base: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    quote: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    initbaseamount: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    initquoteamount: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    authority: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pool'
  });
};
