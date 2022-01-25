import Pretender, { Server } from 'pretender';
export declare class PretenderBuilder {
    private pretender;
    private response;
    private urlExpression?;
    constructor(pretender: Pretender);
    delete(...args: Parameters<Server['delete']>): this;
    get(urlExpression: string): this;
    patch(...args: Parameters<Server['patch']>): this;
    post(...args: Parameters<Server['post']>): this;
    put(...args: Parameters<Server['put']>): this;
    json(json: object | string | boolean | number | null): this;
    send(body: string | object): this;
    sendStatus(status: number): this;
    set(header: string, value: string): this;
    shutdown(): void;
    private commit;
}
