---
name: Emerald & Copper B2B
colors:
  surface: '#111412'
  surface-dim: '#111412'
  surface-bright: '#373a38'
  surface-container-lowest: '#0c0f0d'
  surface-container-low: '#191c1b'
  surface-container: '#1d201e'
  surface-container-high: '#272b29'
  surface-container-highest: '#323533'
  on-surface: '#e1e3e0'
  on-surface-variant: '#bfc9c3'
  inverse-surface: '#e1e3e0'
  inverse-on-surface: '#2e312f'
  outline: '#89938d'
  outline-variant: '#404944'
  surface-tint: '#95d3ba'
  primary: '#95d3ba'
  on-primary: '#003829'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#2b6954'
  secondary: '#ffb68e'
  on-secondary: '#532200'
  secondary-container: '#ab4c00'
  on-secondary-container: '#ffe2d5'
  tertiary: '#ffb77d'
  on-tertiary: '#4d2600'
  tertiary-container: '#6a3700'
  on-tertiary-container: '#ff9939'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#111412'
  on-background: '#e1e3e0'
  surface-variant: '#323533'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
This design system is built for elite B2B SaaS platforms that prioritize authority, longevity, and artisanal precision. The personality is "The Modern Atelier"—combining the heritage of high-end finance with the efficiency of cutting-edge technology. It moves away from the ephemeral "AI Blue" aesthetics toward a timeless, grounded palette that evokes the stability of emerald and the industrial warmth of copper.

The design style is **Corporate Modern with Tactile Minimalism**. It utilizes deep tonal layering and subtle metallic accents to create a sense of physical presence and exclusivity. Every interaction should feel intentional and high-stakes, appealing to executives and power users who value clarity over clutter.

## Colors
The color palette is anchored in **Emerald Green (#064e3b)**, representing growth and sophisticated stability. This is contrasted against a backdrop of **Dark Forest Green (#022c22)** and **Charcoal (#111827)** to provide a canvas that feels expansive yet focused.

**Metallic Copper (#b45309)** is used for primary calls to action and critical interactive states, providing a warm, high-contrast focal point. **Warm Gold (#d97706)** serves as a secondary accent for success states, premium features, and data highlights. All backgrounds should maintain a dark luminosity to ensure the emerald and copper tones appear illuminated rather than flat.

## Typography
This design system utilizes **Inter** across all roles to maintain a clean, systematic, and utilitarian feel that offsets the richness of the color palette. 

Headlines utilize tighter letter spacing and heavier weights to command attention. Body text is optimized for readability against dark backgrounds, using a slightly increased line height (1.5x) to prevent ocular fatigue. Labels and captions use medium to semi-bold weights with subtle tracking (0.02em - 0.05em) to ensure hierarchy is maintained even at small scales. On mobile devices, the `display` and `headline-lg` styles scale down to ensure content remains the primary focus without excessive scrolling.

## Layout & Spacing
The design system employs a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. The spacing rhythm is based on a strict **8px base unit**, ensuring mathematical harmony across all components.

Desktop layouts utilize generous "Safe Zones" (64px margins) to create an airy, premium feel, while content cards are separated by 24px gutters. For data-heavy SaaS views, a "compact" mode is available where internal padding is reduced to 4px (xs) and 12px (sm), but the global margins remain consistent to preserve the brand’s high-end spatial identity.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. In a dark forest green environment, depth is achieved by "lifting" surfaces with subtle increases in luminosity.

1.  **Base Layer:** Dark Forest Green (#022c22).
2.  **Surface Layer:** Emerald-tinted Charcoal with a 1px border (#ffffff10).
3.  **Overlay Layer:** Use a subtle backdrop blur (8px) and a slightly brighter emerald stroke to indicate modals or floating menus.

Shadows, when used, are tinted with the primary Emerald Green (e.g., `rgba(6, 78, 59, 0.4)`) and are highly diffused to mimic ambient light rather than direct overhead light.

## Shapes
A refined **8px corner radius** (level 2) is the standard for all primary UI elements, including buttons, input fields, and cards. This radius provides a perfect balance between the precision of a sharp edge and the approachability of a rounded one. 

- **Small Components (Chips/Badges):** Use 4px (Soft) to maintain structural integrity at small scales.
- **Large Containers:** Use 16px (rounded-lg) for outer containers to create a "nested" visual effect when 8px components are placed inside.
- **Iconography:** Should follow the 8px philosophy, using "squircle" containers or rounded terminals to match the UI.

## Components
- **Buttons:** Primary buttons use a solid Metallic Copper (#b45309) background with white text. Secondary buttons use an Emerald Green stroke with an almost-black green background. Interaction states should involve a subtle "gold" glow on hover.
- **Input Fields:** Use the Charcoal background with a 1px Emerald stroke. On focus, the stroke transitions to Copper with a 2px outer glow.
- **Cards:** Cards should not have shadows. Instead, use a subtle gradient from Forest Green to Charcoal and a 1px border to define the edge.
- **Chips & Status:** Success states use Warm Gold (#d97706) text on a transparent gold-tinted background. This departs from standard green success indicators to align with the premium brand palette.
- **Data Visualization:** Charts should utilize a monochromatic Emerald scale with Copper used exclusively for the most important data point (the "North Star" metric).
- **Navigation:** A persistent sidebar in deep Charcoal with high-contrast Emerald icons ensures the user always feels grounded within the platform architecture.