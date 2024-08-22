import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../interfaces/country';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGet: string = "/api/Country/GetCountriesBraches";
  private baseUrlGet2: string = "/api/Country/GetCountries";
  private baseUrlAdd: string = "/api/Country/AddCountry";
  private baseUrlUpdate: string = "/api/Country/UpdateCountry/";
  private baseUrlDelete: string = "/api/Country/DeleteCountry/";


  private Country$!: Observable<Country[]>;


  GetCountries(): Observable<Country[]> {
    this.clearCache();


    if (!this.Country$) {
      this.Country$ = this.http.get<Country[]>(this.baseUrlGet).pipe(shareReplay());
    }
    return this.Country$;

  }


  GetCountriesMainBrach(): Observable<Country[]> {
    this.clearCache();


    if (!this.Country$) {
      this.Country$ = this.http.get<Country[]>(this.baseUrlGet2).pipe(shareReplay());
    }

    return this.Country$;

  }



  //// Insert the country
  AddCountry(newCountry: Country): Observable<Country> {

    return this.http.post<Country>(this.baseUrlAdd, newCountry);


  }

  // Update country

  updateCountry(id: number, editCountry: Country): Observable<Country> {
    return this.http.put<Country>(this.baseUrlUpdate + id, editCountry);
  }


  // Delete country
  DeleteCountry(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }

  // Clear Cache
  clearCache() {
    this.Country$ = null as any;

  }
}
