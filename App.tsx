import React, { useState, useCallback, useEffect, } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import FilterContextProvider from './store/context/filter-context';
import AppScreens from './components/AppScreens';
import { enableLatestRenderer } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { OpenSans_600SemiBold, OpenSans_400Regular, useFonts } from '@expo-google-fonts/open-sans';
enableLatestRenderer();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {

  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    OpenSans_600SemiBold, OpenSans_400Regular
  });


  useEffect(() => {
    (async () => {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Ionicons.font);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!fontsLoaded || fontError) {
    return null;
  }
  return (
    <>
      <StatusBar style="light" />
      <FilterContextProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <AppScreens />
        </View>
      </FilterContextProvider>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%', height: '100%' 
    //  marginTop: StatusBar.currentHeight || 0
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  /*
  backgroundImage: {
    opacity: 0.35,
  }
  */
});

