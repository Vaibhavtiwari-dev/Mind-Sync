---
name: Aetheric High-Tech
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3c3742'
  surface-container-lowest: '#100d16'
  surface-container-low: '#1e1a24'
  surface-container: '#221e28'
  surface-container-high: '#2c2833'
  surface-container-highest: '#37333e'
  on-surface: '#e8dfee'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e8dfee'
  inverse-on-surface: '#332e39'
  outline: '#968da1'
  outline-variant: '#4a4455'
  surface-tint: '#d3bbff'
  primary: '#d3bbff'
  on-primary: '#40008d'
  primary-container: '#8a49f8'
  on-primary-container: '#fef7ff'
  inverse-primary: '#752ee2'
  secondary: '#ffb0ca'
  on-secondary: '#640036'
  secondary-container: '#a2035b'
  on-secondary-container: '#ffb0ca'
  tertiary: '#adc6ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#1c6ee1'
  on-tertiary-container: '#f9f8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ebddff'
  primary-fixed-dim: '#d3bbff'
  on-primary-fixed: '#260059'
  on-primary-fixed-variant: '#5b00c4'
  secondary-fixed: '#ffd9e3'
  secondary-fixed-dim: '#ffb0ca'
  on-secondary-fixed: '#3e001f'
  on-secondary-fixed-variant: '#8d004e'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#15121b'
  on-background: '#e8dfee'
  surface-variant: '#37333e'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  stat-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  sidebar-primary: 280px
  sidebar-secondary: 80px
  gutter: 32px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
This design system embodies a "Future Tech" aesthetic that balances high-end luxury with cutting-edge performance. Targeted at elite users seeking peak cognitive performance, the UI evokes a sense of "Royal Intelligence"—authoritative, sophisticated, and infinitely capable.

The style is a refined **Glassmorphism**, characterized by deep spatial layering, ultra-refined backdrop blurs, and luminous accents. We leverage gradient meshes to simulate organic, fluid movement within the background, creating a living interface that feels responsive to the user's presence. Every element is treated as a high-fidelity artifact, combining the weight of premium materials with the ethereal nature of light-based interfaces.

## Colors
The palette is rooted in a "Void Black" foundation, allowing the HSL-defined brand gradients to pierce through with maximum vibrance.

- **Primary Gradient:** A tri-tone sweep from Brand Purple `hsl(262, 83%, 58%)` through Brand Pink `hsl(330, 81%, 60%)` to Brand Blue `hsl(217, 91%, 60%)`. Use this for high-impact actions and data visualizations.
- **Glass Surfaces:** Use `rgba(15, 15, 25, 0.6)` for containers, paired with a `20px` to `40px` backdrop-blur.
- **Luminous Glow:** A soft atmospheric glow `hsla(262, 83%, 58%, 0.15)` is applied to active states, focus rings, and secondary borders to simulate light emission.

## Typography
The system uses **Inter** for its neutral, highly legible character, allowing the brand's expressive gradients to take center stage without typographic competition. For technical data, timestamps, and performance metrics, **JetBrains Mono** is employed to provide a precise, "engineered" feel.

Large display headings should utilize the brand gradient via `background-clip: text`. Maintain tight letter spacing on larger headings to reinforce the "Premium" and "Futuristic" density.

## Layout & Spacing
The layout follows a fluid-fixed hybrid model. High-intensity dashboards utilize a **dual-pane sidebar** (a slim iconic navigation alongside a contextual expansion pane). 

- **Whitespace:** Use expansive 64px+ margins for hero sections to evoke a sense of "Royal" scale.
- **Grid:** A 12-column system with a 32px gutter.
- **Breakpoints:** 
  - Mobile (<768px): Single column, reduced margins.
  - Tablet (768px - 1280px): Collapsed secondary sidebar.
  - Desktop (>1280px): Full dual-pane visibility with fixed-width container maxing at 1440px.

## Elevation & Depth
Depth is not achieved through traditional drop shadows, but through **translucency and refraction**.

1.  **Base Layer:** Background mesh gradients (animated, low-frequency movement).
2.  **Surface Layer:** `backdrop-filter: blur(24px)` with a `1px` semi-transparent border `rgba(255,255,255,0.1)`.
3.  **Raised Layer:** Used for active cards. Includes a `y: -8px` hover-lift and a secondary "inner-glow" border using the Primary Gradient at 30% opacity.
4.  **Overlay Layer:** Modals and tooltips utilize a higher blur (40px) and a subtle drop shadow `rgba(0,0,0,0.5)` to separate from the blurred background.

## Shapes
The shape language is sophisticated and modern. A consistent **0.5rem (8px)** base radius is used for standard components, while cards and primary containers use **1rem (16px)** to feel more substantial. 

Interactive elements like chips and primary buttons use the **rounded-xl (1.5rem)** setting to provide a softer, more inviting touchpoint against the sharp, technical layout.

## Components

- **Buttons:** Primary buttons feature a full Brand Gradient background. Secondary buttons use a "Ghost" style with a gradient border and a 5% white fill on hover. All buttons include a subtle `0 0 15px` outer glow in the primary brand color when hovered.
- **Glass Cards:** Must include a `1px` top-down linear gradient border (white to transparent) to simulate a "light catch" on the top edge.
- **Input Fields:** Semi-transparent dark fills. On focus, the border transitions to a Brand Purple glow, and the label (using JetBrains Mono) shifts to a gradient-text color.
- **Chips/Badges:** High-contrast backgrounds with JetBrains Mono text. Use status colors (Emerald, Amber, Rose) with 10% opacity fills and 100% opacity borders.
- **Lists:** Items should be separated by `1px` low-opacity lines. Hover states trigger a subtle horizontal slide (+4px) and a background tint change.
- **Progress Indicators:** Use the Primary Gradient for the fill, with a "pulsing" glow animation at the leading edge to indicate movement and life.