export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static startMeasure(label: string): void {
    try {
      this.marks.set(label, performance.now());
    } catch (error) {
      console.error(`[Performance] Failed to start measure for ${label}:`, error);
    }
  }

  static endMeasure(label: string): number {
    try {
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
    } catch (error) {
      console.error(`[Performance] Failed to end measure for ${label}:`, error);
      return 0;
    }
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(label);
    try {
      return await fn();
    } catch (error) {
      console.error(`[Performance] ${label} failed:`, error);
      throw error;
    } finally {
      this.endMeasure(label);
    }
  }

  static measure<T>(label: string, fn: () => T): T {
    this.startMeasure(label);
    try {
      return fn();
    } catch (error) {
      console.error(`[Performance] ${label} failed:`, error);
      throw error;
    } finally {
      this.endMeasure(label);
    }
  }
}
