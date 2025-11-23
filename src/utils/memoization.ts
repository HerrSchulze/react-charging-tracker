export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    try {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    } catch (error) {
      console.error('Memoized function error:', error);
      throw error;
    }
  }) as T;
};

export const useMemoCallback = <T extends (...args: any[]) => any>(
  fn: T,
  deps: any[]
): T => {
  let lastDeps: any[] = [];
  let lastResult: any;

  return ((...args: any[]) => {
    const depsChanged = !lastDeps.length || deps.some((dep, i) => dep !== lastDeps[i]);

    if (depsChanged) {
      try {
        lastResult = fn(...args);
        lastDeps = deps;
      } catch (error) {
        console.error('Memo callback error:', error);
        throw error;
      }
    }

    return lastResult;
  }) as T;
};
