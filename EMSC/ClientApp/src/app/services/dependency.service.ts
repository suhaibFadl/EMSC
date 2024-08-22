import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependency } from '../interfaces/dependency';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DependencyService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGet: string = "/api/Dependency/GetDependencies";
  private baseUrlAdd: string = "/api/Dependency/AddDependency";
  private baseUrlUpdate: string = "/api/Dependency/UpdateDependency/";
  private baseUrlDelete: string = "/api/Dependency/DeleteDependency/";


  private dependency$!: Observable<Dependency[]>;


  GetDependencies(): Observable<Dependency[]> {
    this.clearCache();


    if (!this.dependency$) {
      this.dependency$ = this.http.get<Dependency[]>(this.baseUrlGet).pipe(shareReplay());
    }
    return this.dependency$;

  }



  //// Insert the country
  AddDependency(newDependency: Dependency): Observable<Dependency> {

    return this.http.post<Dependency>(this.baseUrlAdd, newDependency);


  }

  // Update country

  updateDependency(id: number, editDependency: Dependency): Observable<Dependency> {
    return this.http.put<Dependency>(this.baseUrlUpdate + id, editDependency);
  }


  // Delete country
  DeleteDependency(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }

  // Clear Cache
  clearCache() {
    this.dependency$ = null as any;

  }}
