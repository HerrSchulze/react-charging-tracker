import React from 'react';
import { StyleSheet } from 'react-native';
import { Menu, Button } from 'react-native-paper';
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
  const [visible, setVisible] = React.useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button
          mode="outlined"
          onPress={() => setVisible(true)}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {selectedLabel}
        </Button>
      }
    >
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          onPress={() => {
            onSelect(option.value);
            setVisible(false);
          }}
          title={option.label}
        />
      ))}
    </Menu>
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
});
