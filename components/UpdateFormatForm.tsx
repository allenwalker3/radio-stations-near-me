import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Button from './Button';
import { GlobalStyles } from '../constants/styles';
import { Formats } from '../constants/constants';


type UpdateFormatFormProps = {
    submitButtonLabel: string,
    onCancel: () => void,
    onSubmit: (val: {
        callSign: string,
        format: string,
        service: string
    }) => void,
    defaultValues: any
}

const UpdateFormatForm = ({ submitButtonLabel, onCancel, onSubmit, defaultValues}: UpdateFormatFormProps) => {

    const [selectedFormat, setSelectedFormat] = useState('');
    useEffect(() => {
        setSelectedFormat(defaultValues.format)
    }, [])

    const formatData = Formats.map((format, index) => ({ key: index, value: format }))
    function submitHandler() {
        const stationData = {
            callSign: defaultValues.callSign,
            format: selectedFormat,
            service: defaultValues.service
        };
  
        onSubmit(stationData);
    }

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Select correct station format</Text>
            <SelectList
                        setSelected={setSelectedFormat}
                        data={formatData}
                        save="value"
                        defaultOption={formatData.find(d => d.value === defaultValues.format)}
                        boxStyles={styles.boxStyles}
                        dropdownStyles={styles.dropdownStyles}
                        inputStyles={styles.inputStyles}
                        maxHeight={400}
                        />
         
            <View style={styles.buttons}>
                <Button style={styles.button} mode="flat" onPress={onCancel}>
                    Cancel
                </Button>
                <Button style={styles.button} onPress={submitHandler}>
                    {submitButtonLabel}
                </Button>
            </View>
        </View>
    );
}


export default UpdateFormatForm;


const styles = StyleSheet.create({
    form: {
      //  marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontFamily: 'OpenSans_600SemiBold',
        color: 'white',
        marginVertical: 24,
        textAlign: 'center',
        
    },
    rowInput: {
        flex: 1,
        fontFamily: 'OpenSans_400Regular'
    },
    errorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8,
    },
    buttons: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8,
    },
    boxStyles: {
        backgroundColor: 'white',
    },
    inputStyles: {
        fontFamily: 'OpenSans_600SemiBold',
        fontSize: 16
    },
    dropdownStyles: {
        backgroundColor: 'white',
        fontFamily: 'OpenSans_400Regular',
        fontSize: 14
    }
});

