import { describe, it, expect, vi } from "vitest";

import { Logger } from "./logger";
describe("Logger", () => {
  it("logs info messages", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    Logger.info("test", {
      requestId: "req-1",
      interviewId: "int-1",
      model: "gpt-4.1",
    });

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("logs warnings", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    Logger.warn("warning");

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("logs errors", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    Logger.error("error");

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});