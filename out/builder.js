"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PretenderBuilder = void 0;
class PretenderBuilder {
    constructor(pretender) {
        this.response = [202, {}, ''];
        this.pretender = pretender;
    }
    delete(...args) {
        this.pretender.delete(...args);
        return this;
    }
    get(urlExpression, response, asyncOrDelay) {
        if (response) {
            this.pretender.get(urlExpression, response, asyncOrDelay);
        }
        else {
            this.urlExpression = urlExpression;
        }
        return this;
    }
    patch(...args) {
        this.pretender.patch(...args);
        return this;
    }
    post(...args) {
        this.pretender.post(...args);
        return this;
    }
    put(...args) {
        this.pretender.put(...args);
        return this;
    }
    json(json) {
        const body = JSON.stringify(json);
        this.response[0] = body.length ? 200 : 202;
        this.response[1]['Content-Type'] = 'application/json';
        this.response[2] = body;
        return this.commit();
    }
    send(body) {
        if (typeof body === 'object')
            return this.json(body);
        if (!this.response[1]['Content-Type'])
            this.response[1]['Content-Type'] = 'text/html';
        this.response[2] = body;
        this.commit();
        return this;
    }
    sendStatus(status) {
        this.response[0] = status;
        return this.commit();
    }
    set(header, value) {
        this.response[1][header] = value;
        return this;
    }
    shutdown() {
        return this.pretender.shutdown();
    }
    commit() {
        if (!this.urlExpression)
            throw new Error('You must specify one of the HTTP request verbs methods before setting the response');
        this.pretender.get(this.urlExpression, () => this.response);
        return this;
    }
}
exports.PretenderBuilder = PretenderBuilder;
