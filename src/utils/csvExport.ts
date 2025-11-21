import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { ChargingSession, TravelEvent } from '../types';
import { formatDate } from './dateUtils';
import { calculateCostPerKwh, roundToTwoDecimals } from './calculations';

export const exportChargingSessionsToCSV = async (sessions: ChargingSession[]): Promise<void> => {
  const data = sessions.map((session) => ({
    Date: formatDate(session.date),
    'Station Provider': session.stationProvider,
    Location: session.location,
    'Energy (kWh)': roundToTwoDecimals(session.energyCharged),
    Cost: roundToTwoDecimals(session.totalCost),
    'Cost per kWh': roundToTwoDecimals(calculateCostPerKwh(session.totalCost, session.energyCharged)),
    'Charge Card': session.chargeCardProvider,
    'Travel Event': session.travelEventId || 'N/A',
  }));

  const csv = Papa.unparse(data);
  const fileName = `charging_sessions_${Date.now()}.csv`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(filePath);
};

export const exportTravelEventsToCSV = async (
  events: TravelEvent[],
  sessionCosts: Record<string, number>,
  sessionEnergy: Record<string, number>
): Promise<void> => {
  const data = events.map((event) => ({
    Name: event.name,
    Description: event.description,
    'Start Date': formatDate(event.startDate),
    'Initial Costs': roundToTwoDecimals(event.initialCosts),
    'Total Sessions': Object.keys(sessionCosts).filter((key) => key === event.id).length,
    'Total Energy': roundToTwoDecimals(sessionEnergy[event.id] || 0),
    'Total Charging Cost': roundToTwoDecimals(sessionCosts[event.id] || 0),
    'Cost per kWh': roundToTwoDecimals(
      calculateCostPerKwh(
        (sessionCosts[event.id] || 0) + event.initialCosts,
        sessionEnergy[event.id] || 0
      )
    ),
  }));

  const csv = Papa.unparse(data);
  const fileName = `travel_events_${Date.now()}.csv`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(filePath);
};
