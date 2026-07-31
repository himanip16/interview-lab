// src/features/library/components/transcript-detail/styles.ts

export const MESSAGE_STYLES = {
  takeaway: {
    background: "linear-gradient(160deg,#fff,#FAF9F6)",
    borderColor: "#00A87E",
    textColor: "#00A87E",
  },
  bubble: {
    candidate: {
      background: "#F1EFEA",
      color: "#15161C",
    },
    interviewer: {
      background: "#fff",
      border: "1px solid rgba(21,22,28,0.07)",
      color: "#15161C",
    },
  },
  aiReply: {
    background: "rgba(106,90,224,0.06)",
    borderColor: "rgba(106,90,224,0.15)",
    color: "#5A5B66",
    accentColor: "#6A5AE0",
  },
  note: {
    background: "#FFF8E1",
    borderColor: "#E8940A",
    color: "#7A5C00",
  },
  codeBlock: {
    background: "#15161C",
    color: "#F3F2EE",
    fontFamily: "'JetBrains Mono', monospace",
  },
  whiteboard: {
    background: "#fff",
    borderColor: "rgba(21,22,28,0.08)",
    captionColor: "#5A5B66",
  },
  testingButton: {
    color: "#E8940A",
    background: "rgba(232,148,10,0.1)",
    borderColor: "rgba(232,148,10,0.3)",
  },
  avatar: {
    candidate: "#6A5AE0",
    interviewer: "#15161C",
  },
} as const;
