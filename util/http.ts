import axios from 'axios';
import Station from '../models/station';

//const BACKEND_URL = 'http://192.168.1.144:3000';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL!;
export async function fetchStations(distance: number, am: boolean, fm: boolean, loc_x: number, loc_y: number) {

  const searchUrl = `${BACKEND_URL}?distance=${distance}&am=${am}&fm=${fm}&loc_y=${loc_y}&loc_x=${loc_x}`
  console.log('searchUrl: ' + searchUrl);
  const response = await axios.get(searchUrl);
  //console.log('response: ' + JSON.stringify(response));
  //console.log('got response')
  const stations = [];

  //    for ( const response of responses)
  for (const resp of response.data) {
    const stationObj = new Station(
      resp['id'],
      resp['callSign'],
      resp['frequency'],
      resp['service'],
      resp['directional'],
      resp['hoursOperation'],
      resp['city'],
      resp['state'],
      resp['country'],
      resp['fileNumber'],
      resp['power'],
      resp['facilityId'],
      resp['geom'],
      resp['licensee'],
      resp['applicationId'],
      resp['distance'],
      resp['format']
    );
    stations.push(stationObj);
  }

  return stations;

}

export const updateFormat = async (callSign: string, format: string, service: string) => {
  const response = await axios.post(BACKEND_URL, {
    callSign: callSign,
    format: format,
    service: service
  });
  return response.status === 200;
}

export const getAntennas = async (callSign: string, service: string) => {
  const response = await axios.get(`${BACKEND_URL}/callSign/${callSign}/${service}`);
  return response.data;
}