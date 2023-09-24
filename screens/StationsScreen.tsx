import React, { useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { GlobalStyles } from '../constants/styles';
import { fetchStations } from '../util/http';
import { FilterContext } from '../store/context/filter-context';
import Station from '../models/station';
import groupBy from 'lodash/groupBy';
import ErrorOverlay from '../components/ErrorOverlay';
import LoadingOverlay from '../components/LoadingOverlay';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StationsScreenParams = {
    StationDetail: {
        callSign: string, frequency: number, service: string, format: string
    }
}
const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';

const StationsScreen = ({ navigation }: NativeStackScreenProps<StationsScreenParams>) => {


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const filterCtx = useContext(FilterContext);
    const { AM, FM, stations, setStations, setLocation, setRange, range, refresh, setRefresh }:
        {
            AM: boolean, FM: boolean, stations: Station[], setStations: Function,
            setLocation: Function, setRange: Function, range: number, refresh: boolean,
            setRefresh: Function
        } = filterCtx

    const stationsToFlatList = () => {
        const filteredStations = stations.filter(r => (AM && r.service.includes("AM") || FM && r.service.includes("FM")));
        const resultsAM = groupBy(filteredStations.filter(s => s.service === 'AM'), 'callSign');
        const resultsFM = groupBy(filteredStations.filter(s => s.service === 'FM'), 'callSign');

        let respAM = []
        for (const key in resultsAM) {
            respAM.push(resultsAM[key].sort((a, b) => a.distance - b.distance)[0])
        }

        let respFM = []
        for (const key in resultsFM) {
            respFM.push(resultsFM[key].sort((a, b) => a.distance - b.distance)[0])
        }

        return [...respAM, ...respFM].map(s => s.toFlatListItem())
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const locationPermission = await Location.requestForegroundPermissionsAsync();
            if (locationPermission.status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }
            const location = await Location.getLastKnownPositionAsync();
            if (location) {
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                });

                try {
                    const stations =
                        await fetchStations(range, AM, FM, location.coords.latitude, location.coords.longitude) || [];
                    setStations(stations);
                    //console.log(JSON.stringify(stations))
                    //   console.log('got stations')
                } catch (e) {
                    console.log(JSON.stringify(e))
                    setError('Could not fetch stations: ' + e.message);
                    // Alert.alert('Could not fetch stations:', error.message);
                }
            }
            setLoading(false);

        })()
    }, [range, refresh]);

    const header = (
        <View style={styles.header}>
            <View style={{ flex: 1.1 }}>
                <Text style={styles.headerText}>CallSign</Text>
            </View>
            <View style={[styles.row, { flex: 1.4 }]}>
                <Text style={styles.headerText}>Frequency</Text>
            </View>
            <View style={[styles.row, { flex: 1.2 }]}>
                <Text style={styles.headerText}>Distance</Text>
            </View>
            <View style={[styles.row, { flex: 2 }]}>
                <Text style={styles.headerText}>Format</Text>
            </View>
        </View>
    );
    const renderItem = ({ item, index, separators }: { item: Station, index: number }) => (
        <Pressable android_ripple={{ color: '#ccc' }}
            style={({ pressed }) => [
                pressed ? styles.linkPressed : null,
            ]}
            onPress={(() => navigation.navigate("StationDetail",
                { callSign: item.callSign, frequency: item.frequency, service: item.service, format: item.format }))}>
            <View style={[styles.item, index % 2 && { backgroundColor: '#fff' }]}>

                <View style={[styles.row, { flex: 1.1 }]}>
                    <Text style={[styles.text]}>{item.callSign}</Text>
                </View>

                <View style={[styles.row, { flex: 1.4 }]}>
                    <Text style={styles.text}>{item.frequency}</Text>
                </View>
                <View style={[styles.row, { flex: 1.2 }]}>
                    <Text style={styles.text}>{item.distance} mi</Text>
                </View>
                <View style={[styles.row, { flex: 2 }]}>
                    <Text style={styles.text}>{item.format}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (<>
        {!error ? (
            <View style={styles.container}>
                {loading? (
                    <LoadingOverlay />
                ) : (
                    <FlatList
                        horizontal={false}
                        ListHeaderComponent={header}
                        data={stationsToFlatList()}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        onRefresh={() => setRefresh(!refresh)}
                        refreshing={loading}
                        testID="stations-flat-list"
                    >
                    </FlatList>
                )}
            </View>
        ) : <ErrorOverlay message={error} setMessage={setError} />}
    </>
    );

}

export default StationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: IOS ? 16 : 0
    },
    header: { height: 40, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
    headerText: { textAlign: 'left', marginHorizontal: 4, fontSize: 16, fontFamily: 'OpenSans_600SemiBold'},
    text: { textAlign: 'left', marginHorizontal: 4, fontSize: 16, fontFamily: 'OpenSans_400Regular' },
    dataWrapper: { marginTop: -1 },
    item: {
        flexDirection: 'row', height: 45, alignItems: 'center',
        backgroundColor: GlobalStyles.colors.primary50,
    },
    row: {},
    link: { color: 'blue' },
    linkPressed: {
        opacity: 0.5
    }
});