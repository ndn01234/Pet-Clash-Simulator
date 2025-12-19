const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Pet = sequelize.define("Pet", {
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  image: DataTypes.STRING,
  hunger: DataTypes.INTEGER,
  happiness: DataTypes.INTEGER,
  energy: DataTypes.INTEGER
})

module.exports = Pet
