'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      callSign: {
        type: Sequelize.STRING,  allowNull: false
      },
      frequency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      service: {
        type: Sequelize.STRING
      },
      directional: {
        type: Sequelize.STRING
      },
      hoursOperation: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      fileNumber: {
        type: Sequelize.STRING
      },
      power: {
        type: Sequelize.STRING
      },
      facilityId: {
        type: Sequelize.STRING
      },
      geom: {
        type: Sequelize.GEOMETRY('POINT'), allowNull: false
      },
      licensee: {
        type: Sequelize.STRING
      },
      applicationId: {
        type: Sequelize.STRING
      },
      format: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    //await addIndex('Stations', ['geom'], { name: 'stations_geom'});
  //  await queryInterface.sequelize.query("CREATE SPATIAL INDEX geom ON stations (geom)")
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stations');
  }
};