import { View, StyleSheet, BackHandler } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Appbar } from 'react-native-paper';
import { COLORS } from '../../src/constants';

export default function TabsLayout() {
  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
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
          name="export/index"
          options={{
            title: 'Export',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="download" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
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
