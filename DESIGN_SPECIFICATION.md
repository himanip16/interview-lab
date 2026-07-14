# HTML Design Specifications

This document captures the frozen design specifications from the HTML files. These serve as the authoritative design reference for the application.

---

## Global Design System

### Fonts
- **Primary Font Family**: Poppins (weights: 500, 600, 700)
- **Secondary Font Family**: Inter (weights: 400, 500, 600)
- **Font Loading**: Google Fonts with preconnect
- **Letter Spacing**: -0.02em for headings (Poppins)
- **Font Smoothing**: -webkit-font-smoothing: antialiased

### Color Palette
```css
--paper: #FAF9F6        /* Background color */
--ink: #15161C          /* Primary text color */
--ink-soft: #5A5B66     /* Secondary text color */
--mint: #00D9A3         /* Accent color */
--mint-deep: #00A87E    /* Darker accent */
--coral: #FF5A3C       /* Warning/alert color */
--violet: #6A5AE0       /* Purple accent */
--amber: #E8940A        /* Yellow/orange accent */
--bubble: #F1EFEA      /* Chat bubble background */
```

### Common Dimensions
- **Panel Border Radius**: 32px
- **Card Border Radius**: 26px
- **Button Border Radius**: 999px (pill buttons)
- **Small Border Radius**: 14px, 18px, 22px (varies by context)

### Common Shadows
- **Panel Shadow**: 0 24px 60px rgba(21,22,28,0.06)
- **Panel Border**: 1px solid rgba(21,22,28,0.06)
- **Hover Shadow**: 0 14px 30px rgba(21,22,28,0.07)

---

## actionCorousel.html

### Layout
- **Body Padding**: 48px 24px
- **Panel Max Width**: 1080px
- **Panel Padding**: 36px 40px 44px
- **Panel Border Radius**: 32px

### Navigation
- **Logo Font Size**: 18px, weight 700
- **Logo Accent**: #00A87E (green)
- **Search Max Width**: 340px
- **Search Padding**: 10px 18px
- **Search Font Size**: 13.5px
- **Search Border Radius**: 999px
- **Search Border**: 1px solid rgba(21,22,28,0.08)
- **Menu Font Size**: 13.5px, weight 600

### Carousel Cards
- **Card Width**: 216px (flex: 0 0)
- **Card Height**: 300px
- **Card Border Radius**: 26px
- **Card Padding**: 22px
- **Card Gap**: 18px
- **Card Hover Transform**: translateY(-8px)
- **Card Transition**: 0.35s cubic-bezier(0.34,1.56,0.64,1)

### Floating Icons
- **Icon Size**: 84px x 84px
- **Icon Position**: top: -30px, left: 50%, transform: translateX(-50%)
- **Float Animation**: 4.5s ease-in-out infinite
- **Float Keyframes**: 0%,100% translateY(0), 50% translateY(-8px)

### Card Typography
- **Title Font Size**: 16.5px, weight 600
- **Meta Font Size**: 11.5px, weight 500
- **Meta Color**: rgba(255,255,255,0.75)
- **Dot Size**: 4px x 4px, border-radius 50%

### Card Gradients
- **c1**: linear-gradient(160deg,#FF6B4A,#E0432A)
- **c2**: linear-gradient(160deg,#3E6BFF,#213FCC)
- **c3**: linear-gradient(160deg,#262832,#121319)
- **c4**: linear-gradient(160deg,#00E0AB,#00A87E)
- **c5**: linear-gradient(160deg,#FFB930,#E8940A)
- **c6**: linear-gradient(160deg,#7A6BFF,#4C3FD6)
- **c7**: linear-gradient(160deg,#FF4D93,#D62568)

### Footer Navigation
- **Social Font Size**: 13px, weight 500
- **Next Button Size**: 46px x 46px
- **Next Button Border Radius**: 50%
- **Ring Animation**: 2.6s ease-in-out infinite
- **Ring Keyframes**: 0%,100% scale(1) opacity(0.7), 50% scale(1.18) opacity(0)

### Responsive
- **Mobile (max-width: 640px)**:
  - Panel padding: 28px 18px 32px
  - Search: display: none

---

## card.html

### Layout
- **Body Padding**: 48px 24px
- **Panel Max Width**: 1080px
- **Panel Padding**: 36px 40px 40px
- **Detail Min Height**: 420px

### Navigation
- **Logo Font Size**: 18px, weight 700
- **Logo Accent**: #C97800 (amber-deep)
- **Search Max Width**: 340px
- **Search Padding**: 10px 18px
- **Search Font Size**: 13.5px

### Detail Layout
- **Rail Width**: 52px
- **Rail Padding**: 20px 0
- **Rail Gap**: 26px
- **Rail Item Font Size**: 12px, weight 600
- **Rail Item Letter Spacing**: 0.02em

### Hero Section
- **Hero Width**: 42% (flex: 0 0)
- **Hero Gradient**: linear-gradient(165deg,#FFB930,#E8940A)
- **Illustration Size**: 200px x 200px
- **Float Animation**: 4.5s ease-in-out infinite
- **Float Keyframes**: 0%,100% translateY(0), 50% translateY(-10px)

### Close Button
- **Close Button Size**: 34px x 34px
- **Close Button Border Radius**: 50%
- **Close Button Background**: rgba(255,255,255,0.18)
- **Close Ring Animation**: 2.6s ease-in-out infinite
- **Close Ring Keyframes**: 0%,100% scale(1) opacity(0.7), 50% scale(1.22) opacity(0)

### Play Button
- **Play Button Size**: 58px x 58px
- **Play Button Border Radius**: 50%
- **Play Button Background**: #fff
- **Play Button Shadow**: 0 10px 24px rgba(0,0,0,0.18)
- **Play Ring Animation**: 2.4s ease-in-out infinite

### Content Section
- **Content Padding**: 34px 38px
- **Badge Font Size**: 11px, weight 600
- **Badge Padding**: 5px 12px
- **Badge Border Radius**: 999px
- **Badge Background**: rgba(232,148,10,0.1)
- **Badge Dot Size**: 6px x 6px
- **Badge Dot Animation**: 1.8s ease-in-out infinite
- **Badge Dot Keyframes**: 0%,100% opacity(1), 50% opacity(0.25)

### Content Typography
- **Title Font Size**: 30px, weight 700
- **Meta Font Size**: 13px, weight 500
- **Description Font Size**: 14px
- **Description Line Height**: 1.65
- **Description Max Width**: 400px

### Clips
- **Clips Label Font Size**: 12.5px, weight 600
- **Clip Height**: 64px
- **Clip Border Radius**: 14px
- **Clip Font Size**: 11.5px, weight 600
- **Clip Gap**: 10px
- **Clip Hover Transform**: translateY(-4px)
- **Clip Transition**: 0.25s cubic-bezier(0.34,1.56,0.64,1)

### Clip Gradients
- **clip1**: linear-gradient(160deg,#3E6BFF,#213FCC)
- **clip2**: linear-gradient(160deg,#00E0AB,#00A87E)
- **clip3**: linear-gradient(160deg,#262832,#121319)

### Responsive
- **Mobile (max-width: 760px)**:
  - Detail: flex-direction: column
  - Rail: display: none
  - Hero: min-height: 220px
  - Search: display: none

---

## listAllProblems.html

### Layout
- **Body Padding**: 40px 24px
- **Panel Max Width**: 960px
- **Panel Padding**: 32px 36px 40px

### Header
- **Title Font Size**: 23px, weight 600
- **Search Width**: 220px
- **Search Padding**: 9px 16px
- **Search Font Size**: 13px
- **Search Border Radius**: 999px

### Filters
- **Filter Label Font Size**: 10.5px, weight 700
- **Filter Label Letter Spacing**: 0.06em
- **Filter Label Text Transform**: uppercase
- **Filter Pill Font Size**: 12.5px, weight 600
- **Filter Pill Padding**: 6px 13px
- **Filter Pill Border Radius**: 999px
- **Filter Pill Border**: 1px solid rgba(21,22,28,0.1)
- **Filter Pill Transition**: 0.2s ease
- **Filter Pill Gap**: 6px

### Filter Active States
- **Default Active**: background: var(--ink), color: #fff
- **HLD Active**: background: var(--violet)
- **LLD Active**: background: var(--coral)
- **DSA Active**: background: var(--mint-deep)

### Sort Dropdown
- **Sort Button Font Size**: 12.5px, weight 600
- **Sort Button Padding**: 8px 14px
- **Sort Button Border Radius**: 999px
- **Sort Menu Border Radius**: 14px
- **Sort Menu Padding**: 6px
- **Sort Menu Min Width**: 170px
- **Sort Menu Shadow**: 0 14px 34px rgba(21,22,28,0.1)
- **Sort Option Font Size**: 12.5px, weight 500
- **Sort Option Padding**: 8px 12px
- **Sort Option Border Radius**: 8px

### Problem List
- **List Gap**: 10px
- **Row Padding**: 16px 18px
- **Row Border Radius**: 18px
- **Row Border**: 1px solid rgba(21,22,28,0.07)
- **Row Gap**: 16px
- **Row Hover Transform**: translateY(-3px)
- **Row Hover Shadow**: 0 14px 30px rgba(21,22,28,0.07)
- **Row Transition**: 0.25s cubic-bezier(0.34,1.56,0.64,1)

### Row Elements
- **Color Bar Width**: 5px
- **Color Bar Border Radius**: 3px
- **Title Font Size**: 14.5px, weight 600
- **Type Tag Font Size**: 10px, weight 700
- **Type Tag Letter Spacing**: 0.03em
- **Type Tag Padding**: 2px 8px
- **Type Tag Border Radius**: 6px
- **Crux Font Size**: 12.5px
- **Difficulty Font Size**: 11px, weight 600
- **Difficulty Padding**: 4px 10px
- **Difficulty Border Radius**: 999px
- **Minutes Font Size**: 12px
- **Minutes Width**: 48px
- **Check Size**: 22px x 22px
- **Check Border Radius**: 50%

### Difficulty Colors
- **Easy**: color: var(--mint-deep), background: rgba(0,168,126,0.1)
- **Medium**: color: var(--amber), background: rgba(232,148,10,0.1)
- **Hard**: color: var(--coral), background: rgba(255,90,60,0.1)

### Empty State
- **Empty State Padding**: 50px 0
- **Empty State Font Size**: 13.5px

### Responsive
- **Mobile (max-width: 640px)**:
  - Search: display: none
  - Minutes: display: none
  - Row crux: display: none

---

## liveInterview.html

### Layout
- **Body Padding**: 40px 24px
- **Panel Max Width**: 1080px
- **Panel Border Radius**: 32px
- **Panel Overflow**: hidden

### Header
- **Header Padding**: 22px 30px
- **Header Border**: 1px solid rgba(21,22,28,0.06)
- **Breadcrumb Font Size**: 13px, weight 500
- **Back Button Size**: 32px x 32px
- **Back Button Border Radius**: 50%
- **Live Badge Font Size**: 12px, weight 600
- **Live Badge Padding**: 6px 13px
- **Live Badge Border Radius**: 999px
- **Live Badge Background**: rgba(255,90,60,0.1)
- **Live Dot Size**: 6px x 6px
- **Live Dot Animation**: 1.6s ease-in-out infinite

### Timer
- **Timer Size**: 58px x 58px
- **Timer Aura**: inset: -10px
- **Timer Aura Animation**: 3.2s ease-in-out infinite
- **Timer Aura Keyframes**: 0%,100% scale(1), 50% scale(1.15)
- **Timer Ring Border**: 1.5px solid rgba(0,217,163,0.4)
- **Timer Font Size**: 13px, weight 600
- **Timer Label Font Size**: 7px
- **Timer Label Letter Spacing**: 0.05em

### Phase Stepper
- **Stepper Padding**: 16px 30px
- **Stepper Border**: 1px solid rgba(21,22,28,0.06)
- **Step Gap**: 6px
- **Step Node Size**: 9px x 9px
- **Step Node Border Radius**: 50%
- **Step Font Size**: 11.5px, weight 600
- **Step Line Width**: 20px
- **Step Line Height**: 1px

### Step States
- **Done**: background: var(--mint-deep)
- **Active**: background: var(--ink), with breathing ring
- **Active Ring**: inset: -5px, border: 1.5px solid rgba(21,22,28,0.35)
- **Active Ring Animation**: 2.4s ease-in-out infinite
- **Upcoming**: border: 1.5px solid rgba(21,22,28,0.2)

### Chat Area
- **Body Height**: 520px
- **Messages Padding**: 26px 30px
- **Messages Gap**: 16px
- **Message Max Width**: 70%
- **Bubble Padding**: 13px 16px
- **Bubble Border Radius**: 18px
- **Bubble Font Size**: 13.5px
- **Bubble Line Height**: 1.55
- **Bubble Corner Radius**: 4px (bottom corners)

### Bubble Colors
- **AI**: background: var(--bubble), color: var(--ink), border-bottom-left-radius: 4px
- **User**: background: var(--ink), color: #fff, border-bottom-right-radius: 4px

### Typing Indicator
- **Typing Padding**: 13px 16px
- **Typing Border Radius**: 18px
- **Typing Dot Size**: 6px x 6px
- **Typing Dot Animation**: 1.2s ease-in-out infinite
- **Typing Dot Keyframes**: 0%,60%,100% translateY(0) opacity(0.4), 30% translateY(-4px) opacity(1)

### Input Area
- **Input Row Padding**: 18px 24px
- **Input Row Border**: 1px solid rgba(21,22,28,0.06)
- **Mic Button Size**: 42px x 42px
- **Mic Button Border Radius**: 50%
- **Field Padding**: 12px 18px
- **Field Font Size**: 13.5px
- **Field Border Radius**: 999px
- **Send Button Size**: 42px x 42px
- **Send Button Border Radius**: 50%
- **Send Button Hover Transform**: scale(1.06)
- **Send Button Transition**: 0.2s ease

### Sidebar
- **Sidebar Width**: 260px (flex: 0 0)
- **Sidebar Padding**: 24px 22px
- **Sidebar Border**: 1px solid rgba(21,22,28,0.06)
- **Side Label Font Size**: 10.5px, weight 700
- **Side Label Letter Spacing**: 0.06em
- **Side Label Text Transform**: uppercase
- **Phase Pill Font Size**: 12px, weight 600
- **Phase Pill Padding**: 5px 13px
- **Phase Pill Border Radius**: 999px
- **Summary Item Font Size**: 12.5px
- **Summary Item Line Height**: 1.6
- **Summary Item Padding Left**: 14px
- **Summary Dot Size**: 5px x 5px

### Responsive
- **Mobile (max-width: 800px)**:
  - Sidebar: display: none
  - Message max-width: 85%

---

## read_transcript.html

### Layout
- **Body Padding**: none (wrap has padding)
- **Wrap Max Width**: 680px
- **Wrap Padding**: 36px 24px 90px

### Progress Bar
- **Progress Height**: 3px
- **Progress Position**: sticky, top: 0
- **Progress Background**: rgba(21,22,28,0.06)
- **Progress Fill Background**: var(--mint-deep)
- **Progress Fill Transition**: 0.1s linear

### Header
- **Breadcrumb Font Size**: 13px, weight 500
- **Back Button Size**: 30px x 30px
- **Back Button Border Radius**: 50%
- **Title Font Size**: 26px, weight 700
- **Meta Pill Font Size**: 11.5px, weight 600
- **Meta Pill Padding**: 5px 12px
- **Meta Pill Border Radius**: 999px
- **Readonly Note Font Size**: 12px, weight 600
- **Readonly Note Padding**: 10px 14px
- **Readonly Note Border Radius**: 12px
- **Readonly Note Background**: rgba(0,217,163,0.08)

### Legend
- **Legend Font Size**: 11.5px
- **Legend Gap**: 16px
- **Swatch Size**: 18px x 8px
- **Swatch Border Radius**: 4px

### Conversation
- **Convo Gap**: 22px
- **Message Max Width**: 88%
- **Message Gap**: 5px
- **Who Font Size**: 11px, weight 600
- **Bubble Padding**: 15px 18px
- **Bubble Border Radius**: 20px
- **Bubble Font Size**: 14px
- **Bubble Line Height**: 1.7
- **Bubble Corner Radius**: 6px (bottom corners)

### Bubble Colors
- **AI**: background: #fff, border: 1px solid rgba(21,22,28,0.07), border-bottom-left-radius: 6px
- **User**: background: #F1EFEA, border-bottom-right-radius: 6px

### Evidence Highlights
- **Evidence Border Radius**: 4px
- **Evidence Padding**: 0 2px
- **Strength Background**: rgba(0,217,163,0.22)
- **Strength Border**: 2px solid var(--mint-deep)
- **Weakness Background**: rgba(255,90,60,0.16)
- **Weakness Border**: 2px solid var(--coral)

### Annotations
- **Annotation Max Width**: 88%
- **Annotation Max Height**: 0 (collapsed), 120px (open)
- **Annotation Opacity**: 0 (collapsed), 1 (open)
- **Annotation Margin**: -8px (collapsed), 2px (open)
- **Annotation Transition**: 0.3s ease
- **Annotation Inner Padding**: 11px 15px
- **Annotation Inner Border Radius**: 14px
- **Annotation Inner Line Height**: 1.55
- **Annotation Tag Font Size**: 9.5px, weight 700
- **Annotation Tag Letter Spacing**: 0.05em
- **Annotation Tag Text Transform**: uppercase

### Takeaway
- **Takeaway Padding**: 20px 22px
- **Takeaway Border Radius**: 18px
- **Takeaway Background**: linear-gradient(160deg,#fff,var(--paper))
- **Takeaway Border**: 3px solid var(--mint-deep)
- **Takeaway Label Font Size**: 10.5px, weight 700
- **Takeaway Label Letter Spacing**: 0.06em
- **Takeaway Label Text Transform**: uppercase
- **Takeaway Text Font Size**: 13.5px
- **Takeaway Text Line Height**: 1.6

### Summary
- **Summary Padding**: 26px
- **Summary Border Radius**: 22px
- **Summary Background**: var(--ink)
- **Summary Font Color**: #fff
- **Summary Title Font Size**: 16px, weight 600
- **Summary Card Padding**: 14px
- **Summary Card Border Radius**: 14px
- **Summary Card Background**: rgba(255,255,255,0.06)
- **Summary Card Key Font Size**: 10px, weight 700
- **Summary Card Key Letter Spacing**: 0.05em
- **Summary Card Key Text Transform**: uppercase
- **Summary Card Text Font Size**: 12px
- **Summary Card Text Line Height**: 1.55

### Responsive
- **Mobile (max-width: 600px)**:
  - Message max-width: 96%
  - Annotation max-width: 96%

---

## whiteboard.html

### Layout
- **Body Padding**: 40px 24px
- **Panel Max Width**: 1080px
- **Panel Padding**: 30px 36px 36px

### Navigation
- **Breadcrumb Font Size**: 13px, weight 500
- **Back Button Size**: 32px x 32px
- **Back Button Border Radius**: 50%

### Title Section
- **Title Font Size**: 23px, weight 600
- **Hint Font Size**: 12.5px
- **Pulse Dot Size**: 6px x 6px
- **Pulse Animation**: 1.8s ease-in-out infinite

### System Pills
- **Pill Font Size**: 12.5px, weight 600
- **Pill Padding**: 7px 15px
- **Pill Border Radius**: 999px
- **Pill Gap**: 8px

### Stage Layout
- **Stage Gap**: 20px
- **Diagram Min Height**: 380px
- **Diagram Border Radius**: 22px
- **Diagram Padding**: 20px

### Diagram Nodes
- **Node Width**: 150px
- **Node Padding**: 14px 16px
- **Node Border Radius**: 16px
- **Node Hover Transform**: translateY(-4px)
- **Node Transition**: 0.3s cubic-bezier(0.34,1.56,0.64,1)
- **Node Dot Size**: 8px x 8px
- **Node Name Font Size**: 13.5px, weight 600
- **Node Kind Font Size**: 10.5px
- **Node Selected Shadow**: 0 0 0 3px rgba(0,217,163,0.35)

### Node Colors
- **Client**: var(--coral)
- **Gateway**: var(--ink)
- **Service**: var(--violet)
- **Database**: var(--mint-deep)

### Wires
- **Wire Stroke**: rgba(21,22,28,0.16)
- **Wire Stroke Width**: 2
- **Wire Stroke Dash Array**: 5 6
- **Wire Animation**: 1.4s linear infinite
- **Wire Animation Keyframes**: stroke-dashoffset: -22

### Legend
- **Legend Font Size**: 11.5px
- **Legend Gap**: 16px
- **Swatch Size**: 8px x 8px

### Inspector
- **Inspector Width**: 300px (flex: 0 0)
- **Inspector Border Radius**: 22px
- **Inspector Padding**: 24px
- **Inspector Dot Size**: 34px x 34px
- **Inspector Dot Border Radius**: 10px
- **Inspector Title Font Size**: 16px, weight 600
- **Inspector Kind Font Size**: 11px
- **Inspector Label Font Size**: 10.5px, weight 700
- **Inspector Label Letter Spacing**: 0.06em
- **Inspector Label Text Transform**: uppercase
- **Inspector Text Font Size**: 12.5px
- **Inspector Text Line Height**: 1.6
- **Inspector Block Margin Bottom**: 16px

### Responsive
- **Mobile (max-width: 820px)**:
  - Stage: flex-direction: column
  - Diagram min-height: 340px

---

## Common Animations

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```

### Breathe Animation
```css
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.18); opacity: 0; }
}
```

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
```

### Bob Animation
```css
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
```

### Typing Bounce Animation
```css
@keyframes tbounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
```

### Flow Animation
```css
@keyframes flow {
  to { stroke-dashoffset: -22; }
}
```

---

## Common Transitions

### Hover Transitions
- **Cards**: 0.35s cubic-bezier(0.34,1.56,0.64,1)
- **Buttons**: 0.2s ease
- **Transform**: 0.25s cubic-bezier(0.34,1.56,0.64,1)
- **Box Shadow**: 0.25s ease

### Filter Transitions
- **Pills**: 0.2s ease

### Annotation Transitions
- **Max Height**: 0.3s ease
- **Opacity**: 0.3s ease
- **Margin**: 0.3s ease

---

## Responsive Breakpoints

### Mobile
- **640px**: Hide search, reduce padding
- **600px**: Full-width messages
- **760px**: Stack detail layout
- **800px**: Hide sidebar
- **820px**: Stack diagram layout

---

## Notes
- All HTML files use the same font loading strategy with Google Fonts
- Color variables are consistent across all files
- Border radius values follow a consistent pattern (999px for pills, 32px for panels, etc.)
- Shadow values are consistent across components
- Animations use ease-in-out timing functions for smooth motion
- Hover states use cubic-bezier for bouncy, interactive feel
