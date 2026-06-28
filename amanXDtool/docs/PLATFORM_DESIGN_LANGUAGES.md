# Platform Design Languages

Use this when the user asks for Google, Android, Material, iOS, Apple, iPhone, iPad, or native mobile styling.

Official references:

- Google Material Design 3: https://m3.material.io/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines

Do not copy platform apps exactly. Use the design language principles to make interfaces feel native and familiar.

## Choose Platform Style

- Android, Google, Pixel, Material, Material You: use Material 3 / Android style.
- iOS, Apple, iPhone, iPad: use iOS Human Interface style.
- Mobile app but no platform: ask Android, iOS, or cross-platform. If the user says use your judgement, choose cross-platform.
- Web app: use platform-neutral web style unless the user asks for Google or Apple influence.

## Material 3 / Android

Design traits:

- Adaptive color system with primary, secondary, surface, and container colors.
- Rounded containers, clear touch targets, and visible active states.
- Cards, chips, search bars, bottom navigation, navigation rails, top app bars, and floating action buttons when appropriate.
- Expressive hierarchy through color, shape, size, and spacing.
- Touch-first spacing using an 8dp rhythm.

Recommended tokens:

- Font: Roboto, Inter, or clean geometric sans.
- Radius: 12 for controls, 16 for cards, 24-28 for large containers.
- Touch targets: 48px minimum.
- Buttons: filled primary, tonal secondary, outlined tertiary.
- Cards: surface/container color, subtle outline or elevation.

Avoid:

- Tiny tap targets.
- Random shadows without hierarchy.
- iOS-only patterns in Android-specific designs.

## iOS / Apple HIG

Design traits:

- Clarity: readable text, precise controls, obvious hierarchy.
- Deference: UI supports content instead of overpowering it.
- Depth: layered surfaces, sheets, cards, and navigation imply structure.
- Large navigation titles, tab bars, grouped lists, segmented controls, search fields, and sheets when appropriate.
- Generous spacing, subtle separators, and restrained decoration.

Recommended tokens:

- Font: SF Pro when available; otherwise Inter.
- Radius: 10-14 for controls, 16-22 for cards/sheets.
- Touch targets: 44px minimum.
- Buttons: clear text buttons, filled capsule CTAs, destructive color only for destructive actions.
- Lists: grouped rows with subtle separators and section labels.

Avoid:

- Heavy Android-style FAB unless requested.
- Excessive shadows or loud container color.
- Dense dashboard UI on small iPhone screens unless it is a pro app.

## Cross-Platform Mobile

Use when the design should work for both Android and iOS.

- Blend Material component clarity with iOS restraint.
- Use neutral top header + bottom nav for consumer apps.
- Use search, chips, cards, and lists with 44-48px minimum touch areas.
- Radius: 14-20.
- Avoid platform-exclusive patterns unless useful.

## Web With Platform Influence

Google-inspired web:

- Search-first flows, clean surfaces, helpful empty states, color-coded chips, structured cards.

Apple-inspired web:

- Large confident typography, premium imagery, generous spacing, subtle layered sections.

## Agent Checklist

Before creating:

- State the platform language in the plan.
- Use matching navigation patterns.
- Use matching controls and component sizing.
- Use matching radius, spacing, and touch target scale.
- Avoid mixing platform-specific patterns unless using cross-platform style.
