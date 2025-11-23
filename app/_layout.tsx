import { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Appbar } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeDatabase } from '../src/services/database';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { SplashScreen } from '../src/screens/SplashScreen';
import { theme } from '../src/theme/theme';
import { COLORS } from '../src/constants';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleExit = () => {
    BackHandler.exitApp();
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
              <Appbar.Content title="Charging Tracker" titleStyle={styles.appbarTitle} />
              <Appbar.Action icon="exit-to-app" iconColor={COLORS.surface} onPress={handleExit} />
            </Appbar.Header>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                  backgroundColor: COLORS.surface,
                  borderTopColor: COLORS.border,
                },
              }}
              sceneContainerStyle={{ backgroundColor: COLORS.background }}
            >
              <Tabs.Screen
                name="travel-events"
                options={{
                  title: 'Travel Events',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="car" color={color} size={size} />
                  ),
                }}
              />
              <Tabs.Screen
                name="charging-sessions"
                options={{
                  title: 'Charging',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="lightning-bolt" color={color} size={size} />
                  ),
                }}
              />
              <Tabs.Screen
                name="export"
                options={{
                  title: 'Export',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="download" color={color} size={size} />
                  ),
                }}
              />
            </Tabs>
          </View>
        </PaperProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
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
