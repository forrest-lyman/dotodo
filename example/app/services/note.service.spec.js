"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const note_service_1 = require("./note.service");
describe('NoteService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(note_service_1.NoteService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
