import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useTravelEventStore } from '../store/travelEventStore';
import { useNavigationStore } from '../store/navigationStore';
import { TravelEventRepository } from '../services/TravelEventRepository';
import {
  AppBar,
  TextInput,
  DateInput,
  DecimalInput,
  FormButton,
  ErrorMessage,
} from '../components';
import { validateTravelEvent } from '../utils/validation';
import { COLORS, SPACING } from '../constants';

export const TravelEventForm: React.FC = () => {
  const { selectedId: id, setCurrentScreen } = useNavigationStore();
  const { insertTravelEvent, updateTravelEvent, loading, error, clearError } =
    useTravelEventStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(Date.now());
  const [initialCosts, setInitialCosts] = useState('0');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  const loadEventData = async () => {
    const repo = new TravelEventRepository();
    const event = await repo.getById(id as string);
    if (event) {
      setName(event.name);
      setDescription(event.description);
      setStartDate(event.startDate);
      setInitialCosts(event.initialCosts.toString());
    }
  };

  useEffect(() => {
    if (id) {
      loadEventData();
    } else {
      setName('');
      setDescription('');
      setStartDate(Date.now());
      setInitialCosts('0');
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  const handleSubmit = async () => {
    const costs = parseFloat(initialCosts) || 0;
    const validationMsg = validateTravelEvent(name, costs);

    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }

    setValidationError(null);

    if (id) {
      await updateTravelEvent({
        id: id as string,
        name,
        description,
        startDate,
        initialCosts: costs,
        createdAt: 0,
        updatedAt: 0,
      });
    } else {
      await insertTravelEvent({
        name,
        description,
        startDate,
        initialCosts: costs,
      });
    }

    setCurrentScreen('list');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <AppBar title={id ? 'Edit Event' : 'Create Event'} onBack={() => setCurrentScreen('list')} />
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
          <TextInput
            label="Event Name"
            value={name}
            onChangeText={setName}
            error={validationError?.includes('Name') ? validationError : undefined}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <DateInput label="Start Date" value={startDate} onChangeDate={setStartDate} />

          <DecimalInput
            label="Initial Costs (€)"
            value={initialCosts}
            onChangeText={setInitialCosts}
            error={validationError?.includes('costs') ? validationError : undefined}
          />

          {validationError && (
            <Text style={styles.error}>{validationError}</Text>
          )}

          <FormButton
            label={id ? 'Update Event' : 'Create Event'}
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
  error: {
    color: COLORS.error,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
});
