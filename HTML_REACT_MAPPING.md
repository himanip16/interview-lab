# HTML to React Page Mapping

This document provides the explicit one-to-one mapping between HTML design specifications and React implementation targets.

---

## Mapping Table

| HTML File | React Target | Type | Status |
|-----------|--------------|------|--------|
| `liveInterview.html` | `/interview/live/[id]` | Page | ✅ Exists (needs style update) |
| `listAllProblems.html` | `/problems` | Page | ✅ Exists (needs style update) |
| `whiteboard.html` | Whiteboard component | Component | ❌ Missing |
| `card.html` | ProblemCard component | Component | ✅ Exists (needs style update) |
| `actionCarousel.html` | ActionCarousel component | Component | ✅ Exists (needs style update) |

---

## Detailed Mapping

### 1. liveInterview.html → `/interview/live/[id]`

**HTML Location**: `src/frontend/liveInterview.html`

**React Target**: `src/app/interview/live/[id]/page.tsx`

**Design Reference**: See `DESIGN_SPECIFICATION.md` - liveInterview.html section

**Key Design Elements**:
- Live interview interface with chat
- Phase stepper (Intro → Requirements → High-level design → Deep dive → Scalability → Closing)
- Timer with breathing animation
- AI/User message bubbles
- Typing indicator
- Sidebar with design summary
- Responsive: hides sidebar on mobile

**Implementation Notes**:
- Dynamic route parameter: `[id]` for interview ID
- Real-time chat interface
- Phase management state
- Timer countdown functionality
- WebSocket or polling for AI responses

---

### 2. listAllProblems.html → `/problems`

**HTML Location**: `src/frontend/listAllProblems.html`

**React Target**: `src/app/problems/page.tsx`

**Design Reference**: See `DESIGN_SPECIFICATION.md` - listAllProblems.html section

**Status**: ✅ **EXISTS** - Currently uses mock data, needs to match HTML design exactly

**Key Design Elements**:
- Problem library with filter pills (Type: All/HLD/LLD/DSA, Difficulty, Status)
- Sort dropdown (Popularity, Alphabetical, Difficulty, Time estimate)
- Problem list with color-coded type bars
- Difficulty badges (Easy/Medium/Hard)
- Completion checkmarks
- Hover states with lift effect
- Responsive: hides search, minutes, crux on mobile

**Implementation Notes**:
- Already fetches from `/api/problems`
- Needs styling to match HTML exactly
- Filter state management
- Sort functionality
- Responsive behavior

---

### 3. whiteboard.html → Whiteboard component

**HTML Location**: `src/frontend/whiteboard.html`

**React Target**: `src/features/learning/components/Whiteboard.tsx` (or similar)

**Design Reference**: See `DESIGN_SPECIFICATION.md` - whiteboard.html section

**Status**: ❌ **MISSING** - Needs to be created

**Key Design Elements**:
- Interactive diagram with clickable nodes
- System selector pills (URL shortener, Uber, Netflix, WhatsApp)
- Node inspector panel
- Animated connection wires
- Component details (Role, Deep dive, Failure modes, Tradeoffs)
- Legend for component types
- Responsive: stacks diagram on mobile

**Implementation Notes**:
- Interactive SVG or canvas-based diagram
- State management for selected node
- Component data structure for different systems
- Animation for wire flow
- Click handlers for node selection

---

### 4. card.html → ProblemCard component

**HTML Location**: `src/frontend/card.html`

**React Target**: `src/features/interview/problems/components/ProblemCard.tsx`

**Design Reference**: See `DESIGN_SPECIFICATION.md` - card.html section

**Status**: ✅ **EXISTS** - Needs to match HTML design exactly

**Key Design Elements**:
- Detail view with left rail navigation
- Hero section with gradient background
- Floating illustration with animation
- Close button with breathing ring
- Play button with shadow
- Badge with pulsing dot
- Phase preview clips
- Responsive: stacks layout on mobile

**Implementation Notes**:
- Currently exists but may not match HTML design
- Needs to implement the detailed card view from HTML
- Animation states for floating elements
- Interactive phase clips

---

### 5. actionCarousel.html → ActionCarousel component

**HTML Location**: `src/frontend/actionCorousel.html`

**React Target**: `src/features/learning/components/ActionCarousel.tsx`

**Design Reference**: See `DESIGN_SPECIFICATION.md` - actionCorousel.html section

**Status**: ✅ **EXISTS** - Needs to match HTML design exactly

**Key Design Elements**:
- Horizontal scrolling carousel
- Cards with gradient backgrounds
- Floating icons with animation
- Navigation buttons (Prev/Next)
- Next button with breathing ring
- Social links in footer
- Responsive: hides search on mobile

**Implementation Notes**:
- Currently exists but may not match HTML design
- Horizontal scroll with snap behavior
- Card hover effects
- Navigation controls
- Animation timing

---

## Implementation Priority

### Phase 1: Existing Components (Style Updates)
1. **ProblemCard** - Update to match card.html design
2. **ActionCarousel** - Update to match actionCorousel.html design
3. **Problems page** - Update to match listAllProblems.html design

### Phase 2: Missing Components (New Implementation)
1. **Whiteboard component** - Create new component matching whiteboard.html
2. **Live interview page** - Create or update `/interview/live/[id]` page

---

## Design Compliance Checklist

For each React implementation, verify:

- [ ] Fonts match (Poppins 500/600/700, Inter 400/500/600)
- [ ] Color palette matches CSS variables
- [ ] Border radii match specifications
- [ ] Shadows match specifications
- [ ] Spacing/padding matches
- [ ] Animations match timing and easing
- [ ] Hover states match
- [ ] Responsive breakpoints match
- [ ] Transitions match

---

## Notes

- All HTML designs use the same global design system
- Animations use specific cubic-bezier curves for bouncy feel
- Responsive behavior is explicitly defined in each HTML
- Color coding is consistent (HLD=violet, LLD=coral, DSA=mint)
- All interactive elements have defined hover/active states
