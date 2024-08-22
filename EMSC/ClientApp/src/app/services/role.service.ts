

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetRolesForBranches: string = "/api/Role/GetRolesForBranches";
  private baseUrlGetRolesForManagement: string = "/api/Role/GetRolesForManagement";
  private baseUrlGetRolesForSupervisors: string = "/api/Role/GetRolesForSupervisors";
  private baseUrlGetRolesForHospitalsInside: string = "/api/Role/GetRolesForHospitalsInside";
  private baseUrlGetRolesForPharmacies: string = "/api/Role/GetRolesForPharmacies";


  private Role$!: Observable<Role[]>;


  GetRolesForBranches(): Observable<Role[]> {
    this.clearCache();
    if (!this.Role$) {
      this.Role$ = this.http.get<Role[]>(this.baseUrlGetRolesForBranches).pipe(shareReplay());
    }
    return this.Role$;

  }
  //========================================================
  GetRolesForManagement(): Observable<Role[]> {
    this.clearCache();
    if (!this.Role$) {
      this.Role$ = this.http.get<Role[]>(this.baseUrlGetRolesForManagement).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Role$;

  }
    //========================================================

  GetRolesForSupervisors(): Observable<Role[]> {
    this.clearCache();
    if (!this.Role$) {
      this.Role$ = this.http.get<Role[]>(this.baseUrlGetRolesForSupervisors).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Role$;

  }
    //========================================================

  GetRolesForHospitalsInside(): Observable<Role[]> {
    this.clearCache();
    if (!this.Role$) {
      this.Role$ = this.http.get<Role[]>(this.baseUrlGetRolesForHospitalsInside).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Role$;

  }
  GetRolesForPharmacies(): Observable<Role[]> {
    this.clearCache();
    if (!this.Role$) {
      this.Role$ = this.http.get<Role[]>(this.baseUrlGetRolesForPharmacies).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Role$;

  }
    //========================================================


  // Clear Cache
  clearCache() {
    this.Role$ = null as any;

  }
}
