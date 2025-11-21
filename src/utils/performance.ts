export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static startMeasure(label: string): void {
    this.marks.set(label, performance.now());
  }

  static endMeasure(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`No start mark found for ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (__DEV__) {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(label);
    try {
      return await fn();
    } finally {
      this.endMeasure(label);
    }
  }

  static measure<T>(label: string, fn: () => T): T {
    this.startMeasure(label);
    try {
      return fn();
    } finally {
      this.endMeasure(label);
    }
  }
}
