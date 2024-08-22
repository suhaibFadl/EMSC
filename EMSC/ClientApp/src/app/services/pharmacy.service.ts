import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { Pharmacy } from '../interfaces/pharmacy';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetMedications: string = "/api/Pharmacy/GetMedications";
  private baseUrlAddMedication: string = "/api/Pharmacy/AddMedication";
  private baseUrlUpdateMedication: string = "/api/Pharmacy/UpdateMedication/";
  private baseUrlDeleteMedication: string = "/api/Pharmacy/DeleteMedication/";


  private baseUrlGetPharmacies: string = "/api/Pharmacy/GetPharmacies";
  private baseUrlAddPharmacy: string = "/api/Pharmacy/AddPharmacy";
  private baseUrlUpdatePharmacy: string = "/api/Pharmacy/UpdatePharmacy/";
  private baseUrlDeletePharmacy: string = "/api/Pharmacy/DeletePharmacy/";


  private baseUrlAddNewPatient: string = "/api/Pharmacy/AddNewPatient";
  private baseUrlRequestMedication: string = "/api/Pharmacy/RequestMedication";
  private baseUrlUpdateRequestMedication: string = "/api/Pharmacy/UpdateRequestMedication/";
  private baseUrlDeleteRequestMedication: string = "/api/Pharmacy/DeleteRequestMedication/";
  private baseUrlResponseRequestMedication: string = "/api/Pharmacy/ResponseRequestMedication/";
  private baseUrlUpdateMedicationDispensedByPharmacy: string = "/api/Pharmacy/UpdateMedicationDispensedByPharmacy/";
  private baseUrlUpdateMedicationDispensedByManag: string = "/api/Pharmacy/UpdateMedicationDispensedByManag/";
  private baseUrlDispenseMedicationByManagement: string = "/api/Pharmacy/DispenseMedicationByManagement/";
  private baseUrlGetALlRequests: string = "/api/Pharmacy/GetALlRequests";
  private baseUrlGetALlPatsFiles: string = "/api/Pharmacy/GetALlPatsFiles";
  private baseUrlGetALlPatsFilesByPharmacy: string = "/api/Pharmacy/GetALlPatsFilesByPharmacy/";
  private baseUrlGetMedicationsProvidedToPatients: string = "/api/Pharmacy/GetMedicationsProvidedToPatients";
  private baseUrlGetNotResponsedRequests: string = "/api/Pharmacy/GetNotResponsedRequests/";
  private baseUrlGetResponsedRequestForDispensing: string = "/api/Pharmacy/GetResponsedRequestForDispensing";
  private baseUrlGetResponsedRequests: string = "/api/Pharmacy/GetResponsedRequests/";
  private baseUrlGetWaitingRequests: string = "/api/Pharmacy/GetWaitingRequests/";
  private baseUrlGetMedicinesPatient: string = "/api/Pharmacy/GetMedicinesPatient/";

  private baseUrlGetRequestMedicineDetails: string = "/api/Pharmacy/GetRequestMedicineDetails/";
  private baseUrlFirstOpenedLetter: string = "/api/Pharmacy/FirstOpenedLetter/";


  private baseUrlGetALLPreOffersRequestes: string = "/api/Pharmacy/GetALLPreOffersRequestes/";
  private baseUrlGetALLMedcationsPreparedFromPharmacy: string = "/api/Pharmacy/GetALLMedcationsPreparedFromPharmacy";
  private baseUrlGetALLAcceptedOffersRequestes: string = "/api/Pharmacy/GetALLAcceptedOffersRequestes/";

  private baseUrlReplyManagementOnPharmacy: string = "/api/Pharmacy/ReplyManagementOnPharmacy/";

  private pData$!: Observable<Pharmacy[]>;

  //======================إضافة وتعديل وحذف الأدوية==========================

  //=========================================================================
  //=========================================================================
  //=========================================================================

  GetMedications(): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetMedications).pipe(shareReplay());
    }
    return this.pData$;
  }


  AddMedication(newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.post<Pharmacy>(this.baseUrlAddMedication, newdata);
  }

  UpdateMedication(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlUpdateMedication + id, newdata);
  }


  DeleteMedication(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteMedication + id);
  }

  //======================إضافة وتعديل وحذف الصيدليات===========================

  //=========================================================================
  //=========================================================================
  //=========================================================================

  GetPharmacies(): Observable<Pharmacy[]> {
    this.clearCache();
    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetPharmacies).pipe(shareReplay());
    }
    return this.pData$;
  }


  AddPharmacy(newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.post<Pharmacy>(this.baseUrlAddPharmacy, newdata);
  }

  UpdatePharmacy(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlUpdatePharmacy + id, newdata);
  }


  DeletePharmacy(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeletePharmacy + id);
  }

  //=============================طلبات الأدوية================================

  //=========================================================================
  //=========================================================================
  //=========================================================================

  AddNewPatient(newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.post<Pharmacy>(this.baseUrlAddNewPatient, newdata);
  }
  RequestMedication(newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.post<Pharmacy>(this.baseUrlRequestMedication, newdata);
  }

  UpdateRequestMedication(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlUpdateRequestMedication + id, newdata);
  }



  DeleteRequestMedication(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteRequestMedication + id);
  }

  ResponseRequestMedication(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlResponseRequestMedication + id, newdata);
  }

  UpdateMedicationDispensedByPharmacy(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlUpdateMedicationDispensedByPharmacy + id, newdata);
  }

  UpdateMedicationDispensedByManag(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlUpdateMedicationDispensedByManag + id, newdata);
  }

  DispenseMedicationByManagement(id: number, newdata: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlDispenseMedicationByManagement + id, newdata);
  }


  GetALlRequests(): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetALlRequests).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetALlPatsFiles(): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetALlPatsFiles).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetALlPatsFilesByPharmacy(id:string): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetALlPatsFilesByPharmacy + id).pipe(shareReplay());
    }
    return this.pData$;
  }


  GetMedicationsProvidedToPatients(): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetMedicationsProvidedToPatients).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetNotResponsedRequests(id: string, orderstate:number): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetNotResponsedRequests + id + '/' + orderstate).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetResponsedRequestForDispensing(): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetResponsedRequestForDispensing).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetResponsedRequests(id:string): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetResponsedRequests + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetWaitingRequests(id:string): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetWaitingRequests + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetMedicinesPatient(id:number): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetMedicinesPatient + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetRequestMedicineDetails(id: number): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetRequestMedicineDetails + id).pipe(shareReplay());
    }
    return this.pData$;
  }


  FirstOpenedLetter(id: number): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlFirstOpenedLetter + id,'');
  }


  GetALLPreOffersRequestes(id: number): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetALLPreOffersRequestes + id).pipe(shareReplay());
    }
    return this.pData$;
  }
  GetALLMedcationsPreparedFromPharmacy(): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetALLMedcationsPreparedFromPharmacy ).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetALLAcceptedOffersRequestes(id: string): Observable<Pharmacy[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<Pharmacy[]>(this.baseUrlGetALLAcceptedOffersRequestes + id).pipe(shareReplay());
    }
    return this.pData$;
  }


  ReplyManagementOnPharmacy(id: number, data: Pharmacy): Observable<Pharmacy> {
    return this.http.put<Pharmacy>(this.baseUrlReplyManagementOnPharmacy + id, data);
  }

  //=========================================================================
  clearCache() {
    this.pData$ = null as any;
  }


}
