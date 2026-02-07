'use client';

import { useState, useCallback } from 'react';

export type ConfirmationAction = 'create' | 'update' | 'delete' | 'custom';

export interface UseDialogConfirmationOptions {
  onConfirm?: (data?: unknown) => void | Promise<void>;
  onCancel?: () => void;
  onSuccess?: (data?: unknown) => void;
  onError?: (error: Error) => void;
}

export interface DialogConfirmationState {
  visible: boolean;
  action: ConfirmationAction;
  data: unknown;
  loading: boolean;
  error: string | null;
}

export interface UseDialogConfirmationReturn {
  state: DialogConfirmationState;
  open: (action?: ConfirmationAction, data?: unknown) => void;
  close: () => void;
  confirm: () => Promise<void>;
  cancel: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isVisible: boolean;
  isLoading: boolean;
  actionType: ConfirmationAction;
  actionData: unknown;
}

const INITIAL_STATE: DialogConfirmationState = {
  visible: false,
  action: 'custom',
  data: null,
  loading: false,
  error: null,
};

export function useDialogConfirmation(
  options: UseDialogConfirmationOptions = {}
): UseDialogConfirmationReturn {
  const { onConfirm, onCancel, onSuccess, onError } = options;

  const [state, setState] = useState<DialogConfirmationState>(INITIAL_STATE);

  const open = useCallback(
    (action: ConfirmationAction = 'custom', data?: unknown) => {
      setState({
        visible: true,
        action,
        data: data ?? null,
        loading: false,
        error: null,
      });
    },
    []
  );

  const close = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const cancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    close();
  }, [onCancel, close]);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const confirm = useCallback(async () => {
    if (!onConfirm) {
      close();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await onConfirm(state.data);

      if (onSuccess) {
        onSuccess(state.data);
      }

      close();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);

      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  }, [onConfirm, onSuccess, onError, state.data, close, setLoading, setError]);

  return {
    state,
    open,
    close,
    confirm,
    cancel,
    setLoading,
    setError,
    isVisible: state.visible,
    isLoading: state.loading,
    actionType: state.action,
    actionData: state.data,
  };
}
