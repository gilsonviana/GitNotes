import { useState, useCallback } from 'react';
import { ConfirmDialog } from '../types';

export const useConfirmDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

  const showConfirm = useCallback((message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmDialog({ message, onConfirm });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirmDialog) {
      try {
        await confirmDialog.onConfirm();
        setConfirmDialog(null);
      } catch (error) {
        console.error('Error in confirm dialog onConfirm handler:', error);
        // Still close the dialog even if there's an error
        setConfirmDialog(null);
      }
    }
  }, [confirmDialog]);

  return {
    confirmDialog,
    showConfirm,
    hideConfirm,
    handleConfirm
  };
};
