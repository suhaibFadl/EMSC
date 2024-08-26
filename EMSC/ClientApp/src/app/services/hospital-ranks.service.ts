import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { HospitalRank } from '../interfaces/hospital-ranks';

@Injectable({
  providedIn: 'root'
})
export class HospitalRanksService {

  constructor(private http: HttpClient, private router: Router) { }
  private baseUrlGet: string = "/api/HospitalRanks/GetHospitalRanks";
  private baseUrlAdd: string = "/api/HospitalRanks/AddHospitalRank";
  private baseUrlUpdate: string = "/api/HospitalRanks/UpdateHospitalRank/";
  private baseUrlDelete: string = "/api/HospitalRanks/DeleteHospitalRank/";

  private hospitalRank$!: Observable<HospitalRank[]>;


  GetHospitalRanks(): Observable<HospitalRank[]> {
    this.clearCache();

    if (!this.hospitalRank$) {
      this.hospitalRank$ = this.http.get<HospitalRank[]>(this.baseUrlGet).pipe(shareReplay());
    }
    return this.hospitalRank$;
  }



  // Insert the Hospital Rank
  AddHospitalRank(newHospitalRank: HospitalRank): Observable<HospitalRank> {
    return this.http.post<HospitalRank>(this.baseUrlAdd, newHospitalRank);
  }

  // Update HospitalRank
  updateHospitalRank(id: number, editHospitalRank: HospitalRank): Observable<HospitalRank> {
    return this.http.put<HospitalRank>(this.baseUrlUpdate + id, editHospitalRank);
  }


  // Delete Hospital Rank
  DeleteHospitalRank(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }

  // Clear Cache
  clearCache() {
    this.hospitalRank$ = null as any;
  }
}

