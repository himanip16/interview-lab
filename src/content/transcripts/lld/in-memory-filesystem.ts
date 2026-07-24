// src/content/transcripts/system-design/in-memory-file-system.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design an In-Memory File System",
    difficulty: Difficulty.HARD,
    duration: 45,
    template: "Low Level Design",
    category: "LLD",
    company: "Amazon",
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
            "Design an in-memory file system. It needs to support ls, mkdir, addContentToFile, and readContentFromFile. All operations should be efficient — I'll push on what that means as we go.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 16,
      content: [
        {
          type: "text",
          value:
            "Before I structure anything — when I mkdir a path like /a/b/c, and a or b don't exist yet, do I create them along the way, like mkdir -p? And addContentToFile, is that an append or does it overwrite?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 34,
      content: [
        {
          type: "text",
          value: "Good questions. Yes, mkdir -p semantics. addContentToFile appends. And it should create the file if it doesn't exist yet.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value:
            "Okay. First instinct — keep it simple — a single hash map, full path string as the key, mapping to either a file's content or some marker that it's a directory. mkdir just inserts the key, addContentToFile looks up the key and appends.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 80,
      content: [
        {
          type: "text",
          value: "Alright. Walk me through ls on that. Say I ls /a.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 104,
      content: [
        {
          type: "text",
          value:
            "I'd... scan every key in the map, check which ones start with /a/, and pull out the next path segment after that prefix.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 120,
      content: [
        {
          type: "text",
          value: "You said everything should be efficient. Is scanning every key in the whole filesystem for one ls call efficient?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value: "...no. That's ",
        },
        {
          id: "missed-flat-map-scan",
          type: "highlight",
          status: "missed",
          value: "O(total keys) for every single ls call",
          explanation:
            "The candidate's first proposal — a flat hash map keyed by full path string — cannot support ls without scanning every entry in the filesystem, since there's no structural link between a directory and its children. This is caught only after the interviewer pushes, rather than being ruled out up front.",
        },
        {
          type: "text",
          value:
            " — that doesn't scale, and it's doing repeated work that a tree structure would give me for free. I jumped to the simplest-looking structure without checking it against the actual access pattern I need. Let me back up.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value: "Go ahead.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value: "What I actually need is a ",
        },
        {
          id: "strong-tree-structure",
          type: "highlight",
          status: "strong",
          value: "tree of nodes, where each directory node holds a map of its immediate children",
          explanation:
            "After the flat-map approach fails, the candidate correctly identifies that the real requirement is parent-child adjacency, not just key lookup — the standard trie/tree-of-nodes structure for a filesystem, where each node points directly to its own children instead of relying on string prefix matching.",
        },
        {
          type: "text",
          value:
            ". Each node is either a file or a directory. A directory node has a name and a map from child name to child node. A file node has a name and its content. mkdir walks the path component by component from the root, creating a node at each level if it's missing.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 214,
      content: [
        {
          type: "text",
          value: "How do you split the path into components?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 232,
      content: [
        {
          type: "text",
          value:
            "Split on '/', and filter out empty strings — a leading slash on an absolute path leaves an empty first element, and I don't want that treated as a real component.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value: "Fine. Now ls on this new structure — what does it actually return?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 274,
      content: [
        {
          type: "text",
          value:
            "Walk the path to the node. If it's a file, return just that file's name in a single-element list. If it's a directory, return the names of its children.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 292,
      content: [
        {
          type: "text",
          value: "In what order?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 316,
      content: [
        {
          type: "text",
          value:
            "Real ls returns them lexicographically sorted. I could just sort the child names every time ls is called — but if ls is called a lot more often than mkdir or addContentToFile, that's repeated sorting work on data that barely changes between calls. ",
        },
        {
          id: "strong-sorted-children",
          type: "highlight",
          status: "strong",
          value: "keep each directory's children in a sorted map instead, so insertion pays a small ongoing cost and ls is just a traversal",
          explanation:
            "Recognizes that the choice of child-map data structure should follow the expected read/write ratio rather than defaulting to sort-on-read. Shifting the cost to insertion (a sorted map, e.g. a TreeMap) so that ls never re-sorts is a real trade-off, correctly reasoned about rather than assumed.",
        },
        {
          type: "text",
          value:
            ". Costs a bit more on every mkdir or addContentToFile, but if this is a system where things get listed constantly and written occasionally, that trade is worth it.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value: "What if it's the other way — heavy writes, rare reads?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 362,
      content: [
        {
          type: "text",
          value:
            "Then I'd flip it — plain hash map for children, sort lazily only when ls is actually called. There's no single right answer without knowing the workload; I'd ask whoever's using this system which one dominates before committing.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 384,
      content: [
        {
          type: "text",
          value: "addContentToFile appends. How are you storing that content internally?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 404,
      content: [
        {
          type: "text",
          value: "Just a string field on the file node, and append does content = content + newContent.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value: "Say a log-style file gets appended to a few thousand times over its life. Any problem with that line?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value: "...yeah, actually — ",
        },
        {
          id: "missed-string-concat-append",
          type: "highlight",
          status: "missed",
          value: "string concatenation on every append copies the entire existing content each time",
          explanation:
            "In languages with immutable strings, repeated `content = content + newContent` is not O(appended length) — it's O(current total length) per call, making thousands of appends quadratic overall. The candidate's first answer treats append as free and only catches the cost after being prompted with a concrete scenario.",
        },
        {
          type: "text",
          value:
            " — if content's already 10MB and I keep doing content = content + chunk, I'm re-copying that 10MB on every single append. Over thousands of appends that's quadratic, not linear. I should be using a mutable buffer — something like a StringBuilder or a list of chunks — and only materializing the final string when readContentFromFile is actually called.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value: "Better. Now — multiple threads. Someone's writing to /a/b/x.txt while someone else runs mkdir /a/c. Problem?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 498,
      content: [
        {
          type: "text",
          value: "Those two touch different subtrees under /a, so ",
        },
        {
          id: "strong-fine-grained-locking",
          type: "highlight",
          status: "strong",
          value: "a single global lock would serialize completely unrelated operations",
          explanation:
            "Correctly identifies that coarse global locking is overkill for operations on disjoint subtrees, and proposes locking at the node level so that concurrent operations on unrelated paths don't block each other — a meaningful concurrency refinement rather than a default 'just lock everything' answer.",
        },
        {
          type: "text",
          value:
            " — I'd rather lock at the directory-node level. mkdir /a/c only needs a lock on node a while it inserts child c. Writing to x.txt only needs a lock on x.txt's node, plus maybe a read-lock walking down to it so the path doesn't get restructured underneath the write. Two unrelated writers shouldn't block each other just because they both happen to live somewhere under /a.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 522,
      content: [
        {
          type: "text",
          value: "What about two mkdirs racing to create the exact same missing intermediate directory?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 546,
      content: [
        {
          type: "text",
          value:
            "That's the one case where they do collide — both need the lock on the same parent node to check-then-create that child, so it has to be check-and-insert as one atomic step under that node's lock, not a separate check followed by a separate insert. Otherwise both threads see it's missing and both try to create it.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 566,
      content: [
        {
          type: "text",
          value: "Last one — how would you extend this to find every file matching a name pattern, anywhere in the tree?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "DFS from the root, and at each file node check the pattern against its name. That's O(total nodes) in the worst case, which is fine since you genuinely have to look at every file at least once if the pattern isn't anchored to a specific path. If this needed to be fast and repeated, I'd think about a separate inverted index from name fragments to file nodes, but I wouldn't build that unless the requirement actually called for repeated searches — it's extra bookkeeping to keep in sync on every add and delete.",
        },
      ],
    },

    {
      id: "29",
      role: "takeaway",
      elapsedSeconds: 620,
      content: [
        {
          type: "text",
          value:
            "Takeaway: a flat map keyed by full path looks simple but can't support ls without scanning every entry — the real requirement is parent-child adjacency, which points to a tree of nodes where each directory holds a map of its own children. Whether that child map should be sorted-on-write or sorted-on-read is a genuine trade-off that depends on the read/write ratio, not a default. File content should live behind a mutable buffer, not repeated string concatenation, to avoid quadratic append costs. And concurrency should be scoped to the node being modified rather than a single global lock, with the one exception being check-and-create on the same parent, which has to be atomic to avoid duplicate directory creation.",
        },
      ],
    },
  ],
};

const inMemoryFileSystem: TranscriptEntry = {
  summary: {
    slug: "amazon-in-memory-file-system",
    title: "Design an In-Memory File System",
    category: "lld",
    difficulty: Difficulty.HARD,
    duration: 45,
    company: "Amazon",
    tags: [
      "System Design",
      "LLD",
      "Trie",
      "Tree",
      "Concurrency",
      "Locking",
      "Bar Raiser",
    ],
    description:
      "Amazon Bar Raiser LLD round designing an in-memory file system (ls, mkdir, addContentToFile, readContentFromFile): why a flat path-map fails, the tree-of-nodes fix, sorted-vs-lazy child ordering, avoiding quadratic string appends, and fine-grained node-level locking.",
  },

  transcript,
};

export default inMemoryFileSystem;