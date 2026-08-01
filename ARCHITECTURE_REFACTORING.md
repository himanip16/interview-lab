# Architecture Refactoring: 5-Layer Learning Operating System

## Overview

This document outlines the refactoring of the current monolithic schema into a clean 5-layer architecture that separates:
1. **Content Library** (CMS - source of truth for all content)
2. **Knowledge Graph** (Skill dependency graph - curriculum)
3. **Content Mapping** (Content ↔ Skill relationships)
4. **Learning Paths** (Skill-based sequences, not content-based)
5. **Recommendation Engine** (Personalization overlay)

---

## Current Schema Issues

### Problems with Current Architecture

1. **Content stored in JSON blobs** - `Transcript.transcript`, `PracticeActivity.content`, `LearningAction.content` all use JSON. This makes querying, versioning, and migration painful.

2. **No skill-to-skill dependencies** - `Concept` only has hierarchy (`parentId`), no dependency graph. Skills don't know what other skills they require.

3. **Content → Skills only** - Only "teaches" relationship exists (`ProblemConcept`, `LearningActionConcept`). No "requires" relationship.

4. **Learning paths link to content directly** - `StudyStep` has `contentType` and `contentSlug`, linking directly to content instead of skills. This makes content non-interchangeable.

5. **Recommendations are content-specific** - `PracticeRecommendationItem` links to `activityId`, not skills. Can't recommend different content for the same skill.

6. **Difficulty is linear (EASY/MEDIUM/HARD)** - Should be categorical (Foundation/Intermediate/Advanced/Expert) with separate time/frequency/importance metrics.

---

## Layer 1: Content Library (CMS)

### Purpose
Source of truth for all content. Should know nothing about skills, paths, or recommendations.

### New Schema

```prisma
// ---------------------------------------------------------------------------
// LAYER 1: CONTENT LIBRARY (CMS)
// ---------------------------------------------------------------------------

// Base content metadata - common to all content types
model Content {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String?
  
  contentType ContentType
  status      ContentStatus @default(DRAFT)
  
  // Metadata (not difficulty - that's skill-specific)
  estimatedMinutes Int?
  interviewFrequency Int? // How often this appears in interviews (0-100)
  importance        Int?  // How important this is (0-100)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations to content-specific tables
  transcriptContent     TranscriptContent?
  deepDiveContent       DeepDiveContent?
  bugHuntContent        BugHuntContent?
  whiteboardContent     WhiteboardContent?
  interviewContent      InterviewContent?
  articleContent        ArticleContent?
  quizContent           QuizContent?
  prReviewContent       PrReviewContent?
  
  // Layer 3: Content-Skill mapping
  skillMappings ContentSkillMapping[]
  
  @@index([contentType, status])
}

enum ContentType {
  TRANSCRIPT
  DEEP_DIVE
  BUG_HUNT
  WHITEBOARD
  INTERVIEW
  ARTICLE
  QUIZ
  PR_REVIEW
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ---------------------------------------------------------------------------
// Content-specific tables (no more JSON blobs!)
// ---------------------------------------------------------------------------

model TranscriptContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  category    String
  company     String?
  interviewer String?
  candidate   String?
  duration    Int?
  summary     String?
  
  // Structured transcript data
  messages    TranscriptMessage[]
  
  @@index([category])
}

model TranscriptMessage {
  id          String @id @default(cuid())
  transcriptId String
  transcript  TranscriptContent @relation(fields: [transcriptId], references: [id], onDelete: Cascade)
  
  role        MessageRole
  content     String @db.Text
  timestamp   Int?
  phase       String?
  
  @@index([transcriptId])
}

model DeepDiveContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  // Markdown content with sections
  sections   DeepDiveSection[]
  category  String
  
  @@index([category])
}

model DeepDiveSection {
  id         String @id @default(cuid())
  deepDiveId String
  deepDive   DeepDiveContent @relation(fields: [deepDiveId], references: [id], onDelete: Cascade)
  
  order      Int
  title      String
  content    String @db.Text
  diagramUrl String?
  
  @@unique([deepDiveId, order])
  @@index([deepDiveId])
}

model BugHuntContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  category  String
  difficulty Difficulty // Bug hunts have inherent difficulty
  
  // Scenario data
  scenario  BugScenario
  logs      BugLog[]
  codeFiles BugCodeFile[]
  
  @@index([category, difficulty])
}

model BugScenario {
  id          String @id @default(cuid())
  bugHuntId   String @unique
  bugHunt     BugHuntContent @relation(fields: [bugHuntId], references: [id], onDelete: Cascade)
  
  title       String
  description String @db.Text
  setup       String @db.Text
  expectedBehavior String @db.Text
}

model BugLog {
  id        String @id @default(cuid())
  bugHuntId String
  bugHunt   BugHuntContent @relation(fields: [bugHuntId], references: [id], onDelete: Cascade)
  
  timestamp DateTime
  level     String // ERROR, WARN, INFO
  message   String @db.Text
  metadata  Json?
  
  @@index([bugHuntId, timestamp])
}

model BugCodeFile {
  id        String @id @default(cuid())
  bugHuntId String
  bugHunt   BugHuntContent @relation(fields: [bugHuntId], references: [id], onDelete: Cascade)
  
  path      String
  content   String @db.Text
  language  String
  
  @@unique([bugHuntId, path])
}

model WhiteboardContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  systemId  String // References WhiteboardSystem
  preset    String // "hld", "lld", etc.
  
  @@index([systemId])
}

model InterviewContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  templateId String // References InterviewTemplate
  problemId  String? // References Problem
  company    String
  difficulty Difficulty
  
  @@index([templateId])
  @@index([company, difficulty])
}

model ArticleContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  // Markdown article
  body      String @db.Text
  category  String
  author    String?
  readTime  Int?
  
  @@index([category])
}

model QuizContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  questions QuizQuestion[]
  category  String
  
  @@index([category])
}

model QuizQuestion {
  id        String @id @default(cuid())
  quizId    String
  quiz      QuizContent @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  order     Int
  question  String @db.Text
  options   Json // Array of options
  correctAnswer Int
  explanation String?
  
  @@unique([quizId, order])
}

model PrReviewContent {
  id        String @id @default(cuid())
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  repository String
  branch     String
  commitHash String
  
  files      PrFile[]
  
  @@index([repository])
}

model PrFile {
  id        String @id @default(cuid())
  prReviewId String
  prReview  PrReviewContent @relation(fields: [prReviewId], references: [id], onDelete: Cascade)
  
  path      String
  oldContent String? @db.Text
  newContent String? @db.Text
  status    String // ADDED, MODIFIED, DELETED
  
  @@unique([prReviewId, path])
}
```

### Key Changes from Current Schema

1. **Removed JSON blobs** - Each content type has its own typed table
2. **Base `Content` table** - Common metadata for all content
3. **No skill relationships** - Skills are handled in Layer 3
4. **No learning paths** - Paths are handled in Layer 4
5. **Status field** - Draft/Published/Archived workflow
6. **Separate difficulty** - Only where inherent (BugHunt, Interview)

---

## Layer 2: Knowledge Graph (Skill Dependencies)

### Purpose
The curriculum. Connects skills to skills, not content to content. This graph rarely changes.

### New Schema

```prisma
// ---------------------------------------------------------------------------
// LAYER 2: KNOWLEDGE GRAPH (Skill Dependency Graph)
// ---------------------------------------------------------------------------

model Skill {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?
  category    String   // "DSA", "System Design", "Backend", etc.
  
  // Difficulty level (categorical, not linear)
  difficulty  SkillDifficulty @default(FOUNDATION)
  
  // Estimated time to master (not content-specific)
  estimatedHours Int?
  
  // Interview relevance
  interviewFrequency Int? // 0-100
  importance        Int?  // 0-100
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Layer 2: Skill dependencies
  prerequisites  SkillDependency[] @relation("SkillPrerequisites")
  dependents     SkillDependency[] @relation("SkillDependents")
  
  // Layer 3: Content mappings
  taughtByContent   ContentSkillMapping[] @relation("SkillTaughtBy")
  requiredByContent ContentSkillMapping[] @relation("SkillRequiredBy")
  
  // Layer 4: Learning paths
  pathSteps LearningPathStep[]
  
  // User mastery (existing)
  masteries ConceptMastery[]
  
  @@index([category, difficulty])
  @@index([interviewFrequency])
}

enum SkillDifficulty {
  FOUNDATION
  INTERMEDIATE
  ADVANCED
  EXPERT
}

// Skill-to-skill dependencies (the graph)
model SkillDependency {
  id             String @id @default(cuid())
  prerequisiteId String
  prerequisite   Skill  @relation("SkillPrerequisites", fields: [prerequisiteId], references: [id], onDelete: Cascade)
  
  dependentId    String
  dependent      Skill  @relation("SkillDependents", fields: [dependentId], references: [id], onDelete: Cascade)
  
  strength       Float @default(1.0) // How strong this dependency is (0-1)
  
  @@unique([prerequisiteId, dependentId])
  @@index([prerequisiteId])
  @@index([dependentId])
}
```

### Key Changes from Current Schema

1. **Renamed `Concept` to `Skill`** - More accurate naming
2. **Added `SkillDependency`** - Skill-to-skill prerequisite graph
3. **Categorical difficulty** - Foundation/Intermediate/Advanced/Expert
4. **Removed hierarchy** - Dependencies replace simple parent/child
5. **Added interview metrics** - Frequency and importance separate from difficulty

### Example Skill Graph

```
Hash Map (Foundation)
    ↓ (requires)
Frequency Counting (Intermediate)
    ↓ (requires)
Sliding Window (Intermediate)
    ↓ (requires)
Variable Window (Advanced)
    ↓ (requires)
Minimum Window Substring (Expert)
```

Another example:

```
Mutex (Foundation)
    ↓ (requires)
Race Condition (Intermediate)
    ↓ (requires)
Deadlock (Advanced)
    ↓ (requires)
Thread Pool (Advanced)
    ↓ (requires)
Concurrent Queue (Expert)
```

---

## Layer 3: Content Mapping (Teaches/Requires)

### Purpose
Map content to skills. Content becomes interchangeable because we map to skills, not content-to-content.

### New Schema

```prisma
// ---------------------------------------------------------------------------
// LAYER 3: CONTENT MAPPING (Content ↔ Skills)
// ---------------------------------------------------------------------------

model ContentSkillMapping {
  id        String @id @default(cuid())
  contentId String
  content   Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  skillId   String
  skill     Skill   @relation("SkillTaughtBy", fields: [skillId], references: [id], onDelete: Cascade)
  
  mappingType ContentMappingType // TEACHES or REQUIRES
  weight     Float @default(1.0) // How strongly this content relates to the skill
  
  @@unique([contentId, skillId, mappingType])
  @@index([contentId])
  @@index([skillId, mappingType])
}

enum ContentMappingType {
  TEACHES   // This content teaches this skill
  REQUIRES  // This content requires this skill (prerequisite)
}
```

### Key Changes from Current Schema

1. **Two relationship types** - TEACHES and REQUIRES
2. **Weighted relationships** - Some content teaches a skill more strongly
3. **Bidirectional queries** - Can find content that teaches X, or content that requires X
4. **Content becomes interchangeable** - Multiple content items can teach the same skill

### Example Mappings

**Deep Dive: Sliding Window**
```
TEACHES: Sliding Window (weight: 1.0)
REQUIRES: Arrays (weight: 0.8), Hash Map (weight: 0.6)
```

**Transcript: Google Interview**
```
TEACHES: System Design (weight: 0.7), Scalability (weight: 0.8)
REQUIRES: Distributed Systems (weight: 0.9), Databases (weight: 0.7)
```

**Bug Hunt: Checkout Timeout**
```
TEACHES: Debugging (weight: 0.8), Race Conditions (weight: 0.9)
REQUIRES: Mutex (weight: 1.0), Locks (weight: 0.9)
```

---

## Layer 4: Learning Paths (Skill-Based Sequences)

### Purpose
Define "read this then this" for different goals. Same content, different order. Paths reference skills, not content directly.

### New Schema

```prisma
// ---------------------------------------------------------------------------
// LAYER 4: LEARNING PATHS (Skill-Based Sequences)
// ---------------------------------------------------------------------------

model LearningPath {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String?
  
  pathType    PathType // COMPANY, ROLE, DOMAIN, CUSTOM
  target      String?  // "Amazon", "Backend", "DSA", etc.
  
  isActive    Boolean  @default(true)
  estimatedWeeks Int?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  steps LearningPathStep[]
  
  @@index([pathType, target])
  @@index([isActive])
}

enum PathType {
  COMPANY   // Amazon, Google, Meta
  ROLE      // Backend, Frontend, Full Stack
  DOMAIN    // DSA, System Design, Distributed Systems
  CUSTOM    // User-created paths
}

model LearningPathStep {
  id        String @id @default(cuid())
  pathId    String
  path      LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  
  order     Int
  skillId   String
  skill     Skill @relation(fields: [skillId], references: [id], onDelete: Cascade)
  
  isOptional Boolean @default(false)
  isMilestone Boolean @default(false) // Boss gate
  
  @@unique([pathId, order])
  @@index([pathId])
  @@index([skillId])
}
```

### Key Changes from Current Schema

1. **Paths reference skills, not content** - `StudyStep.contentSlug` → `LearningPathStep.skillId`
2. **Path types** - Company, Role, Domain, Custom
3. **Milestones** - Boss gates for important skills
4. **Optional steps** - Flexible learning
5. **Same content, different order** - Skills can appear in multiple paths

### Example Paths

**Amazon SDE 2 Path**
```
1. Arrays (Foundation)
2. Hash Map (Foundation) 
3. Sliding Window (Intermediate)
4. Heap (Intermediate)
5. Graphs (Advanced)
6. System Design (Advanced)
7. Distributed Systems (Expert)
```

**Google Path**
```
1. Arrays (Foundation)
2. Binary Search (Intermediate)
3. Trees (Intermediate)
4. Graphs (Advanced)
5. Dynamic Programming (Advanced)
6. Distributed Systems (Expert)
```

**Backend Path**
```
1. REST APIs (Foundation)
2. Caching (Intermediate)
3. Message Queues (Intermediate)
4. Kafka (Advanced)
5. Redis (Advanced)
6. Distributed Locks (Expert)
7. Scaling (Expert)
```

---

## Layer 5: Recommendation Engine (Personalization)

### Purpose
Personalization overlay. Takes current goal, weak skills, prerequisites, time available → generates "Today's Plan". Completely separate from curriculum.

### New Schema

```prisma
// ---------------------------------------------------------------------------
// LAYER 5: RECOMMENDATION ENGINE (Personalization Overlay)
// ---------------------------------------------------------------------------

model UserLearningGoal {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  pathId      String?  // Optional: following a specific path
  path        LearningPath? @relation(fields: [pathId], references: [id])
  
  targetSkill String?  // Or focusing on a specific skill
  targetRole  String?  // Or preparing for a specific role
  targetCompany String? // Or preparing for a specific company
  
  deadline    DateTime?
  hoursPerWeek Int?
  
  isActive    Boolean  @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  dailyPlans DailyPlan[]
  
  @@unique([userId, isActive])
  @@index([userId])
}

model DailyPlan {
  id          String   @id @default(cuid())
  goalId      String
  goal        UserLearningGoal @relation(fields: [goalId], references: [id], onDelete: Cascade)
  
  date        DateTime @db.Date
  timeAvailableMinutes Int?
  
  // Recommended content for this day
  recommendations DailyRecommendation[]
  
  completed   Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@unique([goalId, date])
  @@index([goalId])
  @@index([date])
}

model DailyRecommendation {
  id          String   @id @default(cuid())
  planId      String
  plan        DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  
  contentId   String
  content     Content @relation(fields: [contentId], references: [id])
  
  targetSkillId String?
  targetSkill   Skill? @relation(fields: [targetSkillId], references: [id])
  
  order       Int
  reason      String // "Review because you struggled yesterday", "Next in path", etc.
  estimatedMinutes Int
  
  completed   Boolean  @default(false)
  skipped     Boolean  @default(false)
  
  @@unique([planId, order])
  @@index([planId])
  @@index([contentId])
  @@index([targetSkillId])
}
```

### Key Changes from Current Schema

1. **User goals** - Explicit goal setting (path, skill, role, company)
2. **Daily plans** - Time-boxed recommendations
3. **Skill-based recommendations** - Recommend content based on skills, not content-to-content
4. **Reasoning** - Why this content is recommended
5. **Completion tracking** - Track what was actually done

### Recommendation Algorithm

```
Current Goal (Amazon Path)
+
Weak Skills (Sliding Window: 0.3 mastery)
+
Prerequisites (Arrays: 0.8 mastery ✓, Hash Map: 0.5 mastery ⚠️)
+
Time Available (45 minutes)
↓
Generate Plan:
1. Review Hash Map (10 min) - weak prerequisite
2. Sliding Window Deep Dive (20 min) - target skill
3. Sliding Window Practice (15 min) - reinforce
```

---

## Migration Strategy

### Phase 1: Add New Tables (Non-Breaking)

1. Create new Layer 1-5 tables alongside existing ones
2. Keep existing tables (`Transcript`, `Problem`, etc.) for backward compatibility
3. Run migration to populate new tables from existing data

### Phase 2: Migrate Data

1. **Content Library**: Migrate `Transcript` → `Content` + `TranscriptContent`
2. **Knowledge Graph**: Convert `Concept` hierarchy to `Skill` dependencies
3. **Content Mapping**: Convert `ProblemConcept` → `ContentSkillMapping` (TEACHES)
4. **Learning Paths**: Convert `StudyPath` → `LearningPath` (skill-based)
5. **Recommendations**: Migrate to new goal-based system

### Phase 3: Update Services

1. Update services to use new Layer 1-5 tables
2. Keep old services for backward compatibility during transition
3. Gradually migrate feature by feature

### Phase 4: Remove Old Tables

1. Once all services migrated, remove old tables
2. Clean up unused relationships
3. Final migration

---

## Benefits of New Architecture

1. **Separation of concerns** - Each layer has a single responsibility
2. **Content interchangeability** - Same skill can be taught by multiple content types
3. **Stable curriculum** - Skill graph rarely changes, paths can be added/modified
4. **Flexible personalization** - Recommendations adapt without changing curriculum
5. **Better querying** - Typed tables instead of JSON blobs
6. **Easier migration** - Schema changes are localized to specific layers
7. **Future-proof** - New content types, paths, and recommendation strategies fit naturally

---

## Next Steps

1. Review and approve this architecture
2. Create Prisma migration for Phase 1
3. Write data migration scripts
4. Update services layer by layer
5. Test thoroughly before removing old tables
