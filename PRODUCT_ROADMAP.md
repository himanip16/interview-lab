# Product Roadmap: Building the Best Software Engineering Learning Platform

## Vision

Build an **engineering simulator**, not a course platform. The platform should feel like continuous, multi-modal learning through structured curriculum + concept graph + rich interactive experiences + adaptive recommendations.

---

## Learning Philosophy

### Core Experience: "Engineering Journey" not "Course"

- **Learn → Visualize → Apply → Explain → Validate**
- Every 5-10 minutes should be interactive
- Progress tracked via **concept mastery**, not XP or completion
- "Mastered" means: demonstrated across multiple contexts (interviews, bug hunts, PR reviews)

### Learning Principles

1. **Context First** - Every concept answers: Why does this exist? Where is it used? Which companies use it?
2. **Multi-Modal Learning** - Deep dive → visualization → interactive question → whiteboard → transcript → practice → bug hunt → reflection
3. **Scenario-Based** - Learn through building real systems (Twitter, Uber, WhatsApp) not isolated lessons
4. **Adaptive** - Detect weak concepts, recommend reviews, generate personalized study plans
5. **Mastery-Driven** - Track accuracy, confidence, time, attempts, long-term retention

### What "Mastered" Means

| Content Type | Mastery Criteria |
|-------------|-----------------|
| Deep Dive | Completed + quiz passed + explained in own words |
| Transcript | Read + key concepts identified + explained interviewer's reasoning |
| Whiteboard | Built correctly + explained trade-offs + defended design |
| Practice | Solved correctly + optimal complexity + explained approach |
| Bug Hunt | Found root cause + proposed fix + explained debugging process |
| PR Review | Identified all issues + suggested improvements + explained reasoning |
| Interview | Passed evaluation + demonstrated concepts + handled follow-ups |

### Interactivity Standards

- **Every 5-10 minutes**: Interactive element (quiz, prediction, whiteboard, code trace)
- **Every 15-20 minutes**: Major activity (bug hunt, PR review, interview simulation)
- **Every 30-45 minutes**: Checkpoint/assessment

---

## Phase 1: Foundation (Priority)

### 1.1 Knowledge Graph

**Status**: Architecture designed in `ARCHITECTURE_REFACTORING.md` (Layer 2)

**Implementation Tasks**:

- [ ] Define initial skill taxonomy (50-100 core skills)
- [ ] Add skill dependencies (prerequisite graph)
- [ ] Group skills into domains (DSA, LLD, HLD, Backend, DB, Kafka, Redis, etc.)
- [ ] Assign estimated learning time per skill
- [ ] Assign categorical difficulty (Foundation/Intermediate/Advanced/Expert)
- [ ] Assign interview importance (0-100)
- [ ] Assign companies where frequently asked
- [ ] Map skills to existing content (problems, transcripts, deep dives)

**Initial Skill Taxonomy**:

```
DSA Domain:
- Arrays (Foundation)
- Hash Map (Foundation)
- Strings (Foundation)
- Linked Lists (Foundation)
- Stacks & Queues (Foundation)
- Binary Search (Intermediate)
- Two Pointers (Intermediate)
- Sliding Window (Intermediate)
- Trees (Intermediate)
- Graphs (Advanced)
- Dynamic Programming (Advanced)
- Backtracking (Advanced)
- Tries (Advanced)

LLD Domain:
- Object Modeling (Foundation)
- Design Patterns (Intermediate)
- Encapsulation (Foundation)
- Inheritance (Foundation)
- Polymorphism (Intermediate)
- SOLID Principles (Intermediate)
- Creational Patterns (Advanced)
- Structural Patterns (Advanced)
- Behavioral Patterns (Advanced)

HLD Domain:
- System Design Basics (Foundation)
- Scalability (Intermediate)
- Availability (Intermediate)
- Consistency (Intermediate)
- Caching (Intermediate)
- Load Balancing (Intermediate)
- Database Sharding (Advanced)
- Message Queues (Advanced)
- Microservices (Advanced)
- Event-Driven Architecture (Expert)

Backend Domain:
- REST APIs (Foundation)
- Authentication (Foundation)
- Database Design (Intermediate)
- Caching Strategies (Intermediate)
- Rate Limiting (Intermediate)
- Kafka (Advanced)
- Redis (Advanced)
- Distributed Locks (Advanced)
- Circuit Breakers (Expert)

Database Domain:
- SQL Basics (Foundation)
- Indexing (Intermediate)
- Transactions (Intermediate)
- Normalization (Intermediate)
- NoSQL (Intermediate)
- Replication (Advanced)
- Sharding (Advanced)
- Consistency Models (Expert)

Kafka Domain:
- Messaging Basics (Foundation)
- Producers/Consumers (Intermediate)
- Partitions (Intermediate)
- Offsets (Intermediate)
- Consumer Groups (Advanced)
- Exactly-Once Semantics (Advanced)
- Kafka Streams (Expert)

Redis Domain:
- Data Structures (Foundation)
- Persistence (Intermediate)
- Replication (Intermediate)
- Clustering (Advanced)
- Pub/Sub (Intermediate)
- Lua Scripting (Advanced)
- Redis Streams (Expert)
```

### 1.2 Course Structure

**Schema**: Already designed in `ARCHITECTURE_REFACTORING.md` (Layer 4)

**Course Metadata**:

```prisma
model Course {
  id          String @id @default(cuid())
  slug        String @unique
  title       String
  description String?
  
  // Learning goals
  goals       String[]
  
  // Prerequisites (skills)
  prerequisiteSkillIds String[]
  
  // Skills gained
  skillIds    String[]
  
  // Metadata
  estimatedWeeks Int?
  difficulty  SkillDifficulty
  
  // Real-world applications
  applications String[]
  
  // Final assessment
  finalAssessmentContentId String?
  
  // Unlocks after completion
  unlocksCourseIds String[]
  
  isActive    Boolean @default(true)
  
  lessons     Lesson[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Standard Course Structure**:

1. **Learning Goals** - What you'll achieve
2. **Prerequisites** - Skills you need before starting
3. **Estimated Duration** - Time commitment
4. **Skills Gained** - Skills you'll master
5. **Real-World Applications** - Where this is used
6. **Final Assessment** - Capstone/interview to validate mastery
7. **Unlocks** - What becomes available after completion

### 1.3 Learning Paths

**Status**: Architecture designed in `ARCHITECTURE_REFACTORING.md` (Layer 4)

**Initial Paths**:

```prisma
// DSA Path
LearningPath {
  slug: "dsa-foundation"
  title: "DSA Foundation"
  pathType: DOMAIN
  target: "DSA"
  steps: [
    { order: 1, skillId: "arrays", isMilestone: true },
    { order: 2, skillId: "hash-map", isMilestone: true },
    { order: 3, skillId: "strings" },
    { order: 4, skillId: "linked-lists" },
    { order: 5, skillId: "stacks-queues", isMilestone: true },
    { order: 6, skillId: "binary-search" },
    { order: 7, skillId: "two-pointers" },
    { order: 8, skillId: "sliding-window", isMilestone: true },
    { order: 9, skillId: "trees" },
    { order: 10, skillId: "graphs", isMilestone: true },
    { order: 11, skillId: "dynamic-programming", isMilestone: true },
  ]
}

// LLD Path
LearningPath {
  slug: "lld-foundation"
  title: "Low Level Design"
  pathType: DOMAIN
  target: "LLD"
  steps: [
    { order: 1, skillId: "object-modeling", isMilestone: true },
    { order: 2, skillId: "encapsulation" },
    { order: 3, skillId: "inheritance" },
    { order: 4, skillId: "polymorphism" },
    { order: 5, skillId: "design-patterns", isMilestone: true },
    { order: 6, skillId: "solid-principles", isMilestone: true },
    { order: 7, skillId: "creational-patterns" },
    { order: 8, skillId: "structural-patterns" },
    { order: 9, skillId: "behavioral-patterns", isMilestone: true },
  ]
}

// HLD Path
LearningPath {
  slug: "hld-foundation"
  title: "High Level Design"
  pathType: DOMAIN
  target: "HLD"
  steps: [
    { order: 1, skillId: "system-design-basics", isMilestone: true },
    { order: 2, skillId: "scalability" },
    { order: 3, skillId: "availability" },
    { order: 4, skillId: "consistency", isMilestone: true },
    { order: 5, skillId: "caching" },
    { order: 6, skillId: "load-balancing" },
    { order: 7, skillId: "database-sharding", isMilestone: true },
    { order: 8, skillId: "message-queues" },
    { order: 9, skillId: "microservices", isMilestone: true },
    { order: 10, skillId: "event-driven-architecture", isMilestone: true },
  ]
}

// Backend Path
LearningPath {
  slug: "backend-engineer"
  title: "Backend Engineer"
  pathType: ROLE
  target: "Backend"
  steps: [
    { order: 1, skillId: "rest-apis", isMilestone: true },
    { order: 2, skillId: "authentication" },
    { order: 3, skillId: "database-design", isMilestone: true },
    { order: 4, skillId: "caching-strategies" },
    { order: 5, skillId: "rate-limiting" },
    { order: 6, skillId: "kafka", isMilestone: true },
    { order: 7, skillId: "redis", isMilestone: true },
    { order: 8, skillId: "distributed-locks" },
    { order: 9, skillId: "circuit-breakers", isMilestone: true },
  ]
}

// Amazon SDE 2 Path
LearningPath {
  slug: "amazon-sde2"
  title: "Amazon SDE 2 Interview Prep"
  pathType: COMPANY
  target: "Amazon"
  steps: [
    { order: 1, skillId: "arrays", isMilestone: true },
    { order: 2, skillId: "hash-map", isMilestone: true },
    { order: 3, skillId: "strings" },
    { order: 4, skillId: "sliding-window", isMilestone: true },
    { order: 5, skillId: "trees" },
    { order: 6, skillId: "graphs", isMilestone: true },
    { order: 7, skillId: "system-design-basics" },
    { order: 8, skillId: "scalability", isMilestone: true },
    { order: 9, skillId: "distributed-systems", isMilestone: true },
  ]
}

// Google Path
LearningPath {
  slug: "google-swe"
  title: "Google SWE Interview Prep"
  pathType: COMPANY
  target: "Google"
  steps: [
    { order: 1, skillId: "arrays", isMilestone: true },
    { order: 2, skillId: "binary-search", isMilestone: true },
    { order: 3, skillId: "trees", isMilestone: true },
    { order: 4, skillId: "graphs", isMilestone: true },
    { order: 5, skillId: "dynamic-programming", isMilestone: true },
    { order: 6, skillId: "system-design-basics" },
    { order: 7, skillId: "scalability" },
    { order: 8, skillId: "distributed-systems", isMilestone: true },
  ]
}
```

### 1.4 Standardized Lesson Template

**Schema Extension**:

```prisma
model Lesson {
  id          String @id @default(cuid())
  courseId    String
  course      Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  order       Int
  title       String
  description String?
  
  // Lesson structure (standardized)
  story       String? @db.Text        // Mission/story context
  motivation  String? @db.Text        // Why this matters
  deepDiveContentId String?           // Core explanation
  visualizationContentId String?     // Interactive visualization
  interactiveQuestionId String?      // Quiz/prediction
  whiteboardContentId String?         // Whiteboard activity
  transcriptContentId String?         // Real interview
  practiceContentId String?          // Practice problems
  bugHuntContentId String?           // Debugging exercise
  prReviewContentId String?          // Code review
  reflectionPrompt String? @db.Text  // Self-assessment
  summary     String? @db.Text        // Key takeaways
  checkpointContentId String?        // Assessment
  
  isBossGate  Boolean @default(false) // Major milestone
  
  estimatedMinutes Int?
  
  // Skills taught/required
  taughtSkillIds String[]
  requiredSkillIds String[]
  
  isActive    Boolean @default(true)
  
  userProgress UserLessonProgress[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([courseId, order])
  @@index([courseId])
}

model UserLessonProgress {
  id          String @id @default(cuid())
  userId      String
  lessonId    String
  
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson      Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  // Track completion of each section
  storyCompleted Boolean @default(false)
  deepDiveCompleted Boolean @default(false)
  visualizationCompleted Boolean @default(false)
  interactiveQuestionCompleted Boolean @default(false)
  whiteboardCompleted Boolean @default(false)
  transcriptCompleted Boolean @default(false)
  practiceCompleted Boolean @default(false)
  bugHuntCompleted Boolean @default(false)
  prReviewCompleted Boolean @default(false)
  reflectionCompleted Boolean @default(false)
  checkpointCompleted Boolean @default(false)
  
  // Overall completion
  completed   Boolean @default(false)
  
  // Mastery metrics
  accuracy    Float?
  confidence  Float?
  timeSpentMinutes Int?
  
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  @@unique([userId, lessonId])
  @@index([userId])
  @@index([lessonId])
}
```

**Standard Lesson Flow**:

1. **Story/Mission** (2 min) - "You're building Twitter's timeline..."
2. **Motivation** (3 min) - Why this concept matters in real systems
3. **Deep Dive** (10 min) - Core explanation with examples
4. **Visualization** (5 min) - Interactive diagram/animation
5. **Interactive Question** (3 min) - Check understanding
6. **Whiteboard Activity** (10 min) - Draw/explain the concept
7. **Transcript** (5 min) - See how it's discussed in interviews
8. **Practice** (10 min) - Apply the concept
9. **Bug Hunt** (10 min) - Debug issues related to the concept
10. **PR Review** (5 min) - Review code using the concept
11. **Reflection** (3 min) - Explain in your own words
12. **Summary** (2 min) - Key takeaways
13. **Checkpoint** (5 min) - Assessment to unlock next lesson

**Total**: ~68 minutes per lesson (can be split across multiple sessions)

---

## Phase 2: Interactive Learning

### 2.1 Whiteboards

**Status**: Already implemented with `WhiteboardSystem`, `WhiteboardNode`, `WhiteboardEdge`

**Enhancements Needed**:

- [ ] Preset whiteboards for each skill
- [ ] Auto-save and versioning
- [ ] AI evaluation of whiteboard designs
- [ ] Collaborative whiteboards (for team scenarios)
- [ ] Export to image/PDF
- [ ] Template library

### 2.2 Interactive Questions

**Question Types**:

```prisma
model InteractiveQuestion {
  id          String @id @default(cuid())
  contentId  String @unique
  content    Content @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  questionType QuestionType
  question    String @db.Text
  
  // Type-specific data
  options     Json?              // For multiple choice
  correctAnswer Json?           // For multiple choice/fill-in-blanks
  dragDropItems Json?          // For drag and drop
  codeSnippet String? @db.Text // For code tracing
  architectureDiagram String?  // For click-through
  
  explanation String @db.Text
  hints      String[]
  
  // Skill being tested
  skillId    String?
  
  difficulty SkillDifficulty
  
  @@index([questionType])
  @@index([skillId])
}

enum QuestionType {
  MULTIPLE_CHOICE
  PREDICT_NEXT_STEP
  FILL_IN_BLANKS
  DRAG_AND_DROP
  CLICK_THROUGH_ARCHITECTURE
  CODE_TRACING
  PRODUCTION_DEBUGGING
  VOICE_EXPLANATION
}
```

### 2.3 AI Tutor

**Features**:

- [ ] Socratic questioning
- [ ] Hints on demand
- [ ] Explanations based on mistakes
- [ ] Follow-up questions
- [ ] Code review
- [ ] Architecture feedback

**Schema**:

```prisma
model AITutorSession {
  id          String @id @default(cuid())
  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  lessonId    String?
  skillId     String?
  
  context     Json? // Current learning context
  
  messages    AITutorMessage[]
  
  startedAt   DateTime @default(now())
  endedAt     DateTime?
  
  @@index([userId])
  @@index([lessonId])
}

model AITutorMessage {
  id          String @id @default(cuid())
  sessionId   String
  session     AITutorSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  role        String // "tutor" or "student"
  content     String @db.Text
  
  metadata    Json? // Hint level, question type, etc.
  
  createdAt DateTime @default(now())
  
  @@index([sessionId])
}
```

### 2.4 Bug Hunts

**Status**: Already implemented with `BugAttempt`, `BugHypothesisAttempt`, `Finding`

**Enhancements Needed**:

- [ ] More scenarios (currently in JSON fixtures)
- [ ] AI-generated scenarios
- [ ] Progressive difficulty
- [ ] Leaderboards
- [ ] Team bug hunts

### 2.5 PR Reviews

**Status**: Already implemented with `ReviewAttempt`, `ReviewComment`, `ReviewReport`

**Enhancements Needed**:

- [ ] More PR scenarios
- [ ] AI-generated PRs with intentional bugs
- [ ] Company-specific code styles
- [ ] Performance review focus
- [ ] Security review focus

### 2.6 Interview Simulations

**Status**: Already implemented with `Interview`, `InterviewTemplate`

**Enhancements Needed**:

- [ ] More company-specific templates
- [ ] Role-specific templates (Staff vs SDE2)
- [ ] Reverse interview mode (candidate interviews interviewer)
- [ ] Panel interview simulation
- [ ] Take-home assignment simulation

---

## Phase 3: Personalization

### 3.1 Mastery Engine

**Enhanced Mastery Tracking**:

```prisma
model SkillMastery {
  id     String @id @default(cuid())
  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  skillId String
  skill   Skill @relation(fields: [skillId], references: [id], onDelete: Cascade)
  
  // Core mastery metrics
  score              Float     @default(0) // 0-1 rolling estimate
  confidence         Float     @default(0) // 0-1
  
  // Detailed metrics
  accuracy           Float?    // Overall accuracy across attempts
  avgTimeMinutes     Float?    // Average time to complete
  attemptCount       Int       @default(0)
  
  // Context-specific mastery
  interviewScore     Float?    // Performance in interviews
  bugHuntScore       Float?    // Performance in bug hunts
  prReviewScore      Float?    // Performance in PR reviews
  
  // Retention metrics
  lastDemonstratedAt DateTime?
  lastReviewedAt     DateTime?
  retentionScore     Float?    // 0-1, based on spaced repetition
  
  // Trend
  masteryTrend       Json?     // [{date, score}] for visualization
  
  @@unique([userId, skillId])
  @@index([userId])
  @@index([skillId])
}
```

### 3.2 Recommendations

**Status**: Architecture designed in `ARCHITECTURE_REFACTORING.md` (Layer 5)

**Recommendation Types**:

```prisma
enum RecommendationReason {
  WEAK_SKILL              // Review because mastery is low
  PREREQUISITE_GAP        // Learn because required for current goal
  PATH_NEXT               // Next step in learning path
  RETENTION_REFRESH       // Review because not practiced recently
  INTERVIEW_PREP          // Practice because frequently asked at target company
  SPACED_REPETITION       // Review due for retention
  CHALLENGE               // Stretch goal based on strong skills
  REMEDIATION             // Fix specific mistake pattern
}
```

**Recommendation Algorithm**:

```
Input:
- Current goal (path/skill/company/role)
- User's mastery scores
- Time available
- Recent mistakes
- Last practiced dates

Output:
- Daily plan with 3-5 recommendations
- Each with: content, target skill, reason, estimated time

Algorithm:
1. Identify weak skills (mastery < 0.6)
2. Check prerequisite gaps for current goal
3. Get next step in learning path
4. Check retention needs (not practiced in 7 days)
5. Filter by time available
6. Prioritize by importance + urgency
7. Return top N recommendations
```

### 3.3 Adaptive Study Plans

**Features**:

- [ ] Daily personalized plans
- [ ] Weekly goals
- [ ] Deadline-based planning (interview in 2 weeks)
- [ ] Time-budget planning (5 hours/week)
- [ ] Intensity adjustment (cram vs steady)
- [ ] Break recommendations

### 3.4 Review Scheduling

**Spaced Repetition System**:

```prisma
model ReviewSchedule {
  id          String @id @default(cuid())
  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  skillId     String
  skill       Skill @relation(fields: [skillId], references: [id], onDelete: Cascade)
  
  // Spaced repetition scheduling
  nextReviewAt DateTime
  interval    Int // Days until next review
  easeFactor  Float @default(2.5) // SM-2 algorithm
  
  // Review history
  reviewCount Int @default(0)
  lastReviewAt DateTime?
  lastReviewQuality Float? // 0-5
  
  @@unique([userId, skillId])
  @@index([userId, nextReviewAt])
}
```

### 3.5 Progress Analytics

**Analytics Dashboard**:

```prisma
model UserAnalytics {
  id          String @id @default(cuid())
  userId      String @unique
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Time metrics
  totalTimeMinutes Int @default(0)
  thisWeekMinutes Int @default(0)
  thisMonthMinutes Int @default(0)
  
  // Skill metrics
  totalSkillsMastered Int @default(0)
  weakSkillsCount Int @default(0) // mastery < 0.6
  strongSkillsCount Int @default(0) // mastery > 0.8
  
  // Content metrics
  lessonsCompleted Int @default(0)
  coursesCompleted Int @default(0)
  pathsCompleted Int @default(0)
  
  // Performance metrics
  avgAccuracy Float?
  interviewSuccessRate Float?
  
  // Engagement metrics
  currentStreak Int @default(0)
  longestStreak Int @default(0)
  lastActiveAt DateTime?
  
  // Readiness metrics
  interviewReadiness Float? // 0-100
  companyReadiness Json? // { "Amazon": 75, "Google": 60 }
  
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}
```

---

## Phase 4: Differentiation

### 4.1 Scenario-Based Engineering Journeys

**Long-Running Scenarios**:

```prisma
model Scenario {
  id          String @id @default(cuid())
  slug        String @unique
  title       String
  description String?
  
  scenarioType ScenarioType // BUILD_SYSTEM, DEBUG_INCIDENT, SCALE_SYSTEM
  
  // Real-world context
  company     String? // "Twitter", "Uber", etc.
  system      String // "Timeline", "Ride Matching", etc.
  
  estimatedWeeks Int?
  difficulty  SkillDifficulty
  
  episodes    ScenarioEpisode[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ScenarioType {
  BUILD_SYSTEM      // Build X from scratch
  DEBUG_INCIDENT    // Debug production issue
  SCALE_SYSTEM      // Scale X to Y users
  MIGRATE_SYSTEM   // Migrate from A to B
}

model ScenarioEpisode {
  id          String @id @default(cuid())
  scenarioId  String
  scenario    Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  
  order       Int
  title       String
  description String?
  
  // Episode content
  mission     String @db.Text
  context     String @db.Text
  challenge   String @db.Text
  
  // Required skills
  skillIds    String[]
  
  // Episode activities
  activities  ScenarioActivity[]
  
  isBossGate  Boolean @default(false)
  
  @@unique([scenarioId, order])
}

model ScenarioActivity {
  id          String @id @default(cuid())
  episodeId   String
  episode     ScenarioEpisode @relation(fields: [episodeId], references: [id], onDelete: Cascade)
  
  order       Int
  activityType ScenarioActivityType
  contentId   String
  
  @@unique([episodeId, order])
}

enum ScenarioActivityType {
  DEEP_DIVE
  WHITEBOARD
  CODING
  BUG_HUNT
  PR_REVIEW
  INTERVIEW
  DEPLOYMENT
  MONITORING
  INCIDENT_RESPONSE
}
```

**Example Scenarios**:

1. **Build Twitter Timeline**
   - Episode 1: Design the data model
   - Episode 2: Implement fanout-on-write
   - Episode 3: Add caching
   - Episode 4: Handle scale
   - Episode 5: Debug latency issue
   - Episode 6: Add read replicas

2. **Build Uber Ride Matching**
   - Episode 1: Design matching algorithm
   - Episode 2: Handle real-time location updates
   - Episode 3: Implement surge pricing
   - Episode 4: Scale to millions
   - Episode 5: Debug lost rides

3. **Debug Kafka Outage**
   - Episode 1: Investigate consumer lag
   - Episode 2: Identify partition imbalance
   - Episode 3: Fix producer bottleneck
   - Episode 4: Implement monitoring
   - Episode 5: Document incident

### 4.2 Company-Specific Learning Paths

**Enhanced Company Data**:

```prisma
model CompanyProfile {
  id          String @id @default(cuid())
  name        String @unique
  
  // Interview patterns
  focusAreas  String[] // ["DSA", "System Design", "Backend"]
  difficulty  String // "Hard", "Medium"
  
  // Frequently asked skills
  topSkills   Json // [{ skillId, frequency, importance }]
  
  // Role-specific requirements
  roleRequirements Json? // { "SDE1": [...], "SDE2": [...], "Staff": [...] }
  
  // Sample questions
  sampleQuestions Json?
  
  // Culture fit
  cultureNotes String? @db.Text
  
  learningPaths LearningPath[]
  
  @@index([name])
}
```

### 4.3 AI-Generated Practice

**On-Demand Content Generation**:

```prisma
model GeneratedContent {
  id          String @id @default(cuid())
  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  contentType ContentType
  skillIds    String[]
  
  // Generation parameters
  difficulty  SkillDifficulty
  context     String? // "Amazon interview", "Production debugging"
  
  // Generated content
  content     Json // The actual generated content
  
  // Quality metrics
  qualityScore Float?
  userFeedback String?
  
  // Promotion to official library
  isPromoted  Boolean @default(false)
  promotedContentId String?
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([contentType])
  @@index([isPromoted])
}
```

**Generation Triggers**:

- User requests "Challenge Me"
- System detects weak skill with no available content
- User requests company-specific practice
- User requests role-specific practice

### 4.4 Production Incident Simulations

**Incident Scenarios**:

```prisma
model IncidentScenario {
  id          String @id @default(cuid())
  slug        String @unique
  title       String
  description String?
  
  // Incident context
  system      String
  severity    IncidentSeverity
  impact      String @db.Text
  
  // Timeline
  timeline    IncidentEvent[]
  
  // Investigation
  logs        IncidentLog[]
  metrics     IncidentMetric[]
  traces      IncidentTrace[]
  
  // Resolution
  rootCause   String @db.Text
  fix         String @db.Text
  postmortem  String @db.Text
  
  // Skills tested
  skillIds    String[]
  
  createdAt DateTime @default(now())
}

enum IncidentSeverity {
  SEV1 // Critical
  SEV2 // High
  SEV3 // Medium
  SEV4 // Low
}

model IncidentEvent {
  id          String @id @default(cuid())
  incidentId  String
  incident    IncidentScenario @relation(fields: [incidentId], references: [id], onDelete: Cascade)
  
  timestamp   DateTime
  description String @db.Text
  type        IncidentEventType
  
  @@index([incidentId, timestamp])
}

enum IncidentEventType {
  ALERT
  DEPLOYMENT
  CONFIG_CHANGE
  TRAFFIC_SPIKE
  DATA_CORRUPTION
  NETWORK_ISSUE
}
```

### 4.5 Capstone Projects

**Multi-Day Projects**:

```prisma
model CapstoneProject {
  id          String @id @default(cuid())
  slug        String @unique
  title       String
  description String?
  
  // Project scope
  system      String // "Build a URL shortener", "Build a chat system"
  requirements String @db.Text
  
  // Skills required
  skillIds    String[]
  
  // Phases
  phases      CapstonePhase[]
  
  // Submission
  submissionRequirements String @db.Text
  
  // Evaluation
  evaluationCriteria Json
  
  estimatedWeeks Int?
  difficulty  SkillDifficulty
  
  createdAt DateTime @default(now())
}

model CapstonePhase {
  id          String @id @default(cuid())
  projectId   String
  project     CapstoneProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  order       Int
  title       String
  description String @db.Text
  
  deliverables String[]
  
  @@unique([projectId, order])
}

model CapstoneSubmission {
  id          String @id @default(cuid())
  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  projectId   String
  project     CapstoneProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  // Submission data
  repositoryUrl String?
  demoUrl String?
  documentation String @db.Text
  
  // Phase submissions
  phaseSubmissions Json?
  
  // Evaluation
  overallScore Int?
  feedback String @db.Text
  
  status      SubmissionStatus @default(IN_PROGRESS)
  
  submittedAt DateTime?
  evaluatedAt DateTime?
  
  @@unique([userId, projectId])
}

enum SubmissionStatus {
  IN_PROGRESS
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
}
```

---

## Visual Progress

### Progress Components

1. **Vertical Roadmap** - Visual learning path with milestones
2. **Dependency Graph** - Interactive skill graph
3. **Concept Graph** - Network view of skill relationships
4. **Completion Animation** - Celebrate milestones
5. **Unlock Animations** - New content reveals
6. **Skill Radar** - Multi-dimensional skill visualization
7. **Mastery Heatmap** - Time × skill grid
8. **Company Readiness** - Progress toward target companies
9. **Interview Readiness** - Overall preparedness score
10. **Weekly Progress** - Activity and achievements

---

## Search & Discovery

**Search Index**:

```prisma
model SearchIndex {
  id          String @id @default(cuid())
  entityType  SearchEntityType
  entityId    String
  
  // Searchable text
  title       String
  description String?
  tags        String[]
  
  // Facets
  skillIds    String[]
  company     String?
  difficulty  SkillDifficulty?
  contentType ContentType?
  
  // Metrics
  popularity  Int @default(0)
  
  updatedAt DateTime @updatedAt
  
  @@index([entityType, entityId])
  @@index([skillIds])
  @@index([company])
  @@index([difficulty])
  @@index([contentType])
}

enum SearchEntityType {
  CONTENT
  SKILL
  COURSE
  PATH
  SCENARIO
  INCIDENT
}
```

**Search Types**:

- Search by concept/skill
- Search by company
- Search by interview question
- Search by bug/issue
- Search by architecture pattern
- Search by technology
- Search by production issue
- Search by difficulty

---

## Content Authoring

**Course Builder UI**:

```prisma
model ContentDraft {
  id          String @id @default(cuid())
  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  entityType  DraftEntityType
  entityId    String? // If editing existing
  
  // Draft data
  data        Json
  
  // Versioning
  version     Int @default(1)
  parentVersionId String?
  
  // State
  status      DraftStatus @default(DRAFT)
  
  // Collaboration
  collaborators String[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}

enum DraftEntityType {
  COURSE
  LESSON
  CONTENT
  SCENARIO
  INCIDENT
}

enum DraftStatus {
  DRAFT
  UNDER_REVIEW
  APPROVED
  PUBLISHED
  REJECTED
}
```

**Authoring Features**:

- Visual course builder
- Episode editor
- Concept mapper (visual dependency editor)
- AI-assisted content generation
- Versioning with diff view
- Preview mode
- Collaboration tools
- Review workflow

---

## Implementation Priority

### Immediate (Next 2-4 weeks)

1. **Knowledge Graph Schema** - Implement Layer 2 from architecture refactoring
2. **Initial Skill Taxonomy** - Seed 50-100 core skills with dependencies
3. **Learning Paths Schema** - Implement Layer 4 from architecture refactoring
4. **Initial Paths** - Create DSA, LLD, HLD, Backend paths
5. **Course Structure** - Implement course/lesson schema
6. **Standard Lesson Template** - Define and implement lesson structure

### Short-term (1-2 months)

7. **Content Migration** - Migrate existing content to new schema
8. **Interactive Questions** - Implement question types and quiz system
9. **Enhanced Whiteboards** - Skill-specific presets and evaluation
10. **AI Tutor Basic** - Socratic questioning and hints
11. **Mastery Enhancement** - Add detailed mastery metrics
12. **Basic Recommendations** - Rule-based recommendation engine

### Medium-term (2-4 months)

13. **Adaptive Study Plans** - Daily/weekly planning
14. **Review Scheduling** - Spaced repetition system
15. **Progress Analytics** - Dashboard and visualizations
16. **Search & Discovery** - Full-text search with facets
17. **Content Authoring** - Basic course builder
18. **Scenario Framework** - Schema for long-running scenarios

### Long-term (4-6+ months)

19. **Scenario Content** - Build initial scenarios (Twitter, Uber)
20. **AI-Generated Practice** - On-demand content generation
21. **Production Incidents** - Incident simulation library
22. **Capstone Projects** - Multi-day project framework
23. **Company Profiles** - Detailed company-specific data
24. **Advanced AI** - More sophisticated tutoring and evaluation

---

## Success Metrics

### Engagement

- Daily active users
- Session duration
- Lessons completed per week
- Streak length
- Return rate

### Learning Effectiveness

- Mastery improvement rate
- Retention rate (30-day, 90-day)
- Time to mastery per skill
- Interview success rate (self-reported)
- Assessment pass rate

### Content Quality

- Content completion rate
- User satisfaction ratings
- AI-generated content quality scores
- Content promotion rate (generated → official)

### Differentiation

- Scenario completion rate
- Capstone project completion
- Company path adoption
- AI tutor usage
- Interactive element engagement

---

## Conclusion

This roadmap transforms the platform from a content library to a true **Learning Operating System**. The 5-layer architecture (Content Library → Knowledge Graph → Content Mapping → Learning Paths → Recommendation Engine) provides the foundation, while the phased implementation ensures we build the most impactful features first.

The key differentiator is the **integration of structured curriculum, concept graph, rich interactive experiences, and adaptive recommendations** - creating an engineering simulator rather than just another course platform.
