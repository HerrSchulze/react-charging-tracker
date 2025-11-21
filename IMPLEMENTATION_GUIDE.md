# Charging Tracker - Implementation Guide

## Project Overview

Charging Tracker is a React Native mobile application for tracking electric vehicle charging sessions and travel events. Built with Expo, TypeScript, and React Native Paper.

## Architecture

### Project Structure
```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── services/         # Database repositories
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── theme/           # Theme configuration
└── constants/       # App constants
```

### Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite)
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Date Handling**: date-fns
- **CSV Export**: papaparse
- **Testing**: Jest

## Database Schema

### travel_events Table
```sql
CREATE TABLE travel_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  startDate INTEGER NOT NULL,
  initialCosts REAL NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
```

### charging_sessions Table
```sql
CREATE TABLE charging_sessions (
  id TEXT PRIMARY KEY,
  date INTEGER NOT NULL,
  stationProvider TEXT NOT NULL,
  location TEXT NOT NULL,
  energyCharged REAL NOT NULL,
  totalCost REAL NOT NULL,
  chargeCardProvider TEXT NOT NULL,
  travelEventId TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (travelEventId) REFERENCES travel_events(id)
);
```

## Key Features

### Travel Events
- Create, read, update, delete travel events
- Track initial costs for each trip
- View aggregated charging data per event
- Paginated list view (4 items per page)

### Charging Sessions
- Create, read, update, delete charging sessions
- Link sessions to travel events
- Track energy charged and costs
- Calculate cost per kWh
- Paginated list view (4 items per page)

### Export
- Export charging sessions to CSV
- Export travel events with aggregated data to CSV
- Share files via system share intent

### Data Validation
- Travel event name required
- Initial costs must be non-negative
- Charging session date cannot be in future
- Station provider and location required
- Energy charged must be positive
- Total cost must be non-negative

## Calculation Formulas

### Cost per kWh
```
costPerKwh = totalCost / energyCharged
```

### Travel Event Total Cost
```
totalCost = initialCosts + sum(chargingSession.totalCost)
```

### Travel Event Total Energy
```
totalEnergy = sum(chargingSession.energyCharged)
```

## State Management

### TravelEventStore (Zustand)
- `travelEvents`: Array of travel events
- `loading`: Loading state
- `error`: Error message
- `currentPage`: Current pagination page
- Actions: loadTravelEvents, insertTravelEvent, updateTravelEvent, deleteTravelEvent

### ChargingSessionStore (Zustand)
- `chargingSessions`: Array of charging sessions
- `loading`: Loading state
- `error`: Error message
- `currentPage`: Current pagination page
- Actions: loadChargingSessions, insertChargingSession, updateChargingSession, deleteChargingSession

## Navigation Structure

### Bottom Tab Navigator (3 tabs)
1. **Travel Events Tab** (index 0)
   - TravelEventsList → TravelEventDetail → TravelEventForm

2. **Charging Sessions Tab** (index 1) - Default
   - ChargingSessionsList → ChargingSessionDetail → ChargingSessionForm

3. **Export Tab** (index 2)
   - ExportScreen

## Component Library

### Common Components
- **AppBar**: Header with title, back button, action button
- **FloatingActionButton**: FAB for creating new items
- **PaginationControls**: Previous/Next navigation
- **EmptyState**: Empty list placeholder
- **LoadingSpinner**: Activity indicator
- **ErrorMessage**: Snackbar for errors
- **Card**: List item container

### Form Components
- **TextInput**: Text input with validation
- **DateInput**: Date picker (dd.MM.yyyy format)
- **DecimalInput**: Numeric input with filtering
- **Dropdown**: Option selector
- **FormButton**: Submit button

## Utilities

### Date Utilities
- `formatDate(timestamp)`: Format to dd.MM.yyyy
- `parseDate(dateString)`: Parse dd.MM.yyyy to timestamp
- `isDateInFuture(timestamp)`: Check if date is in future

### Calculation Utilities
- `calculateCostPerKwh(totalCost, energyCharged)`: Calculate cost per kWh
- `roundToTwoDecimals(value)`: Round to 2 decimal places

### Validation Utilities
- `validateTravelEvent(name, initialCosts)`: Validate travel event
- `validateChargingSession(date, stationProvider, location, energyCharged, totalCost)`: Validate charging session

### CSV Export Utilities
- `exportChargingSessionsToCSV(sessions)`: Export sessions to CSV
- `exportTravelEventsToCSV(events, sessionCosts, sessionEnergy)`: Export events to CSV

## Error Handling

### Error Codes
- `DB_ERROR`: Database operation failed
- `VALIDATION_ERROR`: Validation failed
- `EXPORT_ERROR`: Export operation failed
- `FILE_ERROR`: File operation failed

### Error Boundary
- Catches React errors
- Displays error message to user
- Provides "Try Again" button

## Performance Optimizations

### Pagination
- 4 items per page to limit UI rendering
- Reduces memory usage with large datasets

### Database Indexing
- Index on travel_events.startDate (DESC)
- Index on charging_sessions.date (DESC)
- Index on charging_sessions.travelEventId

### Lazy Rendering
- LazyList component with optimized FlatList
- Configurable batch rendering
- Removes clipped subviews

### Performance Monitoring
- PerformanceMonitor class tracks operation durations
- Logs metrics in development mode

## Running the App

### Development
```bash
npm start
npm run android
```

### Testing
```bash
npm test
npm run test:watch
npm run test:coverage
```

### Building
```bash
npm run android  # Build and run on Android
```

## Troubleshooting

### Database Issues
- Check database initialization in app/_layout.tsx
- Verify SQLite is properly installed
- Check database schema creation

### Navigation Issues
- Verify route parameters match type definitions
- Check navigation stack configuration
- Ensure screens are properly registered

### Performance Issues
- Check pagination is working correctly
- Monitor database query performance
- Use PerformanceMonitor to identify bottlenecks

## Future Enhancements
- Add statistics and charts
- Implement data backup/restore
- Add offline sync
- Multi-language support
- Dark mode support
- Advanced filtering and search
