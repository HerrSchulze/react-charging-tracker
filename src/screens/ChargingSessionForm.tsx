import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChargingSessionStore } from '../store/chargingSessionStore';
import { useTravelEventStore } from '../store/travelEventStore';
import { ChargingSessionRepository } from '../services/ChargingSessionRepository';
import { TravelEventRepository } from '../services/TravelEventRepository';
import {
  AppBar,
  TextInput,
  DateInput,
  DecimalInput,
  Dropdown,
  FormButton,
  ErrorMessage,
} from '../components';
import { validateChargingSession } from '../utils/validation';
import { COLORS, SPACING } from '../constants';

export const ChargingSessionForm: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { insertChargingSession, updateChargingSession, loading, error, clearError } =
    useChargingSessionStore();
  const { travelEvents, loadTravelEvents } = useTravelEventStore();

  const [date, setDate] = useState(Date.now());
  const [stationProvider, setStationProvider] = useState('');
  const [location, setLocation] = useState('');
  const [energyCharged, setEnergyCharged] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [chargeCardProvider, setChargeCardProvider] = useState('');
  const [travelEventId, setTravelEventId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  const loadSessionData = async () => {
    const repo = new ChargingSessionRepository();
    const session = await repo.getById(id as string);
    if (session) {
      setDate(session.date);
      setStationProvider(session.stationProvider);
      setLocation(session.location);
      setEnergyCharged(session.energyCharged.toString());
      setTotalCost(session.totalCost.toString());
      setChargeCardProvider(session.chargeCardProvider);
      setTravelEventId(session.travelEventId);
    }
  };

  useEffect(() => {
    loadTravelEvents(0);
    if (id && typeof id === 'string') {
      loadSessionData();
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  const handleSubmit = async () => {
    const energy = parseFloat(energyCharged) || 0;
    const cost = parseFloat(totalCost) || 0;

    const validationMsg = validateChargingSession(
      date,
      stationProvider,
      location,
      energy,
      cost
    );

    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }

    setValidationError(null);

    if (id) {
      await updateChargingSession({
        id: id as string,
        date,
        stationProvider,
        location,
        energyCharged: energy,
        totalCost: cost,
        chargeCardProvider,
        travelEventId,
        createdAt: 0,
        updatedAt: 0,
      });
    } else {
      await insertChargingSession({
        date,
        stationProvider,
        location,
        energyCharged: energy,
        totalCost: cost,
        chargeCardProvider,
        travelEventId,
      });
    }

    router.back();
  };

  const eventOptions = travelEvents.map((event) => ({
    label: event.name,
    value: event.id,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <AppBar
        title={id ? 'Edit Session' : 'Create Session'}
        onBack={() => router.back()}
      />
      <ErrorMessage
        message={error || ''}
        visible={errorVisible}
        onDismiss={() => {
          setErrorVisible(false);
          clearError();
        }}
      />

      <ScrollView style={styles.content} scrollEnabled={true} nestedScrollEnabled={true} contentContainerStyle={styles.scrollContent}>
        <DateInput label="Date" value={date} onChangeDate={setDate} />

        <TextInput
          label="Station Provider"
          value={stationProvider}
          onChangeText={setStationProvider}
          error={validationError?.includes('Station') ? validationError : undefined}
        />

        <TextInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          error={validationError?.includes('Location') ? validationError : undefined}
        />

        <DecimalInput
          label="Energy Charged (kWh)"
          value={energyCharged}
          onChangeText={setEnergyCharged}
          error={validationError?.includes('Energy') ? validationError : undefined}
        />

        <DecimalInput
          label="Total Cost (€)"
          value={totalCost}
          onChangeText={setTotalCost}
          error={validationError?.includes('cost') ? validationError : undefined}
        />

        <TextInput
          label="Charge Card Provider"
          value={chargeCardProvider}
          onChangeText={setChargeCardProvider}
        />

        {eventOptions.length > 0 && (
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Travel Event (Optional)</Text>
            <Dropdown
              label="Select Event"
              value={travelEventId || ''}
              options={[{ label: 'None', value: '' }, ...eventOptions]}
              onSelect={(value) => setTravelEventId(value || null)}
            />
          </View>
        )}

        {validationError && (
          <Text style={styles.error}>{validationError}</Text>
        )}

        <FormButton
          label={id ? 'Update Session' : 'Create Session'}
          onPress={handleSubmit}
          loading={loading}
        />
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
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: 0,
    paddingBottom: 100,
  },
  dropdownContainer: {
    marginVertical: SPACING.sm,
  },
  label: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  error: {
    color: COLORS.error,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
});
