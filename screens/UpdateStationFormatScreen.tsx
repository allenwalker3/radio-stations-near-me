import { useContext, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { GlobalStyles } from '../constants/styles';
import { FilterContext } from '../store/context/filter-context';
import { updateStationFormat } from '../util/http';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorOverlay from '../components/ErrorOverlay';
import UpdateStationFormatForm from '../components/UpdateStationFormatForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type UpdateStationFormatScreenParams = {
    UpdateStationFormat: { callSign: string, service: string } | undefined
    StationDetail: {} | undefined
}

const UpdateStationFormatScreen = ({ navigation, route }
    : NativeStackScreenProps<UpdateStationFormatScreenParams, "UpdateStationFormat">) => {
    const callSign = route.params?.callSign;
    const service = route.params?.service
    const filterCtx = useContext(FilterContext);
    const stations = filterCtx.stations;
    const { setRefresh, refresh } = filterCtx;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const station = stations.find(
        (station) => station.callSign === callSign && station.service === service
    );

    function cancelHandler() {
        navigation.goBack();
    }

    function confirmHandler(stationData: any) {
        (async () => {
            try {
                setLoading(true);
                setRefresh(!refresh)
                const response = await updateStationFormat(stationData);
                Alert.alert('Database updated, Thank you');
                if (response) {
                    setRefresh(true)
                    navigation.navigate('StationDetail', stationData);
                }
            } catch (e) {
                setError(e.message);
                Alert.alert('Error filing report:', e.message);
            } finally {
                setLoading(false)
            }
        })();
    }

    return (
        <View style={styles.container}>
            {error ? (<ErrorOverlay message={error} setMessage={setError} />) : (
                (loading ? (
                    <LoadingOverlay />
                ) : (
                    <UpdateStationFormatForm
                        submitButtonLabel={'Save'}
                        onSubmit={confirmHandler}
                        onCancel={cancelHandler}
                        defaultValues={station}
                    />
                ))
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    }
});

export default UpdateStationFormatScreen;