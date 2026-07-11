import pino from "pino";

const logger =
  process.env.NODE_ENV === "production"
    ? pino({
        level: process.env.LOG_LEVEL ?? "info",
        base: {
          service: "ai-system-design-interviewer",
        },
      })
    : pino({
        transport: {
          target: "pino-pretty",
        },
      });

export default logger;