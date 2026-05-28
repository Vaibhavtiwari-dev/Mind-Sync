---
name: EuroGrant AI Modern System
colors:
  surface: '#FFFFFF'
  surface-dim: '#dad9e1'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3fa'
  surface-container: '#eeedf4'
  surface-container-high: '#e9e7ef'
  surface-container-highest: '#e3e1e9'
  on-surface: '#1a1b21'
  on-surface-variant: '#444651'
  inverse-surface: '#2f3036'
  inverse-on-surface: '#f1f0f7'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#4b1c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e2c00'
  on-tertiary-container: '#f39461'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#773205'
  background: '#faf8ff'
  on-background: '#1a1b21'
  surface-variant: '#e3e1e9'
  bg-main: '#F8FAFC'
  text-primary: '#0F172A'
  text-secondary: '#64748B'
  success: '#10B981'
  warning: '#F59E0B'
  danger: '#EF4444'
  border-light: '#E2E8F0'
  dark-bg: '#0B0F19'
  dark-surface: '#1E293B'
  dark-text: '#F8FAFC'
  dark-border: '#334155'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

# EuroGrant AI - Design System

## Overview
EuroGrant AI is a premium B2B SaaS platform designed to automate the discovery and proposal drafting process for EU grants and public tenders. The design language must communicate trust, intelligence, efficiency, and modern sophistication. It should feel robust enough for enterprise use but intuitive enough for startups and SMEs.

## Typography
- **Primary Font**: `Inter` (Sans-serif) - Used for all primary UI elements, headings, and body text. Provides a clean, highly legible, and modern aesthetic.
- **Secondary/Monospace Font**: `Roboto Mono` - Used strictly for data tables, match scores, code snippets, or reference IDs where alignment and distinct characters are essential.

## Color Palette

### Light Mode
- **Primary (Brand)**: `#1E3A8A` (Deep Royal Blue) — Conveys institutionality, reliability, and trust.
- **Accent/Action**: `#2563EB` (Electric Blue) — Used for primary buttons, active states, and interactive links.
- **Background**: `#F8FAFC` (Slate 50) — A cool, crisp off-white for the main application background.
- **Surface**: `#FFFFFF` (White) — For cards, modals, and dropdowns.
- **Text (Primary)**: `#0F172A` (Slate 900) — High contrast for headings and main body text.
- **Text (Secondary)**: `#64748B` (Slate 500) — For supporting text, labels, and placeholders.
- **Success**: `#10B981` (Emerald) — For high match probabilities, successful generation, and approved statuses.
- **Warning**: `#F59E0B` (Amber) — For upcoming deadlines or missing profile data.
- **Danger**: `#EF4444` (Red) — For destructive actions or critical errors.

### Dark Mode (Optional/Secondary)
- **Primary (Brand)**: `#3B82F6` (Blue 500)
- **Background**: `#0B0F19` (Very Dark Slate) — A deep, premium dark background that reduces eye strain.
- **Surface**: `#1E293B` (Slate 800) — Elevated surfaces.
- **Text (Primary)**: `#F8FAFC` (Slate 50)
- **Borders**: `#334155` (Slate 700)

## Shapes & Geometry
- **Border Radius (Small)**: `4px` (0.25rem) — For inputs, checkboxes, and small badges.
- **Border Radius (Medium)**: `8px` (0.5rem) — For buttons, dropdowns, and standard UI components. Keeps a professional, structured B2B look without being overly playful.
- **Border Radius (Large)**: `12px` (0.75rem) — For large cards and modals.
- **Borders**: Subtle, using `1px solid #E2E8F0` (Light Mode) to delineate sections without heavy visual weight.

## Shadows & Elevation
Soft, diffused shadows to create a sense of hierarchy and depth.
- **Level 1 (Cards, Dropdowns)**: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`
- **Level 2 (Modals, Popovers)**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

## Layout & Spacing
- **Grid System**: Based on a standard `8px` scale (8, 16, 24, 32, 48, etc.).
- **Container Width**: Max width of `1280px` for dashboard views to ensure readability on large monitors.
- **Density**: "Comfortable" density. Ample whitespace is critical to reduce cognitive load when users are reviewing complex grant requirements and long-form AI-generated text.

## Animation & Interactions
- **Speed**: Snappy and responsive. Use `150ms ease-in-out` for hover states and transitions.
- **Hover Effects**: Buttons and cards should have a subtle upward translation (`transform: translateY(-2px)`) accompanied by a slight shadow increase.
- **Micro-animations**: Subtle pulsing effects for "Generating Proposal..." or "Matching Grants..." states to indicate AI processing without blocking the UI.
- **Glassmorphism**: Minimal use of blurred translucent backgrounds for sticky headers or floating action bars to add a modern touch without sacrificing performance.

## Core Components
- **Buttons**: Solid fill for primary actions. Ghost or outline styles for secondary actions.
- **Badges**: Pill-shaped with subtle background colors (e.g., light green background with dark green text for "High Match").
- **Cards**: Clean padding (`24px`), visible borders, and clear typographic hierarchy for Grant Summaries.
- **Navigation**: Sidebar layout preferred for the dashboard to allow quick switching between Grant Search, My Proposals, Company Profile, and Settings.
