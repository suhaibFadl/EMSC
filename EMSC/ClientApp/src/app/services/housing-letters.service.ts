import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { PatientTrans } from '../interfaces/patient-trans';
import { PTransOutside } from '../interfaces/p-trans-outside';
import { HousingLetter } from '../interfaces/housing-letter';
@Injectable({
  providedIn: 'root'
})

export class HousingLettersService {

  constructor(private http: HttpClient, private router: Router) { }

  private housingLetters$!: Observable<HousingLetter[]>;
  private pTransOutside$!: Observable<PTransOutside[]>;


  private baseUrlGetPatsAcceptedByCountryForManagement: string = "/api/Housing/GetPatsAcceptedByCountryForManagement";
  private baseUrlAddHousingLetter: string = "/api/Housing/AddHousingLetter";
  private baseUrlGetAllHousingLetters: string = "/api/Housing/GetAllHousingLetters";
  private baseUrlGetAllHousingLettersByCountryId: string = "/api/Housing/GetAllHousingLettersByCountryId/";
  private baseUrlGetAllHousingLettersByBranchId: string = "/api/Housing/GetAllHousingLettersByBranchId/";
  private baseUrlUpdateHousingLetter: string = "/api/Housing/UpdateHousingLetter/";
  private baseUrlDeleteHousingLetter: string = "/api/Housing/DeleteHousingLetter/";

  private baseUrlGetAllHousingLettersIncomingByCountryId: string = "/api/Housing/GetAllHousingLettersIncomingByCountryId/";
  private baseUrlAddHotelEntryProcedure: string = "/api/Housing/AddHotelEntryProcedure";
  private baseUrlGetHotelEntryProcedures: string = "/api/Housing/GetHotelEntryProcedures/";
  private baseUrlGetCountsForRenewals: string = "/api/Housing/GetCountsForRenewals/";
  private baseUrlUpdateHotelEntryProcedure: string = "/api/Housing/UpdateHotelEntryProcedure/";
  private baseUrlDeleteHotelEntryProcedure: string = "/api/Housing/DeleteHotelEntryProcedure/";


  private baseUrlAddHotelLeavingProcedure: string = "/api/Housing/AddHotelLeavingProcedure";
  private baseUrlGetHotelLeavingProcedures: string = "/api/Housing/GetHotelLeavingProcedures/";
  private baseUrlUpdateHotelLeavingProcedure: string = "/api/Housing/UpdateHotelLeavingProcedure/";
  private baseUrlDeleteHotelLeavingProcedure: string = "/api/Housing/DeleteHotelLeavingProcedure/";


  private baseUrlAddHotelRenewalProcedure: string = "/api/Housing/AddHotelRenewalProcedure";
//  private baseUrlAddHotelRenewalProcedure: string = "/api/Housing/GetHotelRenewalProceduresByHotelEntryId";
  private baseUrlUpdateHoteRenewalProcedure: string = "/api/Housing/UpdateHoteRenewalProcedure/";
  private baseUrlDeleteHotelRenewalProcedure: string = "/api/Housing/DeleteHotelRenewalProcedure/";
  private baseUrlGetAllHotelProcedures: string = "/api/Housing/GetAllHotelProcedures/";


      //===================================رسائل التسكين=====================
  //=============================عرض الجرحى والمرافقين الذين تم قبولهم في دولة تونس ليتم إضافة رسائل التسكين
  GetPatsAcceptedByCountryForManagement(): Observable<PTransOutside[]> {

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetPatsAcceptedByCountryForManagement).pipe(shareReplay());
    }
    return this.pTransOutside$;

  }
  //=============================عرض الجرحى والمرافقين الذين لديهم رسائل تسكين
  GetAllHousingLetters(): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetAllHousingLetters).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  //=============================  عرض الجرحى والمرافقين الذين لديهم رسائل تسكين حسب الدولة
  GetAllHousingLettersByCountryId(id: string): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetAllHousingLettersByCountryId + id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  //=============================  عرض الجرحى والمرافقين الذين لديهم رسائل تسكين حسب الفرع
  GetAllHousingLettersByBranchId(id: string): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetAllHousingLettersByBranchId + id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  //=============================إضافة رسالة التسكين للجريح أو المرافق عن طريق الفرع الرئيسي
  AddHousingLetter(newhotel: HousingLetter): Observable<HousingLetter> {
    return this.http.post<HousingLetter>(this.baseUrlAddHousingLetter, newhotel);
  }
  //=============================تعديل رسالة التسكين
  UpdateHousingLetter(id: number, newData: HousingLetter): Observable<HousingLetter> {
    return this.http.put<HousingLetter>(this.baseUrlUpdateHousingLetter + id, newData);
  }
  //=============================حذف رسالة التسكين
  DeleteHousingLetter(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHousingLetter + id);

  }
  //================================================================================================
  //================================================================================================
  //================================================================================================


    //===================================إجراءات الدخول إلى الفنادق=====================
  //=============================عرض رسائل التسكين الواردة حسب الدولة لشركة التسكين
  GetAllHousingLettersIncomingByCountryId(id: string): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetAllHousingLettersIncomingByCountryId + id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  //=============================إضافة إجراء الدخول للفندق
  AddHotelEntryProcedure(newhotel: HousingLetter): Observable<HousingLetter> {
    return this.http.post<HousingLetter>(this.baseUrlAddHotelEntryProcedure, newhotel);
  }
  //=============================عرض إجراءات الدخول للفنادق
  GetHotelEntryProcedures(id: string): Observable<HousingLetter[]> {
    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetHotelEntryProcedures +id).pipe(shareReplay());
    }
    return this.housingLetters$;
  }

  GetCountsForRenewals(id: number): Observable<HousingLetter[]> {
    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetCountsForRenewals +id).pipe(shareReplay());
    }
    return this.housingLetters$;
  }
  //=============================تعديل إجراء الدخول للفندق
  UpdateHotelEntryProcedure(id: number, newData: HousingLetter): Observable<HousingLetter> {
    return this.http.put<HousingLetter>(this.baseUrlUpdateHotelEntryProcedure + id, newData);
  }
  //=============================حذف إجراء الدخول إلى الفندق
  DeleteHotelEntryProcedure(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHotelEntryProcedure + id);

  }
    //================================================================================================
  //================================================================================================
  //================================================================================================


    //===================================إجراءات الخروج من الفنادق=====================
  //=============================إضافة إجراء الخروج من الفندق
  AddHotelLeavingProcedure(newhotel: HousingLetter): Observable<HousingLetter> {
    return this.http.put<HousingLetter>(this.baseUrlAddHotelLeavingProcedure, newhotel);
  }
  //=============================عرض إجراءات الخروج من الفنادق
  GetHotelLeavingProcedures(id:string): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetHotelLeavingProcedures+id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  //=============================تعديل إجراء الدخول للفندق
  UpdateHotelLeavingProcedure(id: number, newData: HousingLetter): Observable<HousingLetter> {
    return this.http.put<HousingLetter>(this.baseUrlUpdateHotelLeavingProcedure + id, newData);
  }
  //=============================حذف إجراء الخروج من الفندق
  DeleteHotelLeavingProcedure(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHotelLeavingProcedure + id);

  }
    //================================================================================================
  //================================================================================================
  //================================================================================================


  //===================================إجراءات تجديد حجز الفنادق=====================
  //=============================إضافة إجراء تجديد الحجز في الفندق
  AddHotelRenewalProcedure(newhotel: HousingLetter): Observable<HousingLetter> {
    return this.http.post<HousingLetter>(this.baseUrlAddHotelRenewalProcedure, newhotel);
  }
  //=============================عرض إجراءات تجديد الحجز في الفندق
  GetHotelRenewalProceduresByHotelEntryId(id:number): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>('/api/Housing/GetHotelRenewalProceduresByHotelEntryId/' + id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  GetEntryAndLeavingProceduresByHotelEntryId(id: number): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>('/api/Housing/GetEntryAndLeavingProceduresByHotelEntryId/' + id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }
  //=============================تعديل إجراء تجديد الحجز للفندق
  UpdateHoteRenewalProcedure(id: number, newData: HousingLetter): Observable<HousingLetter> {
    return this.http.put<HousingLetter>(this.baseUrlUpdateHoteRenewalProcedure + id, newData);
  }
  //=============================حذف إجراء تجديد الحجز في الفندق
  DeleteHotelRenewalProcedure(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHotelRenewalProcedure + id);

  }
  //=============================عرض كافة إجراءات الدخول والخروج  للفنادق
  GetAllHotelProcedures(id: string): Observable<HousingLetter[]> {

    if (!this.housingLetters$) {
      this.housingLetters$ = this.http.get<HousingLetter[]>(this.baseUrlGetAllHotelProcedures + id).pipe(shareReplay());
    }
    return this.housingLetters$;

  }


  clearCache() {
    this.pTransOutside$ = null as any;
    this.housingLetters$ = null as any;
  }

}
