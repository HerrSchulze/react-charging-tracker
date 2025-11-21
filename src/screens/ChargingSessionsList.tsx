import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card as PaperCard, Text, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useChargingSessionStore } from '../store/chargingSessionStore';
import { TravelEventRepository } from '../services/TravelEventRepository';
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

export const ChargingSessionsList: React.FC = () => {
  const router = useRouter();
  const {
    chargingSessions,
    loading,
    error,
    currentPage,
    loadChargingSessions,
    deleteChargingSession,
    setCurrentPage,
    clearError,
  } = useChargingSessionStore();

  const [eventNames, setEventNames] = useState<Record<string, string>>({});
  const [errorVisible, setErrorVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadChargingSessions(0);
    }, [])
  );

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  useEffect(() => {
    const loadEventNames = async () => {
      const repo = new TravelEventRepository();
      const names: Record<string, string> = {};

      for (const session of chargingSessions) {
        if (session.travelEventId) {
          const event = await repo.getById(session.travelEventId);
          if (event) {
            names[session.travelEventId] = event.name;
          }
        }
      }

      setEventNames(names);
    };

    if (chargingSessions.length > 0) {
      loadEventNames();
    }
  }, [chargingSessions]);

  const handleDelete = async (id: string) => {
    await deleteChargingSession(id);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    loadChargingSessions(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      loadChargingSessions(currentPage - 1);
    }
  };

  if (loading && chargingSessions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.titleBar}>
        <Text variant="headlineSmall" style={styles.screenTitle}>Charging Sessions</Text>
      </View>
      <ErrorMessage
        message={error || ''}
        visible={errorVisible}
        onDismiss={() => {
          setErrorVisible(false);
          clearError();
        }}
      />

      {chargingSessions.length === 0 ? (
        <EmptyState message="No charging sessions yet. Create one to get started!" icon="lightning-bolt" />
      ) : (
        <>
          <FlatList
            data={chargingSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const costPerKwh = calculateCostPerKwh(item.totalCost, item.energyCharged);
              const eventName = item.travelEventId ? eventNames[item.travelEventId] : null;

              return (
                <PaperCard
                  style={styles.card}
                  onPress={() => router.push(`/(tabs)/charging-sessions/${item.id}`)}
                >
                  <PaperCard.Content style={styles.content}>
                    <Text variant="titleSmall" style={styles.title}>
                      {item.stationProvider} • {item.location}
                    </Text>
                    <View style={styles.dateRow}>
                      <Text variant="labelSmall" style={styles.subtitle}>
                        {formatDate(item.date)}
                      </Text>
                      <IconButton
                        icon="delete"
                        iconColor={COLORS.error}
                        size={18}
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                      />
                    </View>
                    <View style={styles.statsRow}>
                      <Text variant="labelSmall" style={styles.stats}>
                        {roundToTwoDecimals(item.energyCharged)} kWh • €{roundToTwoDecimals(item.totalCost)} •    
                      </Text>
                      <Text variant="labelSmall" style={[styles.stats, styles.bold]}>
                        €{roundToTwoDecimals(costPerKwh)}/kWh
                      </Text>
                    </View>
                    {eventName && (
                      <Text variant="labelSmall" style={styles.event}>
                        {eventName}
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
            hasNextPage={chargingSessions.length === PAGINATION.itemsPerPage}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </>
      )}

      <FloatingActionButton style={styles.fab} onPress={() => router.push('/(tabs)/charging-sessions/form')} />
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
  event: {
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  deleteButton: {
    margin: 0,
    padding: 0,
  },
  fab: {
    marginBottom: 180,
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
