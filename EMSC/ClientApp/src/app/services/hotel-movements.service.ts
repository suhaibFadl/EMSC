import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelMovement } from './../interfaces/hotel-movement';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { PTransOutside } from '../interfaces/p-trans-outside';

@Injectable({
  providedIn: 'root'
})
export class HotelMovementsService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetHotelMovements: string = "/api/HotelMovements/GetHotelMovements";
  //private baseUrlGetTravelingProceduresByDate: string = "/api/HotelMovements/GetTravelingProceduresByDate";
  private baseUrlAddHotelMovement: string = "/api/HotelMovements/AddHotelMovement";
  private baseUrlAddHotelMovementByCountry: string = "/api/HotelMovements/AddHotelMovementByCountry";
  private baseUrlUpdateHotelMovements: string = "/api/HotelMovements/UpdateHotelMovement/";
  private baseUrlDeleteHotelMovements: string = "/api/HotelMovements/DeleteHotelMovement/";
  private baseUrlUpdateHotelField: string = "/api/HotelMovements/UpdateHotelField/";
  private baseUrlUpdateFieldsByCountry: string = "/api/HotelMovements/UpdateFieldsByCountry/";
  private baseUrlGetHotelMovementsByCountryId: string = "/api/HotelMovements/GetHotelMovementsByCountryId/";
  private baseUrlGetHotelMovementsByRoleId: string = "/api/HotelMovements/GetHotelMovementsByRoleId/";
  private baseUrlGetHotelMovementsByBranchId: string = "/api/HotelMovements/GetHotelMovementsByBranchId/";


  private HotelMov$!: Observable<HotelMovement[]>;
  private PTransOutside$!: Observable<PTransOutside[]>;

  GetHotelMovements(): Observable<HotelMovement[]> {
    this.clearCache();
    if (!this.HotelMov$) {
      this.HotelMov$ = this.http.get<HotelMovement[]>(this.baseUrlGetHotelMovements).pipe(shareReplay());
    }
    return this.HotelMov$;

  }
  ////==============================================================
  GetHotelMovementsByCountryId(id: string): Observable<HotelMovement[]> {
    this.clearCache();


    if (!this.HotelMov$) {
      this.HotelMov$ = this.http.get<HotelMovement[]>(this.baseUrlGetHotelMovementsByCountryId + id).pipe(shareReplay());
    }
    return this.HotelMov$;

  }

  GetHotelMovementsByRoleId(id: string): Observable<HotelMovement[]> {
    this.clearCache();


    if (!this.HotelMov$) {
      this.HotelMov$ = this.http.get<HotelMovement[]>(this.baseUrlGetHotelMovementsByRoleId + id).pipe(shareReplay());
    }
    return this.HotelMov$;

  }

  GetHotelMovementsByBranchId(id: string): Observable<HotelMovement[]> {
    this.clearCache();


    if (!this.HotelMov$) {
      this.HotelMov$ = this.http.get<HotelMovement[]>(this.baseUrlGetHotelMovementsByBranchId + id).pipe(shareReplay());
    }
    return this.HotelMov$;

  }

  //==============================================================


  /// Insert the HotelMovement
  AddHotelMovement(newhotel: HotelMovement): Observable<HotelMovement> {

    return this.http.post<HotelMovement>(this.baseUrlAddHotelMovement, newhotel);


  }

  AddHotelMovementByCountry(newhotel: HotelMovement): Observable<HotelMovement> {

    return this.http.post<HotelMovement>(this.baseUrlAddHotelMovementByCountry, newhotel);


  }
  //======================================================================
  UpdateHotelField(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateHotelField + id, '');
  }
  UpdateFieldsByCountry(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateFieldsByCountry + id, '');
  }

  // Update country

  updateHotelMovements(id: number, edithotel: HotelMovement): Observable<HotelMovement> {
    return this.http.put<HotelMovement>(this.baseUrlUpdateHotelMovements + id, edithotel);
  }


  // Delete country
  DeleteHotelMovements(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHotelMovements + id);

  }

  // Clear Cache
  clearCache() {
    this.HotelMov$ = null as any;

  }
}
