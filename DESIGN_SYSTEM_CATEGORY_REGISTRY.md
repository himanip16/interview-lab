# Category Color Registry

**Purpose**: This is the central, append-only registry for content category colors in the application. Every color identity maps to a specific content type, not arbitrary choice. This registry ensures consistency across all features and prevents color drift.

**Rule**: When adding a new content category, add an entry to this list first. Never invent a new gradient or color inline in feature files.

---

## Category Mappings

### coral — Practice/Bugs/Alerts
- **CSS Variable**: `--category-practice`
- **Primary Color**: `#FF5A3C`
- **Deep Color**: `#E0432A`
- **Background**: `rgba(255, 90, 60, 0.1)`
- **Use Cases**: 
  - Bug hunting features
  - Error states and alerts
  - Warning indicators
  - Practice/problem-solving contexts
- **Examples**: Bug hunting workspace, error badges, warning pills

### mint — Learn/Success/Completion
- **CSS Variable**: `--category-learn`
- **Primary Color**: `#00D9A3`
- **Deep Color**: `#00A87E`
- **Background**: `rgba(0, 217, 163, 0.1)`
- **Use Cases**:
  - Learning features
  - Success states
  - Completion indicators
  - Positive feedback
- **Examples**: Success badges, completion checks, learning paths

### amber — Live/Active/In-Progress
- **CSS Variable**: `--category-live`
- **Primary Color**: `#f59e0b`
- **Deep Color**: `#d97706`
- **Background**: `rgba(245, 158, 11, 0.1)`
- **Use Cases**:
  - Live interview sessions
  - Active states
  - In-progress indicators
  - Timers and countdowns
- **Examples**: Live badges, active session indicators, timers

### violet — Conceptual/Deep-Dive/Documentation
- **CSS Variable**: `--category-concept`
- **Primary Color**: `#6A5AE0`
- **Deep Color**: `#4C3FD6`
- **Background**: `rgba(106, 90, 224, 0.1)`
- **Use Cases**:
  - Deep dive content
  - Conceptual explanations
  - Documentation
  - Abstract/system-level components
- **Examples**: Deep dive pages, documentation sections, system diagram logic nodes

### blue — Information/Neutral
- **CSS Variable**: `--category-info`
- **Primary Color**: `#3E6BFF`
- **Deep Color**: `#213FCC`
- **Background**: `rgba(62, 107, 255, 0.1)`
- **Use Cases**:
  - Informational content
  - Neutral states
  - Generic features
  - Standard UI elements
- **Examples**: Info badges, neutral pills, standard cards

### pink — Social/Community
- **CSS Variable**: `--category-social`
- **Primary Color**: `#FF4D93`
- **Deep Color**: `#D62568`
- **Background**: `rgba(255, 77, 147, 0.1)`
- **Use Cases**:
  - Social features
  - Community elements
  - User-generated content
  - Collaborative features
- **Examples**: Social badges, community indicators, collaborative elements

### dark — Neutral/Infrastructure/Storage
- **CSS Variable**: `--category-neutral`
- **Primary Color**: `#15161C`
- **Deep Color**: `#050505`
- **Background**: `rgba(21, 22, 28, 0.1)`
- **Use Cases**:
  - Infrastructure components
  - Databases
  - Neutral/structural elements
  - Background components
- **Examples**: Database nodes, infrastructure elements, structural components

---

## Adding New Categories

When adding a new content category:

1. **Review existing categories** - ensure your use case doesn't fit an existing category
2. **Choose a distinct color** - must be visually distinct from existing 7 categories
3. **Document the use case** - clearly define when this category should be used
4. **Add CSS variables** - update `src/styles/design-tokens.css` with primitive, semantic, and category tokens
5. **Update this registry** - add the entry above following the established format
6. **Team review** - new categories require team approval to prevent category bloat

---

## Color Selection Guidelines

- **Accessibility**: Ensure 4.5:1 contrast ratio for text on backgrounds
- **Distinctness**: New colors must be distinguishable from existing 7 categories
- **Meaning**: Color should always answer "what kind of thing is this?"
- **Consistency**: Same content type = same color across all features
- **Scalability**: Consider how the color works in gradients, backgrounds, and borders

---

## Anti-Patterns

❌ **Don't**: Pick a color because it "looks nice"  
✅ **Do**: Choose a color based on content type mapping

❌ **Don't**: Use hex colors inline in components  
✅ **Do**: Reference category CSS variables

❌ **Don't**: Create ad-hoc gradients per feature  
✅ **Do**: Use established category color tokens

❌ **Don't**: Reuse categories for unrelated content types  
✅ **Do**: Add a new category if the use case is truly distinct

---

## Implementation Reference

In components, reference category tokens like this:

```css
/* Correct */
background-color: var(--category-practice);
color: var(--category-practice-deep);

/* Incorrect */
background-color: #FF5A3C;
color: #E0432A;
```

```tsx
/* Correct - using category tokens */
<div style={{ backgroundColor: 'var(--category-learn)' }}>

/* Incorrect - using hex values */
<div style={{ backgroundColor: '#00D9A3' }}>
```
