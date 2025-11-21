import { getDatabase } from './database';
import { TravelEvent } from '../types';
import { AppError, logError } from '../utils/errorHandler';

export class TravelEventRepository {
  async insert(travelEvent: Omit<TravelEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<TravelEvent> {
    try {
      const db = getDatabase();
      const id = Date.now().toString();
      const now = Date.now();

      const newEvent: TravelEvent = {
        ...travelEvent,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await db.runAsync(
        `INSERT INTO travel_events (id, name, description, startDate, initialCosts, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newEvent.id, newEvent.name, newEvent.description, newEvent.startDate, newEvent.initialCosts, newEvent.createdAt, newEvent.updatedAt]
      );

      return newEvent;
    } catch (error) {
      logError(error, 'TravelEventRepository.insert');
      throw new AppError('DB_ERROR', 'Failed to insert travel event', error as Error);
    }
  }

  async update(travelEvent: TravelEvent): Promise<void> {
    try {
      const db = getDatabase();
      const now = Date.now();

      await db.runAsync(
        `UPDATE travel_events SET name = ?, description = ?, startDate = ?, initialCosts = ?, updatedAt = ?
         WHERE id = ?`,
        [travelEvent.name, travelEvent.description, travelEvent.startDate, travelEvent.initialCosts, now, travelEvent.id]
      );
    } catch (error) {
      logError(error, 'TravelEventRepository.update');
      throw new AppError('DB_ERROR', 'Failed to update travel event', error as Error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync('DELETE FROM travel_events WHERE id = ?', [id]);
    } catch (error) {
      logError(error, 'TravelEventRepository.delete');
      throw new AppError('DB_ERROR', 'Failed to delete travel event', error as Error);
    }
  }

  async getById(id: string): Promise<TravelEvent | null> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<TravelEvent>(
        'SELECT * FROM travel_events WHERE id = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      logError(error, 'TravelEventRepository.getById');
      throw new AppError('DB_ERROR', 'Failed to fetch travel event', error as Error);
    }
  }

  async getAll(): Promise<TravelEvent[]> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<TravelEvent>(
        'SELECT * FROM travel_events ORDER BY startDate DESC'
      );
      return results;
    } catch (error) {
      logError(error, 'TravelEventRepository.getAll');
      throw new AppError('DB_ERROR', 'Failed to fetch travel events', error as Error);
    }
  }

  async getAllPaginated(page: number, pageSize: number): Promise<TravelEvent[]> {
    try {
      const db = getDatabase();
      const offset = page * pageSize;
      const results = await db.getAllAsync<TravelEvent>(
        'SELECT * FROM travel_events ORDER BY startDate DESC LIMIT ? OFFSET ?',
        [pageSize, offset]
      );
      return results;
    } catch (error) {
      logError(error, 'TravelEventRepository.getAllPaginated');
      throw new AppError('DB_ERROR', 'Failed to fetch travel events', error as Error);
    }
  }
}
