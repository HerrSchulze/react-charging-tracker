# Charging Tracker 🔋

A React Native Expo app for tracking EV charging sessions and travel events with cost analysis.

## Features

- **Travel Events Management**: Create and track travel events with initial costs
- **Charging Sessions**: Log charging sessions with energy and cost details
- **Cost Analysis**: Calculate cost per kWh and total expenses per trip
- **Session Filtering**: Filter charging sessions by travel event
- **Deletion Protection**: Prevent accidental deletion of travel events with connected sessions
- **Confirmation Dialogs**: User confirmations for all delete operations
- **Charge Card Autocomplete**: Smart autocomplete suggestions for charge card providers
- **Data Export**: Export charging sessions and travel events as CSV files
- **Offline-First**: SQLite database for local data storage
- **Petrol-Themed UI**: Modern design with React Native Paper components
- **Pagination**: Efficient list navigation with 4 items per page

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Database**: SQLite with expo-sqlite
- **UI Library**: React Native Paper
- **Routing**: Expo Router (file-based)
- **Testing**: Jest
- **Export**: PapaParse for CSV generation

## Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components (lists, forms, details)
├── services/         # Database repositories
├── store/            # Zustand state management
├── utils/            # Utilities (validation, calculations, date formatting)
├── theme/            # Theme configuration
├── types/            # TypeScript type definitions
└── constants/        # App constants and colors
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Open in:
   - Android Emulator: Press `a`
   - iOS Simulator: Press `i`
   - Expo Go: Scan QR code with your phone

## Usage

### Travel Events
- Create travel events with name, description, start date, and initial costs
- View aggregated charging costs and energy per trip
- Click the lightning bolt icon to view all charging sessions for that event
- Edit or delete events (delete only available if no connected sessions)

### Charging Sessions
- Log charging sessions with station, location, energy, and cost
- Link sessions to travel events
- Track cost per kWh for each session
- Autocomplete suggestions for charge card providers based on existing entries
- Filter sessions by travel event using the query parameter
- Clear filter with the close button in the title bar

### Export Data
- Export all charging sessions as CSV
- Export all travel events with aggregated data as CSV
- Share files via email or cloud storage

## Color Scheme

- **Primary**: Petrol (#1B7A7E)
- **Secondary**: Coral Red (#FF6B6B)
- **Tertiary**: Golden Yellow (#FFD93D)
- **Error**: Deep Red (#E63946)

## Scripts

```bash
npm start          # Start development server
npm test           # Run Jest tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Database Schema

### travel_events
- id, name, description, startDate, initialCosts, createdAt, updatedAt

### charging_sessions
- id, date, stationProvider, location, energyCharged, totalCost, chargeCardProvider, travelEventId, createdAt, updatedAt

## Version History

### v1.4.1
- Fixed routing structure to resolve "unmatched route" error on app startup
- Simplified navigation initialization for better stability

### v1.4.0
- Fixed critical security vulnerabilities (CWE-117 log injection)
- Improved error handling in performance monitoring and memoization utilities
- Enhanced code quality and maintainability with proper type definitions
- Fixed routing issues for proper app initialization

### v1.3.0
- Added autocomplete for charge card provider field with dropdown suggestions
- Swapped tab order (Travel Events first, Charging Sessions second)
- Fixed deprecated SafeAreaView import

### v1.2.0
- Added charging session filtering by travel event
- Added deletion protection for travel events with connected sessions
- Added confirmation dialogs for all delete operations
- Charging Sessions is now the default start screen

### v1.1.1
- Charging Sessions is now the default start screen

### v1.1.0
- UI improvements and refinements
- Security enhancements with input validation
- Bug fixes and code quality improvements

## License

MIT
