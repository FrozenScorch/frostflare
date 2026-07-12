import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useWebSocket demo mode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("feeds fictional messages through the shared consumer", async () => {
    vi.stubEnv("VITE_DEMO_MODE", "true");
    vi.spyOn(console, "log").mockImplementation(() => undefined);

    const { useWebSocket } = await import("./useWebSocket");
    const { result, unmount } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current.connected).toBe(true);
      expect(result.current.guilds).toHaveLength(1);
      expect(result.current.users.size).toBe(5);
    });

    expect(result.current.mode).toBe("demo");
    expect(result.current.stats?.totalUsers).toBe(5);
    expect(result.current.logs.map((log) => log.message)).toEqual(
      expect.arrayContaining([
        "Received guild list: 1 guilds",
        "State update: 5 users, 1 interactions",
        "Demo mode started — using fictional local activity",
      ])
    );

    unmount();
  });
});
