export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
}

export function createApiClient({
  baseUrl,
  fetchImpl = fetch,
  timeoutMs = 5_000,
}: ApiClientOptions) {
  async function request<T>(pathname: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await Promise.resolve(
        fetchImpl(new URL(pathname, baseUrl), {
          ...init,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...init?.headers,
          },
          signal: controller.signal,
        }),
      );

      if (!response.ok) {
        throw new ApiError(`Request failed with status ${response.status}.`, response.status);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    getJson: <T>(pathname: string) => request<T>(pathname),
    postJson: <T>(pathname: string, body: unknown) =>
      request<T>(pathname, {
        method: "POST",
        body: JSON.stringify(body),
      }),
  };
}
