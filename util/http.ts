import axios from 'axios';
import Station from '../models/station';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

export async function fetchStations(args: any) {
  const { range, am, fm, latitude, longitude } = args 
  const searchUrl 
    = `${BACKEND_URL}?distance=${range}&am=${am}&fm=${fm}&loc_y=${longitude}&loc_x=${latitude}`;

  console.log('searchUrl: ' + searchUrl);
  const response = await axios.get(searchUrl);
  const stations = [];

  for (const stationItem of response.data) {
    const station = new Station(
      stationItem['id'],
      stationItem['callSign'],
      stationItem['frequency'],
      stationItem['service'],
      stationItem['directional'],
      stationItem['hoursOperation'],
      stationItem['city'],
      stationItem['state'],
      stationItem['country'],
      stationItem['fileNumber'],
      stationItem['power'],
      stationItem['facilityId'],
      stationItem['geom'],
      stationItem['licensee'],
      stationItem['applicationId'],
      stationItem['distance'],
      stationItem['format']
    );
    stations.push(station);
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

export const fetchAntennas = async (args: any) => {
  const { callSign, service} = args
  const response = await axios.get(`${BACKEND_URL}/callSign/${callSign}/${service}`);
  return response.data;
}