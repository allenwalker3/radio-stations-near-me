var express = require('express');
var router = express.Router();
const { Sequelize, QueryTypes } = require('sequelize');
const { Station } = require('../models');
const { Formats } = require('../constants/constants')
const fs = require('fs');

// db init
let database;
let host;
if (process.env.NODE_ENV === 'test') {
  database = 'fcc_db_test'
  host = 'localhost'
} else {
  database = 'fcc_db'
  host = 'mysqldb'
}

const sequelize = new Sequelize(database, 'root', 'password', {
  host: host,
  dialect: 'mysql'
});


const queryInterface = sequelize.getQueryInterface();
(async () => {

  try {
    await sequelize.authenticate();

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})

/* GET home page. */
router.get('/', async (req, res) => {
  let results;
  const services = [];
  let { loc_x, loc_y, distance } = req.query;
  distance = Number(distance);
  if (Number(loc_x) && Number(loc_y) && distance && distance > 0 && distance <= 200) {
    results = await sequelize.query(`
      SELECT (ST_Distance_Sphere(ST_GeomFromText('POINT(${loc_y} ${loc_x})'), geom) / 1609.34) as distance,
          id,
          callSign, 
          frequency, 
          service,
          directional,
          hoursOperation,
          city,
          state,
          country,
          fileNumber,
          power,
          facilityId,
          geom,
          licensee,
          applicationId,
          format
      FROM
        Stations
      WHERE
          ST_Distance_Sphere(
          POINT(${loc_y}, ${loc_x}),
          geom
          ) < 1609.34 * ${distance}`, { type: QueryTypes.SELECT });
  }

  res.send(results);
});

router.post('/', async (req, res) => {
  const ipAddress = req.socket.remoteAddress;
  const callSign = req.body.callSign;
  const format = req.body.format;
  const service = req.body.service;
  if (Formats.includes(format) && callSign?.length < 8 && (service === 'FM' || service === 'AM') ) {
    const stations = await Station.findAll({ where: { callSign: callSign, service: service } });
    for (const station of stations) {
      station.format = format
      station.save()
    }
  }
  const date = new Date().getDate(); //Current Date
  const month = new Date().getMonth() + 1; //Current Month
  const year = new Date().getFullYear(); //Current Year
  const hours = new Date().getHours(); //Current Hours
  const min = new Date().getMinutes(); //Current Minutes
  const sec = new Date().getSeconds(); //Current Seconds
  const dateTime = month + '/' + date + '/' + year
    + ' ' + hours + ':' + min + ':' + sec

  const log = `${ipAddress} ${dateTime} : ${callSign} : ${format}\n`


  fs.writeFile('./logs/updates.txt', log, { flag: 'a+' }, (err) => {
    if (err) {
      throw err;
    }
    console.log("File is updated.");
  });

  res.send('Got a PUT request: ' + req.body);
})

router.get('/callSign/:callSign/:service', async (req, res) => {
  const stations = await Station.findAll({ where: { callSign: req.params.callSign, service: req.params.service } });
  res.send(stations)
})


module.exports = router;
