import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";

import { User } from '../interfaces/user';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  constructor(private http: HttpClient, private router: Router) {
  //  this. = localStorage.getItem('flightdetails') || {};
  }

  private baseUrlLogin: string = "/api/ApplicationUser/Login";


  private baseUrlResetPassword: string = "/api/ApplicationUser/ResetPassword";
  private baseUrlGetActiveStateForCurrentUser: string = "/api/ApplicationUser/GetActiveStateForCurrentUser/";
  private baseUrlRegister: string = "/api/ApplicationUser/Register";
  private baseUrlRegisterbranch: string = "/api/ApplicationUser/CreateBrancheAccount";
  private baseUrlCreateHospitalUserAccount: string = "/api/ApplicationUser/CreateHospitalUserAccount";
  private baseUrlRegisterHospital: string = "/api/ApplicationUser/CreateHospitalUserAccount";
  private baseUrlCreatePharmacyUserAccount: string = "/api/ApplicationUser/CreatePharmacyUserAccount";
  private baseUrlGetBranchUser: string = "/api/ApplicationUser/GetBranchIdByUserId/";
  private baseUrlGetUserInside: string = "/api/ApplicationUser/GetUsersInside";
  private baseUrlGetUsersPharmacies: string = "/api/ApplicationUser/GetUsersPharmacies";
  private baseUrlGetUserOutside: string = "/api/ApplicationUser/GetUsersOutside";
  private baseUrlGetUserGetInsideHospital: string = "/api/ApplicationUser/GetUsersInsideHospital";
  private baseUrlGetUserGetUsersInsideManagement: string = "/api/ApplicationUser/GetUsersInsideManagement";
  private baseUrlGetBlockedUser: string = "/api/ApplicationUser/BlockedUser/";
  private baseUrlDeleteUser: string = "/api/ApplicationUser/DeleteUser/";
  private baseUrlDeleteUserCo: string = "/api/ApplicationUser/DeleteUserCo/";
  //private baseUrlGetCountryByUserId: string = "/api/ApplicationUser/GetCountryByUserId/";



  private LoginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private jwt = new BehaviorSubject<string>(localStorage.getItem('jwt') || '{}');
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username') || '{}');
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole') || '{}');
  private ActiveState = new BehaviorSubject<string>(localStorage.getItem('active') || '');
  private FullName = new BehaviorSubject<string>(localStorage.getItem('fullName') || '');
  private RoleId = new BehaviorSubject<string>(localStorage.getItem('roleId') || '');
  private UserId = new BehaviorSubject<string>(localStorage.getItem('id') || '{}');


  private BranchId = new BehaviorSubject<string>(localStorage.getItem('branchId') || '');
  private BranchName = new BehaviorSubject<string>(localStorage.getItem('brName') || '');
  private PharmacyId = new BehaviorSubject<string>(localStorage.getItem('pharmacyId') || '');
  private PharmacyName = new BehaviorSubject<string>(localStorage.getItem('pharmacyName') || '');
  private CountryId = new BehaviorSubject<string>(localStorage.getItem('countryId') || '');
  private CountryName = new BehaviorSubject<string>(localStorage.getItem('country') || '');
  private HospitalId = new BehaviorSubject<string>(localStorage.getItem('hospitalId') || '');
  private HospitalName = new BehaviorSubject<string>(localStorage.getItem('hospital') || '');

  //private Branch$!: Observable<Branch[]>;

  //private data$!: Observable<BranchUser[]>;
  //private datah$!: Observable<HospitalUser[]>;
  //private datac$!: Observable<CountryUser[]>;
  private User$!: Observable<User[]>;

  

  login(username: string, password: string) {
   // var branch = [];

    return this.http.post<any>(this.baseUrlLogin, { username, password }).pipe(

      map(result => {
        if (result && result.token) {

          this.LoginStatus.next(true);

          //set items
          localStorage.setItem('LoginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('userRole', result.userRole);
          localStorage.setItem('branchId', result.branchId.value);
          localStorage.setItem('brName', result.brName.value);
          localStorage.setItem('pharmacyId', result.pharmacyId.value);
          localStorage.setItem('pharmacyName', result.pharmacyName.value);
          localStorage.setItem('countryId', result.countryId.value);
          localStorage.setItem('country', result.country.value);
          localStorage.setItem('hospitalId', result.hospitalId.value);
          localStorage.setItem('hospital', result.hospital.value);
          localStorage.setItem('active', result.active.value);
          localStorage.setItem('fullName', result.fullName.value);
          localStorage.setItem('roleId', result.roleId.value);
          localStorage.setItem('id', result.userid);



          //get items
          this.jwt.next(localStorage.getItem('jwt') || '{}');
          this.UserName.next(localStorage.getItem('username') || '{}');
          this.UserRole.next(localStorage.getItem('userRole') || '{}');
          this.BranchId.next(localStorage.getItem('branchId') || '');
          this.BranchName.next(localStorage.getItem('brName') || '');
          this.PharmacyId.next(localStorage.getItem('pharmacyId') || '');
          this.PharmacyName.next(localStorage.getItem('pharmacyName') || '');
          this.CountryId.next(localStorage.getItem('countryId') || '');
          this.CountryName.next(localStorage.getItem('country') || '');
          this.HospitalId.next(localStorage.getItem('hospitalId') || '');
          this.HospitalName.next(localStorage.getItem('hospital') || '');
          this.ActiveState.next(localStorage.getItem('active') || '');
          this.FullName.next(localStorage.getItem('fullName') || '');
          this.RoleId.next(localStorage.getItem('roleId') || '');
          this.UserId.next(localStorage.getItem('id') || '{}');
        }
        else {
          this.LoginStatus.next(false);
          //set items
          localStorage.setItem('LoginStatus', '0');
          localStorage.setItem('active', result.active.value);
          localStorage.setItem('id', result.userid);
          //get items
          this.ActiveState.next(localStorage.getItem('active') || '');
          this.UserId.next(localStorage.getItem('id') || '{}');
        }
        return result;
      })
    );

  }




  logout() {
    this.LoginStatus.next(false);
    localStorage.setItem('LoginStatus', '0');
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('branchId');
    localStorage.removeItem('brName');
    localStorage.removeItem('pharmacyId');
    localStorage.removeItem('pharmacyName');
    localStorage.removeItem('countryId');
    localStorage.removeItem('country');
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('hospital');
    localStorage.removeItem('active');
    localStorage.removeItem('fullName');
    localStorage.removeItem('roleId');
    localStorage.removeItem('expiration');
    this.router.navigate(['/login']);
  
  }


  checkLoginStatus(): boolean {
    var LoginCookie = localStorage.getItem("LoginStatus");

    if (LoginCookie == "1") {
      if (localStorage.getItem('jwt') === null || localStorage.getItem('jwt') === undefined) 
        {
          return false;
        }
        const token = localStorage.getItem('jwt');
        var decoded = jwt_decode(token);

        if (decoded.exp === undefined) {
          return false;
        }
        const date = new Date(0);


        let tokenExpDate = date.setUTCSeconds(decoded.exp);


        if (tokenExpDate.valueOf() > new Date().valueOf()) {
          return true;
        }


        return false;

      }
      return false;
    
  }



  get isloggesin() {
    return this.LoginStatus.asObservable();
  }

  get currentUserName() {
    return this.UserName.asObservable();
  }

  get currentUserRole() {
    return this.UserRole.asObservable();
  }

  get currentuserid() {
    return this.UserId.asObservable();
  }
  get currentUserPharmacyId() {
    return this.PharmacyId.asObservable();
  }

  get currentUserPharmacyName() {
    return this.PharmacyName.asObservable();
  }
  
  get currentUserBranchName() {
    return this.BranchName.asObservable();
  }
  get currentUserBranchId() {
    return this.BranchId.asObservable();
  }

  get currentUserCountryId() {
    return this.CountryId.asObservable();
  }

  get currentUserCountryName() {
    return this.CountryName.asObservable();
  }
  get currentUserHospitalId() {
    return this.HospitalId.asObservable();
  }

  get currentUserHospitalName() {
    return this.HospitalName.asObservable();
  }
  get currentUserActiveState() {
    return this.ActiveState.asObservable();
  }
  get currentUserFullName() {
    return this.FullName.asObservable();
  }

  get currentUserRoleId() {
    return this.RoleId.asObservable();
  }

 

  register(newCAccount: Account): Observable<Account> {

   
    return this.http.post<Account>(this.baseUrlRegister, newCAccount);
  }


  //=========================================================================
  //GetBranchByUserId(id: string): Observable<BranchUser[]> {

  //  if (!this.data$) {
  //    this.data$ = this.http.get<BranchUser[]>(this.baseUrlGetBranchUser + id).pipe(shareReplay());
  //  }
  //  return this.data$;

  //}
  //=========================== AddAccountBr ================================

  AddAccountBr(newAccount: Account): Observable<Account> {
   
    return this.http.post<Account>(this.baseUrlRegisterbranch, newAccount);
  }

  ResetPassword(newAccount: Account): Observable<Account> {

    return this.http.post<Account>(this.baseUrlResetPassword, newAccount);
  }


//===============================

  //=========================== AddAccountHo ================================

  AddAccountHo(newAccount: Account): Observable<Account> {
  
    return this.http.post<Account>(this.baseUrlCreateHospitalUserAccount, newAccount);
  }

  AddAccountPharmacy(newAccount: Account): Observable<Account> {
  
    return this.http.post<Account>(this.baseUrlCreatePharmacyUserAccount, newAccount);
  }

//===============================

  GetUsersOutside(): Observable<User[]> {
    this.clearCache();


    if (!this.User$) {
      this.User$ = this.http.get<User[]>(this.baseUrlGetUserOutside).pipe(shareReplay());
    }
    return this.User$;

  }
//===============================

  GetUsersInside(): Observable<User[]> {
    this.clearCache();


    if (!this.User$) {
      this.User$ = this.http.get<User[]>(this.baseUrlGetUserInside).pipe(shareReplay());
    }
    return this.User$;

  }

  GetUsersPharmacies(): Observable<User[]> {
    this.clearCache();


    if (!this.User$) {
      this.User$ = this.http.get<User[]>(this.baseUrlGetUsersPharmacies).pipe(shareReplay());
    }
    return this.User$;

  }

  GetUserGetUsersInsideManagement(): Observable<User[]> {
    this.clearCache();


    if (!this.User$) {
      this.User$ = this.http.get<User[]>(this.baseUrlGetUserGetUsersInsideManagement).pipe(shareReplay());
    }
    return this.User$;

  }
  //===============================

  GetUserGetInsideHospital(): Observable<User[]> {
    this.clearCache();


    if (!this.User$) {
      this.User$ = this.http.get<User[]>(this.baseUrlGetUserGetInsideHospital).pipe(shareReplay());
    }
    return this.User$;

  }
  //===============================

  GetBlockedUser(id: number, editBlock: User): Observable<User> {
    return this.http.put<User>(this.baseUrlGetBlockedUser + id, editBlock);
  }


  // Delete user
  DeleteUser(id: string): Observable<any> {
    return this.http.delete(this.baseUrlDeleteUser + id);

  }

  DeleteUserCo(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDeleteUser + id);

  }

  clearCache() {
  this.User$ = null as any;
}
}





