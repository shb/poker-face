import pretend from ".";
import { PretenderBuilder } from "./builder";

describe("express builder methods", () => {
  let server: PretenderBuilder;

  afterEach(() => {
    server.shutdown();
  });

  test("sending status code", async () => {
    server = pretend().get("/teapot").sendStatus(418);

    const res = await fetch("/teapot");

    expect(res.status).toBe(418);
  });

  test("sending html", async () => {
    server = pretend().get("/foo").send("<h1>Hello World</h1>");

    const res = await fetch("/foo");

    expect(res.headers.get("Content-Type")).toBe("text/html");
    expect(await res.text()).toBe("<h1>Hello World</h1>");
  });

  test("sending plain text", async () => {
    server = pretend()
      .get("/foo")
      .set("Content-Type", "text/plain")
      .send("<h1>Hello World</h1>");

    const res = await fetch("/foo");

    expect(res.headers.get("Content-Type")).toBe("text/plain");
    expect(await res.text()).toBe("<h1>Hello World</h1>");
  });

  test("sending json implicitly", async () => {
    server = pretend().get("/foo").send({ foo: "bar" });

    const res = await fetch("/foo");

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/json");
    expect(await res.json()).toStrictEqual({ foo: "bar" });
  });

  test("sending json explicitly", async () => {
    server = pretend().get("/foo").json({ foo: "bar" });

    const res = await fetch("/foo");

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/json");
    expect(await res.json()).toStrictEqual({ foo: "bar" });
  });

  test("setting status", async () => {
    server = pretend().get("/foo").status(500).json({ foo: "bar" });

    const res = await fetch("/foo");

    expect(res.status).toBe(500);
    expect(await res.json()).toStrictEqual({ foo: "bar" });
  });
});

describe("express HTTP methods", () => {
  const testExpressMethod = (method: string) => async () => {
    const server = pretend();
    (server as any)[method]("/foo").status(200).send({ test: true });

    const res = await fetch("/foo", { method });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ test: true });

    server.shutdown();
  };

  test("DELETE request", testExpressMethod("delete"));
  test("GET request", testExpressMethod("get"));
  test("PATCH request", testExpressMethod("patch"));
  test("POST request", testExpressMethod("post"));
  test("PUT request", testExpressMethod("put"));
});
