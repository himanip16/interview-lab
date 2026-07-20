import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Cutting Poles to Collect Minimum Wood",
    difficulty: Difficulty.MEDIUM,
    duration: 35,
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
            "There are N poles of various heights. You have a machine whose saw blade can be set to a specific height h, and it cuts every pole down to h — any pole taller than h gets trimmed to exactly h, and you keep the cut-off pieces. Poles already at or below h are left alone. You need to walk away with at least M total length of cut pieces. What's the maximum h you can set the blade to and still collect at least M?",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 14,
      content: [
        {
          type: "text",
          value:
            "Let me make sure I have the mechanics right. If a pole's height is less than or equal to h, it contributes nothing, right? And if it's taller, it contributes exactly height minus h?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 30,
      content: [
        {
          type: "text",
          value: "Exactly.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 44,
      content: [
        {
          type: "text",
          value:
            "And is h restricted to integers, or can I set the blade to something like 15.5?",
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
          value: "For this version, assume all pole heights and h are non-negative integers.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value:
            "Got it. What are the constraints on N and on the height values — are we talking small arrays, or should I be thinking about this at scale?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 86,
      content: [
        {
          type: "text",
          value:
            "Assume N can be up to around 10^5, and individual heights can be up to around 10^9. Design for that.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 102,
      content: [
        {
          type: "text",
          value:
            "One more thing — what if it's impossible to collect M total, even setting h to 0? Should I return something like -1, or is it guaranteed a valid h always exists?",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [
        {
          type: "text",
          value: "Good question — handle that case yourself. Nothing's guaranteed.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 135,
      content: [
        {
          type: "text",
          value:
            "Okay. Let me start with the most direct approach so we have a baseline. I'd take the maximum pole height as the starting point for h, and walk h downward one unit at a time — 20, 19, 18, and so on — computing the total wood collected at each step, and stop at the first h where the total is at least M.",
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
          value: "Walk me through the cost of that.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 182,
      content: [
        {
          type: "text",
          value:
            "For each candidate h I'm scanning all N poles, and in the worst case h could walk all the way down from 10^9 to 0. So that's O(N times max height), which with the constraints you gave is way too slow.",
        },
        {
          id: "highlight-linear-scan",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "Correctly identifies the brute force is too slow, but stops at naming the problem rather than immediately recognizing the structural property — monotonicity — that unlocks a faster approach. The interviewer has to prompt for it.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value:
            "Right. So instead of asking 'what's the cost of scanning,' ask yourself: as h goes up, what happens to the total wood collected?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 232,
      content: [
        {
          type: "text",
          value: "It only ever goes down, or stays the same — it never increases.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 245,
      content: [
        {
          type: "text",
          value: "Right. So what does that buy you?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 262,
      content: [
        {
          type: "text",
          value:
            "That's a ",
        },
        {
          id: "highlight-monotonic-insight",
          type: "highlight",
          status: "strong",
          value: "monotonic function of h",
          explanation:
            "Correctly recognizes that total-wood-collected is a non-increasing function of h, which is exactly the structural property that makes binary search on the answer valid here.",
        },
        {
          type: "text",
          value:
            " — total collected is non-increasing in h. Any function like that over a bounded range is a binary search candidate. Instead of walking h down one at a time, I can binary search directly on the value of h.",
        },
      ],
    },

    {
      id: "16b",
      role: "candidate",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value: "Let me sketch the array so the search space is concrete before I set bounds.",
        },
        {
          id: "whiteboard-pole-array",
          type: "whiteboard",
          caption: "Pole heights 20, 15, 10, 17 — the wood above any cut line h is what gets collected.",
          value:
            "<svg viewBox=\"0 0 420 260\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"230\" x2=\"400\" y2=\"230\" stroke=\"#475569\" stroke-width=\"2\"/><g><rect x=\"40\" y=\"70\" width=\"50\" height=\"160\" fill=\"#94a3b8\"/><text x=\"65\" y=\"60\" font-size=\"14\" text-anchor=\"middle\" fill=\"#1e293b\">20</text></g><g><rect x=\"130\" y=\"110\" width=\"50\" height=\"120\" fill=\"#94a3b8\"/><text x=\"155\" y=\"100\" font-size=\"14\" text-anchor=\"middle\" fill=\"#1e293b\">15</text></g><g><rect x=\"220\" y=\"150\" width=\"50\" height=\"80\" fill=\"#94a3b8\"/><text x=\"245\" y=\"140\" font-size=\"14\" text-anchor=\"middle\" fill=\"#1e293b\">10</text></g><g><rect x=\"310\" y=\"94\" width=\"50\" height=\"136\" fill=\"#94a3b8\"/><text x=\"335\" y=\"84\" font-size=\"14\" text-anchor=\"middle\" fill=\"#1e293b\">17</text></g><line x1=\"20\" y1=\"110\" x2=\"400\" y2=\"110\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"6,4\"/><text x=\"20\" y=\"104\" font-size=\"13\" fill=\"#dc2626\">h = 15 (example cut line)</text><rect x=\"40\" y=\"70\" width=\"50\" height=\"40\" fill=\"#f59e0b\"/><rect x=\"310\" y=\"94\" width=\"50\" height=\"16\" fill=\"#f59e0b\"/></svg>",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 295,
      content: [
        {
          type: "text",
          value: "Set up the search space. What are your bounds?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value:
            "Low is 0 — the blade could shave everything down to nothing. High is the max height in the array, because setting h any higher than the tallest pole collects zero and is never better than setting h to the tallest pole itself.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value: "Now define the check for a given mid value.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "For a candidate height h, iterate every pole, add max(0, arr[i] - h) to a running total, and return whether that total is at least M. That's an O(N) check.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value:
            "You said heights can be up to 10^9 and N up to 10^5. Any concern with how you're accumulating that total?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 405,
      content: [
        {
          type: "text",
          value:
            "Good catch — worst case that sum is around 10^5 times 10^9, which is 10^14. That ",
        },
        {
          id: "highlight-overflow",
          type: "highlight",
          status: "strong",
          value: "overflows a 32-bit integer",
          explanation:
            "Proactively catches an overflow bug before it ships — 1e14 exceeds 32-bit int range, and the candidate flags it unprompted rather than waiting for a failing test case.",
        },
        {
          type: "text",
          value:
            ", so the running total needs to be a 64-bit type, long in Java or C++, or just a regular number in a language like Python or JavaScript where that's not a separate concern.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 440,
      content: [
        {
          type: "text",
          value:
            "Good. Now, this isn't a standard 'find the target value' binary search — you're not looking for an exact match, you're looking for the largest h where the check still passes. How does that change your loop?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "Right, this is a boundary search, not an exact-match search. While low is less than or equal to high: compute mid, run the check. If check(mid) is true — meaning I'd collect at least M — that h is feasible, so I record it as my current best answer and try to push higher by setting low to mid plus one. If it's false, h is too aggressive, I need a shorter cut, so I set high to mid minus one.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 508,
      content: [
        {
          type: "text",
          value: "Why do you keep searching upward after you already find a feasible h, instead of stopping?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value:
            "Because feasible isn't the same as maximum. There could be a taller h that's still feasible — I only know the check passed at this particular value, not that it's the largest one that does. So I keep the best answer seen so far and keep probing higher until low crosses high.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value: "What about the impossible case you flagged earlier — M larger than what's achievable even at h equals 0?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 578,
      content: [
        {
          type: "text",
          value: "I'd handle that as an ",
        },
        {
          id: "highlight-infeasible-check",
          type: "highlight",
          status: "strong",
          value: "upfront feasibility check before searching",
          explanation:
            "Separates the impossible case out as a precondition rather than letting the binary search silently return a meaningless default, which avoids an incorrect answer sneaking through for an edge case the interviewer explicitly called out.",
        },
        {
          type: "text",
          value:
            " at all — sum every pole's full height, since that's the maximum possible wood you could ever collect at h equals 0. If that total is less than M, there's no valid h, and I return -1 immediately without running the binary search at all.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "Okay, let's dry run it. N is 4, M is 7, the array is 20, 15, 10, 17. Walk me through the search step by step.",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 645,
      content: [
        {
          type: "text",
          value:
            "First the feasibility check — full sum is 20 plus 15 plus 10 plus 17, which is 62, well above 7, so a valid h exists. Low starts at 0, high at 20.",
        },
      ],
    },

    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 675,
      content: [
        {
          type: "text",
          value:
            "Mid is 10. Check: 20 minus 10 is 10, 15 minus 10 is 5, 10 minus 10 is 0, 17 minus 10 is 7. Total is 22, which is at least 7 — feasible. Best answer so far is 10, and low moves to 11.",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value:
            "Now low is 11, high is 20, mid is 15. Check: 20 minus 15 is 5, 15 minus 15 is 0, 10 minus 15 is negative so it contributes 0, 17 minus 15 is 2. Total is 7, still feasible — meets M exactly. Best answer updates to 15, low moves to 16.",
        },
      ],
    },

    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 735,
      content: [
        {
          type: "text",
          value:
            "Low is 16, high is 20, mid is 18. Check: 20 minus 18 is 2, the other three all go negative and contribute 0. Total is 2, which is below 7 — not feasible. High moves down to 17.",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 762,
      content: [
        {
          type: "text",
          value:
            "Low is 16, high is 17, mid is 16. Check: 20 minus 16 is 4, 17 minus 16 is 1, the rest are 0. Total is 5, below 7 — not feasible. High moves down to 15.",
        },
      ],
    },

    {
      id: "35",
      role: "candidate",
      elapsedSeconds: 788,
      content: [
        {
          type: "text",
          value:
            "Now low is 16 and high is 15, so low has crossed high and the loop ends. The best feasible answer I recorded is 15, so that's the maximum blade height.",
        },
      ],
    },

    {
      id: "35b",
      role: "candidate",
      elapsedSeconds: 800,
      content: [
        {
          type: "text",
          value: "Here's how low, mid, and high move through that — mid visits 10, then 15, then 18, then 16, and the window closes in on 15.",
        },
        {
          id: "animation-binary-search-convergence",
          type: "animation",
          caption: "low/high narrowing toward the answer h = 15 over the range [0, 20].",
          durationSeconds: 8,
          value:
            "<svg viewBox=\"0 0 520 160\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"40\" y1=\"110\" x2=\"480\" y2=\"110\" stroke=\"#475569\" stroke-width=\"2\"/><text x=\"40\" y=\"135\" font-size=\"12\" text-anchor=\"middle\" fill=\"#475569\">0</text><text x=\"480\" y=\"135\" font-size=\"12\" text-anchor=\"middle\" fill=\"#475569\">20</text><circle cx=\"260\" cy=\"110\" r=\"6\" fill=\"#2563eb\"><animate attributeName=\"cx\" values=\"260;348;172;194\" keyTimes=\"0;0.33;0.66;1\" dur=\"8s\" begin=\"0s\" fill=\"freeze\" /></circle><text font-size=\"13\" fill=\"#2563eb\" text-anchor=\"middle\"><animate attributeName=\"x\" values=\"260;348;172;194\" keyTimes=\"0;0.33;0.66;1\" dur=\"8s\" begin=\"0s\" fill=\"freeze\" /><animate attributeName=\"y\" values=\"90;90;90;90\" dur=\"8s\" begin=\"0s\" fill=\"freeze\" />mid</text><text x=\"260\" y=\"75\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\" opacity=\"0\"><animate attributeName=\"opacity\" values=\"1;0\" begin=\"0s\" dur=\"2.6s\" fill=\"freeze\" />h=10, sum=22 (feasible)</text><text x=\"348\" y=\"75\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\" opacity=\"0\"><animate attributeName=\"opacity\" values=\"0;1;0\" begin=\"2.6s\" dur=\"2.7s\" fill=\"freeze\" />h=15, sum=7 (feasible, best)</text><text x=\"172\" y=\"75\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\" opacity=\"0\"><animate attributeName=\"opacity\" values=\"0;1;0\" begin=\"5.3s\" dur=\"1.35s\" fill=\"freeze\" />h=18, sum=2 (too high)</text><text x=\"194\" y=\"75\" font-size=\"12\" fill=\"#1e293b\" text-anchor=\"middle\" opacity=\"0\"><animate attributeName=\"opacity\" values=\"0;1\" begin=\"6.65s\" dur=\"1.35s\" fill=\"freeze\" />h=16, sum=5 (too high)</text><rect x=\"40\" y=\"104\" width=\"440\" height=\"12\" fill=\"#93c5fd\" opacity=\"0.35\"><animate attributeName=\"width\" values=\"440;220;110;55\" keyTimes=\"0;0.33;0.66;1\" dur=\"8s\" begin=\"0s\" fill=\"freeze\" /><animate attributeName=\"x\" values=\"40;260;348;348\" keyTimes=\"0;0.33;0.66;1\" dur=\"8s\" begin=\"0s\" fill=\"freeze\" /></rect><circle cx=\"348\" cy=\"110\" r=\"5\" fill=\"#16a34a\" opacity=\"0\"><animate attributeName=\"opacity\" values=\"0;1\" begin=\"2.6s\" dur=\"5.4s\" fill=\"freeze\" /></circle><text x=\"348\" y=\"140\" font-size=\"11\" fill=\"#16a34a\" text-anchor=\"middle\" opacity=\"0\"><animate attributeName=\"opacity\" values=\"0;1\" begin=\"2.6s\" dur=\"5.4s\" fill=\"freeze\" />best = 15</text></svg>",
        },
      ],
    },

    {
      id: "36",
      role: "interviewer",
      elapsedSeconds: 812,
      content: [
        {
          type: "text",
          value: "Good, that matches. Now write the actual function.",
        },
      ],
    },

    {
      id: "37",
      role: "candidate",
      elapsedSeconds: 835,
      content: [
        {
          type: "code",
          language: "python",
          value:
            "def max_blade_height(arr, m):\n    total = sum(arr)\n    if total < m:\n        return -1\n\n    def wood_collected(h):\n        return sum(x - h for x in arr if x > h)\n\n    low, high = 0, max(arr)\n    best = 0\n\n    while low <= high:\n        mid = (low + high) // 2\n        if wood_collected(mid) >= m:\n            best = mid\n            low = mid + 1\n        else:\n            high = mid - 1\n\n    return best",
        },
      ],
    },

    {
      id: "38",
      role: "interviewer",
      elapsedSeconds: 878,
      content: [
        {
          type: "text",
          value: "What's the overall time and space complexity?",
        },
      ],
    },

    {
      id: "39",
      role: "candidate",
      elapsedSeconds: 895,
      content: [
        {
          type: "text",
          value:
            "The binary search runs O(log(max height)) iterations, and each iteration does an O(N) check, so it's O(N log(max height)) overall — with the given constraints that's roughly 10^5 times 30, so around 3 times 10^6 operations, comfortably fast. Space is O(1) beyond the input array, since I'm not storing anything extra per pole.",
        },
      ],
    },

    {
      id: "40",
      role: "interviewer",
      elapsedSeconds: 925,
      content: [
        {
          type: "text",
          value:
            "Let's push on this. Suppose the requirement changes so the blade can be set to a real number, not just an integer — h could be 15.37. How does your approach change?",
        },
      ],
    },

    {
      id: "41",
      role: "candidate",
      elapsedSeconds: 955,
      content: [
        {
          type: "text",
          value:
            "The core idea still holds, since the collected-wood function is still non-increasing in h. But I can't binary search on integers anymore — there's no well-defined 'next' value to test. I'd switch to binary search over a continuous range with a fixed number of iterations, say around 50 to 100, rather than an exact low-crosses-high stopping condition, since floating point equality isn't reliable. After the fixed iterations, low and high converge to within some acceptable epsilon of the true answer, and I'd return high, or the midpoint of the final range, depending on the precision required.",
        },
      ],
    },

    {
      id: "42",
      role: "interviewer",
      elapsedSeconds: 1000,
      content: [
        {
          type: "text",
          value: "Would you still do a strict feasibility check upfront in that version?",
        },
      ],
    },

    {
      id: "43",
      role: "candidate",
      elapsedSeconds: 1022,
      content: [
        {
          type: "text",
          value:
            "Yes, that part doesn't change — sum of all pole heights compared to M is still exactly the h-equals-zero case, integer or not, so the same guard applies before I spend any iterations on the search.",
        },
      ],
    },

    {
      id: "44",
      role: "interviewer",
      elapsedSeconds: 1048,
      content: [
        {
          type: "text",
          value:
            "New direction. Suppose this runs continuously in a warehouse system, and poles are being added and removed from the yard throughout the day — this isn't a one-shot query anymore, it's repeated with a changing array. What would you reconsider?",
        },
      ],
    },

    {
      id: "45",
      role: "candidate",
      elapsedSeconds: 1080,
      content: [
        {
          type: "text",
          value:
            "If each query still has to scan every pole for every check inside the binary search, that's fine for one query, but if this is being called repeatedly on a large, frequently-changing set, I'd rather not pay O(N log(max height)) from scratch every single time.",
        },
      ],
    },

    {
      id: "46",
      role: "interviewer",
      elapsedSeconds: 1108,
      content: [
        {
          type: "text",
          value: "So what would you change about the data structure?",
        },
      ],
    },

    {
      id: "47",
      role: "candidate",
      elapsedSeconds: 1135,
      content: [
        {
          type: "text",
          value:
            "I'd keep the pole heights in a sorted structure — a sorted array with a Fenwick tree over height buckets, or a balanced BST augmented with subtree sums. That way, for a given h, instead of scanning all N poles I can binary search for the split point between poles above h and poles at or below h, and use a prefix sum of heights above that point to get the total collected in O(log N) instead of O(N). That turns each check inside the binary search into O(log N), so the whole query becomes O(log N times log(max height)), and insertions or removals of individual poles are also O(log N) to keep the structure updated.",
        },
        {
          id: "highlight-log-n-check",
          type: "highlight",
          status: "strong",
          value: "",
          explanation:
            "Correctly identifies that the O(N) check is the bottleneck once queries are repeated against a mutating dataset, and proposes the right fix — a sorted/augmented structure with prefix sums so each check drops from O(N) to O(log N), which is the natural next step once the problem shape changes from single-shot to repeated queries.",
        },
      ],
    },

    {
      id: "48",
      role: "interviewer",
      elapsedSeconds: 1185,
      content: [
        {
          type: "text",
          value: "That's the right direction. Last one — what if two poles are tied at the exact height that ends up being your answer? Does anything about your logic break?",
        },
      ],
    },

    {
      id: "49",
      role: "candidate",
      elapsedSeconds: 1210,
      content: [
        {
          type: "text",
          value:
            "No — duplicates don't need special-casing here, because the check function treats every pole independently by value, not by position or identity. Two poles at height 15 just both contribute their own max(0, height - h) term to the same sum. The monotonicity argument doesn't rely on the values being distinct, so the binary search is unaffected either way.",
        },
      ],
    },

    {
      id: "50",
      role: "interviewer",
      elapsedSeconds: 1240,
      content: [
        {
          type: "text",
          value: "Good. That's everything I wanted to cover.",
        },
      ],
    },

    {
      id: "51",
      role: "takeaway",
      elapsedSeconds: 1270,
      content: [
        {
          type: "text",
          value:
            "Takeaway: recognizing that total wood collected is a monotonic, non-increasing function of h is what turns a brute-force linear scan over every possible height into a binary search on the answer. The O(N) check per candidate h, the 64-bit accumulator to avoid overflow, the upfront feasibility guard for an unreachable M, and the boundary-search loop that keeps probing after the first feasible hit are the pieces that make the solution both correct and efficient. The follow-ups — continuous h values, and repeated queries against a mutating pole set — test whether that same monotonicity insight generalizes past the original array-based version.",
        },
      ],
    },
  ],
};

const amazonCuttingPoles: TranscriptEntry = {
  summary: {
    slug: "amazon-cutting-poles",
    title: "Cutting Poles to Collect Minimum Wood",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 35,
    company: "Amazon",
    tags: [
      "Binary Search",
      "Arrays",
      "Monotonic Function",
      "Search Space Reduction",
      "Overflow Handling",
      "Edge Cases",
      "Time Complexity",
    ],
    description:
      "SDE2 DSA interview covering binary search on the answer space to find the maximum blade height that still collects at least M units of wood, including the monotonicity argument, 64-bit overflow handling, an upfront infeasibility guard, a full dry run, and follow-ups on continuous heights and repeated queries against a mutating pole set.",
  },

  transcript,
};

export default amazonCuttingPoles;