import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { PatientTrans } from '../interfaces/patient-trans';
import { PTransInside } from '../interfaces/p-trans-inside';
import { PTransOutside } from '../interfaces/p-trans-outside';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  constructor(private http: HttpClient, private router: Router) { }


  private baseUrlGetPatientsByHospitalId: string = "/api/Patients/GetPatientsByHospitalId/";
  private baseUrlAddPatientTransManagement: string = "/api/Patients/AddPatientTransManagement";
  private baseUrlAddPatientTransManagementInside: string = "/api/Patients/AddPatientTransManagementInside";
  private baseUrlAddAttendantTransByManag: string = "/api/Patients/AddAttendantTransByManag";
 



  private baseUrlDeleteFile: string = "/api/Upload/DeleteFile/";
  private baseUrlDeleteReply: string = "/api/Patients/DeleteReply/";

  //private patients$!: Observable<Patients[]>;

  private pTransactions$!: Observable<PatientTrans[]>;


  
  //============================ADD patients Transaction ================================

  AddPatientTransManagement(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddPatientTransManagement, newpatients);
  }
  AddPatientTransManagementInside(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddPatientTransManagementInside, newpatients);
  }

 AddAttendantTransByManag(newpatients: PatientTrans): Observable<PatientTrans> {
    return this.http.post<PatientTrans>(this.baseUrlAddAttendantTransByManag, newpatients);
  }


  //=================== GET Patients BY patient ID ==============================
  GetPatientsByHospitalId(id: number): Observable<PatientTrans[]> {
    this.clearCache();

    if (!this.pTransactions$) {
      this.pTransactions$ = this.http.get<PatientTrans[]>(this.baseUrlGetPatientsByHospitalId + id).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.pTransactions$;

  }
  //================================================================
  

  DeleteFile(id: string): Observable<any> {
    return this.http.delete(this.baseUrlDeleteFile + id);

  }
  //=========================================================================
  clearCache() {
    this.pTransactions$ = null as any;
  }

}
