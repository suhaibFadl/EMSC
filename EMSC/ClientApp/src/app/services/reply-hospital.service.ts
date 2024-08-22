import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { Patients } from '../interfaces/patients';
import { Reply } from '../interfaces/reply';
import { PatientTrans } from '../interfaces/patient-trans';
import { Patienthosp } from '../interfaces/patienthosp';
import { PTransInside } from '../interfaces/p-trans-inside';
import { PTransOutside } from '../interfaces/p-trans-outside';
import { ReplyMOutside } from '../interfaces/reply-m-outside';
import { ReplyMInside } from '../interfaces/reply-m-inside';
@Injectable({
  providedIn: 'root'
})
export class ReplyHospitalService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlReplyOnBranchByCountry: string = "/api/ReplyHospital/ReplyOnBranchByManagementInside/";
  private baseUrlUpdateReplyStateInside: string = "/api/ReplyHospital/UpdateReplyStateInside/";
  private baseUrlUpdateReplyByHospitalInside: string = "/api/ReplyHospital/UpdateReplyByHospitalInside";


  private baseUrlDeleteReply: string = "/api/ReplyHospital/DeleteReplyInside/";
  private baseUrlReplyOnBranchByHospitalInside: string = "/api/ReplyHospital/ReplyOnBranchByHospitalInside/";
  private baseUrlUpdateReplyStateByHospital: string = "/api/ReplyHospital/UpdateReplyStateByHospital/";
  private baseUrlGetRepliesAcceptedByHospitalforBranch: string = "/api/ReplyHospital/GetRepliesAcceptedByHospitalforBranch/";
  private baseUrlGetRepliesByHospitalId: string = "/api/ReplyHospital/GetRepliesByHospitalId/";


  private RepliesHo$!: Observable<Reply[]>;


  ReplyOnBranchByManagementInside(id: number, newReply: Reply): Observable<Reply> {
    return this.http.put<Reply>(this.baseUrlReplyOnBranchByCountry + id, newReply);
  }

  UpdateReplyStateInside(id: number, newReply: PTransInside): Observable<PTransInside> {
    return this.http.put<PTransInside>(this.baseUrlUpdateReplyStateInside + id, newReply);
  }

  UpdateReplyByHospitalInside(newReply: PTransInside): Observable<PTransInside> {
    return this.http.put<PTransInside>(this.baseUrlUpdateReplyByHospitalInside, newReply);
  }

  DeleteReplyInside(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteReply + id);
  }

  //======================================================================
  ReplyOnBranchByHospitalInside(id: number, newReply: Reply): Observable<Reply> {
    return this.http.put<Reply>(this.baseUrlReplyOnBranchByHospitalInside + id, newReply);
  }

  UpdateReplyStateByHospital(id: number): Observable<PTransOutside> {
    return this.http.put<PTransOutside>(this.baseUrlUpdateReplyStateByHospital + id, '');
  }

    //======================================================================

  GetRepliesAcceptedByHospitalforBranch(id: string): Observable<Reply[]> {

    if (!this.RepliesHo$) {
      this.RepliesHo$ = this.http.get<Reply[]>(this.baseUrlGetRepliesAcceptedByHospitalforBranch + id).pipe(shareReplay());
    }
    return this.RepliesHo$;

  }
    //===========================================================================================

  GetRepliesByHospitalId(id: string): Observable<Reply[]> {

    if (!this.RepliesHo$) {
      this.RepliesHo$ = this.http.get<Reply[]>(this.baseUrlGetRepliesByHospitalId + id).pipe(shareReplay());
    }
    return this.RepliesHo$;

  }



  clearCache() {
    this.RepliesHo$ = null as any;
  }


  //============================================ abdo code new system

  private AddNewFileBaseURL: string = "/api/claims/AddNewFile/";
  //private baseUrlUpdateReplyStateInside: string = "/api/ReplyHospital/UpdateReplyStateInside/";
  //private baseUrlUpdateReplyByHospitalInside: string = "/api/ReplyHospital/UpdateReplyByHospitalInside";


  //private baseUrlDeleteReply: string = "/api/ReplyHospital/DeleteReplyInside/";
  //private baseUrlReplyOnBranchByHospitalInside: string = "/api/ReplyHospital/ReplyOnBranchByHospitalInside/";
  //private baseUrlUpdateReplyStateByHospital: string = "/api/ReplyHospital/UpdateReplyStateByHospital/";
  //private baseUrlGetRepliesAcceptedByHospitalforBranch: string = "/api/ReplyHospital/GetRepliesAcceptedByHospitalforBranch/";
  //private baseUrlGetRepliesByHospitalId: string = "/api/ReplyHospital/GetRepliesByHospitalId/";

  private patienthosp$!: Observable<Patienthosp[]>;

  OpenPatientFileInHospital(id: number, newReply: Patienthosp): Observable<Patienthosp> {
    return this.http.post<Patienthosp>(this.AddNewFileBaseURL + id, newReply);
  }






}
