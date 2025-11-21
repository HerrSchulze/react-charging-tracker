import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  TravelEventsTab: NavigatorScreenParams<TravelEventsStackParamList>;
  ChargingSessionsTab: NavigatorScreenParams<ChargingSessionsStackParamList>;
  ExportTab: undefined;
};

export type TravelEventsStackParamList = {
  TravelEventsList: undefined;
  TravelEventDetail: { id: string };
  TravelEventForm: { id?: string };
};

export type ChargingSessionsStackParamList = {
  ChargingSessionsList: undefined;
  ChargingSessionDetail: { id: string };
  ChargingSessionForm: { id?: string };
};
