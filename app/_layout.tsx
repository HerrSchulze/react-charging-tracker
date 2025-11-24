import { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Appbar } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase } from '../src/services/database';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { SplashScreen } from '../src/screens/SplashScreen';
import { CustomTabBar } from '../src/components/CustomTabBar';
import { useNavigationStore } from '../src/store/navigationStore';
import { TravelEventsList } from '../src/screens/TravelEventsList';
import { TravelEventDetail } from '../src/screens/TravelEventDetail';
import { TravelEventForm } from '../src/screens/TravelEventForm';
import { ChargingSessionsList } from '../src/screens/ChargingSessionsList';
import { ChargingSessionDetail } from '../src/screens/ChargingSessionDetail';
import { ChargingSessionForm } from '../src/screens/ChargingSessionForm';
import { ExportScreen } from '../src/screens/ExportScreen';
import { theme } from '../src/theme/theme';
import { COLORS } from '../src/constants';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const activeTab = useNavigationStore((state) => state.activeTab);
  const currentScreen = useNavigationStore((state) => state.currentScreen);
  const selectedId = useNavigationStore((state) => state.selectedId);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleExit = () => {
    BackHandler.exitApp();
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const renderScreen = () => {
    if (activeTab === 'travel-events') {
      if (currentScreen === 'detail' && selectedId) {
        return <TravelEventDetail />;
      }
      if (currentScreen === 'form') {
        return <TravelEventForm />;
      }
      return <TravelEventsList />;
    }

    if (activeTab === 'charging-sessions') {
      if (currentScreen === 'detail' && selectedId) {
        return <ChargingSessionDetail />;
      }
      if (currentScreen === 'form') {
        return <ChargingSessionForm />;
      }
      return <ChargingSessionsList />;
    }

    if (activeTab === 'export') {
      return <ExportScreen />;
    }

    return <ChargingSessionsList />;
  };

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <View style={styles.container}>
              <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Charging Tracker" titleStyle={styles.appbarTitle} />
                <Appbar.Action icon="exit-to-app" iconColor={COLORS.surface} onPress={handleExit} />
              </Appbar.Header>
              <View style={styles.content}>
                {renderScreen()}
              </View>
              {currentScreen === 'list' && <CustomTabBar />}
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  appbar: {
    backgroundColor: COLORS.primary,
  },
  appbarTitle: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});
