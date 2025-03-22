"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideAi = exports.AiService = exports.DEFAULT_CONFIG = void 0;
const core_1 = require("@angular/core");
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
const environment_1 = require("../../environments/environment");
exports.DEFAULT_CONFIG = {
    model: 'gpt-4o-mini',
    max_tokens: 4000,
    temperature: 0.1
};
let AiService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AiService = _classThis = class {
        constructor() {
            this.init(environment_1.environment.openAi);
        }
        init(apiKey) {
            this.openai = new openai_1.default({
                apiKey,
                dangerouslyAllowBrowser: true
            });
        }
        prompt(content_1) {
            return __awaiter(this, arguments, void 0, function* (content, config = {}) {
                return yield this.chat([{
                        role: 'user',
                        content
                    }]);
            });
        }
        ;
        chat(messages_1) {
            return __awaiter(this, arguments, void 0, function* (messages, config = {}) {
                const res = yield this.openai.chat.completions.create(Object.assign(Object.assign(Object.assign({}, exports.DEFAULT_CONFIG), config), { messages }));
                return res.choices[0].message.content;
            });
        }
        ;
        completion(messages_1, format_1) {
            return __awaiter(this, arguments, void 0, function* (messages, format, config = {}) {
                const res = yield this.openai.chat.completions.create(Object.assign(Object.assign(Object.assign({}, exports.DEFAULT_CONFIG), config), { messages, response_format: (0, zod_1.zodResponseFormat)(format, 'event') }));
                const { content } = res.choices[0].message;
                return content ? JSON.parse(content) : null;
            });
        }
        fn(content_1) {
            return __awaiter(this, arguments, void 0, function* (content, config = {}) {
                var _a, _b, _c, _d;
                const { schema } = config;
                delete config.schema;
                if (Array.isArray(content)) {
                    content = content.join(`\n`);
                }
                const res = yield this.openai.chat.completions.create(Object.assign(Object.assign({}, exports.DEFAULT_CONFIG), { messages: [
                        { role: 'user', content }
                    ], tools: [
                        {
                            type: 'function',
                            function: schema
                        }
                    ], tool_choice: {
                        type: 'function',
                        function: {
                            name: schema.name
                        }
                    } }));
                const toolCalls = (_b = (_a = res.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.tool_calls;
                if (!toolCalls) {
                    throw new Error('No tools called');
                }
                const json = (_d = (_c = toolCalls[0]) === null || _c === void 0 ? void 0 : _c.function) === null || _d === void 0 ? void 0 : _d.arguments;
                const data = json ? JSON.parse(json) : {};
                return data.res;
            });
        }
    };
    __setFunctionName(_classThis, "AiService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiService = _classThis;
})();
exports.AiService = AiService;
const provideAi = (apiKey) => ({
    provide: AiService,
    useFactory: () => {
        console.warn('Initializing OpenAI with fixed key, do not use in production!');
        const service = new AiService();
        service.init(apiKey);
        return service;
    }
});
exports.provideAi = provideAi;
