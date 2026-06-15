import { describe, it, expect } from "vitest";
import { relativeTime } from "./relativeTime";

describe("relativeTime", () => {
  const now = 1_000_000_000_000;
  it("renders seconds", () => {
    expect(relativeTime(now - 5_000, now)).toBe("5s ago");
  });
  it("renders minutes", () => {
    expect(relativeTime(now - 5 * 60_000, now)).toBe("5m ago");
  });
  it("renders hours", () => {
    expect(relativeTime(now - 3 * 3_600_000, now)).toBe("3h ago");
  });
  it("renders days", () => {
    expect(relativeTime(now - 2 * 86_400_000, now)).toBe("2d ago");
  });
  it("never goes below 1s", () => {
    expect(relativeTime(now, now)).toBe("1s ago");
  });
});
