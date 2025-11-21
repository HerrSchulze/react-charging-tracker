import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card as PaperCard } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChargingSessionRepository } from '../services/ChargingSessionRepository';
import { TravelEventRepository } from '../services/TravelEventRepository';
import { ChargingSession, TravelEvent } from '../types';
import { AppBar, LoadingSpinner } from '../components';
import { formatDate } from '../utils/dateUtils';
import { calculateCostPerKwh, roundToTwoDecimals } from '../utils/calculations';
import { COLORS, SPACING } from '../constants';

export const ChargingSessionDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [session, setSession] = useState<ChargingSession | null>(null);
  const [event, setEvent] = useState<TravelEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSessionData = async () => {
    setLoading(true);
    const sessionRepo = new ChargingSessionRepository();
    const eventRepo = new TravelEventRepository();

    const sessionData = await sessionRepo.getById(id as string);
    if (sessionData) {
      setSession(sessionData);

      if (sessionData.travelEventId) {
        const eventData = await eventRepo.getById(sessionData.travelEventId);
        setEvent(eventData);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadSessionData();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <AppBar title="Session Details" onBack={() => router.back()} />
        <View style={styles.center}>
          <Text>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const costPerKwh = calculateCostPerKwh(session.totalCost, session.energyCharged);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <AppBar
        title={session.stationProvider}
        onBack={() => router.back()}
        onAction={() => router.push(`/(tabs)/charging-sessions/${id}/form`)}
        actionIcon="pencil"
      />

      <ScrollView style={styles.content}>
        <PaperCard style={styles.card}>
          <PaperCard.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Session Information
            </Text>
            <Text variant="bodySmall" style={styles.label}>
              Station Provider:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {session.stationProvider}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Location:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {session.location}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Date:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {formatDate(session.date)}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Charge Card Provider:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {session.chargeCardProvider}
            </Text>
          </PaperCard.Content>
        </PaperCard>

        <PaperCard style={styles.card}>
          <PaperCard.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Charging Details
            </Text>
            <Text variant="bodySmall" style={styles.label}>
              Energy Charged:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {roundToTwoDecimals(session.energyCharged)} kWh
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Total Cost:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              €{roundToTwoDecimals(session.totalCost)}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Cost per kWh:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              €{roundToTwoDecimals(costPerKwh)}
            </Text>
          </PaperCard.Content>
        </PaperCard>

        {event && (
          <PaperCard style={styles.card}>
            <PaperCard.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Associated Travel Event
              </Text>
              <Text variant="bodySmall" style={styles.label}>
                Event Name:
              </Text>
              <Text variant="bodySmall" style={styles.value}>
                {event.name}
              </Text>

              <Text variant="bodySmall" style={styles.label}>
                Start Date:
              </Text>
              <Text variant="bodySmall" style={styles.value}>
                {formatDate(event.startDate)}
              </Text>
            </PaperCard.Content>
          </PaperCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    paddingTop: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  value: {
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
});
