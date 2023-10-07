import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.range}>
                {`Range: ${props.range} miles${props.AM ? ', AM' : ''}${props.FM ? ', FM' : ''}`} 
                </Text>
            <Pressable
                style={({ pressed }) =>
                    pressed
                        ? [styles.search, styles.pressed]
                        : [styles.search]
                }
                onPress={() => props.setShowSearchScreen(true)}
                android_ripple={{ color: '#f1f8ff' }}
            >
                <Ionicons name="search" size={24} color="black" />
            </Pressable>
        </View>


    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    range: { alignSelf: 'center', padding: 5, fontWeight: 'bold', color: 'green' },
    search: { alignSelf: 'center', padding: 5 },
    pressed: {
        opacity: 0.75,
    },
})
