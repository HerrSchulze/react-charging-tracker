import React from 'react';
import { Dialog, Portal, Button } from 'react-native-paper';
import { COLORS } from '../constants';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Dialog.ScrollArea>
            <Dialog.Content>{message}</Dialog.Content>
          </Dialog.ScrollArea>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{cancelText}</Button>
          <Button
            onPress={onConfirm}
            textColor={isDangerous ? COLORS.error : COLORS.primary}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
