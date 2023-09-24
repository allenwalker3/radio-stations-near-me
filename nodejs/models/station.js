'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Station.init({
    callSign: DataTypes.STRING,
    frequency: DataTypes.STRING,
    service: DataTypes.STRING,
    directional: DataTypes.STRING,
    hoursOperation: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    fileNumber: DataTypes.STRING,
    power: DataTypes.STRING,
    facilityId: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('POINT'),
    licensee: DataTypes.STRING,
    applicationId: DataTypes.STRING,
    format: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Station',
  });
  return Station;
};