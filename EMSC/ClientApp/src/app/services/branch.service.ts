
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../interfaces/branch';
//import { BranchUser } from '../interfaces/branch-user';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http: HttpClient, private router: Router) { }
  private baseUrlGetBranch: string = "/api/Branch/GetBranches";
  private baseUrlAdd: string = "/api/Branch/AddBranch";
  private baseUrlUpdate: string = "/api/Branch/UpdateBranch/";
  private baseUrlDelete: string = "/api/Branch/DeleteBranch/";
  private baseUrlGetBranchUser: string = "/api/Branch/GetBranchByUserId/";

  private Branch$!: Observable<Branch[]>;
 // private data$!: Observable<BranchUser[]>;

  GetBranches(): Observable<Branch[]> {
    this.clearCache();


    if (!this.Branch$) {
      this.Branch$ = this.http.get<Branch[]>(this.baseUrlGetBranch).pipe(shareReplay());
    }
    // if products cache exists return it
    return this.Branch$;

  }

  //// Insert the Branch
  AddBranch(newBranch: Branch): Observable<Branch> {

    return this.http.post<Branch>(this.baseUrlAdd, newBranch);


  }

  // Update Branch

  updateBranch(id: number, editBranch: Branch): Observable<Branch> {
    return this.http.put<Branch>(this.baseUrlUpdate + id, editBranch);
  }


  // Delete Branch
  DeleteBranch(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }

  //============================Get Branch Id By UserId=============================================
  //GetBranchByUserId(id: string): Observable<BranchUser[]> {
  //  this.clearCache();

  //  if (!this.data$) {
  //    this.data$ = this.http.get<BranchUser[]>(this.baseUrlGetBranchUser + id).pipe(shareReplay());
  //  }
  //  return this.data$;

  //}

  // Clear Cache
  clearCache() {
    this.Branch$ = null as any;

  }
}




