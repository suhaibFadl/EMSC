import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { AccountService } from '.././services/account.service';
import { PatientData } from '../interfaces/patient-data';

@Injectable({
  providedIn: 'root'
})
export class PatientsMainDataService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlAddPatients: string = "/api/PatientsMainData/AddPatient";
  private baseUrlUpdatePatientData: string = "/api/PatientsMainData/UpdatePatientData/";
  private baseUrlUpdateAppendPatientData: string = "/api/PatientsMainData/UpdateAppendPatientData/";
  private baseUrlDeletePatientData: string = "/api/PatientsMainData/DeletePatientData/";
  private baseUrlGetPatientMainData: string = "/api/PatientsMainData/GetAllPatientsMainData";
  private baseUrlGetAllPatientsMainDataTripoliBranch: string = "/api/PatientsMainData/GetAllPatientsMainDataTripoliBranch";
  private baseUrlGetPatientsMainDataByUserId: string = "/api/PatientsMainData/GetPatientsMainDataByUserId/";
  private baseUrlGetAllPatientsMainDataByBranchId: string = "/api/PatientsMainData/GetAllPatientsMainDataByBranchId/";
  private baseUrlGetAllAttendByBranchId: string = "/api/PatientsMainData/GetAllAttendByBranchId/";
  private baseUrlGetAllAttends: string = "/api/PatientsMainData/GetAllAttends";
  private baseUrlGetAllPatByBranchId: string = "/api/PatientsMainData/GetAllPatByBranchId/";
  private baseUrlGetAllPats: string = "/api/PatientsMainData/GetAllPats";
  private baseUrlGetDataByPassport: string = "/api/PatientsMainData/GetDataByPassport/";
  private baseUrlGetDataByName: string = "/api/PatientsMainData/GetDataByName/";
  private baseUrlGetDataByNational: string = "/api/PatientsMainData/GetDataByNational/";
  private baseUrlGetPatientsMainDataByPatientId: string = "/api/PatientsMainData/GetPatientsMainDataByPatientId/";


  private baseUrlGetAllAttendByUserId: string = "/api/PatientsMainData/GetAllAttendByUserId/";
  private baseUrlGetAllPatByUserId: string = "/api/PatientsMainData/GetAllPatByUserId/";

  private pData$!: Observable<PatientData[]>;

  //============================ADD patient main data ================================

  AddPatient(newpatients: PatientData): Observable<PatientData> {
    return this.http.post<PatientData>(this.baseUrlAddPatients, newpatients);
  }
  //============================Get All Patients Main Data for Management ================================
  GetAllPatientsMainData(): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetPatientMainData).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllPatientsMainDataTripoliBranch(): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllPatientsMainDataTripoliBranch).pipe(shareReplay());
    }
    return this.pData$;
  }
  //===========================Delete Patient Data ================================
  DeletePatientData(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeletePatientData + id);

  }
  //==================================Update Patient Data ==============================
  UpdatePatientData(id: number, newPatient: PatientData): Observable<PatientData> {
    return this.http.put<PatientData>(this.baseUrlUpdatePatientData + id, newPatient);
  }
  UpdateAppendPatientData(id: number, newPatient: PatientData): Observable<PatientData> {
    return this.http.put<PatientData>(this.baseUrlUpdateAppendPatientData + id, newPatient);
  }
  //============================Get All Patients Main Data by Branch Id ================================

  GetAllPatientsMainDataByBranchId(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllPatientsMainDataByBranchId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllAttendByBranchId(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllAttendByBranchId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllAttends(): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllAttends).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllPatByBranchId(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllPatByBranchId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllAttendByUserId(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllAttendByUserId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllPatByUserId(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllPatByUserId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetAllPats(): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetAllPats).pipe(shareReplay());
    }
    return this.pData$;
  }

  GetDataByPassport(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetDataByPassport + id).pipe(shareReplay());
    }
    return this.pData$;
  }
  GetDataByName(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetDataByName + id).pipe(shareReplay());
    }
    return this.pData$;
  }
  GetDataByNational(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetDataByNational + id).pipe(shareReplay());
    }
    return this.pData$;
  }
  //============================Get All Patients Main Data by User Id================================


  GetPatientsMainDataByUserId(id: string): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetPatientsMainDataByUserId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  //============================Get All Patients Main Data by Patient Id ================================

  GetPatientsMainDataByPatientId(id: number): Observable<PatientData[]> {
    this.clearCache();

    if (!this.pData$) {
      this.pData$ = this.http.get<PatientData[]>(this.baseUrlGetPatientsMainDataByPatientId + id).pipe(shareReplay());
    }
    return this.pData$;
  }

  //=========================================================================
  clearCache() {
    this.pData$ = null as any;
  }

}
