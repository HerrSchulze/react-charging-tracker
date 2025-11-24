import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card as PaperCard, Text, IconButton } from 'react-native-paper';

import { useChargingSessionStore } from '../store/chargingSessionStore';
import { useNavigationStore } from '../store/navigationStore';
import { TravelEventRepository } from '../services/TravelEventRepository';
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

export const ChargingSessionsList: React.FC = () => {
  const { setCurrentScreen, setSelectedId, filterTravelEventId, setFilterTravelEventId } = useNavigationStore();
  const {
    chargingSessions,
    loading,
    error,
    currentPage,
    loadChargingSessions,
    loadChargingSessionsByTravelEvent,
    deleteChargingSession,
    setCurrentPage,
    clearError,
  } = useChargingSessionStore();

  const [eventNames, setEventNames] = useState<Record<string, string>>({});
  const [errorVisible, setErrorVisible] = useState(false);
  const [travelEventName, setTravelEventName] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (filterTravelEventId) {
      loadChargingSessionsByTravelEvent(filterTravelEventId, 0);
    } else {
      loadChargingSessions(0);
    }
  }, [filterTravelEventId]);

  useEffect(() => {
    if (filterTravelEventId) {
      const loadEventName = async () => {
        const repo = new TravelEventRepository();
        const event = await repo.getById(filterTravelEventId);
        if (event) {
          setTravelEventName(event.name);
        }
      };
      loadEventName();
    } else {
      setTravelEventName(null);
    }
  }, [filterTravelEventId]);

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
        if (session.travelEventId && !filterTravelEventId) {
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
  }, [chargingSessions, filterTravelEventId]);

  const handleDeletePress = (id: string) => {
    setPendingDeleteId(id);
    setDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteChargingSession(pendingDeleteId);
      setPendingDeleteId(null);
    }
    setDialogVisible(false);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    if (filterTravelEventId) {
      loadChargingSessionsByTravelEvent(filterTravelEventId, currentPage + 1);
    } else {
      loadChargingSessions(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      if (filterTravelEventId) {
        loadChargingSessionsByTravelEvent(filterTravelEventId, currentPage - 1);
      } else {
        loadChargingSessions(currentPage - 1);
      }
    }
  };

  if (loading && chargingSessions.length === 0) {
    return <LoadingSpinner />;
  }

  const screenTitle = travelEventName ? `${travelEventName} - Sessions` : 'Charging Sessions';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {filterTravelEventId && (
        <View style={styles.filterBar}>
          <Text variant="labelSmall" style={styles.filterText}>{screenTitle}</Text>
          <IconButton
            icon="close"
            iconColor={COLORS.textSecondary}
            size={20}
            style={styles.clearButton}
            onPress={() => setFilterTravelEventId(null)}
          />
        </View>
      )}
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
        title="Delete Charging Session"
        message="Are you sure you want to delete this charging session?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogVisible(false)}
        isDangerous={true}
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
                  onPress={() => {
                    setSelectedId(item.id);
                    setCurrentScreen('detail');
                  }}
                >
                  <PaperCard.Content style={styles.content}>
                    <Text variant="titleSmall" style={styles.title}>
                      {item.stationProvider} • {item.location}
                    </Text>
                    <View style={styles.dateRow}>
                      <Text variant="labelSmall" style={styles.subtitle}>
                        {formatDate(item.date)}  • {item.chargeCardProvider}
                      </Text>
                      <IconButton
                        icon="delete"
                        iconColor={COLORS.error}
                        size={18}
                        style={styles.deleteButton}
                        onPress={() => handleDeletePress(item.id)}
                      />
                    </View>
                    <View style={styles.statsRow}>
                      <Text variant="labelLarge" style={styles.stats}>
                        {roundToTwoDecimals(item.energyCharged)} kWh • €{roundToTwoDecimals(item.totalCost)} •    
                      </Text>
                      <Text variant="labelLarge" style={[styles.stats, styles.bold]}>
                        €{roundToTwoDecimals(costPerKwh)}/kWh
                      </Text>
                    </View>
                    {eventName && !filterTravelEventId && (
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

      <FloatingActionButton style={styles.fab} onPress={() => {
        setSelectedId(null);
        setCurrentScreen('form');
      }} />
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
    marginBottom: 50,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterText: {
    color: COLORS.textSecondary,
    flex: 1,
  },
  clearButton: {
    margin: 0,
    padding: 0,
  },
});
