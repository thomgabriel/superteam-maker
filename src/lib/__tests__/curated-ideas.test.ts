import { describe, expect, it } from "vitest";
import { CURATED_IDEAS } from "../curated-ideas";

describe("curated ideas catalog", () => {
  it("contains exactly 200 ideas", () => {
    expect(CURATED_IDEAS).toHaveLength(200);
  });

  it("uses unique ids", () => {
    const ids = CURATED_IDEAS.map((idea) => idea.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("fills the required editorial fields for every idea", () => {
    for (const idea of CURATED_IDEAS) {
      expect(idea.title.length).toBeGreaterThan(8);
      expect(idea.targetUser.length).toBeGreaterThan(8);
      expect(idea.painPoint.length).toBeGreaterThan(20);
      expect(idea.cryptoAngle.length).toBeGreaterThan(20);
      expect(idea.mvpScope.length).toBeGreaterThan(20);
      expect(idea.judgeHook.length).toBeGreaterThan(20);
      expect(idea.painScore).toBeGreaterThanOrEqual(1);
      expect(idea.painScore).toBeLessThanOrEqual(3);
      expect(idea.cryptoScore).toBeGreaterThanOrEqual(1);
      expect(idea.cryptoScore).toBeLessThanOrEqual(3);
      expect(idea.editorialTracks.length).toBeGreaterThan(0);
      expect(idea.tags.length).toBeGreaterThan(1);
    }
  });

  it("keeps broad category coverage after rebalancing", () => {
    const categories = new Set(CURATED_IDEAS.map((idea) => idea.category));
    expect(categories.size).toBeGreaterThanOrEqual(6);
  });

  it("keeps the featured list intentionally small", () => {
    const featured = CURATED_IDEAS.filter((idea) => idea.featured);
    expect(featured.length).toBeGreaterThanOrEqual(6);
    expect(featured.length).toBeLessThanOrEqual(16);
  });
});
