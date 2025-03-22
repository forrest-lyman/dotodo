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
exports.FormComponent = void 0;
const core_1 = require("@angular/core");
const note_service_1 = require("../../services/note.service");
const user_service_1 = require("../../services/user.service");
const router_1 = require("@angular/router");
const forms_1 = require("@angular/forms");
const button_1 = require("@angular/material/button");
const icon_1 = require("@angular/material/icon");
const toolbar_1 = require("@angular/material/toolbar");
const ngx_markdown_1 = require("ngx-markdown");
const sidenav_1 = require("@angular/material/sidenav");
const list_1 = require("@angular/material/list");
const common_1 = require("@angular/common");
const card_1 = require("@angular/material/card");
const tabs_1 = require("@angular/material/tabs");
const radio_1 = require("@angular/material/radio");
let FormComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-form',
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
                radio_1.MatRadioModule
            ],
            templateUrl: './form.component.html',
            styleUrl: './form.component.scss'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FormComponent = _classThis = class {
        constructor() {
            this.noteService = (0, core_1.inject)(note_service_1.NoteService);
            this.userService = (0, core_1.inject)(user_service_1.UserService);
            this.route = (0, core_1.inject)(router_1.ActivatedRoute);
            this.router = (0, core_1.inject)(router_1.Router);
            this.notes = new forms_1.FormControl(localStorage.getItem('notes') || '', [
                forms_1.Validators.required
            ]);
            this.loading = (0, core_1.signal)(false);
            this.error = (0, core_1.signal)(null);
            this.title = 'browser';
            this.notes.valueChanges.subscribe(value => localStorage.setItem('notes', value || ''));
        }
        submit() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.notes.valid) {
                    throw new Error('Invalid notes');
                }
                this.loading.set(true);
                try {
                    const doc = yield this.noteService.create(this.notes.value);
                    this.notes.reset();
                    yield this.router.navigate([doc.id]);
                }
                catch (e) {
                    this.error.set(e.message);
                    console.error(this.error());
                }
                this.loading.set(false);
            });
        }
        reset() {
            this.loading.set(false);
            this.notes.reset();
            this.error.set(null);
        }
        loadSample() {
            this.notes.setValue(sample);
        }
    };
    __setFunctionName(_classThis, "FormComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FormComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FormComponent = _classThis;
})();
exports.FormComponent = FormComponent;
const sample = [
    "Tomatoes come in two types: determinate (bush) and indeterminate (vining). Determinate varieties stop growing once they reach a certain size, while indeterminate keep growing and producing fruit all season. Examples include cherry, Roma, and beefsteak.",
    "They need well-drained, loamy soil. Ideal pH is between 6.0 and 6.8. Adding compost or aged manure to the soil helps with nutrients.",
    "Tomatoes need full sun, at least 6-8 hours a day. Morning sun is best, but they should be protected from intense afternoon heat.",
    "Wait until after the last frost to plant seedlings outdoors. When planting, bury part of the stem deeper than the roots to encourage more root growth.",
    "Water deeply and consistently, about 1-2 inches of water per week. Avoid getting water on the leaves to reduce the chance of diseases. Mulch helps keep moisture in the soil and prevents splashing.",
    "Fertilize regularly with a balanced fertilizer like 10-10-10 or something higher in phosphorus. Don’t use too much nitrogen, or you’ll end up with more leaves and fewer tomatoes.",
    "Pinch off suckers (the little shoots between the main stem and branches) to focus energy on growing fruit. Prune lower leaves to improve airflow and prevent diseases.",
    "Common pests to watch out for: aphids, cutworms, whiteflies, and tomato hornworms. Rotate crops each year to reduce the risk of diseases like blight and powdery mildew.",
    "Use stakes, cages, or trellises to support plants, especially indeterminate varieties. Tie them loosely with twine to avoid damage.",
    "Harvest tomatoes when they’re firm and fully colored (depends on variety—red, yellow, orange, or even purple). Best to pick in the morning when they’re freshest."
].join(`\n\n`);
