import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  base: {
    service: "ai-system-design-interviewer",
  },

  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
});

export default logger;