# AP Agri Guard Design Guidelines

## Design Approach
**System Selected**: Material Design 3 with agricultural sector adaptations
**Rationale**: Information-dense agricultural monitoring requires clear hierarchy, reliable patterns, and excellent mobile-first performance for field use. Material Design provides robust components for data visualization, forms, and responsive layouts while maintaining accessibility in outdoor conditions.

## Core Design Principles
1. **Clarity Over Decoration**: Every element serves data communication
2. **Scannable Information**: Quick risk assessment at a glance
3. **Bilingual Parity**: Telugu and English layouts maintain identical visual weight
4. **Field-Ready**: High contrast, generous touch targets, readable in sunlight
5. **Progressive Disclosure**: Complex data revealed through interaction, not displayed all at once

---

## Typography System

**Font Stack**: 
- Primary: Noto Sans (excellent Telugu glyph support)
- Fallback: Inter, system-ui

**Scale** (mobile/web adaptive):
- Display: 32px/40px (hero numbers, KPIs)
- H1: 24px/32px (screen titles)
- H2: 20px/24px (section headers)
- H3: 18px/20px (card titles)
- Body: 16px/16px (primary content)
- Small: 14px/14px (metadata, labels)
- Caption: 12px/12px (timestamps, units)

**Weights**: Regular (400) for body, Medium (500) for labels, SemiBold (600) for emphasis, Bold (700) for headers

**Line Heights**: 1.5 for body text, 1.3 for headings, 1.2 for data displays

---

## Layout System

**Spacing Primitives** (Tailwind units): Standardize on 2, 4, 6, 8, 12, 16, 24, 32
- Micro spacing (within components): 2, 4
- Component padding: 4, 6, 8
- Section spacing: 12, 16, 24
- Page margins: 16, 24, 32

**Grid System**:
- Mobile: Single column, 16px outer margins
- Tablet: 2-column with 24px gutters
- Desktop: 12-column grid with 32px gutters, max-width 1280px

**Containers**:
- Full-width: Maps, charts
- Constrained: max-w-7xl for dashboards
- Reading width: max-w-3xl for text-heavy content

---

## Mobile App (Farmer Experience)

### Navigation
Bottom tab bar (5 items): Home, Plots, Advisories, Map, Settings
- 64px height with icons (24px) + labels (12px)
- Active state: icon weight increases, subtle elevation

### Home Screen
**Risk Dashboard Layout**:
- Header: Location selector + date + weather summary (96px fixed)
- Risk cards: Full-width cards with 16px margins, 8px vertical spacing
- Card anatomy: Severity indicator (8px left border), hazard icon (32px), title, plot name, timestamp, "Explain" button
- 7-day outlook: Horizontal scroll carousel, 80px wide mini-cards

### Plot Management
**List View**: Avatar (crop icon) + 2-line (name, area) + right indicator (worst hazard badge)
**Add Plot Flow**: 
- Stepper header (4 steps), 56px fixed
- Map full-screen with floating controls (bottom-aligned, 16px margins)
- Drawing tools: 48px circular FAB cluster, bottom-right

### Advisories Inbox
- Grouped by date, sticky headers (40px)
- Cards: 88px min-height, left accent, swipe-to-acknowledge
- Filter chips: 40px height, horizontal scroll, 8px spacing

---

## Web Dashboard (Officer/Admin Experience)

### Overall Layout
**Structure**: Fixed sidebar (240px) + top bar (64px) + content area
- Sidebar: Logo (48px), nav items (48px each), subtle dividers
- Top bar: Breadcrumb + search + language toggle + user menu

### Overview Page
**KPI Cards Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
- Card dimensions: 240px height, 16px padding
- Anatomy: Large number (40px), label (14px), trend indicator, micro-chart (60px height)

**Mini Map + Alerts Section**: 60/40 split on desktop, stacked on mobile

### Map Interface
**Full-Screen Layout**:
- Layer controls: Floating left panel, 280px width, collapsible
- Legend: Bottom-left, 240px width
- Plot cards: Right drawer (360px), slide-in on selection
- Zoom controls: Bottom-right, 48px buttons, 8px spacing

### Alerts Queue
**Table Design**:
- Fixed header (48px), sticky on scroll
- Row height: 56px, zebra striping
- Columns: Checkbox (40px), Severity (80px), Hazard (120px), Location (flexible), Date (120px), Status (100px), Actions (80px)
- Bulk action bar: Slides up from bottom (64px height) when items selected

### Farmers & Plots Management
**Master-Detail Layout**:
- Left: Searchable table (60% width)
- Right: Detail panel (40% width) with tabs (Signals, Advisories, History)
- Signals chart: 400px height, 14-day range, multi-axis (rain bars, temperature lines, VPD area)

### Rules Viewer/Tester
**Two-Column Split**:
- Left: YAML display with syntax highlighting, read-only
- Right: Interactive tester
  - Input sliders: 240px width, 48px height, real-time preview
  - Output: Severity gauge (180px diameter), score (72px), explain list with checkmarks

### Communications Composer
**Template Library + Composer**:
- Left sidebar (320px): Template list with preview toggle
- Center (flexible): Composition area
  - District → Mandal → Village → Farmer cascade (200px width each)
  - Template preview: 480px width, 320px height, scrollable
  - Channel badges: 40px height, multi-select chip group
- Send button: Primary, 48px height, full-width at bottom

---

## Component Library

### Risk/Severity Indicators
- **Badges**: 24px height, pill-shaped, icon + label
- **Border Accents**: 4px or 8px left border on cards
- **Severity Gauges**: 120px diameter circular, arc from 0-100

### Data Cards
**Standard Card**: 16px padding, subtle elevation, 8px border-radius
- Header: Icon (24px) + title + actions (right-aligned)
- Content: Generous whitespace, 12px spacing between elements
- Footer: Metadata or actions, 8px top border

### Form Elements
- **Input fields**: 48px height, 16px horizontal padding, 4px border-radius
- **Select dropdowns**: Same dimensions, chevron icon 20px
- **Checkboxes/Radio**: 20px, 2px stroke
- **Switches**: 40px width, 20px height (mobile context)

### Charts
**Weather Signal Charts**:
- Height: 240px (mobile), 320px (web)
- Grid: Subtle horizontal lines, 20% opacity
- Axes: 12px labels, 14px titles
- Legend: Top-right, horizontal, 32px height

### Maps
**Polygon Styling**:
- Plot boundaries: 2px stroke, 20% fill
- Selected plot: 3px stroke, 40% fill
- GeoJSON overlays: 1px stroke, 10% fill, pattern for districts

### Buttons & Actions
- **Primary**: 48px height, 16px horizontal padding, full corner radius
- **Secondary**: Same dimensions, outline variant
- **Icon buttons**: 40px square, 20px icon
- **FABs (mobile)**: 56px diameter, 24px icon

---

## Images

**Not applicable** - This is a data-focused agricultural monitoring system. No hero images or decorative photography. All visuals are:
1. Functional maps (GeoJSON layers)
2. Data visualizations (charts, gauges)
3. Icons for crops, hazards, and actions
4. Optional: Small illustrative icons for empty states (e.g., "No plots added yet")

---

## Animation & Interaction

**Minimal, Purposeful Motion**:
- Page transitions: 200ms ease-out
- Card expansions: 250ms ease-in-out
- Loading states: Subtle skeleton screens, no spinners
- Map interactions: Smooth zoom (300ms), instant pan
- **No decorative animations** - field use requires instant response

---

## Accessibility & Outdoor Readability

- **Touch targets**: Minimum 44px (web), 48px (mobile)
- **Contrast**: Maintain 4.5:1 for all text, 7:1 for critical data
- **Focus indicators**: 3px outline, high contrast
- **Icon + text**: Never icons alone for critical actions
- **Bilingual layout**: Reserve vertical space equally for Telugu and English labels
- **Status communication**: Use icon, shape, position, AND label (never rely on single attribute)