import Pretender, { ResponseData } from "pretender";
import { PretenderEngine } from "../engines/pretender";

export class ExpressBuilder {
  private engine: PretenderEngine;
  private pretender: Pretender;

  private method: string = "get";
  private response: ResponseData = [202, {}, ""];
  private urlExpression?: string;

  constructor(deps: {
    engine: PretenderEngine, pretender: Pretender
  }, params: {
    method?: string;
    urlExpression: string;
  }) {
    this.engine = deps.engine
    this.pretender = deps.pretender
    this.method = params.method || 'get'
    this.urlExpression = params.urlExpression
  }

  //
  // Setters
  //

  set(header: string, value: string): this {
    this.response[1][header] = value;
    return this;
  }

  status(status: number): this {
    this.response[0] = status;
    return this;
  }

  //
  // Builders
  //

  json(json: object | string | boolean | number | null): PretenderEngine {
    const body = JSON.stringify(json);

    if (this.response[0] === 202 && body.length) this.response[0] = 200;
    this.response[1]["Content-Type"] = "application/json";
    this.response[2] = body;

    return this.build();
  }

  send(body: string | object): PretenderEngine {
    if (typeof body === "object") return this.json(body);

    if (!this.response[1]["Content-Type"])
      this.response[1]["Content-Type"] = "text/html";

    this.response[2] = body;

    return this.build();
  }

  sendStatus(status: number): PretenderEngine {
    this.response[0] = status;
    return this.build();
  }

  private build(): PretenderEngine {
    if (!this.urlExpression)
      throw new Error(
        "You must specify one of the HTTP request verbs methods before setting the response"
      );

    (this.pretender as any)[this.method](
      this.urlExpression,
      () => this.response
    );

    return this.engine;
  }
}