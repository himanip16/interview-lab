# Design System Overview

**Purpose**: This document provides a comprehensive overview of the design system architecture for the AI System Design Interviewer application. It serves as the main entry point for understanding how the design system is organized and how to use it effectively.

---

## Table of Contents
1. [Architecture](#architecture)
2. [Token System](#token-system)
3. [Component System](#component-system)
4. [Motion System](#motion-system)
5. [Page Shells](#page-shells)
6. [Category Colors](#category-colors)
7. [Quick Start](#quick-start)
8. [Documentation Links](#documentation-links)

---

## Architecture

The design system is organized into three layers:

### Layer 1: Tokens
**Location**: `/src/styles/design-tokens.css`
- Primitive tokens (raw values)
- Semantic tokens (meaning in context)
- Category tokens (content type identities)

### Layer 2: Components
**Location**: `/src/components/ui/`
- **Primitives**: Dumb, presentation-only components
- **Patterns**: Composed, reusable components
- **Shells**: Page layout components

### Layer 3: Governance
**Location**: Root directory
- Category registry
- Governance rules
- Code review checklist

---

## Token System

### Three-Tier Hierarchy

**Tier 1: Primitive Tokens** (raw values, never use directly)
```css
--primitive-white: #ffffff
--primitive-coral: #FF5A3C
--primitive-radius-panel: 32px
```

**Tier 2: Semantic Tokens** (what the value means)
```css
--surface-page: var(--primitive-off-white)
--text-primary: var(--primitive-near-black)
--radius-panel: var(--primitive-radius-panel)
```

**Tier 3: Category Tokens** (content type identities)
```css
--category-practice: var(--primitive-coral)
--category-learn: var(--primitive-mint)
--category-live: var(--primitive-amber)
```

### Usage Rules
- ✅ Components reference semantic or category tokens
- ❌ Never use primitive tokens directly
- ❌ Never use hex colors inline
- ❌ Never use arbitrary radius values

---

## Component System

### Three Tiers

#### Primitives (Dumb, Presentation-Only)
**Location**: `/src/components/ui/primitives/`
- `Panel` - Rounded white panel
- `IconCircle` - Circular button with optional breathing ring
- `Pill` - Pill-shaped button for filters/tags
- `StatusBadge` - Status indicator with pulsing dot
- `Button` - Standard button (existing)
- `Avatar` - User avatar (existing)
- `Divider` - Visual separator (existing)
- `Tag` - Small tag component (existing)

**Characteristics**:
- No business logic
- Map 1:1 to visual shapes
- Use semantic tokens for all visual properties
- Never redefine radius, shadow, or color inline

#### Patterns (Composed, Reusable)
**Location**: `/src/components/ui/patterns/`
- `AnimatedRing` - Breathing aura wrapper
- `StatusBadge` - Status with pulse (also in primitives)
- `FilterBar` - Filter controls with pills
- `Stepper` - Phase/step tracker
- `Timeline` - Deploy history (existing)
- `Inspector` - Detail drawer pattern (in layout/)

**Characteristics**:
- Composed from Primitives
- Generic across features
- Import from Primitives only
- Reusable interaction patterns

#### Features (Page-Specific)
**Location**: Feature directories
- `BugHuntingWorkspace`
- `LiveInterviewSession`
- `TranscriptViewer`
- `ProblemLibrary`

**Characteristics**:
- Import from Patterns and Primitives only
- Business logic lives here
- Page-specific compositions
- If new visual shape needed → add a Pattern first

---

## Motion System

### Four Animation Moods

**Location**: `/src/styles/motion-system.css`

#### 1. Breathe
- **Usage**: Ring pulse behind circular buttons/timers
- **Signals**: "this is active/live/attend to me"
- **Rule**: Max one breathing element per screen
- **CSS**: `.animate-breathe`, `.breathe-ring`

#### 2. Float
- **Usage**: Icon bob on cards, hero illustrations
- **Signals**: Decorative warmth
- **Rule**: Never on more than one element cluster at a time
- **CSS**: `.animate-float`

#### 3. Pulse
- **Usage**: Small dot status/liveness indicator
- **Signals**: Status/liveness
- **Rule**: Always paired with text label (accessibility)
- **CSS**: `.animate-pulse`, `.pulse-dot`

#### 4. Flow
- **Usage**: Dashed line animation on connectors
- **Signals**: Data/relationship movement
- **Rule**: Only in diagrams
- **CSS**: `.animate-flow`, `.flow-line`

### Usage Rules
- ✅ Only use these four animations
- ❌ No custom @keyframes in feature files
- ❌ No fifth "cute" animation per feature
- ✅ Max one breathing element per screen
- ✅ Pulse always paired with text label

---

## Page Shells

### Four Page Shells

**Location**: `/src/components/layout/shells/`

#### 1. Panel-Detail Shell
- **Usage**: Big white rounded panel, breadcrumb top-left
- **For**: Bug hunting, card detail, whiteboarding, problem library
- **Component**: `PanelDetailShell`

```tsx
<PanelDetailShell maxWidth="lg" breadcrumb={<Breadcrumb />}>
  <YourContent />
</PanelDetailShell>
```

#### 2. Immersive/Hero Shell
- **Usage**: Full-bleed gradient background, no panel
- **For**: Discovery/landing moments (rare)
- **Component**: `ImmersiveShell`

```tsx
<ImmersiveShell gradient="linear-gradient(...)">
  <YourHeroContent />
</ImmersiveShell>
```

#### 3. Reading Shell
- **Usage**: Narrow centered column, progress bar
- **For**: Articles, transcripts, long-form content
- **Component**: `ReadingShell`

```tsx
<ReadingShell maxWidth="md" showProgress progress={45}>
  <YourArticle />
</ReadingShell>
```

#### 4. Workspace Shell
- **Usage**: Panel with internal split (sidebar + main)
- **For**: Bug hunting, live-interview
- **Component**: `WorkspaceShell`

```tsx
<WorkspaceShell sidebarWidth={260} sidebarPosition="right">
  <WorkspaceShell.Main>
    <YourMainContent />
  </WorkspaceShell.Main>
  <WorkspaceShell.Sidebar>
    <YourSidebar />
  </WorkspaceShell.Sidebar>
</WorkspaceShell>
```

### Shell Selection Guide
- **Panel-detail**: Most common, standard content pages
- **Immersive**: Rare, only for special landing moments
- **Reading**: Long-form consumption
- **Workspace**: Split layouts with sidebars

---

## Category Colors

### Seven Category Identities

**Location**: `DESIGN_SYSTEM_CATEGORY_REGISTRY.md`

| Category | Color | Use Cases |
|----------|-------|-----------|
| **coral** | `#FF5A3C` | Practice/bugs, alerts, warnings |
| **mint** | `#00D9A3` | Learn/success, completion, positive |
| **amber** | `#f59e0b` | Live/active, in-progress, timers |
| **violet** | `#6A5AE0` | Conceptual/deep-dive, documentation |
| **blue** | `#3E6BFF` | Information, neutral states |
| **pink** | `#FF4D93` | Social, community features |
| **dark** | `#15161C` | Neutral, infrastructure, databases |

### Usage Rules
- ✅ Color always answers "what kind of thing is this?"
- ✅ Reference category CSS variables
- ❌ Never pick colors because they "look nice"
- ❌ Never invent new gradients inline
- ✅ New categories require team approval

### CSS Variables
```css
/* Primary color */
--category-practice: var(--primitive-coral)

/* Deep color */
--category-practice-deep: var(--primitive-coral-dark)

/* Background tint */
--category-practice-bg: rgba(255, 90, 60, 0.1)
```

---

## Quick Start

### For New Components

1. **Check existing Primitives** - don't reinvent the wheel
2. **Use semantic tokens** - no hex colors or arbitrary values
3. **Reference category tokens** - for content-type colors
4. **Use motion system** - only the four animation moods
5. **Import from design system** - not from other features

### For New Pages

1. **Choose a shell** - one of the four page shells
2. **Use Primitives** - for visual elements
3. **Use Patterns** - for interaction patterns
4. **Use Inspector** - for detail panels
5. **Follow governance** - code review checklist

### For Existing Code Migration

1. **Replace hex colors** with category/semantic tokens
2. **Replace arbitrary radius** with radius tokens
3. **Replace custom divs** with Primitive components
4. **Replace repeated patterns** with Pattern components
5. **Replace custom layouts** with Shell components

---

## Documentation Links

### Core Documentation
- **Token System**: `/src/styles/design-tokens.css`
- **Motion System**: `/src/styles/motion-system.css`
- **Category Registry**: `DESIGN_SYSTEM_CATEGORY_REGISTRY.md`
- **Governance**: `DESIGN_SYSTEM_GOVERNANCE.md`
- **Design Spec**: `DESIGN_SPECIFICATION.md`

### Component Documentation
- **Primitives**: `/src/components/ui/primitives/`
- **Patterns**: `/src/components/ui/patterns/`
- **Shells**: `/src/components/layout/shells/`
- **Inspector**: `/src/components/layout/Inspector.tsx`

### Governance
- **Code Review Checklist**: See `DESIGN_SYSTEM_GOVERNANCE.md`
- **Lint Rules**: See `DESIGN_SYSTEM_GOVERNANCE.md`
- **Category Process**: See `DESIGN_SYSTEM_CATEGORY_REGISTRY.md`

---

## Design Principles

### 1. Consistency Over Customization
- Use existing components before creating new ones
- Follow the token hierarchy strictly
- Use the four shells for all pages

### 2. Meaning Over Aesthetics
- Category colors answer "what kind of thing is this?"
- Motion signals intent, not decoration
- Status is always color + text + icon

### 3. Accessibility First
- 4.5:1 contrast ratio for text
- Pulse always paired with text label
- Focus states on all interactive elements

### 4. Progressive Enhancement
- Start with the shell
- Add primitives for visual elements
- Add patterns for interactions
- Add business logic in features

---

## Common Patterns

### Status Indicator
```tsx
<StatusBadge status="live" label="Live" showPulse />
```

### Filter Bar
```tsx
<FilterBar
  label="Difficulty"
  options={[
    { label: 'Easy', value: 'easy', category: 'learn' },
    { label: 'Hard', value: 'hard', category: 'practice' }
  ]}
  activeValue="easy"
  onChange={setActive}
/>
```

### Circular Button with Breathing Ring
```tsx
<IconCircle variant="ghost" size="md" showBreathingRing>
  <CloseIcon />
</IconCircle>
```

### Inspector Panel
```tsx
<Inspector
  title="Load Balancer"
  kind="Gateway"
  category="neutral"
  blocks={[
    { label: 'Role', content: 'Distributes traffic...' },
    { label: 'Deep dive', content: 'Round-robin algorithm...' }
  ]}
/>
```

### Stepper
```tsx
<Stepper
  steps={[
    { id: '1', label: 'Requirements', status: 'done' },
    { id: '2', label: 'Design', status: 'active' },
    { id: '3', label: 'Implementation', status: 'upcoming' }
  ]}
/>
```

---

## Troubleshooting

### "I need a new color"
1. Check the category registry - does an existing category fit?
2. If yes, use that category token
3. If no, follow the category addition process in the registry

### "I need a new animation"
1. Check the motion system - do the four moods cover your use case?
2. If yes, use that animation
3. If no, follow the motion addition process in governance

### "I need a new component"
1. Check Primitives - is there a dumb component for this shape?
2. Check Patterns - is there a composed component for this interaction?
3. If neither exists, determine if it's a Primitive or Pattern
4. Follow the component addition process in governance

### "I need a new page layout"
1. Check the four shells - does one fit your use case?
2. If yes, use that shell
3. If no, follow the shell addition process in governance

---

## Success Metrics

The design system is successful when:

- **Zero hex colors** in feature files
- **Zero arbitrary radius** values
- **Zero custom @keyframes** in feature files
- **100% shell usage** for all pages
- **100% primitive usage** for repeated shapes
- **Zero category drift** (colors match content type)
- **One live signal** per screen (max one breathing element)

---

## Getting Help

### Design System Questions
- Check this overview document
- Check the specific documentation links
- Check the governance document
- Ask the design system owner

### Implementation Questions
- Check component JSDoc comments
- Check the design specification
- Check existing usage in the codebase
- Ask the team in code review

---

**Last Updated**: 2026-07-20
**Version**: 1.0
**Maintained By**: Design System Owner
