"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var hospital_ranks_service_1 = require("./hospital-ranks.service");
describe('HospitalRanksService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(hospital_ranks_service_1.HospitalRanksService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=hospital-ranks.service.spec.js.map