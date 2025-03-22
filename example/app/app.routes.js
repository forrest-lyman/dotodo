"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const form_component_1 = require("./pages/form/form.component");
const guide_component_1 = require("./pages/guide/guide.component");
const privacy_component_1 = require("./pages/privacy/privacy.component");
const terms_of_use_component_1 = require("./pages/terms-of-use/terms-of-use.component");
const report_component_1 = require("./pages/report/report.component");
exports.routes = [
    {
        path: '',
        component: form_component_1.FormComponent
    },
    {
        path: 'edit/:id',
        component: form_component_1.FormComponent
    },
    {
        path: 'privacy',
        component: privacy_component_1.PrivacyComponent
    },
    {
        path: 'report',
        component: report_component_1.ReportComponent
    },
    {
        path: 'terms-of-use',
        component: terms_of_use_component_1.TermsOfUseComponent
    },
    {
        path: ':id',
        component: guide_component_1.GuideComponent
    },
];
