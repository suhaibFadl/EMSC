"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var patients_letters_inside_service_1 = require("./patients-letters-inside.service");
describe('PatientsLettersInsideService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(patients_letters_inside_service_1.PatientsLettersInsideService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=patients-letters-inside.service.spec.js.map