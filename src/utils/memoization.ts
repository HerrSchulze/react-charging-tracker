export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
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
      lastResult = fn(...args);
      lastDeps = deps;
    }

    return lastResult;
  }) as T;
};
