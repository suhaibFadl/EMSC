import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelOutside } from '../interfaces/hotel-outside';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelOutsideService {

  constructor(private http: HttpClient, private router: Router) { }


  private baseUrlAddHotelOutside: string = "/api/HotelsOutside/AddHotelOutside";
  private baseUrlGetAllHotelsOutside: string = "/api/HotelsOutside/GetAllHotelsOutside";
  private baseUrlUpdateHotelOutside: string = "/api/HotelsOutside/UpdateHotelOutside/";
  private baseUrlDeleteHotelOutside: string = "/api/HotelsOutside/DeleteHotelOutside/";
  private baseUrlGetHotelsOutsideByCountryId: string = "/api/HotelsOutside/GetHotelsOutsideByCountryId/";

 


  private HotelOutside$!: Observable<HotelOutside[]>;



  ////==========AddHospitalsCountriesManagement============
  AddHotelOutside(newHospitalsCountries: HotelOutside): Observable<HotelOutside> {

    return this.http.post<HotelOutside>(this.baseUrlAddHotelOutside, newHospitalsCountries);


  }

  GetAllHotelsOutside(): Observable<HotelOutside[]> {
    this.clearCache();

    if (!this.HotelOutside$) {
      this.HotelOutside$ = this.http.get<HotelOutside[]>(this.baseUrlGetAllHotelsOutside).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.HotelOutside$;
  }

  GetHotelsOutsideByCountryId(id: string): Observable<HotelOutside[]> {
    this.clearCache();

    if (!this.HotelOutside$) {
      this.HotelOutside$ = this.http.get<HotelOutside[]>(this.baseUrlGetHotelsOutsideByCountryId + id).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.HotelOutside$;
  }
  //==========updateHospitalsCountriesManagement=========

  UpdateHotelOutside(id: number, edithotel: HotelOutside): Observable<HotelOutside> {
    return this.http.put<HotelOutside>(this.baseUrlUpdateHotelOutside + id, edithotel);
  }


  // ==================DeleteHospitalsCountriesManagement=====================
  DeleteHotelOutside(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHotelOutside + id);

  }




  // Clear Cache
  clearCache() {
    this.HotelOutside$ = null as any;

  }




}
