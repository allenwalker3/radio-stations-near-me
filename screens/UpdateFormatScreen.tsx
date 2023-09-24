import { useContext, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { GlobalStyles } from '../constants/styles';
import { FilterContext } from '../store/context/filter-context';
import { updateFormat } from '../util/http';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorOverlay from '../components/ErrorOverlay';
import UpdateFormatForm from '../components/UpdateFormatForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type UpdateFormatScreenParams = {
    UpdateFormat: { callSign: string, service: string } | undefined
    StationDetail: {} | undefined
}

const UpdateFormatScreen = ({ navigation, route }
    : NativeStackScreenProps<UpdateFormatScreenParams, "UpdateFormat">) => {
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

    function confirmHandler(stationData) {
        (async () => {
            try {
                setLoading(true);
                setRefresh(!refresh)
                const response = await updateFormat(stationData.callSign, stationData.format, stationData.service);
                Alert.alert('Database updated, Thank you');
                if (response) {
                    setRefresh(true)
                    navigation.navigate('StationDetail',
                        { callSign: stationData.callSign, format: stationData.format, service: stationData.service });
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
                    <UpdateFormatForm
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

export default UpdateFormatScreen;