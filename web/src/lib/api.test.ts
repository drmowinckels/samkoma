import { describe, it, expect, vi, afterEach } from "vitest";
import { createPoll, getPoll, ApiError, type PollInput } from "./api";

const input: PollInput = {
  title: "Team offsite",
  days: ["2026-07-15", "2026-07-16"],
  from: "09:00",
  to: "15:00",
  slot: 30,
  tz: "Europe/Oslo",
  public: true,
};

function mockFetch(body: unknown, init: { status?: number } = {}) {
  const fn = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status: init.status ?? 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createPoll", () => {
  it("POSTs the input as JSON and returns the created poll", async () => {
    const fn = mockFetch(
      { id: "9fK2qd", url: "x/#/e/9fK2qd", editToken: "tok" },
      { status: 201 },
    );

    const created = await createPoll(input);

    expect(created.id).toBe("9fK2qd");
    const [url, opts] = fn.mock.calls[0];
    expect(url).toBe("http://localhost:8787/v1/polls");
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual(input);
  });

  it("throws an ApiError carrying the server error code on 400", async () => {
    mockFetch({ error: "invalid_body" }, { status: 400 });
    await expect(createPoll(input)).rejects.toMatchObject({
      code: "invalid_body",
      status: 400,
    });
  });
});

describe("getPoll", () => {
  it("fetches a poll by id", async () => {
    const fn = mockFetch({ id: "abc123", title: "Lunch", responses: [] });
    const poll = await getPoll("abc123");
    expect(poll.title).toBe("Lunch");
    expect(fn.mock.calls[0][0]).toBe("http://localhost:8787/v1/polls/abc123");
  });

  it("throws a 404 ApiError for an unknown poll", async () => {
    mockFetch({ error: "not_found" }, { status: 404 });
    const err = await getPoll("nope").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
  });
});
