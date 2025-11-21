import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="lightning-bolt" size={80} color={COLORS.primary} />
      <Text style={styles.title}>Charging Tracker</Text>
      <Text style={styles.version}>v1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: COLORS.primary,
  },
  version: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
});
