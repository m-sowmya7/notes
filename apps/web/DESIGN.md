---
name: Notes Workspace
description: Premium, playful, task-first planning workspace for daily note and board collaboration.
colors:
  primary-olive: "#A18D6D"
  accent-moss: "#CCD67F"
  accent-orchid: "#C8AAAA"
  canvas-warm: "#F6F3EF"
  sidebar-surface: "#F8F5F1"
  paper-surface: "#FFFFFF"
  ink-strong: "#1F1F1F"
  ink-soft: "#2C241D"
  stroke-neutral: "#E5E7EB"
  focus-plum: "#A37575"
typography:
  display:
    fontFamily: "Newsreader, serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.04em"
  heading-xl:
    fontFamily: "Newsreader, serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  heading-lg:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading-md:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  body-sm:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  hero: "28px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary-olive}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.lg}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.primary-olive}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.lg}"
    padding: "14px 22px"
  input-search:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  nav-item-active:
    backgroundColor: "{colors.accent-orchid}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  card-surface:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.2xl}"
    padding: "20px 24px"
---

# Design System: Notes Workspace

## 1. Overview

**Creative North Star: "The Focus Atelier"**

This system is a calm productivity studio: premium whitespace, restrained ornament, and task-first hierarchy. The visual language balances Apple-like composure with Notion-like workflow familiarity, so navigation, creation, and collaboration feel immediate instead of theatrical.

The interface should read clean at first glance, then reveal playful character in controlled places (micro-copy tone, gentle color moments, subtle state transitions). Density is intentional but never cramped; every surface should help users move from "what am I working on?" to "done" with minimal friction.

**Key Characteristics:**
- Quiet premium framing with warm neutrals and sharp information hierarchy
- Familiar productivity affordances (sidebar, list/table-like rows, sticky toolbar)
- Subtle playful notes without sacrificing clarity or speed
- State-forward interaction language (focus, active, syncing, online/offline)

## 2. Colors

A warm-neutral base supports focused reading while olive/moss accents mark actions and state.

### Primary
- **Moss Anchor** (`#A18D6D`): Primary call-to-action color for creation and forward movement (hero CTA, key action buttons).

### Secondary
- **Soft Herb** (`#CCD67F`): Support accent for constructive actions (new-page, positive utility actions) where less authority than primary is needed.

### Tertiary
- **Orchid Tint** (`#C8AAAA`): Selection and active-background signal, used with low opacity to avoid stealing hierarchy.

### Neutral
- **Warm Canvas** (`#F6F3EF`): Main workspace background for long-session comfort.
- **Sidebar Linen** (`#F8F5F1`): Secondary neutral layer to separate navigation chrome from content.
- **Paper Surface** (`#FFFFFF`): Cards, menus, modals, and elevated controls.
- **Graphite Ink** (`#1F1F1F`): Primary readable text and headings.
- **Cocoa Ink** (`#2C241D`): Hero copy and warm editorial moments.
- **Quiet Stroke** (`#E5E7EB`): Borders, separators, and control outlines.

**The Accent Scarcity Rule.** Accent hues are reserved for action and state. Decorative accent flooding is prohibited.

## 3. Typography

### Philosophy

Typography is designed for focused desktop work where reading, writing, and organization are the primary tasks. It is the foundation of the interface and should create hierarchy before color, borders, or decoration.

The system follows a simple principle: **reading comfort always takes priority over visual expression.** Personality belongs to the brand and marketing experience, while the product interface remains calm, highly readable, and consistent.

### Principles

| Principle | Guideline |
|-----------|-----------|
| Reading First | If aesthetics and readability conflict, readability wins. |
| One Product Font | The application uses a single sans-serif family to maintain consistency and reduce cognitive load. |
| Display with Restraint | The display font is reserved for branding, marketing, and editorial moments only. |
| Weight Before Size | Prefer changing weight before introducing another font size. |
| Whitespace Creates Hierarchy | Separate information with spacing before using decoration. |
| Desktop First | Typography is optimized for large desktop displays and long work sessions. |

### Font Stack

| Role | Font | Weights | Usage | Fallback |
|------|------|---------|-------|----------|
| Display | **Newsreader Variable** | 500–800 | Landing hero, marketing headlines, feature sections, editorial callouts | `serif` |
| Product | **Geist Variable** | 400–700 | Entire application UI, notes, navigation, forms, tables, dialogs | `system-ui, sans-serif` |
| Mono | Reserved | — | Introduce only when Markdown / Code Blocks are supported | `monospace` |

#### Usage Rules

**Newsreader** — use only for:
- Landing page hero
- Marketing section headings
- Feature callouts
- About page
- Editorial moments

Do **not** use inside the application interface.

**Geist** — use for:
- Dashboard, sidebar, navigation
- Notes, paragraphs, lists
- Forms, dialogs, tables, cards
- Buttons, settings, empty states

### Semantic Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|-----:|-------:|------------:|---------------:|------|
| `display` | Newsreader | 72px | 700 | 1.0 | -0.04em | Landing hero only |
| `heading-xl` | Newsreader | 48px | 700 | 1.1 | -0.03em | Marketing sections |
| `heading-lg` | Geist | 36px | 700 | 1.15 | -0.02em | Dashboard & page titles |
| `heading-md` | Geist | 30px | 600 | 1.2 | -0.015em | Section headings |
| `title` | Geist | 24px | 600 | 1.3 | -0.01em | Cards, dialogs, panels |
| `body-lg` | Geist | 18px | 400 | 1.65 | 0 | Intro paragraphs |
| `body` | Geist | 16px | 400 | 1.6 | 0 | Notes, paragraphs, lists |
| `body-sm` | Geist | 14px | 400 | 1.5 | 0 | Sidebar, tables, dense UI |
| `label` | Geist | 14px | 500 | 1.4 | 0 | Buttons, navigation, inputs |
| `caption` | Geist | 12px | 500 | 1.4 | 0.02em | Metadata, timestamps, helper text |

### Font Weights

| Weight | Usage |
|--------:|------|
| **400** | Body copy, notes, paragraphs |
| **500** | Buttons, labels, navigation, metadata |
| **600** | Titles, dialogs, cards |
| **700** | Display and headings |

Use the minimum number of weights necessary. Prefer **400 → 500 → 600 → 700**.

### Reading Rhythm

| Property | Value |
|----------|------|
| Reading Width | 65–75ch |
| Body Line Height | 1.6 |
| Large Body | 1.65 |
| Headings | 1.1–1.2 |
| Labels | 1.4 |
| Paragraph Gap | 1em |
| List Gap | 0.4em |
| Section Gap | 1.5–2em |

Long-form notes should prioritize comfortable reading over dense information display.

### Letter Spacing

| Usage | Tracking |
|--------|---------|
| Display | -0.04em |
| Large Heading | -0.03em |
| Heading | -0.02em |
| Title | -0.01em |
| Body | 0 |
| Label | 0 |
| Caption | +0.02em |

Apply negative tracking only to large display typography.

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (Primary) | Full typography scale |
| Large Displays | Increase whitespace before increasing font size |
| Tablet | Reduce display and heading sizes one level while preserving body size |
| Mobile | Out of scope for Version 1 |

Typography decisions should always optimize for desktop-first productivity.

### Component Mapping

| Component | Token | Font |
|-----------|-------|------|
| Landing Hero | `display` | Newsreader |
| Marketing Section | `heading-xl` | Newsreader |
| Dashboard Title | `heading-lg` | Geist |
| Page Heading | `heading-md` | Geist |
| Card Title | `title` | Geist |
| Notes | `body` | Geist |
| Paragraph | `body` | Geist |
| Sidebar | `body-sm` | Geist |
| Navigation | `label` | Geist |
| Buttons | `label` | Geist |
| Inputs | `body` | Geist |
| Tables | `body-sm` | Geist |
| Dialogs | `body` | Geist |
| Empty State Title | `title` | Geist |
| Metadata | `caption` | Geist |

### Typography Accessibility

| Rule | Requirement |
|------|-------------|
| Minimum Body Size | 16px |
| Minimum UI Text | 14px |
| Minimum Caption | 12px |
| Contrast | WCAG 2.1 AA |
| Zoom Support | Up to 200% browser zoom |
| Font Loading | `font-display: swap` |

### Typography Do

- Use Newsreader only for branding and marketing.
- Use Geist for every application surface.
- Create hierarchy through weight before increasing font size.
- Maintain a comfortable reading rhythm for long-form content.
- Keep body text at **16px** for primary reading experiences.
- Use whitespace before introducing decorative styling.

### Typography Don't

- Don't introduce additional font families.
- Don't use Newsreader inside the application UI.
- Don't rely on color alone to create hierarchy.
- Don't reduce body text below **16px**.
- Don't create component-specific typography outside the semantic scale.
- Don't introduce new typography tokens without a clear product need.

## 4. Elevation

Depth is soft-layered: flat and readable by default, with elevation used to separate overlays (menus/modals) and to reinforce interaction readiness on actionable controls.

### Shadow Vocabulary
- **Ambient Lift** (`0 10px 30px rgba(0,0,0,0.12)`): Menus and modal containers.
- **Action Glow** (`0 22px 36px rgba(247,241,222,1)`): Primary action emphasis on hover-capable surfaces.
- **Soft Inset Edge** (`inset 0 1px 0 rgba(255,255,255,0.75)`): Polished icon/brand containers.

**The Flat-At-Rest Rule.** Content surfaces stay mostly flat at rest; lift appears as a state signal, not decoration.

## 5. Components

### Buttons
- **Shape:** Rounded but compact (`8px` for primary, `6px` for utility).
- **Primary:** Moss background (`#A18D6D`) with white text, medium-strong padding (`14px 22px`), bold label.
- **Hover / Focus:** Slight lift/brightness on hover; focus uses explicit plum outline (`#A37575`).
- **Secondary Utility:** Moss-light (`#CCD67F`) for constructive secondary actions.

### Cards / Containers
- **Corner Style:** Soft large rounding (`16px` to `28px` depending on surface importance).
- **Background:** Mostly white paper surfaces against warm canvas.
- **Shadow Strategy:** Minimal by default, stronger for overlays.
- **Internal Padding:** Comfortable medium-large spacing (`20px` to `40px`) to preserve premium whitespace.

### Inputs / Fields
- **Style:** White background, neutral border, rounded-xl (`12px`) shape.
- **Focus:** Border/ring reinforcement, never relying on placeholder color alone.
- **Error / Disabled:** Reduced emphasis through opacity and muted text while preserving contrast targets.

### Navigation
- **Style:** Sidebar layer on linen neutral, icon+label rows with rounded-xl hit areas.
- **States:** Hover uses neutral tint; active uses low-opacity orchid tint with stronger text contrast.
- **Density:** Compact enough for speed, with enough vertical rhythm to avoid visual noise.

### Modals
- **Style:** Centered elevated surfaces with high radius (`16px` to `32px`) and softened backdrops.
- **Behavior:** Clear single-dismiss affordance plus outside-click support where appropriate.

## 6. Do's and Don'ts

### Do:
- **Do** keep warm-neutral scaffolding consistent (`#F6F3EF`, `#F8F5F1`, `#FFFFFF`) and let hierarchy come from spacing and weight.
- **Do** use accent colors primarily for actions and state transitions, not decorative blocks.
- **Do** keep core workflows keyboard-friendly with visible focus states and AA-level readable contrast.
- **Do** preserve the premium + playful balance through subtle microinteractions, not large visual theatrics.

### Don't:
- **Don't** ship generic AI-template aesthetics (predictable palettes, repetitive card scaffolds, overused visual tropes).
- **Don't** use overly loud, cluttered UI patterns that reduce scanability and task speed.
- **Don't** add decorative style choices that weaken information hierarchy.
- **Don't** introduce side-stripe accent borders, gradient text, or decorative glassmorphism as default patterns.