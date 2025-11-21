import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTravelEventStore } from '../store/travelEventStore';
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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { insertTravelEvent, updateTravelEvent, loading, error, clearError } =
    useTravelEventStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(Date.now());
  const [initialCosts, setInitialCosts] = useState('0');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadEventData();
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

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

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar title={id ? 'Edit Event' : 'Create Event'} onBack={() => router.back()} />
      <ErrorMessage
        message={error || ''}
        visible={errorVisible}
        onDismiss={() => {
          setErrorVisible(false);
          clearError();
        }}
      />

      <ScrollView style={styles.content} scrollEnabled={true} nestedScrollEnabled={true} contentContainerStyle={styles.scrollContent}>
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
    paddingBottom: 100,
  },
  error: {
    color: COLORS.error,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
});
