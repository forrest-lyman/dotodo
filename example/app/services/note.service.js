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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const core_1 = require("@angular/core");
const firestore_1 = require("@angular/fire/firestore");
const rxjs_1 = require("rxjs");
const user_service_1 = require("./user.service");
const rxjs_interop_1 = require("@angular/core/rxjs-interop");
const ai_service_1 = require("./ai.service");
let NoteService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NoteService = _classThis = class {
        constructor() {
            this.firestore = (0, core_1.inject)(firestore_1.Firestore);
            this.userService = (0, core_1.inject)(user_service_1.UserService);
            this.aiService = (0, core_1.inject)(ai_service_1.AiService);
            this.noteCollection = (0, firestore_1.collection)(this.firestore, 'notes');
            this.active = (0, core_1.signal)(null);
            this.myNotes = (0, core_1.signal)([]);
            this.loadMyNotes();
        }
        loadMyNotes() {
            return (0, rxjs_interop_1.toObservable)(this.userService.user).pipe((0, rxjs_1.mergeMap)(user => {
                if (!user) {
                    return (0, rxjs_1.of)([]);
                }
                else {
                    const q = (0, firestore_1.query)(this.noteCollection, (0, firestore_1.where)('uid', '==', user.uid));
                    return (0, firestore_1.collectionData)(q, { idField: 'id' });
                }
            })).subscribe((notes) => this.myNotes.set(notes));
        }
        load(id) {
            if (!id) {
                throw new Error('Invalid id');
            }
            const docRef = (0, firestore_1.doc)(this.noteCollection, id);
            return (0, firestore_1.docData)(docRef).subscribe((note) => {
                this.active.set(note);
            });
        }
        create(notes) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = this.userService.user();
                if (!user) {
                    throw new Error('Unauthorized');
                }
                const data = {
                    notes,
                    uid: user.uid,
                    createdAt: new Date(),
                    status: 'new'
                };
                const res = yield (0, firestore_1.addDoc)(this.noteCollection, data);
                return Object.assign({ id: res.id }, data);
            });
        }
    };
    __setFunctionName(_classThis, "NoteService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NoteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NoteService = _classThis;
})();
exports.NoteService = NoteService;
