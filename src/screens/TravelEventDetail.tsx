import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card as PaperCard } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TravelEventRepository } from '../services/TravelEventRepository';
import { ChargingSessionRepository } from '../services/ChargingSessionRepository';
import { TravelEvent } from '../types';
import { AppBar, LoadingSpinner } from '../components';
import { formatDate } from '../utils/dateUtils';
import { calculateCostPerKwh, roundToTwoDecimals } from '../utils/calculations';
import { COLORS, SPACING } from '../constants';

export const TravelEventDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<TravelEvent | null>(null);
  const [totalChargingCost, setTotalChargingCost] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadEventData = async () => {
    setLoading(true);
    const eventRepo = new TravelEventRepository();
    const sessionRepo = new ChargingSessionRepository();

    const eventData = await eventRepo.getById(id as string);
    if (eventData) {
      setEvent(eventData);

      const cost = await sessionRepo.getTotalCostByTravelEventId(id as string);
      const energy = await sessionRepo.getTotalEnergyByTravelEventId(id as string);

      setTotalChargingCost(cost);
      setTotalEnergy(energy);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadEventData();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar title="Event Details" onBack={() => router.back()} />
        <View style={styles.center}>
          <Text>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalCost = event.initialCosts + totalChargingCost;
  const costPerKwh = calculateCostPerKwh(totalCost, totalEnergy);

  return (
    <SafeAreaView style={styles.container}>
      <AppBar
        title={event.name}
        onBack={() => router.back()}
        onAction={() => router.push(`/(tabs)/travel-events/${id}/form`)}
        actionIcon="pencil"
      />

      <ScrollView style={styles.content}>
        <PaperCard style={styles.card}>
          <PaperCard.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Event Information
            </Text>
            <Text variant="bodySmall" style={styles.label}>
              Description:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {event.description || 'No description'}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Start Date:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {formatDate(event.startDate)}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Initial Costs:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              €{roundToTwoDecimals(event.initialCosts)}
            </Text>
          </PaperCard.Content>
        </PaperCard>

        <PaperCard style={styles.card}>
          <PaperCard.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Charging Summary
            </Text>
            <Text variant="bodySmall" style={styles.label}>
              Total Charging Sessions Cost:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              €{roundToTwoDecimals(totalChargingCost)}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Total Energy Charged:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {roundToTwoDecimals(totalEnergy)} kWh
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Total Cost (Initial + Charging):
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              €{roundToTwoDecimals(totalCost)}
            </Text>

            <Text variant="bodySmall" style={styles.label}>
              Cost per kWh:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              €{roundToTwoDecimals(costPerKwh)}
            </Text>
          </PaperCard.Content>
        </PaperCard>
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
