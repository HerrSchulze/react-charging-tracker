export interface TravelEvent {
  id: string;
  name: string;
  description: string;
  startDate: number;
  initialCosts: number;
  createdAt: number;
  updatedAt: number;
}

export interface ChargingSession {
  id: string;
  date: number;
  stationProvider: string;
  location: string;
  energyCharged: number;
  totalCost: number;
  chargeCardProvider: string;
  travelEventId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface TravelEventUiState {
  travelEvents: TravelEvent[];
  loading: boolean;
  error: string | null;
  currentPage: number;
}

export interface ChargingSessionUiState {
  chargingSessions: ChargingSession[];
  loading: boolean;
  error: string | null;
  currentPage: number;
}
