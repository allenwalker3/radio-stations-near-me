'use strict';

const fs = require('fs/promises');
const { parse } = require('csv-parse/sync');

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const ConvertDMSToDD = (direction, degrees, minutes, seconds) => {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const files = ['./fcc/fcc_am.csv', './fcc/fcc_fm.csv'];
    try {
      for (const file of files) {
        const data = await fs.readFile(file, 'utf8');
        const records = parse(data, { skip_records_with_empty_values: true, delimiter: "|", trim: true });

        const stations = records.filter(r => r[1].length > 1 && r[19].length === 1 && r[23].length == 1
          && isNumeric(r[20]) && isNumeric(r[21]) && isNumeric(r[22]) && isNumeric(r[24]) && isNumeric(r[25])
          && isNumeric(r[26]))
          .map(r => {
            console.log(r[1], r[23], r[24] * 1, r[25] * 1, r[26] * 1, " ||| " + r[19], r[20] * 1, r[21] * 1, r[22] * 1)

            return {
              callSign: r[1].match(/^[^-]*/)[0],
              //callSign: r[1],
              frequency: r[2].replace(/\s+/g, ' ').trim(),
              service: (r[3] === 'AM' ? 'AM' : 'FM'),
              directional: r[5],
              hoursOperation: r[6],
              city: r[10],
              state: r[11],
              country: r[12],
              fileNumber: r[13],
              power: r[14].replace(/\s+/g, ' ').trim(),
              facilityId: r[18],
              geom: Sequelize.fn('ST_GeomFromText',
                `POINT(${ConvertDMSToDD(r[23], r[24] * 1, r[25] * 1, r[26] * 1)} ${ConvertDMSToDD(r[19], r[20] * 1, r[21] * 1, r[22] * 1)})`),
              licensee: r[27],
              applicationId: r[31],
              format: null,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })

        //console.log(stations)

        await queryInterface.bulkInsert('Stations', stations, {});
      }
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Stations', null, {});
  }
};
