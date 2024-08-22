import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TravelingPr } from './../interfaces/traveling-pr';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { PTransOutside } from '../interfaces/p-trans-outside';
import { TravelBack } from '../interfaces/travel-back';

@Injectable({
  providedIn: 'root'
})
export class TravelingService {


  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetTravelingProcedures: string = "/api/Traveling/GetTravelingProcedures";
  private baseUrlGetTravelingProceduresByBranchId: string = "/api/Traveling/GetTravelingProceduresByBranchId/";
  private baseUrlGetTravelingProceduresByCountryId: string = "/api/Traveling/GetTravelingProceduresByCountryId/";
  private baseUrlGetTravelingProceduresByUserId: string = "/api/Traveling/GetTravelingProceduresByUserId/";
  private baseUrlGetTravelTicketsByUserId: string = "/api/Traveling/GetTravelTicketsByUserId/";
  private baseUrlGetPatientTransactionTravelingByCountryId: string = "/api/Traveling/GetPatientTransactionTravelingByCountryId/";
  private baseUrlGetPTravelBacktoInsideforManagement: string = "/api/Traveling/GetPTravelBacktoInsideforManagement";
  private baseUrlGetPTravelBacktoInsideByBranchId: string = "/api/Traveling/GetPTravelBacktoInsideByBranchId/";
  private baseUrlGetAllTravelingProceduresManagement: string = "/api/Traveling/GetAllTravelingProceduresManagement";
  private baseUrlGetTravelingProceduresByDate: string = "/api/Traveling/GetTravelingProceduresByDate";
  private baseUrlAddTravelingProcedure: string = "/api/Traveling/AddTravelingProcedure";
  private baseUrlAddTravelingBack: string = "/api/Traveling/AddTravelingBack";
  private baseUrlUpdateTravelingProcedure: string = "/api/Traveling/UpdateTravelingProcedure/";
  private baseUrlUpdateTravelBack: string = "/api/Traveling/UpdateTravelBack/";
  private baseUrlDeleteTravelingProcedure: string = "/api/Traveling/DeleteTravelingProcedure/";
  private baseUrlUpdateTravelOutside: string = "/api/Traveling/UpdateTravelOutside/";
  private baseUrlUpdateTravelField: string = "/api/Traveling/UpdateTravelField/";

  private baseUrlGetPTraveltoOutsideByBranchId: string = "/api/Traveling/GetPTraveltoOutsideByBranchId/";
  private baseUrlGetPTraveltoOutsideforManagement: string = "/api/Traveling/GetPTraveltoOutsideforManagement";

  private baseUrlUpdateTravelFieldBackByCountry: string = "/api/Traveling/UpdateTravelFieldBackByCountry/";
  private baseUrlUpdateTravelFieldBack: string = "/api/Traveling/UpdateTravelFieldBack/";

  private baseUrlUpdateTravelFieldForward: string = "/api/Traveling/UpdateTravelFieldForward/";
  private baseUrlReferredPatientFromCountry: string = "/api/Traveling/ReferredPatientFromCountry/";
  private baseUrlGetPatientTransactionToBack: string = "/api/Traveling/GetPatientTransactionToBack";
  //private baseUrlGetPatientsClosedFilesToTransferByCountryId: string = "/api/Traveling/GetPatientsClosedFilesToTransferByCountryId/";


  //private baseUrlGetPatientTransactionToTravelByBranchId: string = "/api/Traveling/GetPatientTransactionToTravelByBranchId";
  private baseUrlGetPatientTransactionAcceptedByCountryToTravel: string = "/api/Traveling/GetPatientTransactionAcceptedByCountryToTravel";
  private baseUrlGetPatientTransactionToTravelByCountryId: string = "/api/Traveling/GetPatientTransactionToTravelByCountryId/";
  private baseUrlGetPatientTransactionToTravelByBranchId: string = "/api/Traveling/GetPatientTransactionToTravelByBranchId/";


  private baseUrlGetPatientTransactionToTravelByBranchIdd: string = "/api/Traveling/GetPatientTransactionToTravelByBranchIdd/";


  private baseUrlGetTravelingProceduresToHousingByCountryId: string = "/api/Traveling/GetTravelingProceduresToHousingByCountryId/";


  private baseUrlReturnLettersToCountry: string = "/api/Traveling/ReturnLettersToCountry";
  private baseUrlGetPatsRejected: string = "/api/Traveling/GetPatsRejected/";

  private Traveling$!: Observable<TravelingPr[]>;
  private TravelBack$!: Observable<TravelBack[]>;

  private pTransOutside$!: Observable<PTransOutside[]>;


  GetTraveling(): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelingProcedures).pipe(shareReplay());
    }
    return this.Traveling$;

  }

  GetPTraveltoOutsideforManagement(): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetPTraveltoOutsideforManagement).pipe(shareReplay());
    }
    return this.Traveling$;

  }
  //==============================================================get for country
  GetTravelingProceduresByBranchId(id:string): Observable<TravelingPr[]> {
    this.clearCache();


    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelingProceduresByBranchId+id).pipe(shareReplay());
    }
    return this.Traveling$;

  }

  GetTravelingProceduresByCountryId(id: string): Observable<TravelingPr[]> {
    this.clearCache();


    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelingProceduresByCountryId +id).pipe(shareReplay());
    }
    return this.Traveling$;

  }

  GetPTraveltoOutsideByBranchId(id: string): Observable<TravelingPr[]> {
    this.clearCache();


    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetPTraveltoOutsideByBranchId+id).pipe(shareReplay());
    }
    return this.Traveling$;

  }
  //==============================================================get for country
  GetTravelingProceduresByUserId(id: string): Observable<TravelBack[]> {
    this.clearCache();


    if (!this.TravelBack$) {
      this.TravelBack$ = this.http.get<TravelBack[]>(this.baseUrlGetTravelingProceduresByUserId+id).pipe(shareReplay());
    }
    return this.TravelBack$;
  }

  GetTravelTicketsByUserId(id: string): Observable<TravelingPr[]> {
    this.clearCache();
    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelTicketsByUserId +id).pipe(shareReplay());
    }
    return this.Traveling$;
  }
  //==============================================================get for country
  //==============================================================get for country
  GetPatientTransactionTravelingByCountryId(id: string): Observable<TravelBack[]> {
    this.clearCache();


    if (!this.TravelBack$) {
      this.TravelBack$ = this.http.get<TravelBack[]>(this.baseUrlGetPatientTransactionTravelingByCountryId+id).pipe(shareReplay());
    }
    return this.TravelBack$;

  } //==============================================================get for country
  GetPTravelBacktoInsideByBranchId(id: string): Observable<TravelBack[]> {
    this.clearCache();


    if (!this.TravelBack$) {
      this.TravelBack$ = this.http.get<TravelBack[]>(this.baseUrlGetPTravelBacktoInsideByBranchId+id).pipe(shareReplay());
    }
    return this.TravelBack$;

  }//==============================================================get for country
  GetPTravelBacktoInsideforManagement(): Observable<TravelBack[]> {
    this.clearCache();


    if (!this.TravelBack$) {
      this.TravelBack$ = this.http.get<TravelBack[]>(this.baseUrlGetPTravelBacktoInsideforManagement).pipe(shareReplay());
    }
    return this.TravelBack$;

  }//==============================================================get for country
  GetTravelingProceduresToHousingByCountryId(id: string): Observable<TravelingPr[]> {
    this.clearCache();
    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelingProceduresToHousingByCountryId+id).pipe(shareReplay());
    }
    return this.Traveling$;

  }
  //GetPatientsClosedFilesToTransferByCountryId(id: string): Observable<TravelingPr[]> {
  //  this.clearCache();
  //  if (!this.Traveling$) {
  //    this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetPatientsClosedFilesToTransferByCountryId+id).pipe(shareReplay());
  //  }
  //  return this.Traveling$;

  //}//==============================================================get for country
  GetAllTravelingProceduresManagement(): Observable<TravelingPr[]> {
    this.clearCache();


    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetAllTravelingProceduresManagement).pipe(shareReplay());
    }
    return this.Traveling$;

  }
  //==============================================================get for country
  GetTravelingProceduresByDate(): Observable<TravelingPr[]> {
    this.clearCache();


    if (!this.Traveling$) {
      this.Traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetTravelingProceduresByDate).pipe(shareReplay());
    }
    return this.Traveling$;

  }

    //==============================================================


  //// Insert the traveling procedure
  AddTravelingProcedure(newtravel: TravelingPr): Observable<TravelingPr> {

    return this.http.post<TravelingPr>(this.baseUrlAddTravelingProcedure  , newtravel);
  }

  AddTravelingBack(newtravel: TravelingPr): Observable<TravelingPr> {

    return this.http.post<TravelingPr>(this.baseUrlAddTravelingBack  , newtravel);
  }

  ReturnLettersToCountry(newtravel: TravelingPr): Observable<TravelingPr> {

    return this.http.post<TravelingPr>(this.baseUrlReturnLettersToCountry, newtravel);
  }
  //عرض معاملات التسفير التي تم رفضها من قبل مسؤول التسفير وإعادة إحالتها للساحة
  GetPatsRejected(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatsRejected).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  // Update Travel Procedure

  updateTraveling(id: number, edittravel: TravelingPr): Observable<TravelingPr> {
    return this.http.put<TravelingPr>(this.baseUrlUpdateTravelingProcedure + id, edittravel);
  }

    // Update Travel Back

  UpdateTravelBack(id: number, edittravel: TravelBack): Observable<TravelBack> {
    return this.http.put<TravelBack>(this.baseUrlUpdateTravelBack + id, edittravel);
  }

  UpdateTravelFieldForward(id: number): Observable<TravelingPr> {
    return this.http.put<TravelingPr>(this.baseUrlUpdateTravelFieldForward + id , '');
  }


  // Delete country
  DeleteTraveling(id: number,trid:number): Observable<any> {
    return this.http.delete('/api/Traveling/DeleteTravelingProcedure/' + id + '/' + trid);

    //return this.http.delete(this.baseUrlDeleteTravelingProcedure + id);

  }

  DeleteTravelingBack(id: number, trid: number,role:string): Observable<any> {
    return this.http.delete('/api/Traveling/DeleteTravelingBack/' + id + '/' + trid + '/' + role);

    //return this.http.delete(this.baseUrlDeleteTravelingProcedure + id);

  }
  //======================================================================
  UpdateTravelOutside(id: number, newtravel: PTransOutside): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateTravelOutside + id, newtravel);
  }

  //================================================
   //======================================================================
  UpdateTravelField(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateTravelField + id,'');
  }

  UpdateTravelFieldBackByCountry(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateTravelFieldBackByCountry + id,'');
  }

  UpdateTravelFieldBack(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateTravelFieldBack + id,'');
  }

  //================================================

  GetPatientTransactionAcceptedByCountryToTravel(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientTransactionAcceptedByCountryToTravel).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetPatientTransactionToTravelByCountryId(id:string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientTransactionToTravelByCountryId+id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetPatientTransactionToTravelByBranchId(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientTransactionToTravelByBranchId +id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }



  GetPatientTransactionToBack(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientTransactionToBack).pipe(shareReplay());
    }
    return this.pTransOutside$;
  } 
  //===================================================
   //================================================

GetPatientTransactionToTravelByBranchIdd(id: string): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
  this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatientTransactionToTravelByBranchIdd + id).pipe(shareReplay());
    }
    return this.pTransOutside$;
  } 
  //===================================================


  ////============================================================================================

  //UpdateTravelingProcedure(id: number, trid: number, edittravel: TravelingPr): Observable<TravelingPr[]> {
  //  this.clearCache();

  //  if (!this.Traveling$) {
  //    this.Traveling$ = this.http.put<TravelingPr[]>('/api/Traveling/UpdateTravelingProcedure/' + id + '/' + trid, edittravel).pipe(shareReplay());
  //  }
  //  return this.Traveling$;
  //}


  ReferredPatientFromCountry(newData: TravelingPr): Observable<TravelingPr> {

    return this.http.post<TravelingPr>(this.baseUrlReferredPatientFromCountry, newData);
  }

  // Clear Cache
  clearCache() {
    this.Traveling$ = null as any;
    this.pTransOutside$ = null as any;
    this.TravelBack$ = null as any;

  }
}
