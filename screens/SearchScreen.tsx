import { useContext, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../components/PrimaryButton';
import Checkbox from 'expo-checkbox';
import { FilterContext } from '../store/context/filter-context';
import { GlobalStyles } from '../constants/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type SearchScreenParams = {
    
};

const SearchScreen = ({ navigation }:  NativeStackScreenProps<SearchScreenParams>) => {

    const filterCtx = useContext(FilterContext);
    const [value, setValue] = useState(filterCtx.range);
    const [AMvalue, setAMvalue] = useState(filterCtx.AM);
    const [FMvalue, setFMvalue] = useState(filterCtx.FM);
    const saveHandler = () => {
        filterCtx.setRange(value);
        filterCtx.setAM(AMvalue);
        filterCtx.setFM(FMvalue);
        navigation.goBack();
    }

    return (
        <View style={styles.screen}>
            <View style={[styles.container, styles.shadowProp]}>
                <View>
                    <Text style={styles.textStyle}>
                        Up to {value} miles away
                    </Text>
                </View>
                <Slider
                    style={styles.slider}
                    step={1}
                    value={value}
                    minimumValue={0}
                    maximumValue={200}
                    minimumTrackTintColor={GlobalStyles.colors.primary800}
                    maximumTrackTintColor="#000000"
                    onValueChange={setValue}
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
                        value={AMvalue}
                        onValueChange={setAMvalue}
                        color={AMvalue ? GlobalStyles.colors.primary700 : undefined}
                    />
                </View>
                <View style={styles.broadcast}>
                    <Text style={styles.textStyle}>
                        FM
                    </Text>
                    <Checkbox
                        style={styles.checkbox}
                        value={FMvalue}
                        onValueChange={setFMvalue}
                        color={FMvalue ? GlobalStyles.colors.primary700 : undefined}
                    />
                </View>
            </View>
            {(value !== filterCtx.range || AMvalue !== filterCtx.AM || FMvalue !== filterCtx.FM) &&
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={saveHandler}>
                    Apply
                </PrimaryButton>
            </View>
            } 
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
        shadowColor:  GlobalStyles.colors.gray500,
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
        marginTop: 'auto'
    },
    pressed: {
        opacity: 0.75,
    },
    textStyle: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 16
    }
})