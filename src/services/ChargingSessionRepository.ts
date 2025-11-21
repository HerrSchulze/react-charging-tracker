import { getDatabase } from './database';
import { ChargingSession } from '../types';
import { AppError, logError } from '../utils/errorHandler';

export class ChargingSessionRepository {
  async insert(session: Omit<ChargingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChargingSession> {
    try {
      const db = getDatabase();
      const id = Date.now().toString();
      const now = Date.now();

      const newSession: ChargingSession = {
        ...session,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await db.runAsync(
        `INSERT INTO charging_sessions (id, date, stationProvider, location, energyCharged, totalCost, chargeCardProvider, travelEventId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newSession.id, newSession.date, newSession.stationProvider, newSession.location, newSession.energyCharged, newSession.totalCost, newSession.chargeCardProvider, newSession.travelEventId, newSession.createdAt, newSession.updatedAt]
      );

      return newSession;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.insert');
      throw new AppError('DB_ERROR', 'Failed to insert charging session', error as Error);
    }
  }

  async update(session: ChargingSession): Promise<void> {
    try {
      const db = getDatabase();
      const now = Date.now();

      await db.runAsync(
        `UPDATE charging_sessions SET date = ?, stationProvider = ?, location = ?, energyCharged = ?, totalCost = ?, chargeCardProvider = ?, travelEventId = ?, updatedAt = ?
         WHERE id = ?`,
        [session.date, session.stationProvider, session.location, session.energyCharged, session.totalCost, session.chargeCardProvider, session.travelEventId, now, session.id]
      );
    } catch (error) {
      logError(error, 'ChargingSessionRepository.update');
      throw new AppError('DB_ERROR', 'Failed to update charging session', error as Error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync('DELETE FROM charging_sessions WHERE id = ?', [id]);
    } catch (error) {
      logError(error, 'ChargingSessionRepository.delete');
      throw new AppError('DB_ERROR', 'Failed to delete charging session', error as Error);
    }
  }

  async getById(id: string): Promise<ChargingSession | null> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<ChargingSession>(
        'SELECT * FROM charging_sessions WHERE id = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.getById');
      throw new AppError('DB_ERROR', 'Failed to fetch charging session', error as Error);
    }
  }

  async getAll(): Promise<ChargingSession[]> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<ChargingSession>(
        'SELECT * FROM charging_sessions ORDER BY date DESC'
      );
      return results;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.getAll');
      throw new AppError('DB_ERROR', 'Failed to fetch charging sessions', error as Error);
    }
  }

  async getAllPaginated(page: number, pageSize: number): Promise<ChargingSession[]> {
    try {
      const db = getDatabase();
      const offset = page * pageSize;
      const results = await db.getAllAsync<ChargingSession>(
        'SELECT * FROM charging_sessions ORDER BY date DESC LIMIT ? OFFSET ?',
        [pageSize, offset]
      );
      return results;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.getAllPaginated');
      throw new AppError('DB_ERROR', 'Failed to fetch charging sessions', error as Error);
    }
  }

  async getByTravelEventId(travelEventId: string): Promise<ChargingSession[]> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<ChargingSession>(
        'SELECT * FROM charging_sessions WHERE travelEventId = ? ORDER BY date DESC',
        [travelEventId]
      );
      return results;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.getByTravelEventId');
      throw new AppError('DB_ERROR', 'Failed to fetch charging sessions', error as Error);
    }
  }

  async getTotalCostByTravelEventId(travelEventId: string): Promise<number> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<{ total: number }>(
        'SELECT COALESCE(SUM(totalCost), 0) as total FROM charging_sessions WHERE travelEventId = ?',
        [travelEventId]
      );
      return result?.total || 0;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.getTotalCostByTravelEventId');
      throw new AppError('DB_ERROR', 'Failed to calculate total cost', error as Error);
    }
  }

  async getTotalEnergyByTravelEventId(travelEventId: string): Promise<number> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<{ total: number }>(
        'SELECT COALESCE(SUM(energyCharged), 0) as total FROM charging_sessions WHERE travelEventId = ?',
        [travelEventId]
      );
      return result?.total || 0;
    } catch (error) {
      logError(error, 'ChargingSessionRepository.getTotalEnergyByTravelEventId');
      throw new AppError('DB_ERROR', 'Failed to calculate total energy', error as Error);
    }
  }
}
