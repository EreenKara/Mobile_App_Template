import {useState, useCallback, useRef} from 'react';
import {parseApiError} from '@utility/error.handler';
import {useNotification} from '@contexts/notification.context';

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

interface UseAsyncOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (errorMessage: string) => void;
  showNotificationOnError?: boolean;
  successMessage?: string; // opsiyonel: başarılı olunca otomatik mesaj
}

export function useAsync<T>(
  asyncFunction: AsyncFunction<T>,
  options?: UseAsyncOptions<T>,
) {
  if (typeof asyncFunction !== 'function') {
    throw new Error('Passed asyncFunction is not a function');
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const lastArgsRef = useRef<any[]>([]);

  const {showNotification} = useNotification();

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      lastArgsRef.current = args;
      try {
        const result = await asyncFunction(...args);
        setData(result);
        options?.onSuccess?.(result);
        setSuccess(true);

        if (options?.successMessage) {
          showNotification({
            message: options.successMessage,
            type: 'success',
            modalType: 'snackbar',
          });
        }

        return result;
      } catch (err) {
        console.log('Error:', err);
        const message = parseApiError(err);
        setError(message);
        setSuccess(false);
        if (options?.showNotificationOnError !== false) {
          showNotification({
            message,
            type: 'error',
            modalType: 'snackbar',
          });
        }

        options?.onError?.(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction],
  );

  const retry = useCallback(() => {
    if (lastArgsRef.current.length > 0) {
      execute(...lastArgsRef.current);
    }
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setSuccess(false);
    lastArgsRef.current = [];
  }, []);

  return {
    execute,
    retry,
    reset,
    loading,
    error,
    data,
    success,
  };
}
