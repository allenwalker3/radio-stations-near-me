import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { GlobalStyles } from '../constants/styles';
import Station from '../models/station';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps';
import SecondaryButton from '../components/SecondaryButton';
import { fetchAntennas } from '../util/http';
import { FilterContext } from '../store/context/filter-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const { height, width } = Dimensions.get('window');
/*
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
        distance, 
        format
        */
// KLLV  |550   kHz |AM |-   |NDD |Daytime   |D  |B  |LIC    |BREEN  |CO |US |BL-19890828AG          |1.8    kW |-         |-       |-       |15879      |N |37 |11 |02.00 |W |108 |04 |56.26 |DAYSTAR RADIO, LTD.                                                         |   0.00 km |   0.00 mi |  0.00 deg |132545    |6ba922b792cb4a2eacd7c1b6063ebeb7       

const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';
const LATITUDE_DELTA = 0.28; // Zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

type StationDetailScreenParams = {
  StationDetail: { format: string, service: string, callSign: string };
  UpdateStationFormat: { callSign: string, service: string };
}

const StationDetailScreen = ({ navigation, route }
  : NativeStackScreenProps<StationDetailScreenParams, "StationDetail">) => {

  const { callSign, service, format } = route.params
  const { stations } = useContext(FilterContext)
  const { frequency } = stations.find(s => s.callSign === callSign && s.service === service)!;
  const [antennas, setAntennas] = useState<Station[]>([]);

  useEffect(() => {
    (async () => {
      setAntennas(await fetchAntennas({callSign, service}))
    })();
  }, [callSign])

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.outerText]}>{`${frequency} ${service}`}</Text>
      </View>
      <View style={styles.formatContainer}>
        <View style={{ flexDirection: 'row' }}>
          {format ? (<>
            <MaterialCommunityIcons name="format-quote-open" size={24} color="black" />
            <Text style={[styles.outerText,
            { fontSize: 28, color: GlobalStyles.colors.primary700 }]}>{format}</Text>
            <MaterialCommunityIcons name="format-quote-close" size={24} color="black" />
          </>
          ) : (
            <Text style={[styles.outerText,
            { fontSize: 28, color: GlobalStyles.colors.primary800 }]}>No Data</Text>
          )}
        </View>
        <SecondaryButton 
          onPress={() => navigation.navigate("UpdateStationFormat", { callSign: callSign, service: service })}>
          <Text>Update</Text>
        </SecondaryButton>
      </View>
      <ScrollView>
        {antennas.map((station, index) => (
          <View style={styles.detailsContainer} key={index}>
            <View>
              <Text style={styles.innerText}>{station.city}, {station.state}, {station.country}</Text>
            </View>
            <View style={styles.innerContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.innerText}>Hours of Operation:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.innerText}>{station.hoursOperation}</Text>
              </View>
            </View>
            <View style={styles.innerContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.innerText}>Power:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.innerText}>{Math.floor(parseFloat(station.power) * 1000)} Watts</Text>
              </View>
            </View>

            <View style={styles.mapContainer}>
              <MapView style={styles.map}
                initialRegion={{
                  latitude: station.geom.coordinates[1],
                  longitude: station.geom.coordinates[0],
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
              >
                <Marker
                  coordinate={{ latitude: station.geom.coordinates[1], longitude: station.geom.coordinates[0] }}
                  title={station.callSign}
                  description={`${station.directional} Antenna`}
                />
              </MapView>

            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )

};


export default StationDetailScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    marginBottom: 32,
    marginHorizontal: 12,
    flexWrap: 'wrap'
  },
  detailsContainer: {
    margin: 8,
    // marginHorizontal: 24,
    borderRadius: 6,
    padding: 8,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.primary50,
    // alignItems: 'center',
    backgroundColor: GlobalStyles.colors.primary50,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,

  },
  innerContainer: {
    margin: 5,
    flexDirection: 'row'
  },
  innerText: {
    //color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular'
  },
  outerText: {
    fontSize: 22,
    fontFamily: 'OpenSans_400Regular'
    // marginBottom: 8
  },
  formatContainer: {
    flexDirection: "row",
    flexWrap: 'wrap',
    //marginVertical: 8
    //maxWidth: 100
  },
  mapContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    minWidth: '100%',
    //  minHeight: '100%',
    height: 200
  }


});