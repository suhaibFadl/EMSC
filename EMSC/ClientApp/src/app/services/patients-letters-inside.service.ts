import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { PatientTrans } from '../interfaces/patient-trans';
import { PTransInside } from '../interfaces/p-trans-inside';
import { Treatment } from '../interfaces/treatment';

@Injectable({
  providedIn: 'root'
})
export class PatientsLettersInsideService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetAllPatientsInside: string = "/api/PatientsLettersInside/GetAllPatientsInside";
  private baseUrlGetAllPatientsTransactionsInsideByBranchId: string = "/api/PatientsLettersInside/GetAllPatientsTransactionsInsideByBranchId/";
  private baseUrlGetPatientsTransactionsInsideByUserId: string = "/api/PatientsLettersInside/GetPatientsTransactionsInsideByUserId/";
  private baseUrlDeletePatientTransactionsInside: string = "/api/PatientsLettersInside/DeletePatientTransactionsInside/";
  private baseUrlUpdatePatientTransactionInside: string = "/api/PatientsLettersInside/UpdatePatientTransactionInside/";
  private baseUrlGetAllP_TransactionsInsideForManagement: string = "/api/PatientsLettersInside/GetAllP_TransactionsInsideForManagement";
  private baseUrlGetPatientsTransactionsInsideByPatientId: string = "/api/PatientsLettersInside/GetPatientsTransactionsInsideByPatientId/";

  private baseUrlGetAllPatientsIsWaitingInside: string = "/api/PatientsLettersInside/GetAllPatientsIsWaitingInside";

  private baseUrlCheckPatientIdIfHaveTransctionInside: string = "/api/PatientsLettersInside/CheckPatientIdIfHaveTransctionInside/";

  private baseUrlCheckPatientIdIfHaveTransInside: string = "/api/PatientsLettersInside/CheckPatientIdIfHaveTransInside/";
  private baseUrlCheckReplyStateTransInside: string = "/api/PatientsLettersInside/CheckReplyStateTransInside/";

  private baseUrlGetAllPatientsTransInsideByToAddTreatment: string = "/api/PatientsLettersInside/GetAllPatientsTransInsideByToAddTreatment/";
  private baseUrlGetAllPatientsTransInsideByBranchToAddTreatment: string = "/api/PatientsLettersInside/GetAllPatientsTransInsideByBranchToAddTreatment/";
  private baseUrlAddTreatmentMovementInside: string = "/api/PatientsLettersInside/AddTreatmentMovementInside";
  private baseUrlUpdateTreatmentMovementInside: string = "/api/PatientsLettersInside/UpdateTreatmentMovementInside/";
  private baseUrlDeleteTreatmentMovement: string = "/api/PatientsLettersInside/DeleteTreatmentMovement/";
  private baseUrlCloseMedicalFileInside: string = "/api/PatientsLettersInside/CloseMedicalFileInside";

  private baseUrlGetPatientTransactionTreatmentByHospId: string = "/api/PatientsLettersInside/GetPatientTransactionTreatmentByHospId/";
  private baseUrlGetPatientTransactionTreatmentByBranchId: string = "/api/PatientsLettersInside/GetPatientTransactionTreatmentByBranchId/";
  private baseUrlGetPatsFilesInsideByHospId: string = "/api/PatientsLettersInside/GetPatsFilesInsideByHospId/";
  private baseUrlGetPatsFilesInsideByBranchId: string = "/api/PatientsLettersInside/GetPatsFilesInsideByBranchId/";
  private baseUrlGetTreatmentsMovByTrid: string = "/api/PatientsLettersInside/GetTreatmentsMovByTrid/";


  private baseUrlDeleteFile: string = "/api/Upload/DeleteFile/";
  private baseUrlDeleteReply: string = "/api/PatientsLettersInside/DeleteReply/";

  private pTransInside$!: Observable<PTransInside[]>;
  private treatment$!: Observable<Treatment[]>;


  CheckPatientIdIfHaveTransInside(id: number): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlCheckPatientIdIfHaveTransInside + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }

  CheckReplyStateTransInside(id: number): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlCheckReplyStateTransInside + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }

  GetAllPatientsTransactionsInsideByBranchId(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsTransactionsInsideByBranchId + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }


  GetPatientsTransactionsInsideByUserId(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetPatientsTransactionsInsideByUserId + id).pipe(shareReplay());
    }
    return this.pTransInside$;

  }
  //================GET ALL patients Transactions is Waiting for management=====================================



  GetAllP_TransactionsInsideForManagement(): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllP_TransactionsInsideForManagement).pipe(shareReplay());
    }
    return this.pTransInside$;
  }


  DeleteReply(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteReply + id);
  }


  //===================================delete Delete Patient Transactions Inside  ==============================

  DeletePatientTransactionsInside(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeletePatientTransactionsInside + id);

  }


  //===================================Update Patient Transaction Inside==============================
  UpdatePatientTransactionInside(id: number, newPatient: PTransInside): Observable<PTransInside> {
    return this.http.put<PTransInside>(this.baseUrlUpdatePatientTransactionInside + id, newPatient);
  }

  GetAllPatientsInside(): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsInside).pipe(shareReplay());
    }
    return this.pTransInside$;
  }
  //====

  GetPatientInsideById(id: number): Observable<PTransInside> {
    this.clearCache();

    return this.GetAllPatientsInside().pipe(flatMap(result => result), first(patients => patients.id == id));

  }

  
  //===================================================================================

  DeleteFile(id: string): Observable<any> {
    return this.http.delete(this.baseUrlDeleteFile + id);

  }
  GetPatientsTransactionsInsideByPatientId(id: number): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetPatientsTransactionsInsideByPatientId + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }


  GetAllPatientsTransInsideByToAddTreatment(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsTransInsideByToAddTreatment + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }

  GetAllPatientsTransInsideByBranchToAddTreatment(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsTransInsideByBranchToAddTreatment + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }


  AddTreatmentMovement(newtratment: Treatment): Observable<Treatment> {
    return this.http.post<Treatment>(this.baseUrlAddTreatmentMovementInside, newtratment);
  }

  CloseMedicalFileInside(newtratment: Treatment): Observable<Treatment> {
    return this.http.put<Treatment>(this.baseUrlCloseMedicalFileInside, newtratment);
  }


  // Update Treatment Movement
  UpdateTreatmentMovement(id: number, edittratment: Treatment): Observable<Treatment> {
    return this.http.put<Treatment>(this.baseUrlUpdateTreatmentMovementInside + id, edittratment);
  }


  // Delete Treatment Movement
  DeleteTreatmentMovement(id: number,trid:number): Observable<any> {

    return this.http.delete('/api/PatientsLettersInside/DeleteTreatmentMovement/' + id + '/' + trid);
  //  return this.http.delete(this.baseUrlDeleteTreatmentMovement + id);
  }


  GetPatientTransactionTreatmentByHospId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatment$) {
      this.treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByHospId + id).pipe(shareReplay());
    }
    return this.treatment$;
  }

  GetPatientTransactionTreatmentByBranchId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatment$) {
      this.treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByBranchId + id).pipe(shareReplay());
    }
    return this.treatment$;
  }


  GetPatsFilesInsideByHospId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatment$) {
      this.treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatsFilesInsideByHospId + id).pipe(shareReplay());
    }
    return this.treatment$;
  }

  GetPatsFilesInsideByBranchId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatment$) {
      this.treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatsFilesInsideByBranchId + id).pipe(shareReplay());
    }
    return this.treatment$;
  }

  GetTreatmentsMovByTrid(id: number): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatment$) {
      this.treatment$ = this.http.get<Treatment[]>(this.baseUrlGetTreatmentsMovByTrid + id).pipe(shareReplay());
    }
    return this.treatment$;
  }

  clearCache() {
    this.pTransInside$ = null as any;
    this.treatment$ = null as any;
  }



  //==============================COde Abdo

  private baseUrlGetAllPatientsTransactionsInsideByHospitalId: string = "/api/PatientsLettersInside/GetAllPatientsTransactionsInsideByHospitalId/";
  private baseUrlGetAllPatientsOpenFilesInsideByHospitalId: string = "/api/PatientsLettersInside/GetAllPatientsOpenFilesByHospitalId/";
  private baseUrlGetAllPatientsOpenFilesInsideByTraId: string = "/api/PatientsLettersInside/GetAllPatientsOpenFilesByTraId/";

  GetAllPatientsTransactionsInsideByHospitalId(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsTransactionsInsideByHospitalId + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }


  GetAllPatientsOpenFilesInsideByHospitalId(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsOpenFilesInsideByHospitalId + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }

  GetPatientsTransactionsInsideByTraId(id: string): Observable<PTransInside[]> {
    this.clearCache();

    if (!this.pTransInside$) {
      this.pTransInside$ = this.http.get<PTransInside[]>(this.baseUrlGetAllPatientsOpenFilesInsideByTraId + id).pipe(shareReplay());
    }
    return this.pTransInside$;
  }

  

}
