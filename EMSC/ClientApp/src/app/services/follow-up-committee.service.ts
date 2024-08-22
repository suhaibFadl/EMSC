import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { PatientTrans } from '../interfaces/patient-trans';
import { PTransOutside } from '../interfaces/p-trans-outside';
import { TravelingPr } from '../interfaces/traveling-pr';
import { HotelMovement } from '../interfaces/hotel-movement';
import { Treatment } from '../interfaces/treatment';

@Injectable({
  providedIn: 'root'
})
export class FollowUpCommitteeService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGetAllPatTransactionsOutside: string = "/api/FollowUpCommittee/GetAllPatTransactionsOutside";
  private baseUrlGetAllRepliesforPatTransactionsOutside: string = "/api/FollowUpCommittee/GetAllRepliesforPatTransactionsOutside";
  private baseUrlGetAllTravelTickets: string = "/api/FollowUpCommittee/GetAllTravelTickets";
  private baseUrlGetAllEntryProcedures: string = "/api/FollowUpCommittee/GetAllEntryProcedures";
  private baseUrlGetAllTreatmentProcedures: string = "/api/FollowUpCommittee/GetAllTreatmentProcedures";
  private baseUrlGetAllClosingFiles: string = "/api/FollowUpCommittee/GetAllClosingFiles";
  private baseUrlGetAllBackTickets: string = "/api/FollowUpCommittee/GetAllBackTickets";
  private baseUrlGetAllPendingTravelTickets: string = "/api/FollowUpCommittee/GetAllPendingTravelTickets";
  private baseUrlGetAllPendingEntryProcedures: string = "/api/FollowUpCommittee/GetAllPendingEntryProcedures";
  private baseUrlGetAllPendingBackTickets: string = "/api/FollowUpCommittee/GetAllPendingBackTickets";



  private pTransOutside$!: Observable<PTransOutside[]>;
  private traveling$!: Observable<TravelingPr[]>;
  private hotelMovs$!: Observable<HotelMovement[]>;
  private treatMovs$!: Observable<Treatment[]>;



  GetAllPatTransactionsOutside(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPatTransactionsOutside).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }


  GetAllRepliesforPatTransactionsOutside(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllRepliesforPatTransactionsOutside).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }


  GetAllTravelTickets(): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.traveling$) {
      this.traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetAllTravelTickets).pipe(shareReplay());
    }
    return this.traveling$;
  }

  GetAllEntryProcedures(): Observable<HotelMovement[]> {
    this.clearCache();

    if (!this.hotelMovs$) {
      this.hotelMovs$ = this.http.get<HotelMovement[]>(this.baseUrlGetAllEntryProcedures).pipe(shareReplay());
    }
    return this.hotelMovs$;
  }


  GetAllTreatmentProcedures(): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatMovs$) {
      this.treatMovs$ = this.http.get<Treatment[]>(this.baseUrlGetAllTreatmentProcedures).pipe(shareReplay());
    }
    return this.treatMovs$;
  }

  GetAllClosingFiles(): Observable<Treatment[]> {
    this.clearCache();

    if (!this.treatMovs$) {
      this.treatMovs$ = this.http.get<Treatment[]>(this.baseUrlGetAllClosingFiles).pipe(shareReplay());
    }
    return this.treatMovs$;
  }

  GetAllBackTickets(): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.traveling$) {
      this.traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetAllBackTickets).pipe(shareReplay());
    }
    return this.traveling$;
  }

  GetAllPendingTravelTickets(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPendingTravelTickets).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }

  GetAllPendingEntryProcedures(): Observable<TravelingPr[]> {
    this.clearCache();

    if (!this.traveling$) {
      this.traveling$ = this.http.get<TravelingPr[]>(this.baseUrlGetAllPendingEntryProcedures).pipe(shareReplay());
    }
    return this.traveling$;
  }

  GetAllPendingBackTickets(): Observable<PTransOutside[]> {
    this.clearCache();

    if (!this.pTransOutside$) {
      this.pTransOutside$ = this.http.get<PTransOutside[]>(this.baseUrlGetAllPendingBackTickets).pipe(shareReplay());
    }
    return this.pTransOutside$;
  }


  clearCache() {
    this.pTransOutside$ = null as any;
    this.traveling$ = null as any;
    this.hotelMovs$ = null as any;
    this.treatMovs$ = null as any;
  }
}
