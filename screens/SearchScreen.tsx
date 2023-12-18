import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../components/PrimaryButton';
import Checkbox from 'expo-checkbox';
import { FilterContext } from '../store/context/filter-context';
import { GlobalStyles } from '../constants/styles';


const SearchScreen = ({ navigation }: any) => {

  const filterCtx = useContext(FilterContext);
  const { range, setRange, AM, setAM, FM, setFM } = filterCtx;
  return (
    <View style={styles.screen}>
      <View style={[styles.container, styles.shadowProp]}>
        <View>
          <Text style={styles.textStyle}>
            Up to {range} miles away
          </Text>
        </View>
        <Slider
          style={styles.slider}
          step={1}
          value={range}
          minimumValue={0}
          maximumValue={200}
          minimumTrackTintColor={GlobalStyles.colors.primary800}
          maximumTrackTintColor="#000000"
          //onValueChange={setRange}
          onSlidingComplete={setRange}
        />
      </View>
      <View style={[styles.container, styles.shadowProp]}>
        <View style={[styles.broadcast, {
          paddingBottom: 15,
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth
        }]}>
          <Text style={styles.textStyle}>
            AM
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={AM}
            onValueChange={setAM}
            color={AM ? GlobalStyles.colors.primary700 : undefined}
          />
        </View>
        <View style={styles.broadcast}>
          <Text style={styles.textStyle}>
            FM
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={FM}
            onValueChange={setFM}
            color={FM ? GlobalStyles.colors.primary700 : undefined}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={() => navigation.navigate("CustomLocation")}
          backgroundColor={GlobalStyles.colors.primary700}>
          Set Custom Location
        </PrimaryButton>
      </View>
    </View >
  )

}

export default SearchScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
    marginBottom: 40
  },
  container: {
    backgroundColor: GlobalStyles.colors.primary50,
    padding: 24,
    margin: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  shadowProp: {
    shadowColor: GlobalStyles.colors.gray500,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  slider: {
    opacity: 1,
    height: 50,
  },
  broadcast: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkbox: {
    marginRight: 8,
  },
  buttonContainer: {
    flex: 1,
    //justifyContent: 'center',
    // alignItems: 'center',
    //padding: 24,
    marginHorizontal: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  textStyle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16
  }
})