import React, { useState } from 'react';
import { StyleSheet, Modal, View, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

  return (
    <>
      <Button
        mode="outlined"
        onPress={() => setVisible(true)}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {selectedLabel}
      </Button>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderColor: COLORS.border,
  },
  buttonLabel: {
    color: COLORS.text,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    width: '80%',
    maxHeight: 300,
  },
  item: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemText: {
    color: COLORS.text,
  },
});
