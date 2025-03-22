"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const app_routes_1 = require("./app.routes");
const async_1 = require("@angular/platform-browser/animations/async");
const environment_1 = require("../environments/environment");
const ngx_markdown_1 = require("ngx-markdown");
const app_1 = require("@angular/fire/app");
const firestore_1 = require("@angular/fire/firestore");
const auth_1 = require("@angular/fire/auth");
// const app = initializeApp(environment.firebase);
exports.appConfig = {
    providers: [
        (0, core_1.provideZoneChangeDetection)({ eventCoalescing: true }),
        (0, router_1.provideRouter)(app_routes_1.routes),
        (0, ngx_markdown_1.provideMarkdown)(),
        (0, firestore_1.provideFirestore)(() => (0, firestore_1.getFirestore)()),
        (0, app_1.provideFirebaseApp)(() => (0, app_1.initializeApp)(environment_1.environment.firebase)),
        (0, auth_1.provideAuth)(() => (0, auth_1.getAuth)()),
        (0, async_1.provideAnimationsAsync)()
    ]
};
