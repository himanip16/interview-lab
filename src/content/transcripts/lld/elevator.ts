// src/content/transcripts/system-design/elevator-system-lld.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Elevator System — Low-Level Design",
    difficulty: Difficulty.HARD,
    duration: 60,
    template: "LLD",
    category: "System Design",
  },

  messages: [
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value:
            "Design an elevator system. I want to know how the elevator moves, where it stops, what input it takes, and the algorithm behind making it actually work.",
        },
      ],
    },
    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 20,
      content: [
        {
          type: "text",
          value:
            "Functional requirements first, a few questions. Single elevator or a bank of several serving the same floors? Is there a capacity or weight limit I need to model, or can I ignore that for now? And two kinds of input I'd expect regardless — someone on a floor pressing up or down, and someone inside the car pressing a destination floor. Confirming those are both in scope.",
        },
      ],
    },
    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 45,
      content: [
        {
          type: "text",
          value:
            "Multiple elevators, same bank of floors. Ignore capacity for now. Yes, both kinds of input are in scope.",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value:
            "Okay. Functional requirements: a hall call — floor number plus direction, up or down, from someone waiting on a floor. A car call — a destination floor pressed from inside a specific elevator. The system has to pick which elevator answers a given hall call. Each elevator has to serve its queued stops in some sensible order, not arbitrarily. And doors open and close at every stop.",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 95,
      content: [
        {
          type: "text",
          value: "Non-functional requirements — what actually matters for this to feel like a good elevator, not a broken one?",
        },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 130,
      content: [
        {
          type: "text",
          value:
            "Minimizing wait time for hall calls and total travel time for car calls — that's the user-facing quality bar. No starvation — a request on floor 2 shouldn't wait forever just because floors 8 through 20 keep generating closer requests; fairness matters as much as raw speed. Thread-safety, since hall calls, car calls, and each elevator's own movement loop are all happening concurrently, not sequentially. And the dispatch algorithm itself should be swappable — I don't want scheduling logic hardwired into the elevator or controller classes, since 'which elevator answers this call' is exactly the kind of policy that gets tuned later.",
        },
        {
          id: "highlight-nfr-fairness-and-extensibility",
          type: "highlight",
          status: "strong",
          value: "Names starvation-avoidance and swappable dispatch policy as first-class non-functional requirements",
          explanation:
            "Beyond the obvious 'minimize wait time', candidate identifies fairness and extensibility of the scheduling policy as real quality bars — both become directly relevant once the algorithm and class design get discussed.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "Good. What entities — classes — do you see in this problem?",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value:
            "An `Elevator` — owns its own current floor, direction, door state, and the set of floors it still needs to stop at. An `ElevatorController` — knows about all elevators in the bank and decides which one answers a given hall call; that's the dispatcher. A `Request` type, split into `HallCall` (floor plus direction) and `CarCall` (just a destination floor, tied to a specific elevator that already has a passenger). A `Direction` enum — UP, DOWN, IDLE. An `ElevatorState` enum — MOVING, DOOR_OPEN, IDLE. And a `DispatchStrategy` interface, so the actual 'which elevator wins this call' logic is pluggable and separate from the controller's bookkeeping.",
        },
        {
          id: "highlight-entity-list",
          type: "highlight",
          status: "strong",
          value: "Separates HallCall from CarCall as distinct types instead of one generic Request",
          explanation:
            "This distinction matters mechanically — a hall call needs a direction and is answered by whichever elevator the controller picks, while a car call is already bound to a specific elevator and just needs a destination added to its queue. Collapsing them into one type would blur that difference.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 245,
      content: [
        {
          type: "text",
          value: "What methods live on Elevator, and what lives on the controller instead?",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "On `Elevator`: `moveLift()` — the core loop that actually advances the car and handles stops, `addStop(floor)` — used by both car calls and by the controller when it assigns a hall call, `openDoor()`/`closeDoor()`, and `getCurrentFloor()`/`getDirection()` for the controller to query state when deciding assignments. On `ElevatorController`: `dispatchLiftForRequest(hallCall)` — picks the best elevator and forwards the stop to it, and `registerCarCall(elevatorId, floor)` for the internal-button case, which skips dispatch entirely since the elevator's already chosen. The controller never touches an elevator's internal queue directly — it only ever calls `addStop`, so `Elevator` owns its own stop-ordering logic.",
        },
        {
          id: "highlight-method-ownership",
          type: "highlight",
          status: "strong",
          value: "Draws a clear boundary: controller decides which elevator, elevator decides how it serves its own stops",
          explanation:
            "This encapsulation choice — controller never reaches into an elevator's internal stop data — keeps the two responsibilities (assignment policy vs. movement mechanics) from leaking into each other.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value: "Now the algorithm. How does an elevator decide what order to serve its stops in?",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value:
            "First-come-first-served would be simple but terrible — if request order is 10, then 2, then 9, the elevator would go 10, all the way down to 2, then back up to 9, which is a lot of wasted travel and bad for everyone waiting. I'd use the SCAN algorithm, sometimes called the elevator algorithm for exactly this reason — the car keeps moving in its current direction, serving every pending stop along the way in that direction, and only reverses once there's nothing left ahead of it in that direction. That naturally batches nearby requests instead of zig-zagging, and it also solves the starvation concern from earlier — a request behind the current direction isn't ignored, it's just deferred until the reversal, which is bounded, not indefinite.",
        },
        {
          id: "highlight-scan-algorithm-choice",
          type: "highlight",
          status: "strong",
          value: "Chooses SCAN and explicitly ties it back to the starvation requirement stated earlier",
          explanation:
            "Rather than presenting SCAN as an isolated algorithm choice, candidate connects it directly to the non-functional requirement raised earlier — bounded wait via guaranteed reversal, not just 'this is the standard elevator algorithm'.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 395,
      content: [
        {
          type: "text",
          value: "How do you store the stops so SCAN is efficient, not a linear scan every time?",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 430,
      content: [
        {
          type: "text",
          value:
            "Two sorted sets per elevator — `upStops` and `downStops`. When moving up, I want the smallest stop greater than my current floor, which is a `ceiling()` query; moving down, the largest stop smaller than current floor, a `floor()` query. A `TreeSet<Integer>` gives me both in O(log n) instead of scanning every pending stop to find the nearest one ahead. New stops go into whichever set matches their relative direction from the elevator's current position and current travel direction.",
        },
        {
          id: "highlight-treeset-choice",
          type: "highlight",
          status: "strong",
          value: "Uses TreeSet's ceiling()/floor() for O(log n) next-stop lookup instead of scanning",
          explanation:
            "Ties the data structure choice directly to the specific query SCAN needs — 'nearest stop ahead in current direction' — rather than defaulting to a generic list or queue.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value: "Code moveLift(). Plain Java.",
        },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 560,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "public class Elevator {\n    private int currentFloor;\n    private Direction direction = Direction.IDLE;\n    private final TreeSet<Integer> upStops = new TreeSet<>();\n    private final TreeSet<Integer> downStops = new TreeSet<>();\n\n    public synchronized void addStop(int floor) {\n        if (floor > currentFloor) {\n            upStops.add(floor);\n            if (direction == Direction.IDLE) direction = Direction.UP;\n        } else if (floor < currentFloor) {\n            downStops.add(floor);\n            if (direction == Direction.IDLE) direction = Direction.DOWN;\n        }\n    }\n\n    public void moveLift() {\n        while (true) {\n            synchronized (this) {\n                if (upStops.isEmpty() && downStops.isEmpty()) {\n                    direction = Direction.IDLE;\n                    return;\n                }\n\n                if (direction == Direction.UP) {\n                    Integer next = upStops.ceiling(currentFloor + 1);\n                    if (next != null) {\n                        currentFloor = next;\n                        upStops.remove(next);\n                        openDoor();\n                        closeDoor();\n                    } else if (!downStops.isEmpty()) {\n                        direction = Direction.DOWN;\n                    } else {\n                        direction = Direction.IDLE;\n                    }\n                } else if (direction == Direction.DOWN) {\n                    Integer next = downStops.floor(currentFloor - 1);\n                    if (next != null) {\n                        currentFloor = next;\n                        downStops.remove(next);\n                        openDoor();\n                        closeDoor();\n                    } else if (!upStops.isEmpty()) {\n                        direction = Direction.UP;\n                    } else {\n                        direction = Direction.IDLE;\n                    }\n                }\n            }\n        }\n    }\n\n    private void openDoor() { /* door open logic, timing */ }\n    private void closeDoor() { /* door close logic, timing */ }\n}",
        },
        {
          type: "text",
          value:
            "Whole state check-and-move step is inside a synchronized block, since addStop() can be called concurrently by a dispatcher thread while moveLift() is reading the same TreeSets.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 595,
      content: [
        {
          type: "text",
          value:
            "Real elevators don't teleport between floors instantly. What's actually wrong with this loop as a model of physical movement?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 625,
      content: [
        {
          type: "text",
          value:
            "Fair — this jumps straight to the next stop rather than modeling floor-by-floor travel with real time passing. In a fuller version, I'd advance currentFloor by one at a time on a timer or scheduled tick, checking after each increment whether the new floor is a stop, rather than jumping directly to the next TreeSet entry. That also matters for a hall call re-evaluation — while an elevator is between floors, a new closer request might arrive, and if I only look at stops on arrival rather than per-floor, I'd miss the chance to react earlier. For this session I simplified to jump-to-next-stop to focus on the ordering logic, but I'd flag that as a simplification, not the final model.",
        },
        {
          id: "highlight-honest-simplification",
          type: "highlight",
          status: "strong",
          value: "Acknowledges the jump-to-next-stop model is a simplification and names what a fuller model needs",
          explanation:
            "Rather than defending the simplified code as complete, candidate names the specific gap — no per-floor tick, no mid-transit re-evaluation — showing awareness of the difference between 'correct enough to demonstrate the algorithm' and 'production-accurate'.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 655,
      content: [
        {
          type: "text",
          value: "Now dispatchLiftForRequest. How do you pick which elevator answers a hall call?",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 690,
      content: [
        {
          type: "text",
          value:
            "First preference: an elevator already moving in the same direction as the hall call, that hasn't passed the requested floor yet — it can pick this up essentially for free, no detour. If none qualify, fall back to the nearest idle elevator by absolute floor distance. If no elevator is idle either, pick whichever elevator has the smallest cost to reach it — I'd approximate that as distance to current position plus its existing queue length, so I'm not always dumping every unmatched request on the same busy elevator.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 715,
      content: [
        {
          type: "text",
          value: "Code it. What's the actual check for 'moving toward it and hasn't passed it yet'?",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 780,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "public class ElevatorController {\n    private final List<Elevator> elevators;\n\n    public void dispatchLiftForRequest(HallCall call) {\n        Elevator best = null;\n        int bestCost = Integer.MAX_VALUE;\n\n        for (Elevator e : elevators) {\n            if (!canServeEnRoute(e, call)) continue;\n            int cost = Math.abs(e.getCurrentFloor() - call.getFloor());\n            if (cost < bestCost) {\n                bestCost = cost;\n                best = e;\n            }\n        }\n\n        if (best == null) {\n            for (Elevator e : elevators) {\n                if (e.getDirection() == Direction.IDLE) {\n                    int cost = Math.abs(e.getCurrentFloor() - call.getFloor());\n                    if (cost < bestCost) {\n                        bestCost = cost;\n                        best = e;\n                    }\n                }\n            }\n        }\n\n        if (best == null) {\n            for (Elevator e : elevators) {\n                int cost = Math.abs(e.getCurrentFloor() - call.getFloor()) + e.getPendingStopCount();\n                if (cost < bestCost) {\n                    bestCost = cost;\n                    best = e;\n                }\n            }\n        }\n\n        best.addStop(call.getFloor());\n    }\n\n    private boolean canServeEnRoute(Elevator e, HallCall call) {\n        if (e.getDirection() == Direction.UP && call.getDirection() == Direction.UP) {\n            return e.getCurrentFloor() <= call.getFloor();\n        }\n        if (e.getDirection() == Direction.DOWN && call.getDirection() == Direction.DOWN) {\n            return e.getCurrentFloor() >= call.getFloor();\n        }\n        return false;\n    }\n}",
        },
        {
          type: "text",
          value:
            "canServeEnRoute checks both direction match and that the elevator hasn't already gone past the requested floor in that direction — an UP elevator at floor 12 can't pick up a call at floor 8 without reversing, so that's excluded even though its direction matches.",
        },
      ],
    },
    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 815,
      content: [
        {
          type: "text",
          value: "Elevator is exactly at the requested floor, moving up, hall call is also up at that same floor. Handled?",
        },
      ],
    },
    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 840,
      content: [
        {
          type: "text",
          value:
            "Yes — `e.getCurrentFloor() <= call.getFloor()` uses less-than-or-equal specifically to include the equal case, since an elevator arriving right as the call comes in should still be eligible, not excluded by a strict less-than that would treat 'already there' as 'already passed'.",
        },
        {
          id: "highlight-boundary-check",
          type: "highlight",
          status: "strong",
          value: "Confirms the equal-floor boundary case is handled by the inclusive comparison, not accidentally excluded",
          explanation:
            "Interviewer probes a specific boundary value; candidate correctly traces through why the inclusive comparison operator was chosen rather than just asserting the code is correct.",
        },
      ],
    },
    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 860,
      content: [
        {
          type: "text",
          value: "Two hall calls come in on different threads at nearly the same instant, both eligible for the same elevator. Race condition?",
        },
      ],
    },
    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 895,
      content: [
        {
          type: "text",
          value:
            "Real risk if dispatchLiftForRequest itself isn't synchronized — both threads could read the same elevator's state as the best candidate before either commits its addStop, and both assign to it when a different elevator might have been better for the second one. I'd put a lock around the dispatch decision-and-commit as one unit — either synchronize the whole dispatchLiftForRequest method, or use a dedicated dispatch lock, so evaluation and the addStop assignment happen atomically per call, not read-then-write with a gap where another thread can interleave.",
        },
        {
          id: "highlight-dispatch-race",
          type: "highlight",
          status: "strong",
          value: "Identifies the read-evaluate-then-commit gap in dispatch as a real race condition",
          explanation:
            "The addStop() method itself being synchronized doesn't protect the larger 'pick best, then assign' decision — candidate correctly scopes the lock to the whole decision, not just the final write.",
        },
      ],
    },
    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 920,
      content: [
        {
          type: "text",
          value: "Good. Test cases — concrete ones for the dispatch logic specifically.",
        },
      ],
    },
    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 955,
      content: [
        {
          type: "text",
          value:
            "Elevator A idle at floor 5, elevator B moving up currently at floor 3, hall call UP at floor 6 — B should win, since it's already en route and hasn't passed floor 6. Hall call UP at floor 2 with B still at floor 3 moving up — B is excluded, since it's already past floor 2 going up, and if A is idle, A should win instead. All elevators busy and none idle, none en route in the right direction — fallback cost formula should pick whichever has the smallest distance-plus-queue-length, and I'd construct a case where the nearest elevator has a much longer queue than a slightly farther one, to confirm queue length is actually factored in, not just raw distance.",
        },
      ],
    },
    {
      id: "29",
      role: "takeaway",
      elapsedSeconds: 980,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this round follows a clean requirements-to-entities-to-code progression, and each layer feeds the next instead of standing alone. Non-functional requirements — starvation-avoidance and a swappable dispatch policy — are stated early and then actually shape the design: SCAN is chosen specifically because its guaranteed reversal bounds wait time, not just because it's the standard textbook elevator algorithm. HallCall and CarCall are kept as distinct types because they're mechanically different — one needs controller-level assignment, the other is already bound to an elevator — and the controller-versus-elevator method boundary (controller never touches an elevator's internal stop data) keeps assignment policy and movement mechanics from leaking into each other. The two coded functions get real scrutiny: moveLift's jump-to-next-stop simplification is named honestly rather than defended as complete, and dispatchLiftForRequest's en-route eligibility check gets boundary-tested at the exact-floor-match case and pressure-tested for a genuine read-then-write race condition across concurrent hall calls, which the candidate correctly scopes to the whole decision, not just the final assignment write. Strong signal throughout: TreeSet's ceiling()/floor() operations are chosen because they match SCAN's actual query pattern, not picked generically.",
        },
      ],
    },
  ],
};

const elevatorSystemLld: TranscriptEntry = {
  summary: {    id: 44,

    slug: "elevator-system-lld",
    title: "Elevator System — Low-Level Design",
    category: "lld",
    difficulty: Difficulty.HARD,
    duration: 60,
    tags: [
      "LLD",
      "System Design",
      "Concurrency",
      "SCAN Algorithm",
      "Object-Oriented Design",
      "Java",
    ],
    description:
      "60-minute whiteboard-format LLD round: design an elevator system covering movement, stop ordering, input handling, and the dispatch algorithm. Candidate gathers functional requirements (hall calls vs car calls, multiple elevators, capacity out of scope) and non-functional requirements (starvation-avoidance, thread-safety, a swappable dispatch policy) before naming entities. HallCall and CarCall are kept as distinct types since they're mechanically different; controller-versus-elevator method ownership is drawn as a clear boundary (controller only ever calls addStop, never touches internal queue state). SCAN algorithm is chosen and explicitly tied back to the starvation requirement, backed by per-elevator TreeSet upStops/downStops for O(log n) ceiling()/floor() next-stop lookup. Codes moveLift() (plain Java) and honestly names its jump-to-next-stop simplification versus a fuller per-floor-tick model, then codes dispatchLiftForRequest() with an en-route eligibility check that's boundary-tested at the exact-floor-match case and pressure-tested for a genuine read-then-write race condition across concurrent hall calls, correctly scoping the fix to the whole decide-and-commit unit rather than just the final write. Closes with concrete dispatch test cases including one that verifies queue length, not just raw distance, factors into the fallback cost.",
  },

  transcript,
};

export default elevatorSystemLld;