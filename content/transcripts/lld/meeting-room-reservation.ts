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
            "Let's design a meeting room reservation system. Think about a company like Amazon or Google where employees can search for available rooms and reserve them for meetings.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 25,
      content: [
        {
          type: "text",
          value:
            "Before jumping into classes, I want to understand the scope. Are we only designing room reservation, or are we also responsible for things like sending calendar invites and checking attendee availability?",
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
            "Good question. For this interview, focus on room reservation. Users can create meetings and invite people, but integration with external calendars is out of scope.",
        },
        {
          id: "eval-requirements",
          type: "highlight",
          status: "note",
          value: "Requirement clarification",
          explanation:
            "Strong candidates avoid immediately writing classes. They clarify boundaries first because the domain model depends heavily on scope.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value:
            "Okay. Then I think the main flow is: user searches for rooms for a time range, selects a room, and creates a reservation. I would start with entities like User, Room, and Meeting.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value:
            "Let's say an employee creates a meeting called 'Quarterly Review'. They select a room and time. What information would you store in Meeting?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "I would have Meeting with fields like id, title, organizer, attendees, room, startTime, and endTime. The meeting itself represents the booking.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 170,
      content: [
        {
          type: "text",
          value:
            "Okay. Now a new requirement. The facilities team wants to block a room for maintenance tomorrow from 2 PM to 4 PM. There is no meeting, no attendees, and no organizer. How does your design handle this?",
        },
        {
          id: "eval-meeting-booking",
          type: "highlight",
          status: "note",
          value: "Testing abstraction boundaries",
          explanation:
            "The interviewer is checking whether the candidate tied room availability too closely to meetings.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 220,
      content: [
        {
          type: "text",
          value:
            "That doesn't fit my current model. I made Meeting responsible for both the event and the room reservation. But maintenance is not a meeting.",
        },
      ],
    },

    {
      id: "9",
      role: "candidate",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value:
            "I think I need a separate concept. Maybe a Reservation represents that a room is unavailable during a time range, and Meeting becomes optional metadata attached to a reservation.",
        },
      ],
    },

    {
      id: "10",
      role: "interviewer",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "That sounds better. Can you explain the difference between Meeting and Reservation in your model?",
        },
      ],
    },

    {
      id: "11",
      role: "candidate",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value:
            "Reservation answers the question: 'Is this room occupied during this time?' Meeting answers: 'Why is this reservation created and who is involved?'",
        },
        {
          type: "text",
          value:
            "A maintenance block would only have a Reservation. A normal calendar event would have both a Reservation and a Meeting.",
        },
      ],
    },

    {
      id: "12",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "Good. Let's start designing the objects. What would your initial classes look like?",
        },
      ],
    },

    {
      id: "13",
      role: "candidate",
      elapsedSeconds: 410,
      content: [
        {
          type: "code",
          language: "typescript",
          value:
            `class Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
}


class TimeRange {
  startTime: Date;
  endTime: Date;

  overlaps(other: TimeRange): boolean {
    return this.startTime < other.endTime &&
           other.startTime < this.endTime;
  }
}


class Reservation {
  id: string;
  room: Room;
  timeRange: TimeRange;
}


class Meeting {
  id: string;
  title: string;
  organizer: User;
  attendees: User[];
  reservation: Reservation;
}`,
        },
      ],
    },

    {
      id: "14",
      role: "interviewer",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "Looks reasonable. Now let's explore recurring meetings. Users often create meetings every Monday at 10 AM. How would you support that?",
        },
      ],
    },

    {
      id: "15",
      role: "candidate",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value:
            "My first thought is creating a RecurringMeeting class that extends Meeting and generates future reservations.",
        },
      ],
    },

    {
      id: "16",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        {
          type: "text",
          value:
            "Imagine a weekly meeting happens every Monday. Next Monday's occurrence needs to move from 10 AM to 2 PM, but only for that week. Does inheritance help here?",
        },
        {
          id: "eval-inheritance",
          type: "highlight",
          status: "note",
          value: "Composition vs inheritance",
          explanation:
            "The interviewer introduces a change that exposes whether inheritance is the right abstraction.",
        },
      ],
    },

    {
      id: "17",
      role: "candidate",
      elapsedSeconds: 610,
      content: [
        {
          type: "text",
          value:
            "Actually, inheritance probably does not help much here. A recurring meeting is not really a different type of meeting. It is a meeting with a recurrence pattern.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value:
            "I would probably keep Meeting the same and add a RecurrenceRule object. Individual reservations can be generated from that rule, and specific occurrences can have overrides.",
        },
      ],
    },
        {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 700,
      content: [
        {
          type: "text",
          value:
            "Let's go deeper into recurring meetings. You said reservations can be generated from the recurrence rule. When do you create those reservations?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 740,
      content: [
        {
          type: "text",
          value:
            "Initially I would create all future reservations when the recurring meeting is created.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 780,
      content: [
        {
          type: "text",
          value:
            "Would you create reservations for the next 10 years? What if the user creates a daily meeting forever?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 820,
      content: [
        {
          type: "text",
          value:
            "That's a good point. Creating everything upfront may create unnecessary data. I would probably create reservations only for a reasonable horizon, maybe the next few months, and generate more as needed.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 870,
      content: [
        {
          type: "text",
          value:
            "Okay. Now imagine the user cancels only one occurrence of a recurring meeting. The Monday meetings should continue. How would you model that?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 920,
      content: [
        {
          type: "text",
          value:
            "If I delete the entire recurring meeting, that breaks the use case. I need to distinguish between the series and individual occurrences.",
        },
      ],
    },

    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 950,
      content: [
        {
          type: "text",
          value:
            "I would introduce a MeetingSeries or RecurringReservation entity. Individual reservations reference the series. Cancelling one occurrence only marks that reservation as cancelled.",
        },
      ],
    },

    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 1000,
      content: [
        {
          type: "text",
          value:
            "Good. Now let's move to the booking flow. A user searches for rooms available from 2 PM to 3 PM. How do you find available rooms?",
        },
      ],
    },

    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 1050,
      content: [
        {
          type: "text",
          value:
            "I would query rooms based on requirements like capacity and equipment. Then I would remove rooms that have reservations overlapping with the requested time range.",
        },
      ],
    },

    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 1090,
      content: [
        {
          type: "text",
          value:
            "The company has 20,000 rooms. Would you load all reservations for every room and filter in memory?",
        },
      ],
    },

    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 1140,
      content:[
        {
          type: "text",
          value:
            "No, that would not scale. The database should do the filtering. We need indexes around room_id and reservation time ranges.",
        },
      ],
    },

    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 1180,
      content: [
        {
          type: "text",
          value:
            "Let's focus on the booking operation now. User searched and saw Room A available. They click Book. What happens next?",
        },
      ],
    },

    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 1230,
      content: [
        {
          type: "text",
          value:
            "The service receives roomId and time range. It checks availability again and creates the reservation.",
        },
      ],
    },

    {
      id: "32",
      role: "interviewer",
      elapsedSeconds: 1260,
      content: [
        {
          type: "text",
          value:
            "Why do you check availability again? Didn't search already tell us it is available?",
        },
      ],
    },

    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 1300,
      content: [
        {
          type: "text",
          value:
            "Because search results can become stale. Someone else could have booked the room after the search response was returned.",
        },
      ],
    },

    {
      id: "34",
      role: "interviewer",
      elapsedSeconds: 1340,
      content: [
        {
          type: "text",
          value:
            "Good. Now two users click Book at exactly the same time. Both requests check availability and see the room is free. Both try inserting reservations. What happens?",
        },
        {
          id: "eval-race-condition",
          type: "highlight",
          status: "strong",
          value: "Concurrency handling",
          explanation:
            "A strong candidate recognizes that check-then-insert is not atomic and thinks about database guarantees.",
        },
      ],
    },

    {
      id: "35",
      role: "candidate",
      elapsedSeconds: 1400,
      content: [
        {
          type: "text",
          value:
            "Initially I might have thought the availability check was enough, but it has a race condition. Both requests can pass the check before either inserts.",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 1440,
      content: [
        {
          type: "text",
          value:
            "We need the database to protect us. One option is locking the room while booking. Another option is enforcing a unique constraint so conflicting reservations cannot both succeed.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 1490,
      content: [
        {
          type: "text",
          value:
            "Which approach would you prefer?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 1530,
      content: [
        {
          type: "text",
          value:
            "I would prefer database constraints where possible because they make correctness the responsibility of the database. Locks can work, but they increase complexity and can introduce deadlocks.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 1580,
      content: [
        {
          type: "text",
          value:
            "A reservation is not always a fixed hour. Someone can book 10:10 AM to 10:50 AM. How would you create a unique constraint for overlapping time ranges?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1630,
      content: [
        {
          type: "text",
          value:
            "A simple unique constraint on start and end time would not work because ranges can partially overlap.",
        },
      ],
    },

    {
      id: "41",
      role: "candidate",
      elapsedSeconds: 1680,
      content: [
        {
          type: "text",
          value:
            "One approach is storing reservations in time buckets. For example, split time into 15-minute intervals and reserve all buckets covered by the meeting. Then we can have a unique constraint on room and bucket.",
        },
      ],
    },

    {
      id: "42",
      role: "interviewer",
      elapsedSeconds: 1730,
      content: [
        {
          type: "text",
          value:
            "What are the downsides of that approach?",
        },
      ],
    },

    {
      id: "43",
      role: "candidate",
      elapsedSeconds: 1770,
      content: [
        {
          type: "text",
          value:
            "Storage increases because every reservation creates multiple bucket records. Also, choosing bucket size is a tradeoff. Smaller buckets give accuracy but more rows.",
        },
      ],
    },

    {
      id: "44",
      role: "interviewer",
      elapsedSeconds: 1810,
      content: [
        {
          type: "text",
          value:
            "Good. Now let's say maintenance blocks a room. Does maintenance need a separate workflow?",
        },
      ],
    },

    {
      id: "45",
      role: "candidate",
      elapsedSeconds: 1850,
      content: [
        {
          type: "text",
          value:
            "From the availability perspective, it should behave like any other reservation. The difference is the reservation type.",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1880,
      content: [
        {
          type: "text",
          value:
            "I would avoid creating MaintenanceReservation, MeetingReservation, and EventReservation classes unless their behavior differs. Most of the booking logic is shared.",
        },
      ],
    },
        {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1920,
      content: [
        {
          type: "text",
          value:
            "Let's look at cancellation. A user cancels a normal meeting. What happens to the reservation?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1960,
      content: [
        {
          type: "text",
          value:
            "The reservation should become cancelled or inactive. I would avoid deleting it because we may need history for auditing.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 2000,
      content: [
        {
          type: "text",
          value:
            "Now consider a recurring meeting. User clicks cancel. What options should the system support?",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 2040,
      content: [
        {
          type: "text",
          value:
            "Usually calendar systems support multiple options: cancel only this occurrence, cancel this and future occurrences, or cancel the entire series.",
        },
      ],
    },

    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 2090,
      content: [
        {
          type: "text",
          value:
            "Good. Now let's talk about permissions. If Alice creates the meeting and later transfers ownership to Bob, who can cancel it?",
        },
      ],
    },

    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 2140,
      content: [
        {
          type: "text",
          value:
            "Initially I only modeled organizer as a field, but this introduces a permission concern. I would separate ownership from the reservation itself.",
        },
      ],
    },

    {
      id: "53",
      role: "candidate",
      elapsedSeconds: 2180,
      content: [
        {
          type: "text",
          value:
            "The Reservation should not know about permissions. A Meeting or AccessPolicy layer should decide whether the current user can modify or cancel it.",
        },
        {
          id: "eval-permissions",
          type: "highlight",
          status: "strong",
          value: "Separating responsibilities",
          explanation:
            "Good designs avoid putting authorization rules inside domain objects that only represent data.",
        },
      ],
    },

    {
      id: "54",
      role: "interviewer",
      elapsedSeconds: 2230,
      content: [
        {
          type: "text",
          value:
            "Let's return to your classes. Show me how the main service would look.",
        },
      ],
    },

    {
      id: "55",
      role: "candidate",
      elapsedSeconds: 2280,
      content: [
        {
          type: "code",
          language: "typescript",
          value:
            `class RoomReservationService {

  searchAvailableRooms(
    criteria: SearchCriteria
  ): Room[] {
    // query rooms and exclude conflicting reservations
  }


  createReservation(
    request: ReservationRequest
  ): Reservation {

    // validate request

    // verify availability again

    // persist reservation

    // publish event

  }


  cancelReservation(
    reservationId: string
  ): void {

    // mark cancelled

  }

}


class Reservation {
  id: string;
  roomId: string;
  timeRange: TimeRange;
  type: "MEETING" | "MAINTENANCE";
  status: "ACTIVE" | "CANCELLED";
}


class Meeting {
  id: string;
  reservationId: string;
  organizerId: string;
  attendees: User[];
  recurrenceRule?: RecurrenceRule;
}`,
        },
      ],
    },

    {
      id: "56",
      role: "interviewer",
      elapsedSeconds: 2400,
      content: [
        {
          type: "text",
          value:
            "Looks good. One final question. After a booking succeeds, we need to notify attendees and update audit logs. Would you do that inside createReservation?",
        },
      ],
    },

    {
      id: "57",
      role: "candidate",
      elapsedSeconds: 2450,
      content: [
        {
          type: "text",
          value:
            "I would avoid doing it synchronously. Creating the reservation is the critical operation. Notification failure should not rollback a successful booking.",
        },
      ],
    },

    {
      id: "58",
      role: "candidate",
      elapsedSeconds: 2490,
      content: [
        {
          type: "text",
          value:
            "I would publish a ReservationCreated event after saving. Notification service, audit logging, and analytics can consume that event independently.",
        },
        {
          id: "eval-events",
          type: "highlight",
          status: "strong",
          value: "Good separation of responsibilities",
          explanation:
            "The candidate keeps the booking flow focused and avoids coupling unrelated side effects.",
        },
      ],
    },

    {
      id: "59",
      role: "interviewer",
      elapsedSeconds: 2540,
      content: [
        {
          type: "text",
          value:
            "What are some things you would improve if you had more time?",
        },
      ],
    },

    {
      id: "60",
      role: "candidate",
      elapsedSeconds: 2580,
      content: [
        {
          type: "text",
          value:
            "I would improve a few areas. First, I would add better conflict checking because users may have external calendar conflicts. Second, I would think more about scaling room search with caching and indexes. Third, I would define clearer permission rules for organizers, delegates, and administrators.",
        },
      ],
    },

    {
      id: "61",
      role: "interviewer",
      elapsedSeconds: 2630,
      content: [
        {
          type: "text",
          value:
            "Good. That covers the design.",
        },
      ],
    },

    {
      id: "62",
      role: "takeaway",
      elapsedSeconds: 2660,
      content: [
        {
          type: "text",
          value:
            "The candidate did not start with a perfect model. They initially coupled Meeting and room reservation, but a new requirement exposed that the abstraction was too narrow. They separated Reservation from Meeting and used the discussion to refine the model.",
        },
        {
          type: "text",
          value:
            "The interview explored realistic design pressure points: recurring meetings, cancelling individual occurrences, concurrent booking conflicts, stale search results, permissions, and asynchronous notifications.",
        },
        {
          type: "text",
          value:
            "The important signal was not knowing every answer immediately. The candidate demonstrated the ability to identify gaps, explain tradeoffs, and evolve the design when new requirements appeared.",
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
      "Recurring Meetings",
      "Domain Modeling",
      "Event Driven Design",
    ],
    description:
      "A realistic SDE2 low-level design interview where the candidate evolves the design through discussion. The candidate initially couples meetings with reservations, discovers the limitation through new requirements, and gradually introduces better abstractions. The interview covers recurring meetings, concurrency handling, database constraints, permissions, and event-driven notifications.",
  },

  transcript,
};

export default amazonMeetingRoomReservation;