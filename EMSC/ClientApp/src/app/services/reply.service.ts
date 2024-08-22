import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { Reply } from '../interfaces/reply';
import { PatientTrans } from '../interfaces/patient-trans';
import { PTransInside } from '../interfaces/p-trans-inside';
import { PTransOutside } from '../interfaces/p-trans-outside';
import { ReplyMOutside } from '../interfaces/reply-m-outside';
import { ReplyMInside } from '../interfaces/reply-m-inside';
@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  constructor(private http: HttpClient, private router: Router) { }


  private baseUrlGetRepliesAccepted: string = "/api/Reply/GetRepliesAcceptedByCountry";
  private baseUrlGetRepliesAcceptedByCountryforBranch: string = "/api/Reply/GetRepliesAcceptedByCountryforBranch/";
  private baseUrlGetRepliesAcceptedByManagementOutside: string = "/api/Reply/GetRepliesAcceptedByManagementOutside";
  private baseUrlGetRepliesAcceptedByManagementInside: string = "/api/Reply/GetRepliesAcceptedByManagementInside";
  private baseUrlGetRepliesManagementTransactionsOutside: string = "/api/Reply/GetRepliesManagementTransactionsOutside";
  private baseUrlGetRepliesCountryTransactionsOutside: string = "/api/Reply/GetRepliesCountryTransactionsOutside";
  private baseUrlGetRepliesAcceptCountryTransactionsToTravel: string = "/api/Reply/GetRepliesAcceptCountryTransactionsToTravel";
  private baseUrlGetRepliesManagementTransactionsInside: string = "/api/Reply/GetRepliesManagementTransactionsInside";
  private baseUrlGetRepliesHospitalsTransactionsInside: string = "/api/Reply/GetRepliesHospitalsTransactionsInside";
  private baseUrlGetRepliesCountryTransactionsOutsideByCountryId: string = "/api/Reply/GetRepliesCountryTransactionsOutsideByCountryId/";
  private baseUrlGetRepliesCountryTransactionsOutsideByCountryIdTreatment: string = "/api/Reply/GetRepliesCountryTransactionsOutsideByCountryIdTreatment/";

  private baseUrlGetRepliesRejected: string = "/api/Reply/GetRepliesRejected";
  private baseUrlUpdateReply: string = "/api/Reply/UpdateReply/";
  private baseUrlReplyOnBranch: string = "/api/Reply/ReplyOnBranch";
  private baseUrlReplyOnBranchByCountry: string = "/api/Reply/ReplyOnBranchByCountry/";
  private baseUrlUpdateReplyStateOutside: string = "/api/Reply/UpdateReplyStateOutside/";
  private baseUrlUpdateReplyStateInside: string = "/api/Reply/UpdateReplyStateInside/";
  private baseUrlUpdateReplyStateCountry: string = "/api/Reply/UpdateReplyStateCountry/";
  private baseUrlUpdateReplyStateHospital: string = "/api/Reply/UpdateReplyStateHospital/";
  private baseUrlUpdateReplyStateAccepted: string = "/api/Reply/UpdateReplyStateAccepted/";

  private baseUrlReplyOnBranchByManagement: string = "/api/Reply/ReplyOnBranchByManagement/";




  private Replies$!: Observable<Reply[]>;
  private pTransactions$!: Observable<PatientTrans[]>;
  private pTransInside$!: Observable<PTransInside[]>;
  private pTransOutside$!: Observable<PTransOutside[]>;
  private ReplyMOutside$!: Observable<ReplyMOutside[]>;
  private ReplyMInside$!: Observable<ReplyMInside[]>;



  ReplyOnBranchByManagement(id: number, newReply: Reply): Observable<Reply> {
    return this.http.put<Reply>(this.baseUrlReplyOnBranchByManagement + id, newReply);
  }
  //===================================Reply on Branch==============================

  ReplyOnBranch(newReply: Reply): Observable<Reply> {
    return this.http.post<Reply>(this.baseUrlReplyOnBranch, newReply);
  }

  //============================================================================================

  UpdateReplyManagementOutside(id: number, trid: number, editreply: ReplyMOutside): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.put<ReplyMOutside[]>('/api/Reply/UpdateReplyManagementOutside/' + id + '/' + trid, editreply).pipe(shareReplay());
    }
    return this.ReplyMOutside$;
  }

    //============================================================================================
  //============================================================================================

  UpdateReplyCountryOutside(id: number, trid: number, editreply: ReplyMOutside): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.put<ReplyMOutside[]>('/api/Reply/UpdateReplyCountryOutside/' + id + '/' + trid, editreply).pipe(shareReplay());
    }
    return this.ReplyMOutside$;
  }

    //============================================================================================
  //============================================================================================

  UpdateReplyManagementInside(id: number, trid: number, editreply: ReplyMInside): Observable<ReplyMInside[]> {
    this.clearCache();

    if (!this.ReplyMInside$) {
      this.ReplyMInside$ = this.http.put<ReplyMInside[]>('/api/Reply/UpdateReplyManagementOutside/' + id + '/' + trid, editreply).pipe(shareReplay());
    }
    return this.ReplyMInside$;
  }

    //============================================================================================

  ReplyOnBranchByCountry(id:number, newReply: Reply): Observable<Reply> {
    return this.http.put<Reply>(this.baseUrlReplyOnBranchByCountry + id , newReply);
  }

  //======================================================================
  UpdateReplyStateOutside(id: number, newReply: PTransOutside): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateReplyStateOutside + id, newReply);
  }
  UpdateReplyStateInside(id: number): Observable<PTransInside> {
    return this.http.put<PTransInside>(this.baseUrlUpdateReplyStateInside + id, '');
  }

  //======================================================================
  UpdateReplyStateCountry(id: number, newReply: PTransOutside): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateReplyStateCountry + id, newReply);
  }
  //======================================================================
  UpdateReplyStateHospital(id: number, newReply: PatientTrans): Observable<PatientTrans> {
    return this.http.put<PatientTrans>(this.baseUrlUpdateReplyStateHospital + id, newReply);
  }

  //================GET ALL Replies Accepted=====================================

  GetRepliesAcceptedByCountry(): Observable<Reply[]> {

    if (!this.Replies$) {
      this.Replies$ = this.http.get<Reply[]>(this.baseUrlGetRepliesAccepted).pipe(shareReplay());
    }
    return this.Replies$;

  } //================Get Replies Accepted By Management Outside====================================

  GetRepliesAcceptedByManagementOutside(): Observable<ReplyMOutside[]> {

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesAcceptedByManagementOutside).pipe(shareReplay());
    }
    return this.ReplyMOutside$;

  }

  //================Get Replies Accepted By Management Inside====================================

  GetRepliesAcceptedByManagementInside(): Observable<ReplyMInside[]> {

    if (!this.ReplyMInside$) {
      this.ReplyMInside$ = this.http.get<ReplyMInside[]>(this.baseUrlGetRepliesAcceptedByManagementInside).pipe(shareReplay());
    }
    return this.ReplyMInside$;

  }

  GetRepliesAcceptedByCountryforBranch(id: string): Observable<ReplyMOutside[]> {

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesAcceptedByCountryforBranch + id).pipe(shareReplay());
    }
    return this.ReplyMOutside$;

  }
    //================GET ALL Replies Accepted=====================================

  GetRepliesRejected(): Observable<Reply[]> {

    if (!this.Replies$) {
      this.Replies$ = this.http.get<Reply[]>(this.baseUrlGetRepliesRejected).pipe(shareReplay());
    }
    return this.Replies$;

  }
  //===================================UPDATE Patient  ==============================
  UpdateReply(id: number, editreply: Reply): Observable<Reply> {
    return this.http.put<Reply>(this.baseUrlUpdateReply + id, editreply);
  }

  //=========================================================================
  ////===================================UPDATE Patient  ==============================
  //UpdateReplyManagementOutside(id: number, editreply: ReplyMOutside): Observable<ReplyMOutside> {
  //  return this.http.put<ReplyMOutside>(this.baseUrlUpdateReplyManagementOutside + id, editreply);
  //}

  ////=========================================================================


  //=========================================================================
  //================Get Replies Accepted By Management outside====================================
  GetRepliesManagementTransactionsOutside(): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesManagementTransactionsOutside).pipe(shareReplay());
    }
    return this.ReplyMOutside$;
  }
  //=========================================================================
  //================Get Replies Accepted By Management Inside====================================
  GetRepliesManagementTransactionsInside(): Observable<ReplyMInside[]> {
    this.clearCache();

    if (!this.ReplyMInside$) {
      this.ReplyMInside$ = this.http.get<ReplyMInside[]>(this.baseUrlGetRepliesManagementTransactionsInside).pipe(shareReplay());
    }
    return this.ReplyMInside$;
  }
  //=========================================================================
  //================Get Replies Accepted By Country outside====================================
  GetRepliesCountryTransactionsOutside(): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesCountryTransactionsOutside).pipe(shareReplay());
    }
    return this.ReplyMOutside$;
  }
  //=========================================================================
  //================Get Replies Accepted By Country outside====================================
  GetRepliesAcceptCountryTransactionsToTravel(): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesAcceptCountryTransactionsToTravel).pipe(shareReplay());
    }
    return this.ReplyMOutside$;
  }
  //=========================================================================
  //================Get Replies Accepted By Management Inside====================================
  GetRepliesHospitalsTransactionsInside(): Observable<ReplyMInside[]> {
    this.clearCache();

    if (!this.ReplyMInside$) {
      this.ReplyMInside$ = this.http.get<ReplyMInside[]>(this.baseUrlGetRepliesHospitalsTransactionsInside).pipe(shareReplay());
    }
    return this.ReplyMInside$;
  }
  //=========================================================================
  //===================================Get Patients By UserId  Patient for branch ==============================

 GetRepliesCountryTransactionsOutsideByCountryIdTreatment(id: string): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesCountryTransactionsOutsideByCountryIdTreatment + id).pipe(shareReplay());
    }
    return this.ReplyMOutside$;

  } //===================================Get Patients By UserId  Patient for branch ==============================

  GetRepliesCountryTransactionsOutsideByCountryId(id: string): Observable<ReplyMOutside[]> {
    this.clearCache();

    if (!this.ReplyMOutside$) {
      this.ReplyMOutside$ = this.http.get<ReplyMOutside[]>(this.baseUrlGetRepliesCountryTransactionsOutsideByCountryId + id).pipe(shareReplay());
    }
    return this.ReplyMOutside$;

  }

  //=========================================================================
  clearCache() {
    this.Replies$ = null as any;
    this.pTransactions$ = null as any;
    this.pTransInside$ = null as any;
    this.pTransOutside$ = null as any;
    this.ReplyMInside$ = null as any;
    this.ReplyMOutside$ = null as any;
  }

}
