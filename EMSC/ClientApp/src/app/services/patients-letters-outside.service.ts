import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { PatientTrans } from '../interfaces/patient-trans';
import { PTransOutside } from '../interfaces/p-trans-outside';
import { TravelingPr } from '../interfaces/traveling-pr';
import { HotelMovement } from '../interfaces/hotel-movement';
import { Treatment } from '../interfaces/treatment';

@Injectable({
  providedIn: 'root'
})
export class PatientsLettersOutsideService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetAllPatientsOutside: string = "/api/PatientsLettersOutside/GetAllPatientsOutside";
  private baseUrlGetAllPatientsTransactionsOutsideByBranchId: string = "/api/PatientsLettersOutside/GetAllPatientsTransactionsOutsideByBranchId/";
  private baseUrlGetAllPatsTransOutsideByBranchIdOutingFromMainBranch: string = "/api/PatientsLettersOutside/GetAllPatsTransOutsideByBranchIdOutingFromMainBranch/";
  private baseUrlGetAllPatientsOutsideByPatientId: string = "/api/PatientsLettersOutside/GetAllPatientsOutsideByPatientId/";
  private baseUrlGetPatientsTransactionsOutsideByUserId: string = "/api/PatientsLettersOutside/GetPatientsTransactionsOutsideByUserId/";
  private baseUrlGetPatientsTransactionsOutsideByUserRole: string = "/api/PatientsLettersOutside/GetPatientsTransactionsOutsideByUserRole/";
  private baseUrlDeletePatientTransactionsOutside: string = "/api/PatientsLettersOutside/DeletePatientTransactionsOutside/";
  private baseUrlDeletePatientTransactionsOutsideByCommit: string = "/api/PatientsLettersOutside/DeletePatientTransactionsOutsideByCommit/";
  private baseUrlUpdatePatientTransactionOutside: string = "/api/PatientsLettersOutside/UpdatePatientTransactionOutside/";
  private baseUrlAddPatientTrans: string = "/api/PatientsLettersOutside/AddPatientTrans";
  private baseUrlAddAttendantTrans: string = "/api/PatientsLettersOutside/AddAttendantTrans";
  private baseUrlAddAttendantTransByCountry: string = "/api/PatientsLettersOutside/AddAttendantTransByCountry";
  private baseUrlAddPLetterOutByCountry: string = "/api/PatientsLettersOutside/AddPLetterOutByCountry";
  private baseUrlAddPatientTransByCommittees: string = "/api/PatientsLettersOutside/AddPatientTransByCommittees";
  private baseUrlAddTravelAndHotelByCommittees: string = "/api/PatientsLettersOutside/AddTravelAndHotelByCommittees/";
  private baseUrlGetAllP_TransactionsOutsideIsWaiting: string = "/api/PatientsLettersOutside/GetAllP_TransactionsOutsideIsWaiting";
  private baseUrlGetPatAttendantByTRID: string = "/api/PatientsLettersOutside/GetPatAttendantByTRID/";
  private baseUrlCheckPatientIdIfHaveTransctionOutside: string = "/api/PatientsLettersOutside/CheckPatientIdIfHaveTransctionOutside/";
  private baseUrlCheckPatientIdIfHaveTransOutside: string = "/api/PatientsLettersOutside/CheckPatientIdIfHaveTransOutside/";
  private baseUrlCheckReplyStateTransOutside: string = "/api/PatientsLettersOutside/CheckReplyStateTransOutside/";
  private baseUrlGetPersonType: string = "/api/PatientsLettersOutside/GetPersonType/";
  private baseUrlCheckAllReplyStateTransOutside: string = "/api/PatientsLettersOutside/CheckAllReplyStateTransOutside/";
  private baseUrlGetAllPatientsIsAcceptedByManagment: string = "/api/Patients/GetAllPatientsIsAcceptedByManagment/";
  private baseUrlGetAllPatientsInWaitingListByCountry: string = "/api/Patients/GetAllPatientsInWaitingListByCountry/";
  private baseUrlGetPatAttendantByTRIDAccepted: string = "/api/Patients/GetPatAttendantByTRIDAccepted/";
  private baseUrlGetPatAttendantByTRIDInWaitingList: string = "/api/Patients/GetPatAttendantByTRIDInWaitingList/";
  private baseUrlGetPatientsTransactionsOutsideByPatientId: string = "/api/PatientsLettersOutside/GetPatientsTransactionsOutsideByPatientId/";
  private baseUrlGetTravelingProceduresByPatientId: string = "/api/Traveling/GetTravelingProceduresByPatientId/";
  private baseUrlGetFileClosedDataByPatientId: string = "/api/TreatmentMovements/GetFileClosedDataByPatientId/";
  private baseUrlGetHotelMovementsByPatientId: string = "/api/HotelMovements/GetHotelMovementsByPatientId/";
  private baseUrlGetPatientTravelingBackByPatientId: string = "/api/Traveling/GetPatientTravelingBackByPatientId/";

  private baseUrlDeleteFile: string = "/api/Upload/DeleteFile/";
  private baseUrlDeleteReply: string = "/api/PatientsLettersOutside/DeleteReply/";

  private pTransOutside$!: Observable<PTransOutside[]>;
  private traveling$!: Observable<TravelingPr[]>;
  private hotelMovs$!: Observable<HotelMovement[]>;


  //============================ADD patients Transaction ================================

  AddPatientTrans(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddPatientTrans, newpatients);
  }

  AddAttendantTrans(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddAttendantTrans, newpatients);
  }

  AddAttendantTransByCountry(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddAttendantTransByCountry, newpatients);
  }

  AddPLetterOutByCountry(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddPLetterOutByCountry, newpatients);
  }

  AddPatientTransByCommittees(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddPatientTransByCommittees, newpatients);
  }

  AddTravelAndHotelByCommittees(id:number,newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddTravelAndHotelByCommittees + id , newpatients );
  }

    //===================================================================================

  CheckPatientIdIfHaveTransOutside(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlCheckPatientIdIfHaveTransOutside + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
    //===================================================================================

  CheckReplyStateTransOutside(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlCheckReplyStateTransOutside + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetPersonType(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPersonType + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================


  CheckAllReplyStateTransOutside(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlCheckAllReplyStateTransOutside + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================


  GetAllPatientsTransactionsOutsideByBranchId(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatientsTransactionsOutsideByBranchId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetAllPatsTransOutsideByBranchIdOutingFromMainBranch(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatsTransOutsideByBranchIdOutingFromMainBranch + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================


  GetAllPatientsOutsideByPatientId(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatientsOutsideByPatientId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================

  GetPatientsTransactionsOutsideByUserId(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientsTransactionsOutsideByUserId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }

  GetPatientsTransactionsOutsideByUserRole(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientsTransactionsOutsideByUserRole + id).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }
      //===================================================================================


  GetAllP_TransactionsOutsideIsWaiting(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllP_TransactionsOutsideIsWaiting).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetPatAttendantByTRID(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatAttendantByTRID + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================


  GetAllPatientsIsAcceptedByManagment(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatientsIsAcceptedByManagment + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetAllPatientsInWaitingListByCountry(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatientsInWaitingListByCountry + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetPatAttendantByTRIDAccepted(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatAttendantByTRIDAccepted + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetPatAttendantByTRIDInWaitingList(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatAttendantByTRIDInWaitingList + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================


  DeletePatientTransactionsOutside(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeletePatientTransactionsOutside + id);

  }

  DeletePatientTransactionsOutsideByCommit(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeletePatientTransactionsOutsideByCommit + id);

  }

    //===================================================================================

  UpdatePatientTransactionOutside(id: number, newPatient: PTransOutside): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdatePatientTransactionOutside + id, newPatient);

  }

      //===================================================================================

  GetAllPatientsOutside(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatientsOutside).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }
      //===================================================================================

  GetPatientOutsideById(id: number): Observable<PTransOutside> {
    this.clearCache();

    return this.GetAllPatientsOutside().pipe(flatMap(result => result), first(patients => patients.id == id));

  }
        //===================================================================================

  DeleteReply(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteReply + id);
  }
        //===================================================================================

  DeleteFile(id: string): Observable<any> {
    return this.http.delete(this.baseUrlDeleteFile + id);

  }
  //===================================================================================

  GetPatientsTransactionsOutsideByPatientId(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientsTransactionsOutsideByPatientId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }

  GetTravelingProceduresByPatientId(id: number): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.traveling$) {
      this.traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelingProceduresByPatientId + id).pipe(shareReplay());
    }
    return this.traveling$;
  }

  GetFileClosedDataByPatientId(id: number): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetFileClosedDataByPatientId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetHotelMovementsByPatientId(id: number): Observable<HotelMovement[]> {
    this.clearCache();

    if (!this.hotelMovs$) {
      this.hotelMovs$ = this.http.get<HotelMovement[]>(this.baseUrlGetHotelMovementsByPatientId + id).pipe(shareReplay());
    }
    return this.hotelMovs$;
  }

  GetPatientTravelingBackByPatientId(id: number): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.traveling$) {
      this.traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetPatientTravelingBackByPatientId + id).pipe(shareReplay());
    }
    return this.traveling$;
  }


  clearCache() {
    this.pTransOutside$ = null as any;
    this.traveling$ = null as any;
    this.hotelMovs$ = null as any;
  }

}
