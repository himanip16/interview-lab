# Design System Governance

**Purpose**: This document establishes the governance mechanisms that keep the design system consistent as the application grows. These rules and processes ensure that tokens, components, and patterns stay honest and don't drift over time.

---

## 1. Style Guide Reference

The single source of truth for the design system is the living style guide. All contributors should reference this before writing new CSS or components.

### Style Guide Location
- **Internal**: `/src/app/style-guide` (route within the app)
- **External**: Storybook (when implemented)

### Style Guide Contents
The style guide must show:
- All Primitive components with their variants
- All Pattern components with their use cases
- All Category tokens with their mappings
- All Motion animations with their usage rules
- All Page shells with their examples

### Before Writing New CSS
1. Check the style guide for an existing component
2. Check the category registry for an appropriate color
3. Check the motion system for an appropriate animation
4. Only create new tokens/components if nothing exists

---

## 2. Code Review Checklist

All PRs that touch UI code must pass this design review checklist:

### Token Usage
- [ ] No hex colors used inline (must use CSS variables)
- [ ] No arbitrary `rounded-[Npx]` (must use radius tokens)
- [ ] No bespoke `@keyframes` in feature files (must use motion system)
- [ ] Semantic tokens used instead of primitive tokens
- [ ] Category tokens used for content-type colors

### Component Usage
- [ ] Existing primitives used instead of custom divs
- [ ] Existing patterns used instead of re-implementing
- [ ] Page shells used instead of custom layouts
- [ ] Inspector pattern used for detail panels

### Motion & Animation
- [ ] Only the four motion moods used (breathe, float, pulse, flow)
- [ ] Max one breathing element per screen
- [ ] Pulse always paired with text label
- [ ] Flow only used in diagrams

### Accessibility
- [ ] Status is always color + text + icon
- [ ] 4.5:1 contrast ratio for text
- [ ] Focus states visible on all interactive elements
- [ ] No color-only status indicators

---

## 3. Lint Rules

### ESLint Rules for Design System

Add these rules to `.eslintrc` or `eslint.config.mjs`:

```javascript
{
  rules: {
    // Prevent hex colors in JSX/TSX
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[value.type="Literal"][value.value=/^#[0-9A-Fa-f]{6}$/]',
        message: 'Use CSS variables instead of hex colors. Reference design-tokens.css'
      }
    ],
    
    // Prevent arbitrary border radius
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[value.value=/rounded-\[?\d+px?\]?/]',
        message: 'Use radius tokens instead of arbitrary values. Reference design-tokens.css'
      }
    ]
  }
}
```

### Stylelint Rules for CSS

Add these rules to `.stylelintrc`:

```json
{
  "rules": {
    "color-named": "never",
    "color-hex-length": "short",
    "declaration-property-value-disallowed-list": {
      "/^color/": ["/^#[0-9A-Fa-f]{6}$/"],
      "/^background/": ["/^#[0-9A-Fa-f]{6}$/"],
      "/^border/": ["/^#[0-9A-Fa-f]{6}$/"]
    },
    "keyframe-name-pattern": "^[a-z-]+$",
    "custom-property-pattern": "^[a-z-]+$"
  }
}
```

---

## 4. Category-Color Registry Process

The category-color registry is append-only. Adding a new category requires:

### Process
1. **Review existing categories** - ensure your use case doesn't fit
2. **Create a proposal** - document the new category, use case, and color choice
3. **Team review** - get approval from the design system owner
4. **Update the registry** - add entry to `DESIGN_SYSTEM_CATEGORY_REGISTRY.md`
5. **Update tokens** - add primitive, semantic, and category tokens to `design-tokens.css`
6. **Update style guide** - add the new category to the style guide

### Anti-Patterns
❌ Adding a category because a color "looks nice"  
✅ Adding a category because it represents a distinct content type

❌ Using hex colors inline for "just this one time"  
✅ Adding a proper category entry if the use case is recurring

❌ Reusing categories for unrelated content types  
✅ Adding a new category if the semantic meaning is different

---

## 5. Motion System Governance

The motion system has exactly four animation moods. This is the complete vocabulary.

### Adding New Animations
New animations are strongly discouraged. If you believe a new animation is necessary:

1. **Document the use case** - why none of the four moods work
2. **Check existing patterns** - ensure it's not a variant of breathe/float/pulse/flow
3. **Team review** - get approval from the design system owner
4. **Add to motion system** - update `motion-system.css`
5. **Document usage rules** - add when and how to use it
6. **Update style guide** - add example to the style guide

### Motion Rules Checklist
- [ ] Max one breathing element per screen
- [ ] Float never on more than one cluster at a time
- [ ] Pulse always paired with text label
- [ ] Flow only in diagrams
- [ ] No custom @keyframes in feature files

---

## 6. Component Governance

### Three-Tier Component System

**Primitives** (dumb, presentation-only):
- Panel, Pill, Button, IconCircle, Avatar, Divider, Tag
- No business logic
- Map 1:1 to visual shapes
- Never redefine radius, shadow, or color inline

**Patterns** (composed, reusable):
- AnimatedRing, StatusBadge, FilterBar, Stepper, Timeline, Inspector
- Generic across features
- Import from Primitives only
- Never redefine visual properties

**Features** (page-specific):
- BugHuntingWorkspace, LiveInterviewSession, TranscriptViewer
- Import from Patterns and Primitives only
- Business logic lives here
- If a new visual shape is needed, add a Pattern first

### Adding New Components

**Adding a Primitive:**
1. Ensure it's a dumb, presentation-only component
2. Use semantic tokens for all visual properties
3. Add to `/src/components/ui/primitives/`
4. Document with JSDoc comments
5. Add to style guide

**Adding a Pattern:**
1. Ensure it's composed from existing Primitives
2. Make it generic across features
3. Add to `/src/components/ui/patterns/`
4. Document with JSDoc comments
5. Add to style guide

**Adding a Feature:**
1. Import from Patterns and Primitives only
2. Never redefine visual properties inline
3. Add to appropriate feature directory
4. Business logic lives here

---

## 7. Page Shell Governance

The application has exactly four page shells. New pages must use one of these:

### The Four Shells
1. **Panel-detail shell** - big white rounded panel, breadcrumb top-left
2. **Immersive/hero shell** - full-bleed gradient, no panel
3. **Reading shell** - narrow centered column, progress bar
4. **Workspace shell** - panel with internal split (sidebar + main)

### Choosing a Shell
- **Panel-detail**: Bug hunting, card detail, whiteboarding, problem library
- **Immersive**: Landing pages, discovery moments (rare)
- **Reading**: Articles, transcripts, long-form content
- **Workspace**: Bug hunting, live-interview (split layouts)

### Adding New Shells
New shells are strongly discouraged. If you believe a new shell is necessary:

1. **Document the use case** - why none of the four shells work
2. **Check existing pages** - ensure it's not a variant of an existing shell
3. **Team review** - get approval from the design system owner
4. **Add to shells directory** - update `/src/components/layout/shells/`
5. **Document usage rules** - add when and how to use it
6. **Update this governance doc** - add to the four shells list

---

## 8. Migration Strategy

### Migrating Existing Code

When migrating existing code to the design system:

1. **Start with high-impact areas** - components used across multiple features
2. **Migrate tokens first** - replace hex colors with CSS variables
3. **Migrate components second** - replace custom divs with Primitives
4. **Migrate patterns third** - replace repeated implementations with Patterns
5. **Migrate shells last** - replace custom layouts with Shells

### Migration Checklist
- [ ] Replace hex colors with category/semantic tokens
- [ ] Replace arbitrary radius with radius tokens
- [ ] Replace custom divs with Primitive components
- [ ] Replace repeated patterns with Pattern components
- [ ] Replace custom layouts with Shell components
- [ ] Remove unused CSS classes
- [ ] Update imports to use new component paths

---

## 9. Design System Owner

The design system owner is responsible for:

- Maintaining the token hierarchy
- Maintaining the category-color registry
- Maintaining the motion system
- Reviewing and approving new tokens/categories/animations
- Keeping the style guide up to date
- Enforcing the code review checklist
- Updating governance documentation

**Current Design System Owner**: [To be assigned]

---

## 10. Violation Handling

### Minor Violations
- Examples: Using hex colors once, minor radius inconsistency
- Action: Comment in PR, request fix before merge
- Timeline: Fix before merge

### Major Violations
- Examples: Adding new category without approval, new animation without process
- Action: Block PR, require design system owner review
- Timeline: Fix before merge, may require team discussion

### Pattern Violations
- Examples: Repeated violations of same rule across team
- Action: Team education, update documentation, consider tooling
- Timeline: Address in next sprint planning

---

## 11. Tooling Recommendations

### Recommended Tools
- **Stylelint**: CSS linting with custom rules
- **ESLint**: JS/TSX linting with custom rules
- **Storybook**: Component documentation and testing
- **Chromatic**: Visual regression testing
- **Figma**: Design token synchronization (future)

### Automation Goals
- Automatic detection of hex colors in PRs
- Automatic detection of arbitrary radius values
- Automatic detection of custom @keyframes
- Visual regression tests for all components
- Token synchronization between Figma and code

---

## 12. Success Metrics

The design system is successful when:

- **Zero hex colors** in feature files (all use CSS variables)
- **Zero arbitrary radius** values (all use radius tokens)
- **Zero custom @keyframes** in feature files (all use motion system)
- **100% shell usage** (all pages use one of four shells)
- **100% primitive usage** (no custom divs for repeated shapes)
- **Zero category drift** (colors always match content type)
- **One live signal** per screen (max one breathing/pulsing element)

---

## 13. Documentation Updates

This governance document must be updated when:

- New governance processes are added
- New lint rules are established
- New tooling is recommended
- Success metrics change
- Design system owner changes

**Last Updated**: 2026-07-20
**Version**: 1.0
