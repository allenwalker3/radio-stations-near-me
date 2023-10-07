import { useContext } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GlobalStyles } from "../constants/styles";
import StationsScreen from "../screens/StationsScreen";
import IconButton from "./IconButton";
import SearchScreen from "../screens/SearchScreen";
import StationDetailScreen from "../screens/StationDetailScreen";
import { FilterContext } from "../store/context/filter-context";
import UpdateFormatScreen from "../screens/UpdateFormatScreen";

const Stack = createNativeStackNavigator();
const AppScreens = () => {

    const filterCtx = useContext(FilterContext);
   
    return (
        <NavigationContainer >
            <Stack.Navigator screenOptions={{
                headerStyle: { backgroundColor: GlobalStyles.colors.primary700 },
                headerTintColor: 'white',
            }}>
                <Stack.Screen name="Stations" component={StationsScreen}
                    options={({ navigation }) => ({
                        title: `${filterCtx.range} miles ${filterCtx.AM ? 'AM' : ''} ${filterCtx.FM ? 'FM' : ''}`,
                        headerLeft: ({ tintColor }) => (
                            <IconButton icon="filter" color={tintColor}
                                onPress={() => navigation.navigate('Search')} />
                        ),
                        //    headerLargeTitle: true,
                        //     headerLargeTitleShadowVisible: false,
                    })}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                />
                <Stack.Screen
                    name="StationDetail"
                    component={StationDetailScreen}
                    options={({ route }) => ({ title: route.params!.callSign })}
                />

                <Stack.Screen
                    name="UpdateFormat"
                    component={UpdateFormatScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default AppScreens;