import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital } from '../interfaces/hospital';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGet: string = "/api/Hospital/GetHospitals";
  private baseUrlAdd: string = "/api/Hospital/AddHospital";
  private baseUrlUpdate: string = "/api/Hospital/UpdateHospital/";
  private baseUrlDelete: string = "/api/Hospital/DeleteHospital/";
  private HospIdbaseUrlGet: string = "/api/Hospital/GetHospitalById/";
  

  private Hospital$!: Observable<Hospital[]>;


  GetHospitals(): Observable<Hospital[]> {
    this.clearCache();


    if (!this.Hospital$) {
      this.Hospital$ = this.http.get<Hospital[]>(this.baseUrlGet).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Hospital$;

  }


  //// add hospital  
  AddHospital(newHospital: Hospital): Observable<Hospital> {

    return this.http.post<Hospital>(this.baseUrlAdd, newHospital);


  }

  // Update 

  updatehospital(id: number, edithospital: Hospital): Observable<Hospital> {
    return this.http.put<Hospital>(this.baseUrlUpdate + id, edithospital);
  }


  // Delete country
  DeleteHospital(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }
  //==========================HospitalsCountries===================


  // Clear Cache
  clearCache() {
    this.Hospital$ = null as any;

  }




  //==================abdo


  GetHospitalById(id: string): Observable<Hospital[]> {
    this.clearCache();


    if (!this.Hospital$) {
      this.Hospital$ = this.http.get<Hospital[]>(this.HospIdbaseUrlGet+id).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Hospital$;

  }
}


