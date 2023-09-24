var express = require('express');
var router = express.Router();
const { Sequelize, QueryTypes } = require('sequelize');
const { Station } = require('../models');
const fs = require('fs');

// db init
const sequelize = new Sequelize('fcc_db', 'root', 'password', {
  host: 'mysqldb',
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
router.get('/', async (req, res, next) => {
  //{ distance: '100', am: 'true', fm: 'false', loc_x :number, loc_y :number}
  //sequelize.query(`SELECT ST_Distance_Sphere(ST_GeomFromText('POINT(${req.query.loc_y} ${req.query.loc_x})'), geom, 'miles') as distance
  let results;
  const services = [];
  if (req.query.loc_x && req.query.loc_y) {
    results = await sequelize.query(`
      SELECT (ST_Distance_Sphere(ST_GeomFromText('POINT(${req.query.loc_y} ${req.query.loc_x})'), geom) / 1609.34) as distance,
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
          POINT(${req.query.loc_y}, ${req.query.loc_x}),
          geom
          ) < 1609.34 * ${req.query.distance}`, { type: QueryTypes.SELECT });

    //   console.log(results);
  }

  res.send(results);
  //res.render('index', { title: 'Express' });
});

router.post('/', async (req, res) => {
  const ipAddress = req.socket.remoteAddress;
  const callSign = req.body.callSign;
  const format = req.body.format;
  const service = req.body.service;
  //await Report.create({callSign: req.body.callSign, format: req.body.format}).catch(err => console.log(err))
  const stations = await Station.findAll({ where: { callSign: callSign, service: service } });
  for (const station of stations) {
    station.format = format
    station.save()
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
