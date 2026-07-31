import { describe, expect, it, vi } from "vitest";

import { ApiError, createApiClient } from "./index";

describe("api client", () => {
  it("parses json responses", async () => {
    const client = createApiClient({
      baseUrl: "https://example.com",
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response),
    });

    await expect(client.getJson<{ ok: boolean }>("/ping")).resolves.toEqual({ ok: true });
  });

  it("throws api errors", async () => {
    const client = createApiClient({
      baseUrl: "https://example.com",
      fetchImpl: vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response),
    });

    await expect(client.getJson("/ping")).rejects.toBeInstanceOf(ApiError);
  });
});
