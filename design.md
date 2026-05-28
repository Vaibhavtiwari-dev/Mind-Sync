# Mind-Sync — Design System & UI Specification

Welcome to the comprehensive design specification for **Mind-Sync**, the ultimate AI-powered productivity workspace. This document serves as the design registry detailing the visual language, layout structure, component variants, and interactive behaviors across all user-facing interfaces—from the public landing page to the authenticated dashboard tabs.

---

## 🎨 1. Core Visual Identity & Design Tokens

Mind-Sync follows a **premium, dark-mode-first aesthetic** utilizing glassmorphism, glowing accents, fluid motion, and curated gradient meshes to evoke depth and focus.

### 1.1 Color System (HSL & CSS Variables)
Defined in [globals.css](file:///C:/Users/Vaibhav/Workspace/Mind-Sync/src/app/globals.css), the palette uses custom HSL coordinates for high-fidelity dark/light mode rendering:

*   **Primary Brand Gradient**: `Brand Purple` HSL(262, 83%, 58%) ➔ `Brand Pink` HSL(330, 81%, 60%) ➔ `Brand Blue` HSL(217, 91%, 60%)
*   **Contextual Semantic Colors**:
    *   **Success**: Emerald Green `hsl(142, 76%, 36%)` (used for habit completions, focus sessions, positive trends)
    *   **Warning**: Amber Orange `hsl(38, 92%, 50%)` (used for high-priority tasks, warning badges, active streaks)
    *   **Error**: Rose Red `hsl(0, 84%, 60%)` (used for deleting items, downward trends, errors)
    *   **Info**: Sky Blue `hsl(199, 89%, 48%)` (used for system tips, secondary tags)
*   **Glow Vectors**: Soft drop shadows and focus rings using `hsl(262, 83%, 58% / 0.15)` to give buttons and cards a premium neon outline.

### 1.2 Typography System
Configured in [layout.tsx](file:///C:/Users/Vaibhav/Workspace/Mind-Sync/src/app/layout.tsx), using modern typography from Google Fonts:
*   **Sans-Serif (Body & Headings)**: `Inter` (Variable Weight) - for legibility, clean weights, and high-density UI layouts.
*   **Monospace (Time, Stats, Code)**: `JetBrains Mono` - for numbers, timers, code logs, and data-heavy metrics.

### 1.3 Key CSS Classes & Visual Utilities
*   `glass` & `glass-card`: Semi-transparent background cards with `backdrop-blur-sm` and custom borders `border-border/50`.
*   `gradient-text` & `gradient-text-animated`: Text elements with background-clip gradients. The animated variant shifts horizontal position over a `3s` infinite loop.
*   `hover-lift`: Multi-stage hover animation lifting the component using `y: -8` translation and broadening shadows.
*   `gradient-border`: Masked border styling which wraps premium components in a dual-layer color outline.
*   `skeleton-shimmer`: Dynamic loading state utility mimicking light passing across skeleton elements.

---

## 🖥️ 2. Public Landing Page Layout

The public landing page [LandingPage.tsx](file:///C:/Users/Vaibhav/Workspace/Mind-Sync/src/app/LandingPage.tsx) is designed to create a premium first impression, converting visitors with rich animations and interactive elements.

```
+-------------------------------------------------------+
|  [Logo] Mind-Sync                      [Sign In] [CTA]  | <-- Header
+-------------------------------------------------------+
|                                                       |
|        Intelligent "Second Brain" Workspace           |
|                                                       |
|                  [ 3D Sphere Orb ]                     | <-- Three.js Hero
|                                                       |
|              [ Start Syncing For Free ]               | <-- Gradient CTA
|                                                       |
+-------------------------------------------------------+
|  [10K+ Users]        [1M+ Tasks]         [99% Uptime] | <-- Animated Stats
+-------------------------------------------------------+
|  [📅 Smart Planner]   [✅ Kanban]   [🎯 Focus]   [📝 Notes] | <-- Feature Cards
+-------------------------------------------------------+
```

### 2.1 Landing Page Sections
1.  **Floating Elements Background**: Dynamic background layer rendering 20 floating, semi-transparent gradient circles rotating and translating at varied durations.
2.  **3D Hero Canvas**: Integrates a Three.js canvas featuring a distorted sphere mesh using `MeshDistortMaterial`. It floats, rotates, and morphs in response to cursor hover.
3.  **Hero Typography & CTA**: Features huge header text using the animated brand gradient, a lead subtitle, and a primary `gradient` CTA button with a rolling shimmer highlight.
4.  **Animated Stats**: Counters tracking user numbers and tasks that count up dynamically when scrolled into view using Framer Motion's `useMotionValue` and `useInView`.
5.  **Staggered Feature Grid**: A 4-column display of core features. Hovering over a card lifts it, highlights the borders, and displays a subtle glowing backdrop.
6.  **Testimonials Carousel**: An infinite, auto-scrolling row of testimonial blocks featuring glassmorphism background layers and transparent borders.
7.  **CTA & Footer Section**: A bottom pitch card offering immediate access to the app shell with minimal footer links.

---

## 🎛️ 3. App Shell & Navigation Dashboard

Once logged in, authenticated users are directed into the central App Shell [DashboardShell.tsx](file:///C:/Users/Vaibhav/Workspace/Mind-Sync/src/app/\(dashboard\)/DashboardShell.tsx).

### 3.1 App Layout Structure
*   **Desktop View**: A fixed 2-pane split:
    *   **Sidebar Pane (`w-64`)**: Contains the brand logo, Workspace Switcher, Quick Search (triggering Command Menu), active list navigation, and user profile drawer.
    *   **Main Content Window**: Fills remaining viewport space. Features a custom scrollbar, an underlying mesh gradient, and content spacing.
*   **Mobile View**: Optimized for narrow touchpoints:
    *   **Top Bar (`h-14`)**: Features a navigation menu hamburger trigger (which opens a drawer containing the Sidebar components) and Clerk's User Profile avatar.
    *   **Bottom Navigation**: A persistent overlay offering quick finger access to primary views (Dashboard, Habits, Calendar, Notes).
*   **Accessibilities**: Includes a `SkipLink` (skip navigation to main content), an interactive Keyboard Shortcut help sheet (toggled with `?`), and screen-reader announcement updates.

---

## 📑 4. Detailed Tab & Page Specs

Mind-Sync's authenticated workspace is divided into 9 page-level subdirectories inside the `(dashboard)` route group.

### 4.1 Dashboard Hub (`/dashboard`)
Serves as the user's primary command center.
*   **Real-time Analytics Header**: 4-column glass stat cards:
    1.  *Focus Hours*: Shows focus time this week with trend indicators (up/down).
    2.  *Tasks Completed*: Shows completed tasks count alongside remaining pending.
    3.  *Current Streak*: Current day completion counts with a fire emoji trigger (`🔥`) for streaks $\ge 3$.
    4.  *Meeting Time Saved*: Calculated savings based on processed transcription summaries.
*   **AI Daily Briefing Widget**: Highlighted banner generating dynamic summaries of the user's upcoming day.
*   **Pending Tasks Panel**: Toggle lists displaying priority-colored tags (P0-P3). Completing a task triggers a **Confetti animation drop**.
*   **Timeline Activity Logs**: Track a vertical history of recently completed tasks with connection lines.
*   **Zen Mode Promo Card**: Bold banner highlighting deep work options with an embedded launch action.

### 4.2 Habit Tracker (`/habits`)
Focuses on behavioral reinforcement.
*   **Timeline Categorization**: Habits are categorized and rendered under four distinct headers: Morning `🌅`, Afternoon `☀️`, Evening `🌙`, and Anytime `✨`.
*   **Habit Progress Cards**: Display streaks, current progress meters, target metrics, and custom checklists showing daily completions.
*   **Habit Builder Drawer**: Drawer layout facilitating custom habit creations, recurrence rates, and time-of-day slotting.

### 4.3 Interactive Calendar (`/calendar`)
Integrates local scheduling with third-party calendars.
*   **Unified Multi-View Grid**:
    *   *Month View*: 7x5 day grid featuring date numbers, active month states, calendar events, and a highlight on "Today".
    *   *Week View*: Multi-column hour grid letting users view side-by-side days.
    *   *Day View*: Single day hour layout for granular time blocking.
    *   *Agenda View*: Compact list format showing chronologically sorted events.
*   **Event Styling**: Events are color-coded: Work (blue/indigo), Meetings (purple/pink), and Personal (teal/green).
*   **Google Calendar Sync Indicator**: Top bar widget displaying last sync times and manual sync actions.
*   **Quick-Add Popover**: Double-clicking an empty spot opens a popover to create events at that specific time slot.

### 4.4 Focus / Zen Mode (`/focus`)
A workspace designed to encourage deep, uninterrupted focus.
*   **Pomodoro Engine**: Features a circular progress ring visualizing active focus blocks, short breaks, and long breaks.
*   **Ambient Audio Drawer**: Integrates ambient soundscapes (Rain, Forest, Café, White Noise) with a volume control bar.
*   **Task Selection**: Let users choose a single pending task from the sidebar queue to display as the active focus target.
*   **Responsive Side Drawer**: On desktop, focus statistics and session histories are pinned to the right sidebar; on mobile, they slide up from a bottom sheet.

### 4.5 Productivity Analytics (`/analytics`)
Deep-dive metrics representing user performance.
*   **Filter System**: Dropdown calendar ranges (7 days, 30 days, 90 days, Year-to-Date).
*   **Visual Charts**:
    *   *Weekly Productivity Chart*: Dual-axis bar/line chart tracking completed tasks against focus hours.
    *   *Activity Heatmap*: 53-week grid mapping daily focus points and tasks completed (similar to GitHub's contributions graph).
*   **Productivity Scoring Widget**: Custom-built meter scaling from 0 to 100, grading consistency, goal completions, and work focus ratios.
*   **AI Coach Widget**: Dynamically analyzes historical data to display encouraging text advice and productivity optimizations.

### 4.6 Kanban Board (`/kanban`)
Agile board layout.
*   **Status Columns**: Drag-and-drop swimlanes categorizing tasks into "Todo", "In Progress", and "Done".
*   **Live Collaboration**: Integrates PartyKit presence indicators. Shows real-time avatars of other teammates currently viewing or editing tasks.
*   **Action Drawer**: Side drawer to export tasks into CSV or JSON files.

### 4.7 Meeting Mode Assistant (`/meeting`)
Real-time audio processing companion.
*   **Live Waveform Visualizer**: Renders real-time audio amplitudes from the user's microphone.
*   **Dual-Screen Layout**:
    *   *Left Screen*: Tiptap text editor for typing meeting notes.
    *   *Right Screen*: Dynamic sidebar outputting real-time transcript segments with speaker IDs.
*   **AI Minutes Summary**: Pressing "AI Summary" calls Google Gemini to compile action items, meeting minutes, and decisions into a styled layout.

### 4.8 Notes Workspace (`/notes`)
A flexible split-pane editor.
*   **Double-Pane Layout**: Notes Sidebar (left) listings with folder structure, tags, and search fields; Active Note Editor (right) displaying rich text formatting.
*   **Templates Picker**: Popup dialog showcasing note blueprints (Meeting Minutes, Project Proposal, Daily Journal, Code Spec) to kickstart writing.

### 4.9 Settings Panel (`/settings`)
User preferences dashboard.
*   **User Details Card**: Integrates Clerk account edit triggers.
*   **Integrations Manager**: Toggles and setup prompts for Google Calendar Oauth sync.
*   **Notification Toggles**: Custom styled switches toggling meeting alert rules.
*   **Data Portability Card**: "Export All Data" button compiling tasks, events, and notes into a downloadable JSON backup.
