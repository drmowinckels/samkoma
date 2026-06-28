import { describe, it, expect, afterEach } from "vitest";
import {
  getDisplayLocale,
  setDisplayLocale,
  localizedDateFormat,
  dayHeader,
  formatDayRange,
} from "./datetime";

// 2026-07-15 is a Wednesday.
const WED = "2026-07-15";

describe("display locale", () => {
  afterEach(() => setDisplayLocale("en-US"));

  it("formats date labels in the active display locale", () => {
    setDisplayLocale("en");
    expect(dayHeader(WED).weekday).toBe("Wed");

    setDisplayLocale("nb");
    expect(dayHeader(WED).weekday).toBe("ons.");
  });

  it("localizes the day-range label", () => {
    setDisplayLocale("en");
    expect(formatDayRange([WED])).toBe("Wed, Jul 15");

    setDisplayLocale("nb");
    expect(formatDayRange([WED])).toBe("ons. 15. juli");
  });

  it("getDisplayLocale reflects the most recent set", () => {
    setDisplayLocale("nb");
    expect(getDisplayLocale()).toBe("nb");
  });

  it("caches one formatter per (locale, options) and rebuilds on locale change", () => {
    const opts = { weekday: "short" } as const;

    setDisplayLocale("en");
    const a = localizedDateFormat(opts);
    expect(localizedDateFormat(opts)).toBe(a); // same locale → cached

    setDisplayLocale("nb");
    expect(localizedDateFormat(opts)).not.toBe(a); // new locale → new formatter
  });
});
