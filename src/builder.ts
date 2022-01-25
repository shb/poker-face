import Pretender, { ResponseData, ResponseHandler, Server } from "pretender";

export class PretenderBuilder {
  private pretender: Pretender;
  private method: string = "get";
  private response: ResponseData = [202, {}, ""];
  private urlExpression?: string;

  constructor(pretender: Pretender) {
    this.pretender = pretender;
  }

  delete(urlExpression: string): this;
  delete(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this {
    if (response) {
      this.pretender.delete(urlExpression, response, asyncOrDelay);
    } else {
      this.method = "delete";
      this.urlExpression = urlExpression;
    }
    return this;
  }

  get(urlExpression: string): this;
  get(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this {
    if (response) {
      this.pretender.get(urlExpression, response, asyncOrDelay);
    } else {
      this.method = "get";
      this.urlExpression = urlExpression;
    }
    return this;
  }

  patch(urlExpression: string): this;
  patch(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this {
    if (response) {
      this.pretender.patch(urlExpression, response, asyncOrDelay);
    } else {
      this.method = "patch";
      this.urlExpression = urlExpression;
    }
    return this;
  }

  post(urlExpression: string): this;
  post(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this {
    if (response) {
      this.pretender.post(urlExpression, response, asyncOrDelay);
    } else {
      this.method = "post";
      this.urlExpression = urlExpression;
    }
    return this;
  }

  put(urlExpression: string): this;
  put(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this {
    if (response) {
      this.pretender.put(urlExpression, response, asyncOrDelay);
    } else {
      this.method = "put";
      this.urlExpression = urlExpression;
    }
    return this;
  }

  json(json: object | string | boolean | number | null): this {
    const body = JSON.stringify(json);

    if (this.response[0] === 202 && body.length) this.response[0] = 200;
    this.response[1]["Content-Type"] = "application/json";
    this.response[2] = body;

    return this.commit();
  }

  send(body: string | object): this {
    if (typeof body === "object") return this.json(body);

    if (!this.response[1]["Content-Type"])
      this.response[1]["Content-Type"] = "text/html";

    this.response[2] = body;

    this.commit();
    return this;
  }

  sendStatus(status: number): this {
    this.response[0] = status;
    return this.commit();
  }

  set(header: string, value: string): this {
    this.response[1][header] = value;
    return this;
  }

  status(status: number): this {
    this.response[0] = status;
    return this;
  }

  shutdown(): void {
    return this.pretender.shutdown();
  }

  private commit(): this {
    if (!this.urlExpression)
      throw new Error(
        "You must specify one of the HTTP request verbs methods before setting the response"
      );

    (this.pretender as any)[this.method](
      this.urlExpression,
      () => this.response
    );
    return this;
  }
}
