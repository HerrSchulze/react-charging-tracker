import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { ChargingSessionsStackParamList } from './types';
import { ChargingSessionsList } from '../screens/ChargingSessionsList';
import { ChargingSessionDetail } from '../screens/ChargingSessionDetail';
import { ChargingSessionForm } from '../screens/ChargingSessionForm';

const Stack = createNativeStackNavigator<ChargingSessionsStackParamList>();

export const ChargingSessionsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ChargingSessionsList"
        component={ChargingSessionsList}
        options={{ title: 'Charging Sessions' }}
      />
      <Stack.Screen
        name="ChargingSessionDetail"
        component={ChargingSessionDetail}
        options={{ title: 'Session Details' }}
      />
      <Stack.Screen
        name="ChargingSessionForm"
        component={ChargingSessionForm}
        options={{ title: 'Session Form' }}
      />
    </Stack.Navigator>
  );
};
