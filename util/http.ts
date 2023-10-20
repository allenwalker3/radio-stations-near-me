import axios from 'axios';
import Station from '../models/station';

//const BACKEND_URL = 'http://192.168.1.144:3000';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL!;
export async function fetchStations(args: any) {
  const { range, am, fm, latitude, longitude } = args 
  const searchUrl 
    = `${BACKEND_URL}?distance=${range}&am=${am}&fm=${fm}&loc_y=${longitude}&loc_x=${latitude}`;

  console.log('searchUrl: ' + searchUrl);
  const response = await axios.get(searchUrl);
  const stations = [];

  for (const station of response.data) {
    const stationObj = new Station(
      station['id'],
      station['callSign'],
      station['frequency'],
      station['service'],
      station['directional'],
      station['hoursOperation'],
      station['city'],
      station['state'],
      station['country'],
      station['fileNumber'],
      station['power'],
      station['facilityId'],
      station['geom'],
      station['licensee'],
      station['applicationId'],
      station['distance'],
      station['format']
    );
    stations.push(stationObj);
  }

  return stations;

}

export const updateStationFormat = async (args: any) => {
  const { callSign, format, service } = args
  const response = await axios.put(`${BACKEND_URL}/${callSign}/${service}`, {
    format: format
  });
  return response.status === 200;
}

export const fetchAntennas = async (callSign: string, service: string) => {
  const response = await axios.get(`${BACKEND_URL}/callSign/${callSign}/${service}`);
  return response.data;
}