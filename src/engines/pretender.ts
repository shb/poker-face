import Pretender, { ResponseData, ResponseHandler } from "pretender";
import { ExpressBuilder } from "../builders/express";
import { HttpMethod } from "../types";

export class PretenderEngine {
  private pretender: Pretender;

  constructor() {
    this.pretender = new Pretender();
  }

  delete(urlExpression: string): ExpressBuilder;
  delete(
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): ExpressBuilder;
  delete(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    return this.builder("delete", urlExpression, response, asyncOrDelay);
  }

  get(urlExpression: string): ExpressBuilder;
  get(
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this;
  get(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    return this.builder("get", urlExpression, response, asyncOrDelay);
  }

  head(urlExpression: string): ExpressBuilder;
  head(
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this;
  head(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    return this.builder("head", urlExpression, response, asyncOrDelay);
  }

  patch(urlExpression: string): this;
  patch(
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this;
  patch(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    return this.builder("patch", urlExpression, response, asyncOrDelay);
  }

  post(urlExpression: string): this;
  post(
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this;
  post(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    return this.builder("post", urlExpression, response, asyncOrDelay);
  }

  put(urlExpression: string): this;
  put(
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this;
  put(
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    return this.builder("put", urlExpression, response, asyncOrDelay);
  }

  shutdown(): void {
    return this.pretender.shutdown();
  }

  private builder (
    method: HttpMethod,
    urlExpression: string,
    response?: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this | ExpressBuilder {
    const builder: any = response ? this.pretenderBuilder : this.expressBuilder;
    return builder.call(this, method, urlExpression, response, asyncOrDelay);
  }

  private pretenderBuilder (
    method: HttpMethod,
    urlExpression: string,
    response: ResponseHandler,
    asyncOrDelay?: boolean | number
  ): this {
    (this.pretender as any)[method](urlExpression, response, asyncOrDelay);
    return this;
  }

  private expressBuilder(
    method: HttpMethod,
    urlExpression: string
  ): ExpressBuilder {
    return new ExpressBuilder(
      {
        engine: this,
        pretender: this.pretender,
      },
      {
        method,
        urlExpression,
      }
    );
  }
}
