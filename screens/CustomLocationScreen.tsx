import React, { useContext, useState } from 'react';

import { FilterContext } from '../store/context/filter-context';

import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete, Point } from 'react-native-google-places-autocomplete';
import PrimaryButton from '../components/PrimaryButton';
import { GlobalStyles } from '../constants/styles';
import Checkbox from 'expo-checkbox';

const GOOGLE_SERVICES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_SERVICES_API_KEY;

const CustomLocationScreen = ({ navigation }: any) => {
  const { location, setLocation, useCustomLocation, setUseCustomLocation, refresh, setRefresh } = useContext(FilterContext);
  const [coords, setCoords] = useState<Point | undefined>();
  const [checkbox, setCheckbox] = useState<boolean>(useCustomLocation)
  const lastLocation = {
    description: 'Last Location',
    geometry: { location: location },
  };

  const saveHandler = () => {
    setUseCustomLocation(checkbox);
    if (coords) {
      setLocation(coords);
    }
    setRefresh(!refresh)
    navigation.navigate("Stations");
  }

  return (
    <>
      <View style={styles.textCheckboxContainer}>
        <Text style={styles.textStyle}>
          Set Custom Location?
        </Text>
        <Checkbox
          style={styles.checkbox}
          value={checkbox}
          onValueChange={setCheckbox}
          color={useCustomLocation ? GlobalStyles.colors.primary700 : undefined}
        />
      </View>
      {!checkbox && (
        <View style={styles.container2}>
          <Text style={styles.textStyle2}>Will use device GPS Coordinates</Text>
        </View>
      )}
      {checkbox && (
        <View style={styles.googlePlaces}>
          <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={2}
            predefinedPlaces={[lastLocation]}
            fetchDetails={true}
            onPress={(data, details) => {
              // 'details' is provided when fetchDetails = true
              setCoords(details?.geometry.location)
            }}
            query={{
              key: GOOGLE_SERVICES_API_KEY,
              language: 'en',
              //components: { country: ["us", "ca"] }
              //components: { country: ["us", "ca"] }
              //components: 'country:us',
            }}

            renderLeftButton={() => <Ionicons name='search' size={28} color="#A7A9AC" />}
            listEmptyComponent={(
              <View style={{ flex: 1 }}>
                <Text>No results were found</Text>
              </View>
            )}

            styles={{
              textInput: { borderWidth: 1 }
            }}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={saveHandler} backgroundColor={GlobalStyles.colors.primary700}>
          Save
        </PrimaryButton>
      </View>
    </>
  )
}

export default CustomLocationScreen;

const styles = StyleSheet.create({
  googlePlaces: {
    flex: 1,
    margin: 10,
    height: 'auto',
    width: 'auto',
    backgroundColor: '#ecf0f1'
  },
  buttonContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center', 
    margin: 24,
    //backgroundColor: GlobalStyles.colors.primary700,
    //marginTop: 'auto'
  },
  textCheckboxContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  checkbox: {
    marginRight: 8,
  },
  textStyle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
    //marginVertical: 5
  },
  textStyle2: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    color: GlobalStyles.colors.gray500
  }
})