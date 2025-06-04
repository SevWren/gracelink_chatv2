
import { useState, useCallback } from 'react';

const HOOK_NAME = "[useModalControls]";

export interface ModalControls {
  showClearConfirmModal: boolean;
  showExportConfirmModal: boolean;
  openClearConfirmModal: () => void;
  closeClearConfirmModal: () => void;
  openExportConfirmModal: () => void;
  closeExportConfirmModal: () => void;
}

export function useModalControls(): ModalControls {
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);
  const [showExportConfirmModal, setShowExportConfirmModal] = useState<boolean>(false);

  const openClearConfirmModal = useCallback(() => {
    console.log(`${HOOK_NAME} Opening clear confirm modal.`);
    setShowClearConfirmModal(true);
  }, []);

  const closeClearConfirmModal = useCallback(() => {
    console.log(`${HOOK_NAME} Closing clear confirm modal.`);
    setShowClearConfirmModal(false);
  }, []);

  const openExportConfirmModal = useCallback(() => {
    console.log(`${HOOK_NAME} Opening export confirm modal.`);
    setShowExportConfirmModal(true);
  }, []);

  const closeExportConfirmModal = useCallback(() => {
    console.log(`${HOOK_NAME} Closing export confirm modal.`);
    setShowExportConfirmModal(false);
  }, []);

  return {
    showClearConfirmModal,
    showExportConfirmModal,
    openClearConfirmModal,
    closeClearConfirmModal,
    openExportConfirmModal,
    closeExportConfirmModal,
  };
}
