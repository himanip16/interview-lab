# Phase 0 Migration Punch List

**Generated**: 2026-07-20
**Purpose**: Inventory of hardcoded values requiring migration to design system tokens

---

## Summary

- **Hex color values**: 200 matches across 18 TSX/TS files
- **Inline styles**: 51 matches across 33 files
- **backgroundColor usage**: 8 matches across 6 files
- **CSS files**: 4 feature-specific CSS files to review

---

## Files with Hex Color Values (Priority: High)

### ActionCarousel Components
- `/src/features/learning/components/ActionCarousel.tsx` (27 matches)
- `/src/app/learn/action-carousel/page.tsx` (27 matches)
- `/src/app/learn/page.tsx` (34 matches)

**Issue**: Gradient definitions with hardcoded hex values
**Migration**: Replace with category tokens or semantic tokens

### Diagram Components
- `/src/features/learning/components/diagrams/CassandraDiagram.tsx` (20 matches)
- `/src/features/deep-dive/illustrations/Cassandra.tsx` (10 matches)
- `/src/features/deep-dive/illustrations/DynamoDB.tsx` (10 matches)
- `/src/features/deep-dive/illustrations/Kafka.tsx` (10 matches)
- `/src/features/deep-dive/illustrations/Postgres.tsx` (10 matches)
- `/src/features/deep-dive/illustrations/Redis.tsx` (10 matches)

**Issue**: Node colors with hardcoded hex values
**Migration**: Replace with category tokens based on node type

### Whiteboard Components
- `/src/features/learning/components/WhiteboardWorkspace.tsx` (10 matches)
- `/src/features/learning/components/Whiteboard.tsx` (7 matches)
- `/src/features/diagram/components/SystemDiagram.tsx` (9 matches)

**Issue**: Diagram node colors with hardcoded hex values
**Migration**: Replace with category tokens (neutral, concept, learn, practice)

### Other Components
- `/src/features/learning/components/diagrams/Redis.tsx` (3 matches)
- `/src/features/learning/components/diagrams/Kafka.tsx` (2 matches)
- `/src/features/learning/components/WhiteboardView.tsx` (2 matches)
- `/src/app/learn/card-detail/page.tsx` (4 matches)
- `/src/lib/utils.ts` (4 matches)
- `/src/components/layout/shells/ImmersiveShell.tsx` (1 match)

---

## Files with Inline Styles (Priority: Medium)

### High Frequency
- `/src/features/learning/components/ActionCarousel.tsx` (8 matches)
- `/src/app/learn/action-carousel/page.tsx` (3 matches)
- `/src/app/learn/page.tsx` (3 matches)
- `/src/app/interview/live/page.tsx` (2 matches)
- `/src/components/layout/Inspector.tsx` (2 matches)
- `/src/components/layout/shells/ReadingShell.tsx` (2 matches)
- `/src/components/ui/primitives/StatusBadge.tsx` (2 matches)

### Medium Frequency
- `/src/features/bug-hunting/components/Sidebar/ReportSidebar.tsx` (2 matches)
- `/src/features/diagram/components/SystemDiagram.tsx` (2 matches)
- `/src/features/learning/components/WhiteboardWorkspace.tsx` (2 matches)

**Issue**: Inline styles with dynamic values
**Migration**: Move to CSS variables or component props

---

## Files with backgroundColor Usage (Priority: Medium)

- `/src/components/ui/primitives/StatusBadge.tsx` (2 matches)
- `/src/features/learning/components/WhiteboardWorkspace.tsx` (2 matches)
- `/src/components/layout/Inspector.tsx` (1 match)
- `/src/components/layout/shells/ReadingShell.tsx` (1 match)
- `/src/components/ui/primitives/Pill.tsx` (1 match)
- `/src/features/learning/components/Whiteboard.tsx` (1 match)

**Issue**: Direct backgroundColor assignments
**Migration**: Replace with category or semantic tokens

---

## CSS Files to Review (Priority: Low)

- `/src/features/bug-hunting/components/BugHunting.module.css`
- `/src/features/deep-dive/styles/deep-dive.css`
- `/src/styles/bug-hunting.css`

**Issue**: Feature-specific CSS with potential hardcoded values
**Migration**: Review and migrate to tokens where applicable

---

## Migration Priority Order

### Phase 1: High-Impact, High-Frequency
1. **ActionCarousel** - Used across learning pages, many hex values
2. **Whiteboard/WhiteboardWorkspace** - Core diagram functionality
3. **Diagram components** - Reused across multiple features

### Phase 2: Medium-Impact
4. **Inspector** - Already updated with category tokens, verify
5. **StatusBadge/Pill** - New primitives, verify they use tokens
6. **Page shells** - Verify they use semantic tokens

### Phase 3: Low-Impact
7. **Deep-dive illustrations** - Feature-specific, less reused
8. **Feature CSS files** - Review and consolidate

---

## Specific Migration Patterns

### Pattern 1: Gradient Definitions
**Before**: `linear-gradient(160deg, #FF6B4A, #E0432A)`
**After**: Use category tokens or predefined gradient utilities

### Pattern 2: Node Colors
**Before**: `backgroundColor: '#FF5A3C'`
**After**: `backgroundColor: 'var(--category-practice)'`

### Pattern 3: Inline Dynamic Styles
**Before**: `style={{ backgroundColor: node.color }}`
**After**: `style={{ backgroundColor: `var(--category-${node.category})` }}`

### Pattern 4: Border Colors
**Before**: `borderColor: 'rgba(21,22,28,0.06)'`
**After**: `borderColor: 'var(--border-subtle)'`

---

## Success Criteria

- [ ] Zero hex color values in TSX/TS files (except comments)
- [ ] Zero arbitrary Tailwind values (bg-[#...], rounded-[Npx])
- [ ] All inline styles use CSS variables
- [ ] All backgroundColor usage uses tokens
- [ ] Feature CSS files reviewed and cleaned

---

## Notes

- Some hex values are in HTML reference files (frontend/) - these are documentation, not code
- The `/src/lib/utils.ts` file has hex values - likely utility functions, review carefully
- New primitives (IconCircle, Pill, StatusBadge) should already use tokens - verify
- Inspector component was updated to use category tokens - verify implementation

---

## Next Steps

1. **Verify new primitives** use tokens correctly
2. **Migrate ActionCarousel** components first (highest impact)
3. **Migrate Whiteboard** components second (core functionality)
4. **Migrate diagram** components third (reused patterns)
5. **Review and clean** feature CSS files
6. **Final audit** to ensure zero hardcoded values remain
