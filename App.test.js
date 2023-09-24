import React, { useContext } from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Station from './models/station';
import StationsScreen from './screens/StationsScreen';
import SearchScreen from './screens/SearchScreen';
import StationDetailScreen from './screens/StationDetailScreen';
import UpdateFormatScreen from './screens/UpdateFormatScreen';
import { getAntennas } from './util/http';
import * as Location from 'expo-location';
import * as Font from 'expo-font';
import axios from 'axios';
import '@testing-library/jest-dom'
import App from './App'

let realUseContext;
let useContextMock;
// Setup mock
const RANGE = 10
beforeEach(() => {
  realUseContext = React.useContext;
  useContextMock = React.useContext = jest.fn();
  //// [new Station(1, 'WZZZ', '99.5', 'FM','x','x','x','x','x','x','x','x',{ coordinates: [0,0]},'x','x',10.22,'Sports')]
  useContextMock.mockReturnValue({
    stations: [{ callSign: 'WZZZ', frequency: '99.5', service: 'FM' }], 
    range: RANGE
  });

  const resp1 = { "canAskAgain": true, "expires": "never", "granted": true, "status": "granted" };
  jest.spyOn(Location, 'requestForegroundPermissionsAsync').mockResolvedValue(resp1);
  const resp2 = { "coords": { "accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "heading": -1, "latitude": 39.7044, "longitude": -105.0023, "speed": -1 }, "timestamp": 1694194653977.405 }
  jest.spyOn(Location, 'getCurrentPositionAsync').mockResolvedValue(resp2);
  const stations = { "data": [{ "id": 15149, "callSign": "KDCO", "frequency": "1340 kHz", "service": "AM", "directional": "ND2", "hoursOperation": "Daytime", "city": "DENVER", "state": "CO", "country": "US", "fileNumber": "BML-20201020AAI", "power": "1.0 kW", "facilityId": "34585", "geom": { "type": "Point", "coordinates": [-105.00720555555556, 39.68331944444444] }, "licensee": "EL SEMBRADOR MINISTRIES", "applicationId": "1822643", "distance": 1.4796915784536877, "format": "Spanish Christian" }, { "id": 15150, "callSign": "KDCO", "frequency": "1340 kHz", "service": "AM", "directional": "ND2", "hoursOperation": "Nighttime", "city": "DENVER", "state": "CO", "country": "US", "fileNumber": "BML-20201020AAI", "power": "1.0 kW", "facilityId": "34585", "geom": { "type": "Point", "coordinates": [-105.00720555555556, 39.68331944444444] }, "licensee": "EL SEMBRADOR MINISTRIES", "applicationId": "1822643", "distance": 1.4796915784536877, "format": "Spanish Christian" }, { "id": 38842, "callSign": "KQMT", "frequency": "99.5 MHz", "service": "FM", "directional": "ND", "hoursOperation": "-", "city": "DENVER", "state": "CO", "country": "US", "fileNumber": "BXMLH-20000825AHL", "power": "21. kW", "facilityId": "26929", "geom": { "type": "Point", "coordinates": [-105.00719444444445, 39.68333333333333] }, "licensee": "AUDACY LICENSE, LLC", "applicationId": "1750.  m", "distance": 1.4786429066378712, "format": "Classic Rock" }] }

  jest.spyOn(axios, 'get').mockResolvedValue(stations);
})

afterEach(() => {
  React.useContext = realUseContext;
});

describe('App', () => {

  it('Renders Stations Screen', async () => {
    const push = jest.fn();
    const { findByTestId, findByText } = render(<StationsScreen navigation={{ push }} />)
    await findByTestId('stations-flat-list')
    expect(await findByText('CallSign')).toBeDefined()
  });

  xit('Renders Stations Detail Screen', async () => {
    const push = jest.fn();
    const route = { params: { service: 'FM', format: 'Sports', callSign: "WZZZ" } };

    const { findByText } = render(<StationDetailScreen route={route} />)
    expect(await findByText('Update')).toBeDefined()
  });

  it('Renders Search Screen', async () => {
    const push = jest.fn();
    const { findByText } = render(<SearchScreen navigation={{ push }} />)
    expect(await findByText(`Up to ${RANGE} miles away`)).toBeDefined()
  });

  xit('Renders Update Format Screen', async () => {
    const push = jest.fn();
    const route = { params: { service: 'FM', format: 'Sports', callSign: "WZZZ" } }
    const { findByTestId, findByText } = await render(<UpdateFormatScreen navigation={{ push }} route={route} />)
    
    const updateFormatFn = jest.spyOn(require('./util/http'), 'updateFormat').mockResolvedValue(true)
    fireEvent.press(await findByText('Submit'))
    expect(updateFormatFn).toBeCalledWith('YYYY', 'Sports', 'AM')

  })

})