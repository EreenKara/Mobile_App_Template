// useRetry.ts
export function useRetry<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  retryCount: number,
  retryDelay: number,
) {
  const executeWithRetry = async (...args: any[]): Promise<T> => {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Max retry attempts reached');
  };
  return executeWithRetry;
}
