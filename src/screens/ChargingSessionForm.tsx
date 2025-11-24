import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useChargingSessionStore } from '../store/chargingSessionStore';
import { useTravelEventStore } from '../store/travelEventStore';
import { useNavigationStore } from '../store/navigationStore';
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
import { findBestMatch } from '../utils/autocomplete';
import { COLORS, SPACING } from '../constants';

export const ChargingSessionForm: React.FC = () => {
  const { selectedId: id, setCurrentScreen } = useNavigationStore();
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
  const [cardProviders, setCardProviders] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  const loadCardProviders = async () => {
    const repo = new ChargingSessionRepository();
    const providers = await repo.getUniqueChargeCardProviders();
    setCardProviders(providers);
  };

  useEffect(() => {
    loadTravelEvents(0);
    loadCardProviders();
  }, []);

  useEffect(() => {
    if (id) {
      loadSessionData();
    } else {
      setDate(Date.now());
      setStationProvider('');
      setLocation('');
      setEnergyCharged('');
      setTotalCost('');
      setChargeCardProvider('');
      setTravelEventId(null);
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  const handleChargeCardChange = (text: string) => {
    setChargeCardProvider(text);
    
    if (text.length > 0) {
      const filtered = cardProviders.filter(provider =>
        provider.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (provider: string) => {
    setChargeCardProvider(provider);
    setSuggestions([]);
  };

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

    setCurrentScreen('list');
  };

  const eventOptions = travelEvents.map((event) => ({
    label: event.name,
    value: event.id,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <AppBar
        title={id ? 'Edit Session' : 'Create Session'}
        onBack={() => setCurrentScreen('list')}
      />
      <ErrorMessage
        message={error || ''}
        visible={errorVisible}
        onDismiss={() => {
          setErrorVisible(false);
          clearError();
        }}
      />
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
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

          <View>
            <TextInput
              label="Charge Card Provider"
              value={chargeCardProvider}
              onChangeText={handleChargeCardChange}
              placeholder="Start typing..."
            />
            {suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {eventOptions.length > 0 && (
            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Travel Event (Optional)</Text>
              <Dropdown
                key={`dropdown-${id}`}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  suggestionsContainer: {
    marginHorizontal: SPACING.md,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    maxHeight: 150,
  },
  suggestionItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionText: {
    color: COLORS.text,
    fontSize: 14,
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
