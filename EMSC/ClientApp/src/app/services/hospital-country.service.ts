import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HospitalsCountries } from '../interfaces/hospitals-countries';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalCountryService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetHospitalsCountriesByManagemet: string = "/api/Hospital/GetHospitalsCountriesByManagemet";
  private baseUrlAddHospitalsCountriesManagemet: string = "/api/Hospital/AddHospitalCountry";
  private baseUrlUpdateHospitalsCountriesManagemet: string = "/api/Hospital/UpdateHospitalsCountriesManagemet/";
  private baseUrlDeleteHospitalsCountriesManagemet: string = "/api/Hospital/DeleteHospitalCountryByManagement/";


  private baseUrlGetHospitalsByCountryId: string = "/api/Hospital/GetHospitalsByCountryId/";
  private baseUrlAddHospitalCountry: string = "/api/Hospital/AddHospitalCountry";
  private baseUrlUpdateHospitalCountry: string = "/api/Hospital/UpdateHospitalCountry/";
  private baseUrlDeleteHospitalCountry: string = "/api/Hospital/DeleteHospitalCountry/";


  //private HospitalsCountries$!: Observable<HospitalsCountries[]>;
  private HospitalCountry$!: Observable<HospitalsCountries[]>;




  GetHospitalsCountriesByManagemet(): Observable<HospitalsCountries[]> {
    this.clearCache();


    if (!this.HospitalCountry$) {
      this.HospitalCountry$ = this.http.get<HospitalsCountries[]>(this.baseUrlGetHospitalsCountriesByManagemet).pipe(shareReplay());
    }
    return this.HospitalCountry$;

  }





  ////==========AddHospitalsCountriesManagement============
  AddHospitalsCountriesManagemet(newHospitalsCountries: HospitalsCountries): Observable<HospitalsCountries> {

    return this.http.post<HospitalsCountries>(this.baseUrlAddHospitalsCountriesManagemet, newHospitalsCountries);


  }

  //==========updateHospitalsCountriesManagement=========

  UpdateHospitalsCountriesManagemet(id: number, edithospitalscountries: HospitalsCountries): Observable<HospitalsCountries> {
    return this.http.put<HospitalsCountries>(this.baseUrlUpdateHospitalsCountriesManagemet + id, edithospitalscountries);
  }


  // ==================DeleteHospitalsCountriesManagement=====================
  DeleteHospitalsCountriesManagemet(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHospitalsCountriesManagemet + id);

  }










  GetHospitalsByCountryId(id: string): Observable<HospitalsCountries[]> {
    this.clearCache();

    if (!this.HospitalCountry$) {
      this.HospitalCountry$ = this.http.get<HospitalsCountries[]>(this.baseUrlGetHospitalsByCountryId + id).pipe(shareReplay());
    }
    return this.HospitalCountry$;
  }
  //============================Get All Patients Main Data by User Id================================













  //// Insert the country
  AddHospitalCountry(newHospitalCountry: HospitalsCountries): Observable<HospitalsCountries> {

    return this.http.post<HospitalsCountries>(this.baseUrlAddHospitalCountry, newHospitalCountry);


  }

  // Update country

  updateHospitalCountry(id: number, editHospitalCountry: HospitalsCountries): Observable<HospitalsCountries> {
    return this.http.put<HospitalsCountries>(this.baseUrlUpdateHospitalCountry + id, editHospitalCountry);
  }


  // Delete country
  DeleteHospitalCountry(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteHospitalCountry + id);

  }

  // Clear Cache
  clearCache() {
    this.HospitalCountry$ = null as any;
    //this.HospitalsCountries$ = null as any;

  }
}
