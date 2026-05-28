# Mind-Sync Design Specification: Aetheric High-Tech

## 1. Visual Identity & Brand Philosophy
Mind-Sync is an "Elite AI Companion" for cognitive augmentation. The visual language, **Aetheric High-Tech**, uses a premium dark-mode aesthetic with glassmorphism, depth-focused layouts, and vibrant neural energy accents.

### 1.1 Color Palette
*   **Surface (Background)**: `#15121b` (Deep Obsidian)
*   **Primary Accent**: `#8a49f8` (Electric Violet)
*   **Secondary Accent**: `#d3bbff` (Soft Lavender)
*   **Gradient Flow**: A linear gradient from `Primary` to `Secondary` represents neural activity and focus.
*   **Semantic Colors**:
    *   Success: Emerald Green (Habit completion, synced states)
    *   Warning: Amber Gold (Priority tasks, streak warnings)
    *   Error: Rose Red (Critical alerts, deletions)

### 1.2 Typography
*   **Headlines & UI Labels**: `Inter` (Variable Weight) - Selected for its modern, clean, and highly legible characteristics in dense UI.
*   **Data & Metrics**: `JetBrains Mono` - Used for timers, percentages, analytics, and any technical log data to emphasize precision.

---

## 2. Shared Component Architecture
Consistency across the workspace is maintained through a unified shell and modular component patterns.

### 2.1 Navigation Shell
*   **SideNavBar**: A fixed `w-64` glassmorphic pane with top-aligned navigation links (Workspace, Analytics, Library, etc.), a "Royal Intelligence" logo, and a bottom-aligned user profile/settings section.
*   **TopAppBar**: Minimalist header containing search, notifications, and context-specific actions (e.g., "Export Board", "Save Sync").

### 2.2 Glassmorphism & Depth
*   **Glass Cards**: `bg-surface/60 backdrop-blur-3xl border border-white/10`
*   **Glow Effects**: Primary buttons and active states use a soft `0 0 15px rgba(138, 73, 248, 0.3)` outer glow to signify active intelligence.

---

## 3. Screen-Specific Specifications

### 3.1 Universal Hub (Dashboard)
The central command center.
*   **Analytics Header**: 4-column glass stat cards for Focus Hours, Tasks, Streaks, and Time Saved.
*   **Neural Activity Log**: A vertical timeline with dot indicators and connector lines tracking system-level events.
*   **AI Intelligence Brief**: A prominent feature card with a gradient background summarizing the user's "Strategic Synthesis."

### 3.2 Neural Analytics
Deep-dive performance metrics.
*   **Neural Quotient**: A central radial gauge visualizing the primary cognitive score.
*   **Cognitive Load Heatmap**: A 53-week grid (GitHub style) mapping neural activity intensity.
*   **AI Coach**: A specialized widget providing real-time optimization advice based on data trends.

### 3.3 Focus Mode (Zen Focus)
Minimalist environment for deep work.
*   **Neural Timer**: A large, central circular progress ring with animated stroke-dasharray transitions.
*   **Focus Insights**: A translucent right-hand panel showing real-time Neural Activity bar charts and session stats.

### 3.4 Neural Kanban
Collaborative agile workspace.
*   **Status Columns**: "Queue / Todo", "Synchronizing", and "Integrated".
*   **Presence Indicators**: Real-time avatars (`+12` style) showing active collaborators.
*   **Priority Tags**: Color-coded badges for Critical (P0), Active (P1), Stable (P2), and Low (P3).

### 3.5 Neural Notes
Structured knowledge vault.
*   **Dual-Pane Editor**: Left-hand navigation for Vaults and Tags; right-hand Rich Text Editor with Markdown support.
*   **Neural Lattice Optimization**: A dedicated section for "Key Realizations" highlighted with gradient borders.

### 3.6 Meeting Sync Assistant
Real-time audio companion.
*   **Waveform Visualizer**: Dynamic amplitude rendering of the active "Neural Stream."
*   **Live Transcript**: Real-time speaker-identified text feed with auto-scrolling logic.
*   **AI Summary**: A high-speed generation tool to distill long meetings into Executive Summaries.

### 3.7 Temporal Grid (Calendar)
High-fidelity scheduling.
*   **Unified Multi-View**: Month-view grid with a persistent "Today's Focus" right-sidebar.
*   **Sync Widget**: Status indicator for Google/Cloud sync integration.

### 3.8 System Preferences (Command Center)
User identity and data management.
*   **Profile Identity**: Dedicated card for authentication and display name management.
*   **Integration Nodes**: Toggle switches for external connections (Google Workspace, Notion).
*   **Data Custody**: Export/Purge tools for machine-readable (JSON) data portability.

---

## 4. Motion & Interactivity
*   **Hover-Lift**: Components lift by `-4px` with a transition duration of `300ms` and an eased curve.
*   **Smooth Transitions**: Page-level changes utilize a fade-and-slide motion (`opacity 0 -> 1`, `y: 20 -> 0`).
*   **3D Sphere**: The landing page center-piece uses a Three.js distorted mesh representing the fluidity of thought.