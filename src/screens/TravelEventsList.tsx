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
  ConfirmDialog,
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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});

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
      const counts: Record<string, number> = {};

      for (const event of travelEvents) {
        const totalCost = await repo.getTotalCostByTravelEventId(event.id);
        const totalEnergy = await repo.getTotalEnergyByTravelEventId(event.id);
        const sessions = await repo.getByTravelEventId(event.id);
        data[event.id] = { totalCost, totalEnergy };
        counts[event.id] = sessions.length;
      }

      setSessionData(data);
      setSessionCounts(counts);
    };

    if (travelEvents.length > 0) {
      loadSessionData();
    }
  }, [travelEvents]);

  const handleDeletePress = (id: string) => {
    setPendingDeleteId(id);
    setDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteTravelEvent(pendingDeleteId);
      setPendingDeleteId(null);
    }
    setDialogVisible(false);
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

  const getDeleteDialogMessage = (eventId: string) => {
    const count = sessionCounts[eventId] || 0;
    if (count > 0) {
      return `This travel event has ${count} charging session${count !== 1 ? 's' : ''}. Please delete all connected sessions first.`;
    }
    return 'Are you sure you want to delete this travel event?';
  };

  const canDelete = (eventId: string) => {
    return (sessionCounts[eventId] || 0) === 0;
  };

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

      <ConfirmDialog
        visible={dialogVisible}
        title={canDelete(pendingDeleteId || '') ? 'Delete Travel Event' : 'Cannot Delete'}
        message={getDeleteDialogMessage(pendingDeleteId || '')}
        confirmText={canDelete(pendingDeleteId || '') ? 'Delete' : 'OK'}
        cancelText={canDelete(pendingDeleteId || '') ? 'Cancel' : ''}
        onConfirm={canDelete(pendingDeleteId || '') ? handleConfirmDelete : () => setDialogVisible(false)}
        onCancel={() => setDialogVisible(false)}
        isDangerous={canDelete(pendingDeleteId || '')}
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
              const hasConnectedSessions = (sessionCounts[item.id] || 0) > 0;

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
                          iconColor={hasConnectedSessions ? COLORS.textSecondary : COLORS.error}
                          size={18}
                          style={styles.deleteButton}
                          disabled={hasConnectedSessions}
                          onPress={() => handleDeletePress(item.id)}
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
    marginLeft: 4,
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
