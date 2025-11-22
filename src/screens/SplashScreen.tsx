import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

const APP_VERSION = '1.3.0';

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="lightning-bolt" size={80} color={COLORS.tertiary} />
      <Text style={styles.title}>Charging Tracker</Text>
      <Text style={styles.version}>v{APP_VERSION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: COLORS.surface,
  },
  version: {
    fontSize: 14,
    color: COLORS.surface,
    marginTop: 10,
  },
});
