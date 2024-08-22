import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { Claimsservices } from '../interfaces/claimsservices';
import { Claim } from '../interfaces/claim';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  private baseUrlGet: string = "/api/Claims/GetClaimServices/";
  private baseUrlAdd: string = "/api/Claims/AddServicesToCLaims/";
  private baseUrlGetClaim: string = "/api/Claims/GetClaimDetails/";
  private baseUrlDeletePatientData: string = "/api/Claims/DeleteServicesFromClaims/";

  constructor(private http: HttpClient, private router: Router) { }

  private cs$!: Observable<Claimsservices[]>;
  private cl$!: Observable<Claim[]>;

  GetClaimsServices(id: string): Observable<Claimsservices[]> {

    this.clearCache();


    if (!this.cs$) {
      this.cs$ = this.http.get<Claimsservices[]>(this.baseUrlGet + id).pipe(shareReplay());
    }
    return this.cs$;
  }


  AddServiceToClaim(id: number, fromdata: Claimsservices): Observable<Claimsservices> {
    return this.http.post<Claimsservices>(this.baseUrlAdd + id, fromdata);

  }


  GetClaimDetails(id: string): Observable<Claim[]> {

    this.clearCache();


    if (!this.cs$) {
      this.cl$ = this.http.get<Claim[]>(this.baseUrlGetClaim + id).pipe(shareReplay());
    }
    return this.cl$;
  }


  DeleteClaimService(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeletePatientData + id);

  }
  // Clear Cache
  clearCache() {
    this.cs$ = null as any;

  }

}
