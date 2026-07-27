// src/content/deep-dive/articles/ownership.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  starMethod: {
    id: 'starMethod',
    term: 'STAR Method',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A structure for behavioral answers: Situation sets the context, Task names what you were responsible for, Action is what you actually did, Result is the measurable outcome.'
          }
        ]
      }
    ],
    examples: [
      'Situation → Task → Action → Result, in that order, every time'
    ],
    relatedConceptIds: ['ownershipLanguage']
  },
  ownershipLanguage: {
    id: 'ownershipLanguage',
    term: 'Ownership Language',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "The difference between describing a problem and describing your response to it. Ownership language centers what you decided to do, even — especially — when the problem wasn't formally yours."
          }
        ]
      }
    ],
    examples: [
      '"Although another team owned that component, I helped drive it to resolution."'
    ],
    relatedConceptIds: ['boundaryOwnership']
  },
  boundaryOwnership: {
    id: 'boundaryOwnership',
    term: 'Boundary Ownership',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Taking responsibility for an outcome that crosses team or role boundaries — the thing interviewers are specifically probing for when they ask about problems "outside your responsibility."'
          }
        ]
      }
    ],
    examples: [
      'Escalating, coordinating, or fixing something upstream or downstream of your own component'
    ],
    relatedConceptIds: ['ownershipLanguage']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'ownership',
    name: 'Ownership',
    eyebrow: 'BEHAVIORAL · INTERVIEW PREP',
    description:
      "Ownership questions aren't really asking what happened — they're asking whether you'll step past the boundary of your job title when something's broken. This deep dive covers the STAR structure and the specific language that separates a good answer from a forgettable one.",
    category: 'behavioral',
    tags: ['Behavioral', 'Ownership', 'STAR Method', 'Interview Prep'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 8,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Ownership',
      'STAR Method',
      'Behavioral Interview',
      'Root Cause',
      'Accountability',
      'Cross-Team Collaboration'
    ],
    aliases: ['Taking Ownership', 'Accountability Questions'],
    learningObjectives: [
      'Recognize the underlying question behind ownership prompts',
      'Structure an answer using Situation, Task, Action, Result',
      'Use language that centers your response instead of just the problem',
      'Handle the "outside your responsibility" variant convincingly',
      'Avoid the most common ways ownership answers fall flat'
    ],
    difficulty: {
      level: 1,
      prerequisites: []
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'OwnershipArrowIllustration',
    caption: 'A problem crossing a team boundary, and someone stepping across to close it',
    alt: 'Diagram showing a person crossing a dotted boundary line toward a problem outside their formal scope',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Ownership questions all point at the same thing: '
        },
        {
          type: 'bold',
          text: 'what do you do when something is broken and no one has clearly assigned you to fix it?'
        },
        {
          type: 'text',
          text: " The story details change, but the interviewer is listening for one signal — did you wait to be told, or did you close the gap yourself?"
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-question',
      number: 1,
      title: "What This Question Is Actually Testing For",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Ownership questions show up in a few different costumes, but they're all the same test underneath:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Tell me about a time you took ownership of a project.
• Tell me about a time something failed and you fixed it.
• Tell me about a time you handled a problem outside your responsibility.`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "None of these are really asking for a project retrospective. They're asking whether your sense of responsibility stops at your job description or extends to the outcome. Interviewers have heard hundreds of technically correct stories that fail this test anyway — the candidate did competent work, but only within a boundary someone else drew for them."
            }
          ]
        }
      ]
    },

    {
      id: 'star-structure',
      number: 2,
      title: 'The Structure That Works: STAR',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The reliable shape for any ownership answer is four beats, in order, each doing a distinct job:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Situation:
A production issue affected customers.

Task:
I owned identifying the root cause.

Action:
I investigated logs, metrics, code paths,
coordinated with teams, and implemented a fix.

Result:
Reduced failures by X%, improved reliability.`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Situation and Task should be quick — a sentence or two each, just enough for the interviewer to picture the stakes. Action is where almost all your airtime goes, because it's the only beat that's actually about you. Result closes the loop with something measurable, even if the measurement is rough — \"cut incident response time roughly in half\" beats \"things got better\" every time."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'starMethod'
        }
      ]
    },

    {
      id: 'the-line',
      number: 3,
      title: 'The Line That Separates Good From Great',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Most candidates get the STAR shape right and still give a forgettable answer, because the actual sentence describing their role gives the ownership away — or takes it back — in one line."
            }
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: "What they don't want to hear",
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '"This was another team\'s bug, so I informed them."'
                }
              ]
            }
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'What they want to hear',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '"Although another team owned that component, customers were impacted, so I helped drive it to resolution."'
                }
              ]
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Both sentences describe a candidate who did the technically correct thing — flagged a bug that wasn't theirs. The difference is entirely in where the sentence ends. The first one ends at the handoff: informing is the whole action, and the story is over. The second one treats the handoff as the beginning, not the end — ownership of the outcome outlives ownership of the code."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'ownershipLanguage'
        },
        {
          type: 'concept-ref',
          conceptId: 'boundaryOwnership'
        }
      ]
    },

    {
      id: 'worked-example',
      number: 4,
      title: 'A Full Worked Answer',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Stitched together, the beats above sound like this — still concise, but each one now carries the ownership language instead of just the plot:"
            }
          ]
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Sample answer',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "A production issue started causing failed checkouts for a subset of customers. It wasn't immediately clear which service was responsible, and the team that owned the most likely component was heads-down on an unrelated release. I took ownership of finding the root cause even though it might not have been my code. I pulled logs and metrics across three services, traced the failure to a timeout in a downstream dependency, and coordinated with the owning team to ship a fix — pairing with one of their engineers directly instead of waiting in a queue. We reduced failed checkouts by around 40% within a day, and I wrote up the timeline afterward so the on-call runbook would catch it faster next time."
                }
              ]
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Notice what's absent: no blame, no \"I told them and moved on,\" no waiting for permission to dig into someone else's service. The follow-up detail — the runbook update — is a small but deliberate signal too: ownership that outlasts the immediate fire is more convincing than ownership that ends the moment the incident does."
            }
          ]
        }
      ]
    },

    {
      id: 'pitfalls',
      number: 5,
      title: 'Where Answers Fall Apart',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A few patterns reliably weaken an otherwise solid ownership story:'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Blaming the other team, even factually — it reads as deflection, not ownership
• Ending the story at "I escalated it" with no follow-through
• No number or concrete outcome in the Result — "it got better" isn't a result
• Choosing a story where you were the only person who could've acted
  (interviewers want to see initiative, not the absence of alternatives)
• Spending most of the answer on Situation and Task, leaving Action thin`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "That last one is the most common. A candidate spends ninety seconds setting the scene and fifteen seconds on what they actually did — which inverts the ratio the interviewer is listening for. The scene-setting should be the fastest part of the answer, not the longest."
            }
          ]
        }
      ]
    },

    {
      id: 'checklist',
      number: 6,
      title: 'Before You Walk In',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Before the interview, have one or two ownership stories ready and pressure-test them against this checklist:'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Ask yourself:

□ Does my Action beat take up most of the answer?
□ Did I cross a boundary — team, role, or seniority — to fix this?
□ Does my Result have a number, even a rough one?
□ If I removed the word "I" and reread it, would it still sound like leadership?
□ Does the story end with resolution, not a handoff?`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "If a story only passes some of these, it's usually salvageable — the fix is almost always in the wording of Action and Result, not in finding a completely new story."
            }
          ]
        }
      ]
    }
  ],

  glossary,

  resources: [
    {
      type: 'article',
      title: 'Conflict Resolution',
      description: 'The natural next behavioral track — what to do when driving an outcome means disagreeing with someone along the way.',
      url: '/deep-dive/conflict-resolution',
      slug: 'conflict-resolution',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Leadership Without Authority',
      description: 'Ownership stories often double as leadership stories — this covers how to tell that story when you had no formal authority.',
      url: '/deep-dive/leadership-without-authority',
      slug: 'leadership-without-authority',
      relationship: 'related'
    }
  ]
};