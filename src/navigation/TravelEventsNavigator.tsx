import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { TravelEventsStackParamList } from './types';
import { TravelEventsList } from '../screens/TravelEventsList';
import { TravelEventDetail } from '../screens/TravelEventDetail';
import { TravelEventForm } from '../screens/TravelEventForm';

const Stack = createNativeStackNavigator<TravelEventsStackParamList>();

export const TravelEventsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TravelEventsList"
        component={TravelEventsList}
        options={{ title: 'Travel Events' }}
      />
      <Stack.Screen
        name="TravelEventDetail"
        component={TravelEventDetail}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen
        name="TravelEventForm"
        component={TravelEventForm}
        options={{ title: 'Event Form' }}
      />
    </Stack.Navigator>
  );
};
