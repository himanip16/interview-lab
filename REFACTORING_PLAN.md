# MessageBlock Refactoring Plan

## Overview
This plan addresses the code review feedback for `MessageBlock.tsx`, focusing on reducing component complexity, improving performance, and fixing bugs.

## Priority 1: Critical Bug Fixes

### 1.1 Fix Key Inconsistency
**Issue**: `toggle(item.id ?? String(ii))` vs `openIds[item.id ?? ""]` creates inconsistent keys when `id` is missing.
**Fix**: Use a consistent key helper:
```ts
const getHighlightKey = (item: ContentBlock, index: number) => item.id ?? `highlight-${index}`;
```
**Files**: `MessageBlock.tsx` lines 278, 333

### 1.2 Remove Unused Prop
**Issue**: `InlineHighlight` receives `open` prop but never uses it.
**Fix**: Remove the `open` prop from `InlineHighlight` component.
**Files**: `MessageBlock.tsx` lines 53-61, 278

---

## Priority 2: Performance Optimizations

### 2.1 Add useMemo for Derived Values
**Issue**: `groups` and `highlights` are recalculated on every render.
**Fix**: Wrap in `useMemo`:
```ts
const groups = useMemo(() => groupBlocks(blocks), [blocks]);
const highlights = useMemo(() => blocks.filter(...), [blocks]);
```
**Files**: `MessageBlock.tsx` lines 223-224

### 2.2 Add Component Memoization
**Issue**: In transcripts with 100+ messages, re-renders cascade unnecessarily.
**Fix**: Wrap component in `memo()`:
```ts
export default memo(MessageBlock);
```
**Files**: `MessageBlock.tsx` line 185

---

## Priority 3: State Management Simplification

### 3.1 Simplify openIds State
**Issue**: `Record<string, boolean>` is overkill for 0-3 highlights per message.
**Fix**: Change to `string | null` (single open annotation):
```ts
const [openHighlightId, setOpenHighlightId] = useState<string | null>(null);
const toggle = (id: string) => setOpenHighlightId(prev => prev === id ? null : id);
```
**Files**: `MessageBlock.tsx` line 198, 201, 278, 333

---

## Priority 4: Code Clarity Improvements

### 4.1 Split Callback Naming
**Issue**: `onAddNote` means two different things (open editor vs save).
**Fix**: Separate into three callbacks:
```ts
onStartNote: (id: string) => void;
onSaveNote: (id: string, note: string) => void;
onDeleteNote: (id: string) => void;
```
**Files**: `MessageBlock.tsx` Props interface, lines 247, 310, 317, 321

### 4.2 Consolidate Duplicate MessageActions
**Issue**: Two `MessageActions` components with only flag differences.
**Fix**: Add variant prop:
```ts
<MessageActions variant="candidate" />
<MessageActions variant="interviewer" />
```
**Files**: `MessageBlock.tsx` lines 240-249, 302-313, and `MessageActions.tsx`

---

## Priority 5: Extractability & Testability

### 5.1 Extract groupBlocks to Utils
**Issue**: `groupBlocks` has React-specific logic but is pure function.
**Fix**: Move to `utils/transcript.ts`:
```ts
// utils/transcript.ts
export function groupBlocks(blocks: ContentBlock[]): Group[] { ... }
```
**Files**: Create `utils/transcript.ts`, update `MessageBlock.tsx` line 36-51

### 5.2 Extract Inline Render Logic
**Issue**: Inline render logic will grow with new block types (math, markdown, etc.).
**Fix**: Create `InlineContentRenderer` component:
```ts
function InlineContentRenderer({ items, concepts, onExplore, openHighlightId, onToggle }) { ... }
```
**Files**: Create new component, update `MessageBlock.tsx` lines 272-298

---

## Priority 6: Styling Improvements

### 6.1 Extract Inline Styles
**Issue**: Repeated inline styles for Takeaway, Bubble, AI, Note, Highlight, Annotation.
**Fix**: Move to Tailwind utilities or constants:
```ts
const styles = {
  takeaway: "linear-gradient(160deg,#fff,#FAF9F6)",
  aiReply: "rgba(106,90,224,0.06)",
  note: "#FFF8E1",
  // ...
};
```
**Files**: `MessageBlock.tsx` multiple locations

---

## Priority 7: Accessibility

### 7.1 Add ARIA Attributes
**Issue**: Missing `aria-expanded` and `aria-label` on interactive elements.
**Fix**: Add to highlights and close buttons:
```ts
<span aria-expanded={open} aria-label="Toggle annotation">
<button aria-label="Close annotation">
```
**Files**: `MessageBlock.tsx` lines 64-78, 130-136, 173-179

---

## Priority 8: Architectural Refactoring (Future)

### 8.1 Split Component Responsibilities
**Issue**: `MessageBlock` handles layout, actions, notes, AI, highlights, takeaways, evaluation, concepts.
**Fix**: Extract into sub-components:
```
MessageBlock
├── MessageHeader
├── MessageBubble
│   ├── InlineRenderer
│   ├── CodeBlock
│   ├── Whiteboard
│   └── Animation
├── MessageActions
├── MessageNotes
├── AIReply
├── HighlightAnnotations
└── EvaluationCallout
```
**Note**: This is a larger refactor that should be done after priorities 1-7.

---

## Implementation Order

1. **Phase 1**: Critical bugs (Priority 1)
2. **Phase 2**: Performance (Priority 2)
3. **Phase 3**: State simplification (Priority 3)
4. **Phase 4**: Code clarity (Priority 4)
5. **Phase 5**: Extractability (Priority 5)
6. **Phase 6**: Styling (Priority 6)
7. **Phase 7**: Accessibility (Priority 7)
8. **Phase 8**: Architecture (Priority 8) - Optional, can be deferred

---

## Testing Checklist

After each phase:
- [ ] Component renders without errors
- [ ] All existing functionality works (bookmarks, notes, AI, highlights)
- [ ] No console warnings
- [ ] Performance acceptable (test with 100+ message transcript)
- [ ] Accessibility tools pass basic checks

---

## Notes

- All changes should be backward compatible with parent components
- Consider adding unit tests for `groupBlocks` after extraction
- The architectural refactor (Phase 8) may require coordination with other files that use `MessageBlock`
