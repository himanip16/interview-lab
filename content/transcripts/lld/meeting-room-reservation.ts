import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Meeting & Room Reservation System",
    difficulty: Difficulty.MEDIUM,
    duration: 50,
    template: "Low Level Design",
    category: "LLD",
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
            "Design a room reservation system. Users search for available rooms and book them for meetings. Think Outlook or Google Calendar's room-booking feature.",
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
            "Okay, so I need classes for rooms and meetings, some way to track bookings, and a service that handles the search-and-book flow.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value:
            "Before you start coding, what questions do you need answered?",
        },
        {
          id: "eval-requirements-discipline",
          type: "annotation",
          value:
            "Evaluating: Do they ask clarifying questions, or just start? This separates someone thinking about the problem from someone pattern-matching a solution.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 65,
      content: [
        {
          type: "text",
          value:
            "Right. Scope first. One building or many buildings? Do we support recurring meetings, or just one-off bookings?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 82,
      content: [
        {
          type: "text",
          value:
            "Thousands of rooms across many buildings. Yes to recurring. And concurrent bookings are common — two people might try to book the same room for overlapping times within milliseconds.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 108,
      content: [
        {
          type: "text",
          value:
            "Okay, so concurrency is critical. One more thing — when you say a room is booked, is that just a room reservation, or is it always tied to a meeting with attendees?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 128,
      content: [
        {
          type: "text",
          value:
            "HR might reserve a room for a company event without creating a formal meeting first. So a booking is independent of a meeting.",
        },
        {
          id: "eval-probing-model-shape",
          type: "annotation",
          value:
            "Evaluating: This should trigger them to question whether Booking and Meeting are the same thing or separate entities. Does this detail change their design?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 152,
      content: [
        {
          type: "text",
          value:
            "Okay, so Booking and Meeting might be different things. Let me start with a basic class sketch and see where that leads.",
        },
      ],
    },

    {
      id: "9",
      role: "candidate",
      elapsedSeconds: 178,
      content: [
        {
          type: "text",
          value:
            "I'll start simple. Meeting has a room, timeSlot, organizer, and attendees. Room has capacity and location. For concurrency, I need to make sure two books for the same time don't both succeed.",
        },
        {
          id: "codepad-initial-sketch",
          type: "code",
          language: "typescript",
          value:
            "class TimeSlot {\n  startTime: Date;\n  endTime: Date;\n\n  overlaps(other: TimeSlot): boolean {\n    return this.startTime < other.endTime && other.startTime < this.endTime;\n  }\n}\n\nclass Room {\n  id: string;\n  capacity: number;\n  building: string;\n  equipment: Equipment[];\n}\n\nclass Meeting {\n  id: string;\n  organizer: User;\n  attendees: User[];\n  room: Room;\n  timeSlot: TimeSlot;\n}\n\nclass RoomBookingService {\n  searchAvailableRooms(timeSlot: TimeSlot, capacity: number): Room[] {\n    // find rooms not booked during this time\n  }\n\n  bookRoom(meeting: Meeting): boolean {\n    // verify no overlap, then save\n  }\n}",
        },
      ],
    },

    {
      id: "10",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value:
            "You said Meeting has a room. But HR reserves a room without a meeting. How does that work in your model?",
        },
        {
          id: "eval-model-consistency",
          type: "annotation",
          value:
            "Evaluating: Do they immediately see the contradiction, or do they defend the design? This forces them to reconsider the core abstraction.",
        },
      ],
    },

    {
      id: "11",
      role: "candidate",
      elapsedSeconds: 238,
      content: [
        {
          type: "text",
          value:
            "Oh right. I think I need a Booking object that's separate from Meeting. Booking is just a (Room, TimeSlot). Meeting is a Booking plus attendees and an organizer.",
        },
      ],
    },

    {
      id: "12",
      role: "interviewer",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value: "So is Meeting a subclass of Booking, or does Meeting contain a Booking?",
        },
        {
          id: "eval-composition-or-inheritance",
          type: "annotation",
          value:
            "Evaluating: Do they think through is-a versus has-a? This is a key OO design question.",
        },
      ],
    },

    {
      id: "13",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "Hmm. If Meeting is a subclass of Booking, then both share the bookRoom logic. But if Booking is a concept that includes both HR events and Meetings, they're not really is-a relationships.",
        },
      ],
    },

    {
      id: "14",
      role: "interviewer",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value: "Right, so?",
        },
        {
          id: "eval-decision-confidence",
          type: "annotation",
          value:
            "Evaluating: Do they decide, or waffle? Can they justify their choice?",
        },
      ],
    },

    {
      id: "15",
      role: "candidate",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value:
            "I'd make Booking the core concept. Meeting is just a Booking with metadata — attendees, organizer, agenda. So Meeting has-a Booking, not is-a Booking.",
        },
      ],
    },

    {
      id: "16",
      role: "interviewer",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value: "Okay. Now, you mentioned recurring meetings earlier. How do you model that?",
        },
        {
          id: "eval-recurrence-modeling",
          type: "annotation",
          value:
            "Evaluating: Do they immediately think subclass? Or do they reason about it? The answer matters because it shows their instinct on inheritance.",
        },
      ],
    },

    {
      id: "17",
      role: "candidate",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value:
            "I could make a RecurringMeeting subclass that generates multiple bookings based on a rule. Or... actually, I could just give Booking a recurrenceRule field that's optional.",
        },
      ],
    },

    {
      id: "18",
      role: "interviewer",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value: "What happens in bookRoom if the booking has a recurrence rule?",
        },
        {
          id: "eval-implementation-thinking",
          type: "annotation",
          value:
            "Evaluating: Do they think about implementation details? Does their model actually work end-to-end?",
        },
      ],
    },

    {
      id: "19",
      role: "candidate",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "I'd expand the rule into individual occurrences at the time of booking, so I only need to store individual timeslot + room pairs in the database. That way, canceling one occurrence or checking conflicts is the same as a regular booking.",
        },
      ],
    },

    {
      id: "20",
      role: "interviewer",
      elapsedSeconds: 475,
      content: [
        {
          type: "text",
          value:
            "And if a user cancels just one occurrence of a recurring meeting?",
        },
        {
          id: "eval-edge-case-handling",
          type: "annotation",
          value:
            "Evaluating: Do they think about edge cases immediately, or is this a surprise? Can they adapt their design?",
        },
      ],
    },

    {
      id: "21",
      role: "candidate",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "I think I'd store a BookingGroup that ties all occurrences together, and if you cancel one, you're actually deleting an individual Booking but keeping the others in the group.",
        },
      ],
    },

    {
      id: "22",
      role: "interviewer",
      elapsedSeconds: 530,
      content: [
        {
          type: "text",
          value:
            "What if the organizer changes the duration of one specific occurrence? Say the recurring meeting is normally 1 hour, but next week needs to be 2 hours?",
        },
        {
          id: "eval-design-pressure",
          type: "annotation",
          value:
            "Evaluating: This is pressure testing. Can they handle it? Do they break, or does the design flex?",
        },
      ],
    },

    {
      id: "23",
      role: "candidate",
      elapsedSeconds: 562,
      content: [
        {
          type: "text",
          value:
            "Okay, that's trickier. If the original booking had a recurrence rule and a 1-hour slot, and I expanded it to N bookings, then modifying one means... I'd probably store an 'exceptions' map on the BookingGroup that overrides the default time slot for specific dates.",
        },
      ],
    },

    {
      id: "24",
      role: "interviewer",
      elapsedSeconds: 592,
      content: [
        {
          type: "text",
          value: "Getting complicated. Let's step back. What does the bookRoom method actually do?",
        },
        {
          id: "eval-implementation-focus",
          type: "annotation",
          value:
            "Evaluating: Can they zoom in and think concretely? Or do they stay abstract?",
        },
      ],
    },

    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 622,
      content: [
        {
          type: "text",
          value:
            "It takes a booking, checks if the room is free for the time slot, and if so, inserts the booking into the database.",
        },
      ],
    },

    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 648,
      content: [
        {
          type: "text",
          value:
            "Two people try to book the same room for 2pm-3pm at exactly the same time. What happens?",
        },
        {
          id: "eval-concurrency-awareness",
          type: "annotation",
          value:
            "Evaluating: Do they see the race condition immediately? Or do they think the check-then-insert is safe?",
        },
      ],
    },

    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 675,
      content: [
        {
          type: "text",
          value:
            "I check if the room is booked, and if it's not, I insert. But if both requests check at the same microsecond before either one inserts, they both think it's free.",
        },
      ],
    },

    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 700,
      content: [
        {
          type: "text",
          value: "Exactly. How do you fix that?",
        },
        {
          id: "eval-concurrency-solution",
          type: "annotation",
          value:
            "Evaluating: Do they know about database constraints, transactions, or locks? Can they articulate a real solution?",
        },
      ],
    },

    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 735,
      content: [
        {
          type: "text",
          value:
            "I could use a unique constraint on (room_id, time_slot). Then the database ensures only one booking succeeds. Or I could acquire a lock on the room before checking and inserting.",
        },
      ],
    },

    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 765,
      content: [
        {
          type: "text",
          value: "Which would you pick and why?",
        },
        {
          id: "eval-tradeoff-reasoning",
          type: "annotation",
          value:
            "Evaluating: Do they think through the implications? Lock overhead? Deadlock risk? Constraint is cleaner but requires normalizing time into buckets.",
        },
      ],
    },

    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 802,
      content: [
        {
          type: "text",
          value:
            "Locks could deadlock if two threads try to lock multiple rooms. A constraint is simpler — I'd normalize the time slot into discrete buckets, say 15-minute slots, and make (room, bucket) unique. If the booking spans multiple buckets, I'd insert a row per bucket.",
        },
      ],
    },

    {
      id: "32",
      role: "interviewer",
      elapsedSeconds: 835,
      content: [
        {
          type: "text",
          value:
            "What if maintenance needs to block a room for 2 hours on a Tuesday?",
        },
        {
          id: "eval-edge-case-maintenance",
          type: "annotation",
          value:
            "Evaluating: Do they realize the constraint model treats maintenance the same as a booking? Or does this surprise them?",
        },
      ],
    },

    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 863,
      content: [
        {
          type: "text",
          value:
            "I'd insert a special 'maintenance' booking for that window, same as a user booking. The system sees it as blocked slots and won't let anyone else book during that time.",
        },
      ],
    },

    {
      id: "34",
      role: "interviewer",
      elapsedSeconds: 888,
      content: [
        {
          type: "text",
          value:
            "Good. Now walk me through the full flow from search to confirmation.",
        },
        {
          id: "eval-end-to-end-flow",
          type: "annotation",
          value:
            "Evaluating: Can they articulate the whole process? Or do they gloss over parts?",
        },
      ],
    },

    {
      id: "35",
      role: "candidate",
      elapsedSeconds: 922,
      content: [
        {
          type: "text",
          value:
            "User searches for rooms available 2pm-3pm on Tuesday with capacity ≥10. System queries all rooms with capacity ≥10, filters those with no bookings in any of the time buckets that overlap 2pm-3pm, returns them sorted by proximity or amenities. User picks one. System validates it's still free, then tries the constraint-protected insert. If it succeeds, we create the Meeting record and notify attendees.",
        },
      ],
    },

    {
      id: "36",
      role: "interviewer",
      elapsedSeconds: 965,
      content: [
        {
          type: "text",
          value:
            "What if search returns a room, user reviews it, and by the time they click book, someone else booked it?",
        },
        {
          id: "eval-staleness-handling",
          type: "annotation",
          value:
            "Evaluating: Do they handle the fact that search results are stale? What's the UX recovery?",
        },
      ],
    },

    {
      id: "37",
      role: "candidate",
      elapsedSeconds: 1000,
      content: [
        {
          type: "text",
          value:
            "The insert fails because the constraint is violated. The service returns an error to the user, like 'Room is no longer available.' The user is back to the search results and can pick a different room.",
        },
      ],
    },

    {
      id: "38",
      role: "interviewer",
      elapsedSeconds: 1028,
      content: [
        {
          type: "text",
          value:
            "What about cancellation? If someone cancels a recurring meeting, do you delete all occurrences or ask which ones?",
        },
        {
          id: "eval-cancellation-design",
          type: "annotation",
          value:
            "Evaluating: Do they handle partial cancellation? Or assume all-or-nothing? Real systems need this nuance.",
        },
      ],
    },

    {
      id: "39",
      role: "candidate",
      elapsedSeconds: 1062,
      content: [
        {
          type: "text",
          value:
            "I think I'd ask — 'Cancel this event only' or 'Cancel this and all following' or 'Cancel all events in this series'. Then delete the appropriate Booking records from the BookingGroup.",
        },
      ],
    },

    {
      id: "40",
      role: "interviewer",
      elapsedSeconds: 1090,
      content: [
        {
          type: "text",
          value: "What if the organizer changes from Alice to Bob?",
        },
        {
          id: "eval-organizer-change",
          type: "annotation",
          value:
            "Evaluating: Does this break their model? Do they just update a field, or is there more to think about?",
        },
      ],
    },

    {
      id: "41",
      role: "candidate",
      elapsedSeconds: 1118,
      content: [
        {
          type: "text",
          value:
            "I'd update the Meeting's organizer field. The Booking itself — the room reservation — doesn't care who the organizer is, so that's fine.",
        },
      ],
    },

    {
      id: "42",
      role: "interviewer",
      elapsedSeconds: 1142,
      content: [
        {
          type: "text",
          value:
            "But what if Alice was the only one who could cancel? Now Bob is the organizer. Can Bob cancel the meeting, or only Alice?",
        },
        {
          id: "eval-permission-model",
          type: "annotation",
          value:
            "Evaluating: Do they think about permissions? Do they realize they're missing something?",
        },
      ],
    },

    {
      id: "43",
      role: "candidate",
      elapsedSeconds: 1175,
      content: [
        {
          type: "text",
          value:
            "That's a good point. I haven't thought through permissions at all. I'd probably add a `canCancel()` method on Meeting that checks if the caller is the organizer or an admin. That's orthogonal to the booking logic, but it matters for the cancellation endpoint.",
        },
      ],
    },

    {
      id: "44",
      role: "interviewer",
      elapsedSeconds: 1208,
      content: [
        {
          type: "text",
          value:
            "Let me ask a different angle. In your class sketch, how does Room know which time slots are booked?",
        },
        {
          id: "eval-query-strategy",
          type: "annotation",
          value:
            "Evaluating: Do they think about queries? Is the data structure suitable for the access patterns?",
        },
      ],
    },

    {
      id: "45",
      role: "candidate",
      elapsedSeconds: 1242,
      content: [
        {
          type: "text",
          value:
            "It doesn't — Room just has an ID and capacity. The search service queries the Booking table for all bookings in that time range, groups by room, and filters. So Room is just metadata. The real query is against Bookings.",
        },
      ],
    },

    {
      id: "46",
      role: "interviewer",
      elapsedSeconds: 1270,
      content: [
        {
          type: "text",
          value: "That works. Let me see the Booking class more clearly. What methods does it have?",
        },
        {
          id: "eval-class-interface",
          type: "annotation",
          value:
            "Evaluating: Do they articulate the interface cleanly? Or is it vague?",
        },
      ],
    },

    {
      id: "47",
      role: "candidate",
      elapsedSeconds: 1305,
      content: [
        {
          type: "code",
          language: "typescript",
          value:
            "class Booking {\n  id: string;\n  roomId: string;\n  timeSlot: TimeSlot;\n  createdBy: User;\n  createdAt: Date;\n  bookingType: 'MEETING' | 'MAINTENANCE' | 'BLOCKED';\n  recurrenceRule?: RecurrenceRule;\n\n  // Expand a recurring booking into individual bookings\n  expandOccurrences(): Booking[] {\n    if (!this.recurrenceRule) return [this];\n    // generate bookings up to horizon\n  }\n\n  // Check if this booking conflicts with a time slot\n  conflictsWith(slot: TimeSlot): boolean {\n    return this.timeSlot.overlaps(slot);\n  }\n}\n\nclass Meeting {\n  id: string;\n  booking: Booking;  // has-a, not is-a\n  organizer: User;\n  attendees: User[];\n  agenda?: string;\n\n  canCancel(user: User): boolean {\n    return user.id === this.organizer.id || user.isAdmin;\n  }\n}",
        },
      ],
    },

    {
      id: "48",
      role: "interviewer",
      elapsedSeconds: 1348,
      content: [
        {
          type: "text",
          value:
            "I see bookingType. So the system treats a maintenance block the same as a meeting?",
        },
        {
          id: "eval-polymorphism-question",
          type: "annotation",
          value:
            "Evaluating: Do they see that treating everything as a Booking is good design, or do they over-engineer with subclasses?",
        },
      ],
    },

    {
      id: "49",
      role: "candidate",
      elapsedSeconds: 1375,
      content: [
        {
          type: "text",
          value:
            "Yes, from the booking system's perspective, they're all just 'this room is not available during this time.' The type is just metadata that affects permissions or UI. A maintenance block can't have attendees, but the slot-blocking logic is identical.",
        },
      ],
    },

    {
      id: "50",
      role: "interviewer",
      elapsedSeconds: 1405,
      content: [
        {
          type: "text",
          value: "Alright. Last one: if you had more time, what would you add or change?",
        },
        {
          id: "eval-self-assessment",
          type: "annotation",
          value:
            "Evaluating: Do they see weaknesses in their own design? Are they honest?",
        },
      ],
    },

    {
      id: "51",
      role: "candidate",
      elapsedSeconds: 1445,
      content: [
        {
          type: "text",
          value:
            "A few things. First, I'm not storing conflict information — if I want to ask 'does Alice have a conflict for this time', I'd need to integrate with a user calendar service, which I haven't modeled. Second, I'd add an Observer pattern for notifications — when a booking is created or cancelled, publish an event so notification and audit logging can react independently. Third, I'm using time buckets to avoid conflict, which works but could be fragile if bucket boundaries don't align with meeting needs.",
        },
      ],
    },

    {
      id: "52",
      role: "interviewer",
      elapsedSeconds: 1498,
      content: [
        {
          type: "text",
          value:
            "Good self-awareness. That covers what I wanted to explore.",
        },
      ],
    },

    {
      id: "53",
      role: "takeaway",
      elapsedSeconds: 1520,
      content: [
        {
          type: "text",
          value:
            "Takeaway: The candidate started with an oversimplified Meeting as the booking record, then got pushed to separate Booking from Meeting when HR use cases surfaced. They initially considered RecurringMeeting as a subclass, but backed away and added recurrenceRule as a field instead — showing they could self-correct. The race condition on concurrent bookings was caught through questioning, not handed to them. They reasoned through time buckets versus locks, trade-offs on expansion timing for recurring meetings, and the complexity that emerges when supporting partial cancellations and organizer changes. They caught themselves missing a permission model, and acknowledged gaps in attendee-calendar integration. Most of all, they showed the ability to design incrementally, adjust when challenged, and be honest about what they didn't know.",
        },
      ],
    },
  ],
};

const amazonMeetingRoomReservation: TranscriptEntry = {
  summary: {
    slug: "amazon-meeting-room-reservation-lld",
    title: "Design a Meeting & Room Reservation System",
    category: "lld",
    difficulty: Difficulty.MEDIUM,
    duration: 50,
    company: "Amazon",
    tags: [
      "Object-Oriented Design",
      "Composition over Inheritance",
      "Concurrency",
      "Database Constraints",
      "Race Conditions",
      "Edge Cases",
      "Time Slot Management",
      "Recurring Events",
    ],
    description:
      "SDE2 low-level design interview with real design evolution. Candidate starts by conflating Meeting with Booking, gets pushed to separate them. Handles race conditions on concurrent bookings. Reasons through recurrence expansion, partial cancellations, and organizer changes. Self-corrects on inheritance versus composition. Shows honest gaps on permission models and calendar conflicts.",
  },

  transcript,
};

export default amazonMeetingRoomReservation;