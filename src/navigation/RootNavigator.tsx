import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RootTabParamList } from './types';
import { TravelEventsNavigator } from './TravelEventsNavigator';
import { ChargingSessionsNavigator } from './ChargingSessionsNavigator';
import { ExportScreen } from '../screens/ExportScreen';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="ChargingSessionsTab"
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
      <Tab.Screen
        name="TravelEventsTab"
        component={TravelEventsNavigator}
        options={{
          title: 'Travel Events',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ChargingSessionsTab"
        component={ChargingSessionsNavigator}
        options={{
          title: 'Charging',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lightning-bolt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExportTab"
        component={ExportScreen}
        options={{
          title: 'Export',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="download" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
