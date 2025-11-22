import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';
import * as Application from 'expo-application';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [version, setVersion] = useState('v1.1.0');

  useEffect(() => {
    const getVersion = async () => {
      const appVersion = Application.nativeApplicationVersion;
      setVersion(`v${appVersion}`);
    };
    getVersion();
  }, []);

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
      <Text style={styles.version}>{version}</Text>
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
