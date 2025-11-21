import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Card as PaperCard } from 'react-native-paper';
import { ChargingSessionRepository } from '../services/ChargingSessionRepository';
import { TravelEventRepository } from '../services/TravelEventRepository';
import { FormButton, LoadingSpinner, ErrorMessage } from '../components';
import { exportChargingSessionsToCSV, exportTravelEventsToCSV } from '../utils/csvExport';
import { COLORS, SPACING } from '../constants';

export const ExportScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [errorVisible, setErrorVisible] = useState(false);

  const handleExportChargingSessions = async () => {
    setLoading(true);
    try {
      const repo = new ChargingSessionRepository();
      const sessions = await repo.getAll();

      if (sessions.length === 0) {
        setMessage('No charging sessions to export');
        setMessageType('error');
        setErrorVisible(true);
        setLoading(false);
        return;
      }

      await exportChargingSessionsToCSV(sessions);
      setMessage('Charging sessions exported successfully!');
      setMessageType('success');
      setErrorVisible(true);
    } catch (error) {
      setMessage((error as Error).message || 'Failed to export charging sessions');
      setMessageType('error');
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTravelEvents = async () => {
    setLoading(true);
    try {
      const eventRepo = new TravelEventRepository();
      const sessionRepo = new ChargingSessionRepository();

      const events = await eventRepo.getAll();

      if (events.length === 0) {
        setMessage('No travel events to export');
        setMessageType('error');
        setErrorVisible(true);
        setLoading(false);
        return;
      }

      const sessionCosts: Record<string, number> = {};
      const sessionEnergy: Record<string, number> = {};

      for (const event of events) {
        sessionCosts[event.id] = await sessionRepo.getTotalCostByTravelEventId(event.id);
        sessionEnergy[event.id] = await sessionRepo.getTotalEnergyByTravelEventId(event.id);
      }

      await exportTravelEventsToCSV(events, sessionCosts, sessionEnergy);
      setMessage('Travel events exported successfully!');
      setMessageType('success');
      setErrorVisible(true);
    } catch (error) {
      setMessage((error as Error).message || 'Failed to export travel events');
      setMessageType('error');
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.titleBar}>
        <Text variant="headlineSmall" style={styles.screenTitle}>Export Data</Text>
      </View>
      {loading && <LoadingSpinner />}

      {!loading && (
        <ScrollView style={styles.content}>
          <PaperCard style={styles.card}>
            <PaperCard.Content>
              <Text variant="titleMedium" style={styles.title}>
                Export Your Data
              </Text>
              <Text variant="bodySmall" style={styles.description}>
                Export your charging sessions and travel events as CSV files. You can then share
                them via email, cloud storage, or other applications.
              </Text>
            </PaperCard.Content>
          </PaperCard>

          <FormButton
            label="Export Charging Sessions"
            onPress={handleExportChargingSessions}
            loading={loading}
          />

          <FormButton
            label="Export Travel Events"
            onPress={handleExportTravelEvents}
            loading={loading}
          />

          {message && (
            <View style={[styles.messageContainer, { backgroundColor: messageType === 'success' ? COLORS.secondary : COLORS.error }]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}
        </ScrollView>
      )}

      <ErrorMessage
        message={message}
        visible={errorVisible && messageType === 'error'}
        onDismiss={() => setErrorVisible(false)}
      />
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
  card: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  messageContainer: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
  },
  messageText: {
    color: COLORS.surface,
    fontWeight: '500',
    textAlign: 'center',
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
