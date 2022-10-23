import pokerface from "..";
import { PretenderEngine } from "../engines/pretender";

describe("express builder methods", () => {
  let server: PretenderEngine;

  afterEach(() => {
    server.shutdown();
  });

  test("sending status code", async () => {
    server = pokerface().get("/teapot").sendStatus(418);

    const res = await fetch("/teapot");

    expect(res.status).toBe(418);
  });

  test("sending html", async () => {
    server = pokerface().get("/foo").send("<h1>Hello World</h1>");

    const res = await fetch("/foo");

    expect(res.headers.get("Content-Type")).toBe("text/html");
    expect(await res.text()).toBe("<h1>Hello World</h1>");
  });

  test("sending plain text", async () => {
    server = pokerface()
      .get("/foo")
      .set("Content-Type", "text/plain")
      .send("<h1>Hello World</h1>");

    const res = await fetch("/foo");

    expect(res.headers.get("Content-Type")).toBe("text/plain");
    expect(await res.text()).toBe("<h1>Hello World</h1>");
  });

  test("sending json implicitly", async () => {
    server = pokerface().get("/foo").send({ foo: "bar" });

    const res = await fetch("/foo");

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/json");
    expect(await res.json()).toStrictEqual({ foo: "bar" });
  });

  test("sending json explicitly", async () => {
    server = pokerface().get("/foo").json({ foo: "bar" });

    const res = await fetch("/foo");

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/json");
    expect(await res.json()).toStrictEqual({ foo: "bar" });
  });

  test("setting status", async () => {
    server = pokerface().get("/foo").status(500).json({ foo: "bar" });

    const res = await fetch("/foo");

    expect(res.status).toBe(500);
    expect(await res.json()).toStrictEqual({ foo: "bar" });
  });

  test("multiple routes", async () => {
    server = pokerface()
      .get("/things")
      .json([{ n: 1 }, { n: 2 }])
      .get("/thing/:n")
      .json({ n: 0 });

    const things = await fetch("/things");
    expect(await things.json()).toMatchObject([{ n: 1 }, { n: 2 }]);

    const thing = await fetch("/thing/42");
    expect(await thing.json()).toMatchObject({ n: 0 });
  });

  test("different responses", async () => {
    server = pokerface();

    server.get("/status").json({ status: "ok" });

    let status = await fetch("/status");
    expect(await status.json()).toMatchObject({ status: "ok" });

    // ...something bad happens...

    server.get("/status").json({ status: "KO" });

    status = await fetch("/status");
    expect(await status.json()).toMatchObject({ status: "KO" });
  });
});

describe("express HTTP methods", () => {
  const testExpressMethod = (method: string) => async () => {
    const server = pokerface();
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
