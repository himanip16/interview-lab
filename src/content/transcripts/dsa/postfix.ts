// src/content/transcripts/technical/postfix-expression-evaluation.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Postfix Expression Evaluation with Exception Handling",
    difficulty: Difficulty.MEDIUM,
    duration: 40,
    template: "DSA",
    category: "DSA",
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
            "Evaluate a postfix expression. Handle all edge cases and invalid inputs.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 15,
      content: [
        {
          type: "text",
          value:
            "Okay, so postfix means operators come after operands. Like '3 4 +' instead of '3 + 4'.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        {
          type: "text",
          value: "Right. Walk me through your approach.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 42,
      content: [
        {
          type: "text",
          value:
            "Use a stack. Iterate through each token. If it's a number, push it. If it's an operator, pop two operands, apply the operator, push the result back.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value: "What if the expression is invalid?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value:
            "Good point. I need to validate. If I encounter an operator and the stack has fewer than two elements, that's invalid.",
        },
        {
          id: "highlight-insufficient-operands",
          type: "highlight",
          status: "strong",
          value: "Check stack size before popping for operators",
          explanation:
            "The candidate identifies the core validation: you need two operands for every binary operator. Insufficient operands means the expression is malformed.",
        },
        {
          type: "text",
          value: " And at the end, the stack should have exactly one element. If it has more, that's extra operands left over.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 98,
      content: [
        {
          type: "text",
          value: "What operators do you support?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 112,
      content: [
        {
          type: "text",
          value:
            "Let's start with +, -, *, /. But I need to be careful with division—division by zero is invalid.",
        },
        {
          id: "highlight-division-by-zero",
          type: "highlight",
          status: "strong",
          value: "Check if divisor is zero before division",
          explanation:
            "A specific runtime error that needs explicit handling. This shows the candidate thinks about operations that can fail, not just structure.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 128,
      content: [
        {
          type: "text",
          value: "How do you identify operands vs operators?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value:
            "For operands, I check if the token can be parsed as a number. Operators are a fixed set: '+', '-', '*', '/'. If a token is neither, that's an invalid symbol.",
        },
        {
          id: "highlight-invalid-symbol",
          type: "highlight",
          status: "strong",
          value: "Reject tokens that are neither valid numbers nor valid operators",
          explanation:
            "The candidate catches the third error class: unknown symbols. A robust solution must validate every token, not just structure.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "What about negative numbers?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 180,
      content: [
        {
          type: "text",
          value:
            "Good catch. I need to handle negative numbers. If I'm parsing a token and it starts with '-', I need to check if it's the operator minus or part of a negative number.",
        },
        {
          id: "highlight-negative-ambiguity",
          type: "highlight",
          status: "missed",
          value: "Disambiguate negative numbers from the minus operator",
          explanation:
            "This is a subtle parsing problem. A token like '-5' is a number, but '-' alone is an operator. The candidate recognizes the issue but doesn't fully specify the solution.",
        },
        {
          type: "text",
          value:
            " I'll treat a token as a number if it can be fully parsed by parseInt or parseFloat, including the minus sign.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 202,
      content: [
        {
          type: "text",
          value: "What about floating point results?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value:
            "Division can produce floats. I'll allow them in the stack. For the final result, I'll return a number that could be int or float depending on the input.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value: "Walk me through your code structure.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 252,
      content: [
        {
          type: "text",
          value:
            "I'll create a function evaluatePostfix(expression: string) that returns a number. First, I'll split the expression by spaces to get tokens.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 268,
      content: [
        {
          type: "text",
          value: "What happens if there are no spaces?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 283,
      content: [
        {
          type: "text",
          value:
            "That's an assumption I'm making—that tokens are space-separated. If they're not, I'd need more context on how to parse. For now, I'll assume space-separated input.",
        },
        {
          id: "highlight-input-assumption",
          type: "highlight",
          status: "strong",
          value: "Clarify and document the input format assumption",
          explanation:
            "Good interviewing practice: the candidate states the assumption explicitly rather than silently breaking on edge input.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value: "Let me give you a test case. What's '5 3 +' evaluated to?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 322,
      content: [
        {
          type: "text",
          value:
            "Push 5. Push 3. See +, pop 3 and 5, compute 5 + 3 = 8, push 8. End of tokens, stack has one element: 8. Result is 8.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 338,
      content: [
        {
          type: "text",
          value: "What about '5 0 /'?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 352,
      content: [
        {
          type: "text",
          value:
            "Push 5. Push 0. See /, pop 0 and 5. Try to compute 5 / 0. That's division by zero. I throw an exception: 'Division by zero error'.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 368,
      content: [
        {
          type: "text",
          value: "What about '5 3 + *'?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 383,
      content: [
        {
          type: "text",
          value:
            "Push 5. Push 3. See +, pop 3 and 5, compute 5 + 3 = 8, push 8. See *, pop 8 and... there's nothing left on the stack. That's 'Insufficient operands for operator'.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value: "What about '5 3'?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 415,
      content: [
        {
          type: "text",
          value:
            "Push 5. Push 3. End of tokens. Stack has two elements. That's too many operands. Error: 'Extra operands in expression'.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 430,
      content: [
        {
          type: "text",
          value: "What about '5 3 & +'?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value:
            "Push 5. Push 3. See &. That's not a valid operator. Error: 'Invalid operator: &'.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value: "What about ''?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 475,
      content: [
        {
          type: "text",
          value:
            "Empty string. After splitting, I get an empty tokens array. The loop doesn't run. Stack is empty. Error: 'Empty expression'.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 488,
      content: [
        {
          type: "text",
          value: "How would you test this comprehensively?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "I'd write unit tests for each error case: division by zero, insufficient operands, extra operands, invalid operators, invalid numbers, empty expression. Then test valid cases with different operator combinations and number ranges.",
        },
        {
          id: "highlight-test-coverage",
          type: "highlight",
          status: "strong",
          value: "Test each error path + valid cases",
          explanation:
            "The candidate thinks about comprehensive test coverage: every error condition needs a test, plus happy path variations.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value: "Any other edge cases?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 543,
      content: [
        {
          type: "text",
          value:
            "Large numbers could overflow, but JavaScript handles big numbers okay. Floating point precision could be an issue with very precise results, but that's acceptable for most use cases.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        {
          type: "text",
          value: "Got it. Write it out.",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value:
            "Sure. Function evaluatePostfix, validate each token, build the stack, handle all error cases, return final result or throw with descriptive error message.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value: "Done?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 605,
      content: [
        {
          type: "text",
          value: "Yeah. Time complexity O(n) where n is the number of tokens. Space complexity O(n) for the stack in worst case.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 618,
      content: [
        {
          type: "text",
          value: "Thanks.",
        },
      ],
    },

    {
      id: "40",
      role: "takeaway",
      elapsedSeconds: 625,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Postfix evaluation is a classic stack problem, but the interview quality depends on exception handling. The candidate identifies the three main error classes: (1) insufficient operands for an operator, (2) extra operands left at the end, (3) invalid tokens (unknown operators or unparseable numbers). They also catch runtime errors like division by zero. The approach is straightforward—iterate tokens, push numbers, pop and apply operators—but robustness comes from validating at every step. The honest miss: negative number parsing isn't fully specified ('I'll let parseInt handle it' works but needs testing). The candidate thinks about comprehensive test coverage and time/space complexity, which rounds out the solution. This is a solid mid-level implementation interview response.",
        },
      ],
    },
  ],
};

const postfixExpressionEvaluation: TranscriptEntry = {
  summary: {
    slug: "postfix-expression-evaluation-exceptions",
    title: "Postfix Expression Evaluation with Exception Handling",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 40,
    tags: [
      "Stack",
      "DSA",
      "Exception Handling",
      "Input Validation",
      "Edge Cases",
      "Testing",
    ],
    description:
      "Technical problem-solving interview. Candidate evaluates postfix (Reverse Polish Notation) expressions using stack. Implements core algorithm: iterate tokens, push numbers, pop operands and apply operators. Identifies and handles three error classes: (1) insufficient operands for binary operators, (2) extra operands remaining at end, (3) invalid tokens (unknown operators, unparseable numbers). Adds runtime validation: division by zero, empty expression. Clarifies input format assumption (space-separated tokens). Walks through test cases: basic evaluation, division by zero, insufficient operands, extra operands, invalid operators, empty input. Reflects on negative number parsing ambiguity and floating-point precision. O(n) time, O(n) space.",
  },

  transcript,
};

export default postfixExpressionEvaluation;