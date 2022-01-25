"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pretender_1 = __importDefault(require("pretender"));
const builder_1 = require("./builder");
function pretend() {
    const pretender = new pretender_1.default();
    return new builder_1.PretenderBuilder(pretender);
}
exports.default = pretend;
