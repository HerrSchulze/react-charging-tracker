import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { formatDate, parseDate } from '../utils/dateUtils';
import { COLORS, SPACING } from '../constants';

interface DateInputProps {
  label: string;
  value: number;
  onChangeDate: (timestamp: number) => void;
  error?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChangeDate,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [dateString, setDateString] = useState(formatDate(value));

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const timestamp = selectedDate.getTime();
      onChangeDate(timestamp);
      setDateString(formatDate(timestamp));
    }
  };

  const handleTextChange = (text: string) => {
    setDateString(text);
    const parsed = parseDate(text);
    if (parsed) {
      onChangeDate(parsed);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <PaperTextInput
          label={label}
          value={dateString}
          onChangeText={handleTextChange}
          mode="outlined"
          editable={false}
          error={!!error}
          style={styles.input}
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
        />
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {showPicker && (
        <DateTimePicker
          value={new Date(value)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
  },
});
