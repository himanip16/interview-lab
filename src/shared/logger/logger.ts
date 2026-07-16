export interface LogContext {
  requestId?: string;
  interviewId?: string;
  model?: string;
  [key: string]: unknown;
}

export class Logger {
  private static log(
    level: "INFO" | "WARN" | "ERROR",
    message: string,
    context: LogContext = {}
  ): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      requestId: context.requestId,
      interviewId: context.interviewId,
      model: context.model,
      ...context,
    };

    const output = JSON.stringify(payload);

    switch (level) {
      case "INFO":
        console.log(output);
        break;

      case "WARN":
        console.warn(output);
        break;

      case "ERROR":
        console.error(output);
        break;
    }
  }

  static info(message: string, context?: LogContext): void {
    this.log("INFO", message, context);
  }

  static warn(message: string, context?: LogContext): void {
    this.log("WARN", message, context);
  }

  static error(message: string, context?: LogContext): void {
    this.log("ERROR", message, context);
  }
}