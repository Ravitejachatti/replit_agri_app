# AP Agri Guard

## Project Overview
AP Agri Guard is a weather-based proactive crop monitoring system for Andhra Pradesh, focused on Krishna and Guntur districts. The system consists of a web dashboard for agricultural officers and administrators to monitor crops, analyze risks, and communicate advisories to farmers.

## Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with local persistence
- **Data Storage**: IndexedDB (via idb) for web application
- **Internationalization**: i18next (Telugu default, English fallback)
- **Maps**: MapLibre GL for GeoJSON visualization
- **Charts**: Recharts for weather signals and analytics
- **Date/Time**: Day.js with IST timezone

### Key Features
1. **Username-only Authentication**: Role-based access (FARMER, FIELD_OFFICER, OPERATOR, ADMIN, DATA_SCIENTIST)
2. **Bilingual Interface**: Telugu (default) and English with instant toggle
3. **YAML Rule Engine**: Evaluates 5 hazards (PADDY_BLAST, PADDY_BLB, CHILLI_ANTHRACNOSE, CHILLI_THRIPS, FLOOD) with severity scoring
4. **Comprehensive Dashboard**: KPIs, maps, alerts queue, farmer management, rule testing, communications
5. **Optional Online Mode**: NASA POWER integration for live weather data

## User Roles & Access

### Fixed Username-Role Mapping
```
farmer_krishna → FARMER
farmer_guntur → FARMER
officer_krishna → FIELD_OFFICER
officer_guntur → FIELD_OFFICER
operator → OPERATOR
admin → ADMIN
datasci → DATA_SCIENTIST
```

### Role-Based Features
- **FARMER**: Mobile-focused (not implemented in web version)
- **FIELD_OFFICER/OPERATOR/ADMIN/DATA_SCIENTIST**: Full web dashboard access

## Data Model

### Core Entities
- **Districts**: Krishna, Guntur
- **Mandals**: 3-4 per district
- **Villages**: 2-3 per mandal
- **Plots**: Farmer field boundaries with crop cycles
- **Crops**: Paddy, Chilli
- **Stages**: Nursery, Transplanting, Tillering, Panicle, Harvest, Vegetative, Flowering, FruitSet
- **Weather (WxDaily)**: Daily weather observations (rain, temp, humidity, wind)
- **Signals (SignalDaily)**: Computed metrics (ETo, ETc, VPD, GDD, NDVI, NDWI)
- **Risk Events**: Hazard alerts with severity (green/orange/red) and explanations
- **Advisory Templates**: Multi-channel message templates
- **Messages**: Communication records

## Application Structure

### Pages
1. **Login** (`/`): Username authentication with quick-select chips
2. **Overview** (`/`): KPI cards, online mode toggle, mini-map, alerts summary
3. **Map** (`/map`): Interactive GeoJSON layers, plot boundaries, alert heatmap
4. **Alerts** (`/alerts`): Filterable alerts queue, bulk acknowledge, CSV export
5. **Farmers** (`/farmers`): Master-detail view with 14-day signals charts (Recharts)
6. **Rules** (`/rules`): YAML viewer and interactive tester with weather sliders
7. **Communications** (`/communications`): Template library and message composer
8. **Messages** (`/messages`): Localized message key reference
9. **Settings** (`/settings`): Language, online mode, theme, data reset

### Components
- **AppSidebar**: Navigation menu with role-based items
- **LanguageToggle**: Telugu/English switcher
- **ThemeToggle**: Light/dark mode switcher
- **SeverityBadge**: Color-coded hazard severity indicators

## Development

### Running the Application
```bash
npm run dev
```
The application runs on port 5000 (configured in Vite).

### Seed Data
Mock data includes:
- 2 districts (Krishna, Guntur)
- 6-8 mandals
- 12-16 villages
- 4 test plots (2 Paddy in Krishna, 2 Chilli in Guntur)
- 21 days of weather and signals data
- 12 advisory templates in Telugu & English
- Sample risk events across all severity levels

### Internationalization
All UI text uses i18n keys:
- `shared/i18n/te.json` - Telugu translations
- `shared/i18n/en.json` - English translations

## Recent Changes
- **2025-01-XX**: Initial implementation of complete web dashboard
- Complete schema design for all agricultural entities
- Telugu-first i18n implementation with 200+ translation keys
- All 9 pages with professional Material Design 3 styling
- Zustand stores for auth and settings with persistence
- Responsive layout with sidebar navigation
- Severity-based color system for agricultural alerts

## Design Guidelines
The application follows Material Design 3 principles adapted for agricultural monitoring:
- **Field-Ready**: High contrast for outdoor readability (4.5:1 minimum)
- **Bilingual Parity**: Equal visual weight for Telugu and English
- **Data-Dense**: Information-first design with progressive disclosure
- **Accessibility**: 48px touch targets, icon+text labels, proper focus indicators
- **Agricultural Colors**: Green (healthy/low risk), Orange (medium risk), Red (high risk)

See `design_guidelines.md` for complete specifications.

## API Endpoints (To Be Implemented)
- `GET /api/stats` - Dashboard KPIs
- `GET /api/alerts` - Risk events with filters
- `POST /api/alerts/acknowledge` - Bulk acknowledge alerts
- `GET /api/farmers` - Farmer list with district filter
- `GET /api/plots` - Plot list by farmer
- `GET /api/signals/:plotId` - Signal data for charts
- `GET /api/mandals/:district` - Mandals by district
- `GET /api/villages/:mandal` - Villages by mandal
- `GET /api/rules` - Rule definitions
- `POST /api/rules/test` - Test rules with custom weather
- `GET /api/advisory-templates` - Message templates
- `POST /api/messages` - Send advisory message

## Next Steps
1. Implement backend with mock service layer and IndexedDB storage
2. Create seed data for all entities
3. Implement YAML rule engine parser and evaluator
4. Add MapLibre GL integration for GeoJSON visualization
5. Implement CSV export functionality
6. Add NASA POWER client-side integration
7. Complete end-to-end testing of all user journeys
