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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const button_1 = require("@angular/material/button");
const icon_1 = require("@angular/material/icon");
const toolbar_1 = require("@angular/material/toolbar");
const ngx_markdown_1 = require("ngx-markdown");
const sidenav_1 = require("@angular/material/sidenav");
const forms_1 = require("@angular/forms");
const list_1 = require("@angular/material/list");
const common_1 = require("@angular/common");
const card_1 = require("@angular/material/card");
const tabs_1 = require("@angular/material/tabs");
const radio_1 = require("@angular/material/radio");
const note_service_1 = require("../../services/note.service");
const user_service_1 = require("../../services/user.service");
const progress_bar_1 = require("@angular/material/progress-bar");
const progress_spinner_1 = require("@angular/material/progress-spinner");
let GuideComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-guide',
            standalone: true,
            imports: [
                router_1.RouterOutlet,
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                toolbar_1.MatToolbarModule,
                ngx_markdown_1.MarkdownModule,
                sidenav_1.MatSidenavModule,
                forms_1.ReactiveFormsModule,
                list_1.MatListModule,
                common_1.NgIf,
                common_1.NgFor,
                common_1.DatePipe,
                card_1.MatCardModule,
                tabs_1.MatTabsModule,
                router_1.RouterLink,
                common_1.SlicePipe,
                radio_1.MatRadioModule,
                progress_bar_1.MatProgressBarModule,
                progress_spinner_1.MatProgressSpinner
            ],
            templateUrl: './guide.component.html',
            styleUrl: './guide.component.scss'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GuideComponent = _classThis = class {
        constructor() {
            this.noteService = (0, core_1.inject)(note_service_1.NoteService);
            this.userService = (0, core_1.inject)(user_service_1.UserService);
            this.route = (0, core_1.inject)(router_1.ActivatedRoute);
            this.answers = (0, core_1.signal)([]);
            this.showAnswers = (0, core_1.signal)(false);
            this.complete = (0, core_1.computed)(() => {
                var _a;
                const answers = this.answers();
                const notes = this.noteService.active();
                return answers.length === ((_a = notes === null || notes === void 0 ? void 0 : notes.guide) === null || _a === void 0 ? void 0 : _a.quiz.length) && !answers.find(a => !a);
            });
            this.loaded = (0, core_1.computed)(() => {
                const notes = this.noteService.active();
                return (notes === null || notes === void 0 ? void 0 : notes.status) === 'done';
            });
            this.score = (0, core_1.computed)(() => {
                var _a;
                const answers = this.answers();
                const notes = this.noteService.active();
                if (!((_a = notes === null || notes === void 0 ? void 0 : notes.guide) === null || _a === void 0 ? void 0 : _a.quiz)) {
                    return 0;
                }
                return [...notes.guide.quiz].reduce((score, question, idx) => {
                    var _a;
                    const answer = answers[idx];
                    if ((_a = question.answers.find((a) => a.text === answer)) === null || _a === void 0 ? void 0 : _a.correct) {
                        score += 1;
                    }
                    return score;
                }, 0);
            });
            this.notes = (0, core_1.computed)(() => {
                const doc = this.noteService.active();
                if (!doc) {
                    return [];
                }
                else {
                    return doc.notes.split(`\n`).map(n => n.trim()).filter(n => !!n);
                }
            });
            this.loading = (0, core_1.signal)(false);
            this.error = (0, core_1.signal)(null);
            this.title = 'browser';
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.noteService.load(params['id']);
                }
                else {
                    this.noteService.active.set(null);
                }
            });
        }
        setAnswer(idx, ev) {
            this.answers.update(answers => {
                answers[idx] = ev.value;
                return [
                    ...answers
                ];
            });
            console.log(this.answers());
        }
        finishQuiz() {
            this.showAnswers.set(true);
        }
    };
    __setFunctionName(_classThis, "GuideComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GuideComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GuideComponent = _classThis;
})();
exports.GuideComponent = GuideComponent;
