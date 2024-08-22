import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treatment } from './../interfaces/treatment';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { PTransOutside } from '../interfaces/p-trans-outside';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlAddTreatmentMovement: string = "/api/TreatmentMovements/AddTreatmentMovement";
  private baseUrlCloseMedicalFile: string = "/api/TreatmentMovements/CloseMedicalFile";
  private baseUrlCloseMedicalFileByCommittees: string = "/api/TreatmentMovements/CloseMedicalFileByCommittees";
  private baseUrlGetAllTreatmentMovements: string = "/api/TreatmentMovements/GetAllTreatmentMovements";
  private baseUrlGetAllTreatmentMovementsByUserId: string = "/api/TreatmentMovements/GetAllTreatmentMovementsByUserId/";
  private baseUrlUpdateTreatmentMovement: string = "/api/TreatmentMovements/UpdateTreatmentMovement/";
  private baseUrlDeleteTreatmentMovement: string = "/api/TreatmentMovements/DeleteTreatmentMovement/";
  private baseUrlUpdateTreatmentFeild: string = "/api/TreatmentMovements/UpdateTreatmentFeild/";
  private baseUrlGetPatientTransactionToTreatmentByCountryId: string = "/api/TreatmentMovements/GetPatientTransactionToTreatmentByCountryId/";
  private baseUrlGetPatientTransactionTreatmentByCountryId: string = "/api/TreatmentMovements/GetPatientTransactionTreatmentByCountryId/";
  private baseUrlGetPatientTransactionTreatmentByRoleId: string = "/api/TreatmentMovements/GetPatientTransactionTreatmentByRoleId/";
  private baseUrlGetPatientTransactionTreatmentByTrid: string = "/api/TreatmentMovements/GetPatientTransactionTreatmentByTrid/";
  private baseUrlGetPatientTransactionTreatmentByBranchId: string = "/api/TreatmentMovements/GetPatientTransactionTreatmentByBranchId/";
  private baseUrlUpdateTreatmentField: string = "/api/TreatmentMovements/UpdateTreatmentFieldWhenAdding/";
  private baseUrlUpdateTreatmentFieldWhenDelete: string = "/api/TreatmentMovements/UpdateTreatmentFieldWhenDelete/";
  private baseUrlGetAllTreatmentsProceduresManagement: string = "/api/TreatmentMovements/GetAllTreatmentsProceduresManagement";
  private baseUrlGetPatientTransactionTreatmentByUserId: string = "/api/TreatmentMovements/GetPatientTransactionTreatmentByUserId/";
  private baseUrlUpdateFileStatusFieldWhenClosing: string = "/api/TreatmentMovements/UpdateFileStatusFieldWhenClosing/";
  private baseUrlUpdateReplyStateWhenCloseMedicalFile: string = "/api/TreatmentMovements/UpdateReplyStateWhenCloseMedicalFile/";


  private baseUrlGetPatientsClosedFilesToTransferByCountryId: string = "/api/TreatmentMovements/GetPatientsClosedFilesToTransferByCountryId/";
  private baseUrlGetPatsRejected: string = "/api/TreatmentMovements/GetPatsRejected/";
  private baseUrlGetAllPatsRejected: string = "/api/TreatmentMovements/GetAllPatsRejected";
  private baseUrlGetPatOpenFilesByBranchId: string = "/api/TreatmentMovements/GetPatOpenFilesByBranchId/";
  private baseUrlGetPatOpenFilesforManagement: string = "/api/TreatmentMovements/GetPatOpenFilesforManagement";
  private baseUrlGetAllPatientsInCountryByCountryId: string = "/api/TreatmentMovements/GetAllPatientsInCountryByCountryId/";

  private Treatment$!: Observable<Treatment[]>;
  private pTransOutside$!: Observable<PTransOutside[]>;

  // Add New Treatment Movement
  AddTreatmentMovement(newtratment: Treatment): Observable<Treatment> {
    return this.http.post<Treatment>(this.baseUrlAddTreatmentMovement, newtratment);
  }

 // Close Medical file 
 CloseMedicalFile(newtratment: Treatment): Observable<Treatment> {
    return this.http.post<Treatment>(this.baseUrlCloseMedicalFile, newtratment);
  }

  //إغلاق الملف الطبي للجريح في الساحة عن طريق لجنة الحصر
 CloseMedicalFileByCommittees(newtratment: Treatment): Observable<Treatment> {
    return this.http.post<Treatment>(this.baseUrlCloseMedicalFileByCommittees, newtratment);
  }


  // Get All Treatment Movements
  GetAllTreatmentMovements(): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
      this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetAllTreatmentMovements).pipe(shareReplay());
    }
    return this.Treatment$;

  }

  GetPatOpenFilesforManagement(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatOpenFilesforManagement).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }


  // Get Treatment Movements By User Id
  GetAllTreatmentMovementsByUserId(): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
      this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetAllTreatmentMovementsByUserId).pipe(shareReplay());
    }
    return this.Treatment$;

  }

  // Update Treatment Movement
  UpdateTreatmentMovement(id: number, edittratment: Treatment): Observable<Treatment> {
    return this.http.put<Treatment>(this.baseUrlUpdateTreatmentMovement + id, edittratment);
  }


  UpdateFileStatusFieldWhenClosing(id: number, edittratment: Treatment): Observable<Treatment> {
    return this.http.put<Treatment>(this.baseUrlUpdateFileStatusFieldWhenClosing + id, edittratment);
  }




  // Delete Treatment Movement
  DeleteTreatmentMovement(id: number): Observable<any> {
    return this.http.delete('/api/TreatmentMovements/DeleteTreatmentMovement/' + id );
  //  return this.http.delete(this.baseUrlDeleteTreatmentMovement + id);
  }

  //UpdateTreatmentFeild(id: number, trid: number): Observable<Treatment> {
  //  //this.clearCache();

  //  //if (!this.Treatment$) {
  //  //  this.Treatment$ = this.http.put<Treatment[]>('/api/TreatmentMovements/UpdateTreatmentFeild' + id + '/' + trid,'').pipe(shareReplay());
  //  //}
  //  //return this.Treatment$;
  ////  return this.http.put<Treatment>(this.baseUrlUpdateTreatmentFeild + id,'');
  //}
//================================================

GetPatientTransactionToTreatmentByCountryId(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
  this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientTransactionToTreatmentByCountryId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
}

  //===================================================

  GetPatientsClosedFilesToTransferByCountryId(id: string): Observable<PTransOutside[]> {
    this.clearCache();
    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientsClosedFilesToTransferByCountryId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }
  GetAllPatientsInCountryByCountryId(id: string): Observable<PTransOutside[]> {
    this.clearCache();
    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatientsInCountryByCountryId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }

//================================================
//عرض الملفات الطبية للجرحى بالخارج حسب الدولة
GetPatientTransactionTreatmentByCountryId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
  this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByCountryId + id).pipe(shareReplay());
    }
    return this.Treatment$;
  }
  //عرض الملفات الطبية للجرحى بالخارج التي تم إدخالها بواسطة لجنة الحصر
 GetPatientTransactionTreatmentByRoleId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
      this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByRoleId + id).pipe(shareReplay());
    }
    return this.Treatment$;
  }

  GetPatientTransactionTreatmentByTrid(id: number): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
      this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByTrid + id).pipe(shareReplay());
    }
    return this.Treatment$;
  } 
  //===================================================
//================================================

GetPatientTransactionTreatmentByBranchId(id: string): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
  this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByBranchId + id).pipe(shareReplay());
    }
    return this.Treatment$;
  }

  GetPatOpenFilesByBranchId(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatOpenFilesByBranchId + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  } 
  //===================================================
//================================================

  GetAllTreatmentsProceduresManagement(): Observable<Treatment[]> {
    this.clearCache();

    if (!this.Treatment$) {
      this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetAllTreatmentsProceduresManagement ).pipe(shareReplay());
    }
    return this.Treatment$;
  } 
  //===================================================
 //======================================================================
  UpdateTreatmentFieldWhenAdding(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateTreatmentField + id, '');
  }

  //======================================================================
  UpdateReplyStateWhenCloseMedicalFile(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateReplyStateWhenCloseMedicalFile + id, '');
  }



  UpdateTreatmentFieldWhenDelete(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateTreatmentFieldWhenDelete + id, '');
  }

  //================================================
  //==============================================================
  GetPatientTransactionTreatmentByUserId(id: string): Observable<Treatment[]> {
    this.clearCache();


   if (!this.Treatment$) {
     this.Treatment$ = this.http.get<Treatment[]>(this.baseUrlGetPatientTransactionTreatmentByUserId + id).pipe(shareReplay());
    }
   return this.Treatment$;

  }
  //عرض معاملات التسفير التي تم رفضها من قبل مسؤول التسفير وإعادة إحالتها للساحة
  GetPatsRejected(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatsRejected + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

 GetAllPatsRejected(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatsRejected).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }


  //==============================================================
  //================================================
  // Clear Cache
  clearCache() {
    this.Treatment$ = null as any;
    this.pTransOutside$ = null as any;

  }

}
