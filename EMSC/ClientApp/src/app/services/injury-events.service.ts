import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InjuryEvents } from '../interfaces/injury-events';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InjuryEventsService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGet: string = "/api/InjuryEvents/GetInjuryEvents";
  private baseUrlAdd: string = "/api/InjuryEvents/AddEvent";
  private baseUrlUpdate: string = "/api/InjuryEvents/UpdateEvent/";
  private baseUrlDelete: string = "/api/InjuryEvents/DeleteEvent/";


  private injuryEvents$!: Observable<InjuryEvents[]>;


  GetInjuryEvents(): Observable<InjuryEvents[]> {
    this.clearCache();


    if (!this.injuryEvents$) {
      this.injuryEvents$ = this.http.get<InjuryEvents[]>(this.baseUrlGet).pipe(shareReplay());
    }
    return this.injuryEvents$;

  }



  //// Insert the country
  AddInjuryEvents(newInjuryEvents: InjuryEvents): Observable<InjuryEvents> {

    return this.http.post<InjuryEvents>(this.baseUrlAdd, newInjuryEvents);


  }

  // Update country

  updateInjuryEvents(id: number, editInjuryEvents: InjuryEvents): Observable<InjuryEvents> {
    return this.http.put<InjuryEvents>(this.baseUrlUpdate + id, editInjuryEvents);
  }


  // Delete country
  DeleteInjuryEvents(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }

  // Clear Cache
  clearCache() {
    this.injuryEvents$ = null as any;

  }
}
