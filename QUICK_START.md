# Quick Start Guide

## Installation

1. Navigate to project directory:
```bash
cd charging-tracker
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Android Development
```bash
npm run android
```

This will:
- Start the Expo development server
- Build and launch the app on Android emulator or connected device
- Enable hot reload for development

### Web (for testing)
```bash
npm run web
```

## Project Structure

- `app/` - Expo Router entry point
- `src/components/` - Reusable UI components
- `src/screens/` - Screen components
- `src/navigation/` - Navigation setup
- `src/services/` - Database repositories
- `src/store/` - Zustand stores
- `src/types/` - TypeScript types
- `src/utils/` - Utility functions
- `src/theme/` - Theme configuration
- `src/constants/` - App constants

## Key Features

### Travel Events
1. Navigate to "Travel Events" tab
2. Click FAB to create new event
3. Fill in event details (name, description, start date, initial costs)
4. View event details and associated charging sessions
5. Edit or delete events

### Charging Sessions
1. Navigate to "Charging Sessions" tab (default)
2. Click FAB to create new session
3. Fill in session details (date, provider, location, energy, cost, card)
4. Optionally link to a travel event
5. View session details
6. Edit or delete sessions

### Export Data
1. Navigate to "Export" tab
2. Click "Export Charging Sessions" to export all sessions
3. Click "Export Travel Events" to export all events with aggregated data
4. Share files via system share intent

## Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint code
npm lint
```

## Database

The app uses SQLite for local data storage. Database is automatically initialized on app startup.

### Tables
- `travel_events` - Travel event records
- `charging_sessions` - Charging session records

### Data Format
- Dates stored as Unix timestamps (milliseconds)
- Costs stored as decimal numbers
- Energy stored as decimal numbers

## Validation Rules

### Travel Events
- Name: Required, non-empty
- Initial Costs: Must be >= 0

### Charging Sessions
- Date: Cannot be in the future
- Station Provider: Required, non-empty
- Location: Required, non-empty
- Energy Charged: Must be > 0
- Total Cost: Must be >= 0

## Date Format

All dates are displayed in `dd.MM.yyyy` format (e.g., 15.01.2024)

## Calculations

- **Cost per kWh**: totalCost / energyCharged (rounded to 2 decimals)
- **Travel Event Total Cost**: initialCosts + sum of all charging session costs
- **Travel Event Total Energy**: sum of all charging session energy

## Troubleshooting

### App won't start
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)

### Database errors
- Check that expo-sqlite is installed
- Verify database initialization in app/_layout.tsx
- Check device storage permissions

### Navigation issues
- Ensure all screens are properly registered
- Check route parameter types match navigation types
- Verify back button functionality

### Performance issues
- Check pagination is working (4 items per page)
- Monitor with PerformanceMonitor in development
- Use LazyList for large lists

## Next Steps

1. Test all CRUD operations
2. Verify calculations are correct
3. Test export functionality
4. Check mobile layout on different devices
5. Run test suite: `npm test`
6. Build for production: `npm run android`

## Support

For issues or questions:
1. Check IMPLEMENTATION_GUIDE.md for detailed documentation
2. Review DEPLOYMENT_CHECKLIST.md for testing checklist
3. Check console logs for error messages
4. Review test files for usage examples
