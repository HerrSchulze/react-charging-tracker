import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card as PaperCard, Text, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTravelEventStore } from '../store/travelEventStore';
import { ChargingSessionRepository } from '../services/ChargingSessionRepository';
import {
  FloatingActionButton,
  PaginationControls,
  EmptyState,
  LoadingSpinner,
  ErrorMessage,
} from '../components';
import { formatDate } from '../utils/dateUtils';
import { calculateCostPerKwh, roundToTwoDecimals } from '../utils/calculations';
import { COLORS, SPACING, PAGINATION } from '../constants';

export const TravelEventsList: React.FC = () => {
  const router = useRouter();
  const {
    travelEvents,
    loading,
    error,
    currentPage,
    loadTravelEvents,
    deleteTravelEvent,
    setCurrentPage,
    clearError,
  } = useTravelEventStore();

  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [errorVisible, setErrorVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadTravelEvents(0);
    }, [])
  );

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  useEffect(() => {
    const loadSessionData = async () => {
      const repo = new ChargingSessionRepository();
      const data: Record<string, any> = {};

      for (const event of travelEvents) {
        const totalCost = await repo.getTotalCostByTravelEventId(event.id);
        const totalEnergy = await repo.getTotalEnergyByTravelEventId(event.id);
        data[event.id] = { totalCost, totalEnergy };
      }

      setSessionData(data);
    };

    if (travelEvents.length > 0) {
      loadSessionData();
    }
  }, [travelEvents]);

  const handleDelete = async (id: string) => {
    await deleteTravelEvent(id);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    loadTravelEvents(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      loadTravelEvents(currentPage - 1);
    }
  };

  if (loading && travelEvents.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.titleBar}>
        <Text variant="headlineSmall" style={styles.screenTitle}>Travel Events</Text>
      </View>
      <ErrorMessage
        message={error || ''}
        visible={errorVisible}
        onDismiss={() => {
          setErrorVisible(false);
          clearError();
        }}
      />

      {travelEvents.length === 0 ? (
        <EmptyState message="No travel events yet. Create one to get started!" icon="car" />
      ) : (
        <>
          <FlatList
            data={travelEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const data = sessionData[item.id] || { totalCost: 0, totalEnergy: 0 };
              const totalChargingCost = data.totalCost;
              const totalEnergy = data.totalEnergy;
              const totalCost = item.initialCosts + totalChargingCost;
              const costPerKwh = calculateCostPerKwh(totalCost, totalEnergy);

              return (
                <PaperCard
                  style={styles.card}
                  onPress={() => router.push(`/(tabs)/travel-events/${item.id}`)}
                >
                  <PaperCard.Content style={styles.content}>
                    <Text variant="titleSmall" style={styles.title}>
                      {item.name}
                    </Text>
                    <View style={styles.dateRow}>
                      <Text variant="labelSmall" style={styles.subtitle}>
                        {formatDate(item.startDate)}
                      </Text>
                      <View style={styles.buttonRow}>
                        <IconButton
                          icon="lightning-bolt"
                          iconColor={COLORS.primary}
                          size={18}
                          style={styles.actionButton}
                          onPress={() => router.push(`/(tabs)/charging-sessions?travelEventId=${item.id}`)}
                        />
                        <IconButton
                          icon="delete"
                          iconColor={COLORS.error}
                          size={18}
                          style={styles.deleteButton}
                          onPress={() => handleDelete(item.id)}
                        />
                      </View>
                    </View>
                    <View style={styles.statsRow}>
                      <Text variant="labelLarge" style={styles.stats}>
                        {roundToTwoDecimals(totalEnergy)} kWh • €{roundToTwoDecimals(totalCost)} •    
                      </Text>
                      <Text variant="labelLarge" style={[styles.stats, styles.bold]}>
                        €{roundToTwoDecimals(costPerKwh)}/kWh
                      </Text>
                    </View>
                    {item.description && (
                      <Text variant="labelSmall" style={styles.description}>
                        {item.description}
                      </Text>
                    )}
                  </PaperCard.Content>
                </PaperCard>
              );
            }}
            scrollEnabled={false}
          />
          <PaginationControls
            currentPage={currentPage}
            hasNextPage={travelEvents.length === PAGINATION.itemsPerPage}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </>
      )}

      <FloatingActionButton style={styles.fab} onPress={() => router.push('/(tabs)/travel-events/form')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.sm,
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
    padding: 0,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  stats: {
    color: COLORS.textSecondary,
  },
  bold: {
    fontWeight: 'bold',
    marginLeft: 4
  },
  description: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  deleteButton: {
    margin: 0,
    padding: 0,
  },
  fab: {
    marginBottom: -20,
  },
  titleBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  screenTitle: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
