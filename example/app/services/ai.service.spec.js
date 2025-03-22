"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const ai_service_1 = require("./ai.service");
describe('AiService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(ai_service_1.AiService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
