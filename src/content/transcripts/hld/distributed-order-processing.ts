// src/features/library/data/distributed-order-processing-transcript.ts
import { Difficulty } from "@prisma/client";
import type { TranscriptData } from "@/features/library/types/transcript";
import type { TranscriptEntry } from "../types";

const ARCHITECTURE_WHITEBOARD = `<svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#334155"/>
    </marker>
  </defs>
  <style>
    .box { fill: #f8fafc; stroke: #334155; stroke-width: 1.5; rx: 8; }
    .kafka { fill: #fef3c7; stroke: #b45309; stroke-width: 1.5; rx: 6; }
    .db { fill: #e0e7ff; stroke: #4338ca; stroke-width: 1.5; }
    .label { font-family: sans-serif; font-size: 13px; fill: #1e293b; }
    .small { font-family: sans-serif; font-size: 11px; fill: #475569; }
  </style>

  <rect x="30" y="20" width="150" height="50" class="box"/>
  <text x="105" y="50" text-anchor="middle" class="label">Client / API GW</text>

  <rect x="30" y="120" width="150" height="50" class="box"/>
  <text x="105" y="150" text-anchor="middle" class="label">Order Service</text>

  <rect x="30" y="220" width="150" height="50" class="box"/>
  <text x="105" y="250" text-anchor="middle" class="label">Order Saga Orchestrator</text>

  <rect x="350" y="20" width="150" height="200" class="kafka"/>
  <text x="425" y="45" text-anchor="middle" class="label">Kafka</text>
  <text x="425" y="65" text-anchor="middle" class="small">order.events</text>
  <text x="425" y="85" text-anchor="middle" class="small">payment.events</text>
  <text x="425" y="105" text-anchor="middle" class="small">inventory.events</text>
  <text x="425" y="125" text-anchor="middle" class="small">delivery.events</text>
  <text x="425" y="145" text-anchor="middle" class="small">driver.events</text>
  <text x="425" y="165" text-anchor="middle" class="small">notification.events</text>
  <text x="425" y="185" text-anchor="middle" class="small">(each: 3x RF, keyed by orderId)</text>

  <rect x="650" y="20" width="150" height="50" class="box"/>
  <text x="725" y="50" text-anchor="middle" class="label">Payment Service</text>
  <rect x="650" y="100" width="150" height="50" class="box"/>
  <text x="725" y="130" text-anchor="middle" class="label">Inventory Service</text>
  <rect x="650" y="180" width="150" height="50" class="box"/>
  <text x="725" y="210" text-anchor="middle" class="label">Delivery Service</text>
  <rect x="650" y="260" width="150" height="50" class="box"/>
  <text x="725" y="290" text-anchor="middle" class="label">Driver Assignment</text>
  <rect x="650" y="340" width="150" height="50" class="box"/>
  <text x="725" y="370" text-anchor="middle" class="label">Notification Service</text>

  <rect x="350" y="300" width="150" height="50" class="db"/>
  <text x="425" y="330" text-anchor="middle" class="label">Outbox Table</text>
  <rect x="350" y="380" width="150" height="50" class="db"/>
  <text x="425" y="410" text-anchor="middle" class="label">Processed-Events (dedup)</text>

  <line x1="105" y1="70" x2="105" y2="118" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="105" y1="170" x2="105" y2="218" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="180" y1="245" x2="348" y2="120" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="500" y1="45" x2="648" y2="45" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="500" y1="90" x2="648" y2="125" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="500" y1="140" x2="648" y2="200" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="500" y1="160" x2="648" y2="280" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="500" y1="180" x2="648" y2="360" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="180" y1="255" x2="348" y2="320" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="425" y1="220" x2="425" y2="298" stroke="#334155" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="4 3"/>
  <text x="900" y="20" class="small"></text>
</svg>`;

const STATE_MACHINE_WHITEBOARD = `<svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#334155"/>
    </marker>
  </defs>
  <style>
    .state { fill: #ecfdf5; stroke: #047857; stroke-width: 1.5; rx: 8; }
    .fail { fill: #fef2f2; stroke: #b91c1c; stroke-width: 1.5; rx: 8; }
    .label { font-family: sans-serif; font-size: 12px; fill: #1e293b; }
    .edge { font-family: sans-serif; font-size: 10px; fill: #64748b; }
  </style>

  <rect x="20" y="60" width="120" height="45" class="state"/>
  <text x="80" y="87" text-anchor="middle" class="label">OrderPlaced</text>

  <rect x="180" y="60" width="140" height="45" class="state"/>
  <text x="250" y="87" text-anchor="middle" class="label">PaymentAuthorized</text>

  <rect x="360" y="60" width="140" height="45" class="state"/>
  <text x="430" y="87" text-anchor="middle" class="label">InventoryReserved</text>

  <rect x="540" y="60" width="100" height="45" class="state"/>
  <text x="590" y="87" text-anchor="middle" class="label">Packed</text>

  <rect x="680" y="60" width="100" height="45" class="state"/>
  <text x="730" y="87" text-anchor="middle" class="label">Shipped</text>

  <rect x="680" y="150" width="120" height="45" class="state"/>
  <text x="740" y="177" text-anchor="middle" class="label">OutForDelivery</text>

  <rect x="540" y="150" width="100" height="45" class="state"/>
  <text x="590" y="177" text-anchor="middle" class="label">Delivered</text>

  <rect x="180" y="260" width="140" height="45" class="fail"/>
  <text x="250" y="287" text-anchor="middle" class="label">PaymentFailed</text>

  <rect x="360" y="260" width="140" height="45" class="fail"/>
  <text x="430" y="287" text-anchor="middle" class="label">InventoryUnavailable</text>

  <rect x="560" y="330" width="140" height="45" class="fail"/>
  <text x="630" y="357" text-anchor="middle" class="label">RefundInitiated</text>

  <rect x="330" y="330" width="140" height="45" class="fail"/>
  <text x="400" y="357" text-anchor="middle" class="label">OrderCancelled</text>

  <line x1="140" y1="82" x2="178" y2="82" stroke="#334155" marker-end="url(#arrow2)"/>
  <line x1="320" y1="82" x2="358" y2="82" stroke="#334155" marker-end="url(#arrow2)"/>
  <line x1="500" y1="82" x2="538" y2="82" stroke="#334155" marker-end="url(#arrow2)"/>
  <line x1="640" y1="82" x2="678" y2="82" stroke="#334155" marker-end="url(#arrow2)"/>
  <line x1="730" y1="105" x2="740" y2="148" stroke="#334155" marker-end="url(#arrow2)"/>
  <line x1="680" y1="172" x2="640" y2="172" stroke="#334155" marker-end="url(#arrow2)"/>

  <line x1="250" y1="105" x2="250" y2="258" stroke="#b91c1c" marker-end="url(#arrow2)"/>
  <text x="256" y="190" class="edge">payment declined</text>
  <line x1="430" y1="105" x2="430" y2="258" stroke="#b91c1c" marker-end="url(#arrow2)"/>
  <text x="436" y="190" class="edge">stock unavailable</text>

  <line x1="320" y1="282" x2="358" y2="282" stroke="#b91c1c" stroke-dasharray="4 3" marker-end="url(#arrow2)"/>
  <line x1="430" y1="305" x2="430" y2="328" stroke="#b91c1c" marker-end="url(#arrow2)"/>
  <line x1="430" y1="305" x2="600" y2="328" stroke="#b91c1c" marker-end="url(#arrow2)"/>
  <text x="500" y="320" class="edge">compensate: release inventory</text>
</svg>`;

const SAGA_COMPENSATION_ANIMATION = `<svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow3" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#b91c1c"/>
    </marker>
  </defs>
  <style>
    .step { fill: #f8fafc; stroke: #334155; stroke-width: 1.5; rx: 8; }
    .stepdone { fill: #ecfdf5; stroke: #047857; stroke-width: 1.5; rx: 8; }
    .stepfail { fill: #fef2f2; stroke: #b91c1c; stroke-width: 1.5; rx: 8; }
    .label { font-family: sans-serif; font-size: 12px; fill: #1e293b; }
    @keyframes pulse {
      0% { opacity: 0.25; }
      50% { opacity: 1; }
      100% { opacity: 0.25; }
    }
    .pulse-1 { animation: pulse 3s ease-in-out infinite; animation-delay: 0s; }
    .pulse-2 { animation: pulse 3s ease-in-out infinite; animation-delay: 0.6s; }
    .pulse-3 { animation: pulse 3s ease-in-out infinite; animation-delay: 1.2s; }
  </style>

  <rect x="20" y="30" width="140" height="50" class="stepdone"/>
  <text x="90" y="60" text-anchor="middle" class="label">1. Reserve Inventory</text>

  <rect x="200" y="30" width="140" height="50" class="stepdone"/>
  <text x="270" y="60" text-anchor="middle" class="label">2. Authorize Payment</text>

  <rect x="380" y="30" width="140" height="50" class="stepfail"/>
  <text x="450" y="60" text-anchor="middle" class="label">3. Assign Driver</text>
  <text x="450" y="95" text-anchor="middle" class="label" fill="#b91c1c">timeout / failure</text>

  <rect x="380" y="150" width="140" height="50" class="step pulse-1"/>
  <text x="450" y="180" text-anchor="middle" class="label">Compensate: Void Auth</text>

  <rect x="200" y="150" width="140" height="50" class="step pulse-2"/>
  <text x="270" y="180" text-anchor="middle" class="label">Compensate: Refund</text>

  <rect x="20" y="150" width="140" height="50" class="step pulse-3"/>
  <text x="90" y="180" text-anchor="middle" class="label">Compensate: Release Stock</text>

  <line x1="450" y1="80" x2="450" y2="148" stroke="#b91c1c" stroke-width="2" marker-end="url(#arrow3)"/>
  <line x1="380" y1="175" x2="342" y2="175" stroke="#b91c1c" stroke-width="2" marker-end="url(#arrow3)"/>
  <line x1="200" y1="175" x2="162" y2="175" stroke="#b91c1c" stroke-width="2" marker-end="url(#arrow3)"/>
</svg>`;

const transcriptData: TranscriptData = {
  metadata: {
    title: "Distributed Order Processing & Delivery Workflow System",
    difficulty: Difficulty.HARD,
    duration: 48,
    template: "hld",
    category: "System Design",
    topics: [
      "Event-Driven Architecture",
      "Saga Pattern",
      "Idempotency",
      "Distributed Transactions",
      "Message Delivery Semantics",
      "Route Optimization",
    ],
    concepts: {
      "event-driven-architecture": {
        name: "Event-Driven Architecture",
        sub: "Services communicate via immutable events on Kafka instead of synchronous calls, decoupling producers from consumers.",
        uses: [
          "Order Service publishes OrderPlaced without knowing who consumes it",
          "Delivery Service reacts to InventoryReserved asynchronously",
        ],
      },
      "saga-orchestration": {
        name: "Saga Pattern (Orchestration)",
        sub: "A central orchestrator drives a sequence of local transactions across services, issuing compensating transactions on failure instead of a 2PC distributed lock.",
        uses: [
          "OrderSagaOrchestrator sequences Reserve Inventory -> Authorize Payment -> Assign Driver",
          "On driver-assignment timeout, orchestrator issues VoidAuthorization and ReleaseInventory compensations",
        ],
      },
      "idempotency-outbox": {
        name: "Idempotency Key + Transactional Outbox",
        sub: "Every mutating call carries a client-generated idempotency key; every state change and its outbound event are written in the same DB transaction and relayed by a poller, so publish failures never lose or duplicate business state.",
        uses: [
          "PaymentService dedupes charge attempts using (orderId, idempotencyKey)",
          "OrderService writes to outbox table in the same transaction as the order status update",
        ],
      },
      "consumer-dedup": {
        name: "Idempotent Consumers via Processed-Events Table",
        sub: "Consumers record each processed eventId in a dedup table with a unique constraint, turning Kafka's at-least-once delivery into effectively-once processing at the business-logic layer.",
        uses: [
          "DeliveryService checks processed_events before acting on InventoryReserved",
          "Reprocessed events after consumer-group rebalance are no-ops",
        ],
      },
    },
  },
  messages: [],
  sections: [
    {
      id: "sec-requirements",
      title: "Requirements & Scope",
      time: "00:00",
      messages: [
        {
          id: "m1",
          role: "interviewer",
          elapsedSeconds: 0,
          timestamp: "00:00",
          intent: "open-ended-prompt",
          content: [
            {
              type: "text",
              value:
                "Design an order processing and delivery workflow system for a food/grocery delivery platform — think Deliveroo or Uber Eats. An order moves through placement, payment, packing, driver assignment, and delivery. Where do you want to start?",
            },
          ],
        },
        {
          id: "m2",
          role: "candidate",
          elapsedSeconds: 15,
          timestamp: "00:15",
          content: [
            {
              type: "text",
              value:
                "I'd like to nail down scope first. A few clarifying questions: is this single-city or multi-region? What's rough order volume — are we talking thousands or hundreds of thousands of orders a day? Is payment a single gateway or multiple providers? And is driver assignment in scope, or can I treat it as a black-box service I call?",
            },
            {
              type: "highlight",
              status: "strong",
              value: "Started with clarifying questions instead of jumping to a diagram.",
              explanation:
                "Anchoring scope before architecture avoids over- or under-designing and shows the candidate treats ambiguity as a first-class part of the problem, not noise to skip past.",
              id: "h1",
            },
          ],
        },
        {
          id: "m3",
          role: "interviewer",
          elapsedSeconds: 45,
          timestamp: "00:45",
          content: [
            {
              type: "text",
              value:
                "Multi-city, single country to start. ~200k orders/day at peak, roughly 8x diurnal skew around lunch and dinner. One primary payment gateway with a secondary fallback. Driver assignment should be in scope, but you don't need to design the route-optimization math in depth — just how it fits the workflow.",
            },
          ],
        },
        {
          id: "m4",
          role: "candidate",
          elapsedSeconds: 70,
          timestamp: "01:10",
          content: [
            {
              type: "text",
              value:
                "Good, that shapes things. Functionally: place order, reserve inventory, charge payment, pack, assign a driver, track to delivery, and support cancellation/refund at almost every stage. Non-functionally: this is a write-heavy, state-machine-heavy system where correctness under partial failure matters more than raw latency — a slow order is annoying, a double-charged or silently-lost order is a support and trust disaster. So I'd prioritize: no lost orders, no duplicate payments, eventual consistency across services is fine as long as it converges and is observable, and graceful degradation when the payment gateway or a downstream service is unhealthy.",
            },
            {
              type: "concept",
              value:
                "Framing the problem around failure modes (lost orders, duplicate charges) rather than just the happy path sets up the rest of the design.",
              conceptKey: "event-driven-architecture",
            },
          ],
          eval: [
            "Correctly prioritized correctness-under-failure over latency for a payments-adjacent workflow",
            "Named the two failure modes that will recur through the rest of the interview (lost state, duplicate side-effects)",
          ],
        },
      ],
    },
    {
      id: "sec-architecture",
      title: "High-Level Architecture",
      time: "05:00",
      messages: [
        {
          id: "m5",
          role: "interviewer",
          elapsedSeconds: 300,
          timestamp: "05:00",
          intent: "probe-architecture",
          content: [
            {
              type: "text",
              value: "Let's see the shape of the system. How would you decompose this into services?",
            },
          ],
        },
        {
          id: "m6",
          role: "candidate",
          elapsedSeconds: 330,
          timestamp: "05:30",
          content: [
            {
              type: "text",
              value:
                "I'd split by bounded context: Order Service owns the order aggregate and its state machine; Payment Service wraps the gateway and owns charge/refund/void; Inventory Service owns stock reservation; Delivery Service owns the delivery lifecycle once packed; Driver Assignment owns matching and routing; Notification Service fans out SMS/push. They don't call each other synchronously for state changes — they communicate through Kafka topics, one per domain, partitioned by orderId so all events for an order land on the same partition and preserve ordering. I'll sketch it.",
            },
            {
              type: "whiteboard",
              value: ARCHITECTURE_WHITEBOARD,
              caption: "Service boundaries and event flow through Kafka, partitioned by orderId",
              id: "w1",
            },
          ],
        },
        {
          id: "m7",
          role: "interviewer",
          elapsedSeconds: 420,
          timestamp: "07:00",
          intent: "probe-tradeoff",
          content: [
            {
              type: "text",
              value:
                "Why events over direct synchronous calls between, say, Order Service and Payment Service? A REST call would be simpler.",
            },
          ],
        },
        {
          id: "m8",
          role: "candidate",
          elapsedSeconds: 450,
          timestamp: "07:30",
          content: [
            {
              type: "text",
              value:
                "Two reasons. First, temporal decoupling: at 8x lunch-hour skew, Payment or Inventory being briefly slow shouldn't cascade into Order Service threads blocking on HTTP calls and tipping over. Kafka absorbs the burst and lets each consumer process at its own rate. Second, it gives me a natural audit log and replay mechanism for free — every state transition is an event I can replay to rebuild state or debug a stuck order, which matters a lot here because 'what happened to this order' is a support and compliance question we'll get asked constantly. The tradeoff is added latency and eventual consistency — I'm fine with that for anything past the initial payment authorization, which I do treat as closer to synchronous because the user is staring at a spinner.",
            },
            {
              type: "highlight",
              status: "strong",
              value:
                "Named the specific tradeoff (latency/eventual consistency) instead of presenting async as strictly superior.",
              explanation:
                "A strong system design answer acknowledges what's given up, not just what's gained — this shows the candidate isn't pattern-matching 'microservices + Kafka = good'.",
              id: "h2",
            },
          ],
          eval: [
            "Justified async messaging with concrete failure-isolation reasoning tied to the stated 8x traffic skew",
            "Correctly distinguished the user-facing synchronous-feeling step (payment auth) from the rest of the async pipeline",
          ],
        },
      ],
    },
    {
      id: "sec-saga",
      title: "Order State Machine & Saga Pattern",
      time: "12:00",
      messages: [
        {
          id: "m9",
          role: "interviewer",
          elapsedSeconds: 720,
          timestamp: "12:00",
          intent: "probe-core-challenge",
          content: [
            {
              type: "text",
              value:
                "Walk me through the order lifecycle end to end, and how you handle the fact that this touches three separate services' data — inventory, payment, delivery — without a single database transaction.",
            },
          ],
        },
        {
          id: "m10",
          role: "candidate",
          elapsedSeconds: 760,
          timestamp: "12:40",
          content: [
            {
              type: "text",
              value:
                "This is exactly the distributed transaction problem, and I'd solve it with the Saga pattern rather than two-phase commit — 2PC needs a coordinator holding locks across services for the duration, which kills availability at our scale and doesn't survive a service being down. A saga instead breaks the transaction into a sequence of local transactions, each with a compensating action if a later step fails.",
            },
            {
              type: "whiteboard",
              value: STATE_MACHINE_WHITEBOARD,
              caption: "Order state machine: happy path and compensation paths",
              id: "w2",
            },
            {
              type: "text",
              value:
                "The states are OrderPlaced, PaymentAuthorized, InventoryReserved, Packed, Shipped, OutForDelivery, Delivered — plus the failure branches PaymentFailed and InventoryUnavailable, which both funnel into compensation and end at OrderCancelled or Refunded. Now, orchestration versus choreography: I'd go with orchestration — a dedicated OrderSagaOrchestrator that owns the sequence — over pure choreography where each service listens for the previous service's event and decides what's next.",
            },
          ],
        },
        {
          id: "m11",
          role: "interviewer",
          elapsedSeconds: 850,
          timestamp: "14:10",
          intent: "probe-tradeoff",
          content: [
            {
              type: "text",
              value: "Why orchestration? Choreography avoids a single service having to know about everyone else.",
            },
          ],
        },
        {
          id: "m12",
          role: "candidate",
          elapsedSeconds: 880,
          timestamp: "14:40",
          content: [
            {
              type: "text",
              value:
                "True, choreography is more decoupled, but at 6-7 steps with multiple failure branches, choreography spreads the 'what happens next' logic across every service, which makes the overall flow nearly impossible to reason about or visualize — you'd have to trace events across six codebases to answer 'why is this order stuck.' With an orchestrator, the entire saga definition lives in one place, I get a single spot to add timeouts, retries, and compensation ordering, and — critically for this domain — one place to answer 'what state is order X in and what's it waiting on' for support tooling. The coupling cost is real, but I'd rather pay it explicitly in one service than implicitly across six.",
            },
          ],
          eval: [
            "Weighed orchestration vs choreography against operational debuggability, not just theoretical coupling",
            "Correctly scoped the decision to the step-count and branching complexity of this specific workflow",
          ],
        },
        {
          id: "m13",
          role: "interviewer",
          elapsedSeconds: 950,
          timestamp: "15:50",
          intent: "probe-detail",
          content: [
            {
              type: "text",
              value:
                "Concretely, what happens if driver assignment times out after payment has already been authorized and inventory reserved?",
            },
          ],
        },
        {
          id: "m14",
          role: "candidate",
          elapsedSeconds: 990,
          timestamp: "16:30",
          content: [
            {
              type: "text",
              value:
                "The orchestrator has a per-step timeout — say 30s for driver assignment given peak-hour driver scarcity. On timeout it fires the compensation chain in reverse order: void the payment authorization, release the inventory reservation, and only then mark the order Cancelled and notify the customer.",
            },
            {
              type: "animation",
              value: SAGA_COMPENSATION_ANIMATION,
              caption: "Compensation cascade on driver-assignment timeout, executed in reverse step order",
              durationSeconds: 3,
              id: "a1",
            },
            {
              type: "code",
              language: "typescript",
              id: "c1",
              value:
                "class OrderSagaOrchestrator {\n  private readonly steps: SagaStep[] = [\n    { name: \"ReserveInventory\", action: reserveInventory, compensate: releaseInventory },\n    { name: \"AuthorizePayment\", action: authorizePayment, compensate: voidAuthorization },\n    { name: \"AssignDriver\", action: assignDriver, compensate: unassignDriver },\n  ];\n\n  async run(order: Order): Promise<void> {\n    const completed: SagaStep[] = [];\n    try {\n      for (const step of this.steps) {\n        await this.persistSagaLog(order.id, step.name, \"STARTED\");\n        await withTimeout(step.action(order), step.timeoutMs ?? 30_000);\n        await this.persistSagaLog(order.id, step.name, \"COMPLETED\");\n        completed.push(step);\n      }\n      await this.transitionOrder(order.id, \"Delivered\" /* pipeline continues async */);\n    } catch (err) {\n      // Compensate in reverse order of completed steps only.\n      for (const step of completed.reverse()) {\n        await this.persistSagaLog(order.id, step.name, \"COMPENSATING\");\n        await step.compensate(order);\n      }\n      await this.transitionOrder(order.id, \"Cancelled\", { reason: err.message });\n    }\n  }\n}",
            },
            {
              type: "text",
              value:
                "One thing I want to flag myself: the saga log write has to happen before the action executes, and it has to be durable — otherwise if the orchestrator crashes mid-saga, on restart it doesn't know whether AssignDriver actually succeeded or not.",
            },
            {
              type: "highlight",
              status: "missed",
              value: "Initially didn't mention persisting saga state before executing each step.",
              explanation:
                "This is a common gap: without a durable saga log, orchestrator crash-recovery can't distinguish 'step never ran' from 'step ran but the completion event was lost,' which risks either skipping a compensation or double-running a non-idempotent action. The candidate caught it themselves, which is good, but a stronger answer front-loads this.",
              id: "h3",
            },
          ],
          eval: [
            "Correctly ordered compensations in reverse of completion order, not reverse of definition order",
            "Self-corrected on saga log durability without prompting — shows the mental model is right even if the first pass was incomplete",
          ],
        },
      ],
    },
    {
      id: "sec-idempotency",
      title: "Idempotency & Delivery Guarantees",
      time: "20:00",
      messages: [
        {
          id: "m15",
          role: "interviewer",
          elapsedSeconds: 1200,
          timestamp: "20:00",
          intent: "probe-core-challenge",
          content: [
            {
              type: "text",
              value:
                "Kafka gives you at-least-once delivery by default. Walk me through how you get effectively-once behavior end to end — both on the publish side and the consume side — and specifically how you stop a customer being double-charged.",
            },
          ],
        },
        {
          id: "m16",
          role: "candidate",
          elapsedSeconds: 1230,
          timestamp: "20:30",
          content: [
            {
              type: "text",
              value:
                "This needs two separate mechanisms — one for publishing, one for consuming — because 'exactly-once' isn't a single knob, it's the composition of idempotent producers and idempotent consumers.",
            },
            {
              type: "concept",
              value:
                "The outbox pattern removes the classic 'DB commit succeeded but the event publish failed' dual-write problem by making the event part of the same local transaction as the state change.",
              conceptKey: "idempotency-outbox",
            },
            {
              type: "text",
              value:
                "On the publish side: Order Service writes the order status change and the outgoing event to an outbox table in the same local DB transaction. A separate relay process polls the outbox and publishes to Kafka, marking rows sent once acknowledged. If the relay crashes after publishing but before marking sent, it republishes on restart — that's fine, because the consumer side is idempotent. This is the transactional outbox pattern; it trades 'might publish twice' for 'never loses an event,' and that's the right trade because duplicates are cheap to filter but lost events are not.",
            },
            {
              type: "code",
              language: "sql",
              id: "c2",
              value:
                "BEGIN;\n  UPDATE orders SET status = 'InventoryReserved' WHERE id = :orderId;\n  INSERT INTO outbox (id, aggregate_id, event_type, payload, created_at)\n  VALUES (:eventId, :orderId, 'InventoryReserved', :payload, now());\nCOMMIT;\n-- Relay process, separately:\n-- SELECT * FROM outbox WHERE sent_at IS NULL ORDER BY created_at LIMIT 500;\n-- publish each to Kafka, then UPDATE outbox SET sent_at = now() WHERE id = :eventId;",
            },
            {
              type: "text",
              value:
                "On the consume side, every event carries a globally unique eventId set at creation time, not at publish time. Each consumer keeps a processed_events table keyed by (consumerGroup, eventId) with a unique constraint. Before acting on an event, it tries to insert that key in the same transaction as the business-logic update; if the insert conflicts, the event was already processed and the consumer just acks and moves on. That turns Kafka's at-least-once into effectively-once at the point where it actually matters — the business state change.",
            },
            {
              type: "concept",
              value:
                "Dedup on the consumer side means the eventId, not a retry counter or offset, is the unit of idempotency — offsets can be replayed after a rebalance even when nothing actually failed.",
              conceptKey: "consumer-dedup",
            },
          ],
        },
        {
          id: "m17",
          role: "interviewer",
          elapsedSeconds: 1400,
          timestamp: "23:20",
          intent: "probe-detail",
          content: [
            {
              type: "text",
              value:
                "That handles internal service-to-service events. What about the payment gateway itself — that's an external HTTP call, not a Kafka consumer, and the gateway might process your charge but the response gets lost on the way back to you.",
            },
          ],
        },
        {
          id: "m18",
          role: "candidate",
          elapsedSeconds: 1430,
          timestamp: "23:50",
          content: [
            {
              type: "text",
              value:
                "Right, that's a different mechanism — idempotency keys on the request itself, which most payment gateways support natively (Stripe, Razorpay, etc. all do). Payment Service generates one idempotency key per charge attempt tied to (orderId, sagaAttemptNumber) and sends it as a header. If the request times out and the orchestrator retries the AuthorizePayment step, it reuses the same key. The gateway recognizes the key, sees it already has a result for it, and returns the original response instead of charging again — regardless of whether the first charge actually succeeded on their end or not. I also keep the mapping of orderId to idempotencyKey and the gateway's response status locally, so that even before retrying I can check 'did I already get a definitive answer for this' without hitting the gateway again.",
            },
            {
              type: "highlight",
              status: "strong",
              value:
                "Distinguished internal dedup (processed_events table) from external dedup (gateway-native idempotency keys) as two different mechanisms for two different failure surfaces.",
              explanation:
                "Conflating these is a common mistake — internal Kafka dedup can't protect you from an external HTTP call, and vice versa. Recognizing they're solving different problems (duplicate consumption vs. duplicate side-effect on a third party) is exactly the kind of precision this topic needs.",
              id: "h4",
            },
          ],
          eval: [
            "Correctly separated internal event dedup from external API idempotency as distinct mechanisms",
            "Anchored idempotency key generation to (orderId, attemptNumber) rather than a fresh key per retry, which is the detail that actually makes retries safe",
          ],
        },
      ],
    },
    {
      id: "sec-payment-failure",
      title: "Payment Gateway Failure Handling",
      time: "28:00",
      messages: [
        {
          id: "m19",
          role: "interviewer",
          elapsedSeconds: 1680,
          timestamp: "28:00",
          intent: "probe-failure-mode",
          content: [
            {
              type: "text",
              value:
                "The payment gateway starts timing out for 40% of requests during a lunch-hour spike. What does your system do?",
            },
          ],
        },
        {
          id: "m20",
          role: "candidate",
          elapsedSeconds: 1710,
          timestamp: "28:30",
          content: [
            {
              type: "text",
              value:
                "First, I don't want every AuthorizePayment call hanging for the full timeout and piling up threads/connections in Payment Service — that's how one degraded downstream takes the whole service down. I'd wrap the gateway call in a circuit breaker: once the error/timeout rate crosses a threshold in a rolling window, the breaker opens and fails fast for a cooldown period instead of hammering an already-struggling gateway, then does limited trial requests to check recovery before fully closing again.",
            },
            {
              type: "text",
              value:
                "Second, retries need to be bounded and jittered — exponential backoff with a cap, maybe 3 attempts, so we're not synchronizing retry storms across thousands of orders at once. Third, if the primary gateway's breaker is open, I'd fail over to the secondary gateway you mentioned earlier, using the same idempotency-key discipline so a request that already succeeded on the primary right before it went unhealthy doesn't get double-charged on the secondary — practically, that means checking our own charge-attempt record for a definitive result before ever trying the secondary.",
            },
            {
              type: "text",
              value:
                "Fourth — and this matters because payments straddle two systems that can disagree — I'd run an async reconciliation job that periodically compares our order/payment state against the gateway's transaction log for anything that timed out or was left ambiguous, and resolves it: either completes the saga if the charge actually succeeded, or triggers compensation if it didn't. That reconciliation job is the safety net for anything the real-time path couldn't resolve with certainty.",
            },
            {
              type: "highlight",
              status: "strong",
              value:
                "Layered the answer: fail fast (circuit breaker) -> bounded retry -> failover -> async reconciliation as the ultimate source of truth.",
              explanation:
                "This is the right shape for payment failure handling — no single mechanism is trusted to resolve ambiguity alone, and reconciliation against the gateway's own record is what actually closes out the timeout cases the real-time path can't.",
              id: "h5",
            },
          ],
          eval: [
            "Proposed circuit breaker specifically to prevent thread/connection exhaustion cascading upstream, not just as a generic pattern name-drop",
            "Recognized failover to a secondary gateway reintroduces a duplicate-charge risk and addressed it explicitly",
            "Identified reconciliation as necessary because some ambiguity (timeout with unknown gateway-side outcome) cannot be resolved synchronously",
          ],
        },
      ],
    },
    {
      id: "sec-driver-assignment",
      title: "Driver Assignment & Route Optimization",
      time: "34:00",
      messages: [
        {
          id: "m21",
          role: "interviewer",
          elapsedSeconds: 2040,
          timestamp: "34:00",
          intent: "probe-architecture",
          content: [
            {
              type: "text",
              value:
                "Order is Packed and needs a driver. How does driver assignment fit into the event flow, and roughly how do you pick a driver?",
            },
          ],
        },
        {
          id: "m22",
          role: "candidate",
          elapsedSeconds: 2070,
          timestamp: "34:30",
          content: [
            {
              type: "text",
              value:
                "Packed emits an event that Driver Assignment consumes. I'd keep the matching itself outside the saga's synchronous critical path where possible — the saga just needs 'a driver got assigned within timeout,' not the internals of how. Driver Assignment maintains near-real-time driver locations via a geospatial index — geohash or H3 cells — so 'nearby available drivers for this restaurant/store' is a fast lookup, not a table scan.",
            },
            {
              type: "text",
              value:
                "For matching, I'd do a hybrid: a fast greedy assignment for the common case — nearest available, idle driver, weighted by their current load and ETA — because most orders just need someone reasonably close, fast. But at high density, greedy-per-order can produce globally bad routes, so I'd run periodic micro-batch optimization — every few seconds, take the pool of unassigned orders and available drivers in a zone and solve a constrained vehicle-routing-style assignment to reduce total distance and balance load, rather than optimizing every order in isolation. Greedy handles the tail end and low-density periods; batching handles the lunch-rush density where it actually pays off.",
            },
            {
              type: "text",
              value:
                "On failure: if no driver accepts within the saga's timeout — say a driver is offered the job and doesn't respond — Driver Assignment retries with the next candidate a couple of times before giving up and letting the timeout propagate to the orchestrator, which then compensates as we discussed.",
            },
          ],
          eval: [
            "Correctly kept the saga's timeout boundary around 'assignment succeeded or not' rather than coupling the orchestrator to routing internals",
            "Justified the greedy + batch hybrid against the stated diurnal density skew rather than presenting one algorithm as universally correct",
          ],
        },
        {
          id: "m23",
          role: "interviewer",
          elapsedSeconds: 2200,
          timestamp: "36:40",
          intent: "probe-tradeoff",
          content: [
            {
              type: "text",
              value: "What's the risk of the micro-batching approach, given orders are arriving continuously?",
            },
          ],
        },
        {
          id: "m24",
          role: "candidate",
          elapsedSeconds: 2230,
          timestamp: "37:10",
          content: [
            {
              type: "text",
              value:
                "The obvious one is added latency — an order that arrives just after a batch closes waits for the next window, so the batch interval is a direct customer-facing latency knob, not just a backend tuning parameter. I'd keep it short, low single-digit seconds, and skip batching entirely below some order-density threshold, falling back to pure greedy — no point batching three orders in a quiet zone at 3pm. The other risk is a stale snapshot: driver locations and availability can change mid-batch-computation, so whatever solver I use needs to treat its output as a proposal, re-validate driver availability at assignment time, and gracefully re-offer to the next candidate if the first pick already went offline or got grabbed by a concurrent batch in an overlapping zone.",
            },
          ],
          eval: [
            "Named batch-interval as a customer-facing latency tradeoff, not just a system-internal detail",
            "Identified stale-snapshot race between batch computation and assignment as a real correctness risk, with a concrete mitigation",
          ],
        },
      ],
    },
    {
      id: "sec-wrapup",
      title: "Wrap-up",
      time: "42:00",
      messages: [
        {
          id: "m25",
          role: "interviewer",
          elapsedSeconds: 2520,
          timestamp: "42:00",
          content: [
            {
              type: "text",
              value:
                "Good. Last thing — if you had to cut scope for time, what's the one piece of this design you'd protect no matter what, and what would you cut first?",
            },
          ],
        },
        {
          id: "m26",
          role: "candidate",
          elapsedSeconds: 2560,
          timestamp: "42:40",
          content: [
            {
              type: "text",
              value:
                "I'd protect the saga orchestrator plus its durable log and the idempotency/outbox layer — that's the correctness spine of the whole system, and it's what stops us from either losing orders or double-charging customers, which are the two failure modes that turn into real trust and legal problems. I'd cut driver-assignment route optimization first — falling back to pure greedy nearest-available is a worse user experience under high load, but it's not a correctness bug, it's a quality-of-service regression I can improve later without touching the transactional core.",
            },
          ],
          eval: [
            "Correctly ranked correctness-critical components above optimization components under a forced tradeoff",
          ],
        },
        {
          id: "m27",
          role: "takeaway",
          elapsedSeconds: 2600,
          timestamp: "43:20",
          content: [
            {
              type: "text",
              value:
                "Strong session overall. The candidate correctly identified Saga orchestration over 2PC and justified it against operational debuggability rather than textbook coupling arguments, cleanly separated internal event-dedup (processed_events table) from external gateway idempotency keys — a distinction many candidates blur — and layered payment-failure handling as circuit breaker -> bounded retry -> failover -> async reconciliation rather than reaching for a single silver-bullet mechanism.",
            },
            {
              type: "text",
              value:
                "The one gap was initially omitting durable saga-log persistence before executing each step, which the candidate self-corrected without prompting. Worth probing harder next time on: partition-count/ordering guarantees under Kafka consumer-group rebalance, and how the saga orchestrator itself scales/shards without becoming a bottleneck or single point of failure.",
            },
            {
              type: "highlight",
              status: "note",
              value: "Self-correction on saga log durability, without prompting, was a positive signal.",
              explanation:
                "Catching your own gap mid-explanation is often a stronger signal than getting it right the first time — it shows the mental model is sound even when the initial verbalization was incomplete.",
              id: "h6",
            },
          ],
        },
      ],
    },
  ],
};

const distributedOrderProcessingEntry: TranscriptEntry = {
  summary: {
    id: 41,
    slug: "distributed-order-processing",
    title: "Distributed Order Processing & Delivery Workflow System",
    category: "hld" as const,
    difficulty: Difficulty.HARD,
    duration: 48,
    tags: ["Event-Driven Architecture", "Saga Pattern", "Idempotency", "Distributed Transactions", "Message Delivery Semantics", "Route Optimization"],
    description: "Design an order processing and delivery workflow system for a food/grocery delivery platform with event-driven architecture, saga orchestration, and idempotency patterns.",
  },
  transcript: transcriptData,
};

export default distributedOrderProcessingEntry;