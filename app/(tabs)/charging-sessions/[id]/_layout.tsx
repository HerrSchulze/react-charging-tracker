import { Stack } from 'expo-router';

export default function ChargingSessionDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
