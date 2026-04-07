import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("COLOSSEUM_COPILOT_PAT", "test-token-123");

const { searchProjects, getFilters } = await import("../colosseum");

describe("colosseum client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("searchProjects", () => {
    it("calls the correct URL with auth header and returns results", async () => {
      const mockResponse = {
        results: [{ slug: "test-project", name: "Test" }],
        totalFound: 1,
        hasMore: false,
        facets: null,
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const result = await searchProjects({ query: "payments", limit: 5 });

      expect(fetch).toHaveBeenCalledWith(
        "https://copilot.colosseum.com/api/v1/search/projects",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token-123",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ query: "payments", limit: 5 }),
        })
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.results).toHaveLength(1);
        expect(result.data.results[0].slug).toBe("test-project");
      }
    });

    it("returns error result on API failure", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
      );

      const result = await searchProjects({ query: "fail" });

      expect(result.ok).toBe(false);
    });
  });

  describe("getFilters", () => {
    it("calls the filters endpoint with auth header", async () => {
      const mockFilters = {
        tracks: [{ key: "breakout/defi", name: "DeFi", hackathonSlug: "breakout", projectCount: 593 }],
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockFilters),
        })
      );

      const result = await getFilters();

      expect(fetch).toHaveBeenCalledWith(
        "https://copilot.colosseum.com/api/v1/filters",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token-123",
          }),
        })
      );
      expect(result!.tracks).toHaveLength(1);
    });

    it("returns null on API error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        })
      );

      const result = await getFilters();

      expect(result).toBeNull();
    });
  });
});
