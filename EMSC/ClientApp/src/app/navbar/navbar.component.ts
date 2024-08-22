import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { CountryService } from '../services/country.service';
import { BranchService } from '../services/branch.service';
import { HospitalService } from '../services/hospital.service';
import { PatientsService } from '../services/patients.service';
import { MatSidenav } from '@angular/material/sidenav';
import { PatientsLettersOutsideService } from '../services/patients-letters-outside.service';
import { MatTableDataSource } from '@angular/material/table';
import { PTransOutside } from '../interfaces/p-trans-outside';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent implements OnInit {

  panelOpenState = false;
  @Output() sidenavClose = new EventEmitter();
  sidenav!: MatSidenav;
  constructor(private acct: AccountService, private countryService: CountryService, branchService: BranchService, hospitalService: HospitalService, private pa: PatientsLettersOutsideService,
  ) { }



  LoginStatus$!: Observable<boolean>;
  UserName$!: Observable<string>;
  UserRole$!: Observable<string>;
  BranchName$!: Observable<string>;
  PharmacyName$!: Observable<string>;
  CountryName$!: Observable<string>;
  CountryId$!: Observable<string>;
  HospitalName$!: Observable<string>;
  ActiveState$!: Observable<string>;
  FullName$!: Observable<string>;
  UserId$!: Observable<string>;
  userRoleStatus!: string;

  UserRole!: string;
  BranchName!: string;
  PharmacyName!: string;
  CountryName!: string;
  CountryId!: string;
  HospitalName!: string;
  userBranchStatus!: string;
  ActiveState!: string;
  FullName!: string;
  UserId!: string;



  pTransOutside$!: Observable<PTransOutside[]>;
  pTransOutside: PTransOutside[] = [];


  pTransOutside1$!: Observable<PTransOutside[]>;
  pTransOutside1: PTransOutside[] = [];



  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;
    this.UserName$ = this.acct.currentUserName;
    this.UserId$ = this.acct.currentuserid;
    this.CountryId$ = this.acct.currentUserCountryId;
    this.UserRole$ = this.acct.currentUserRole;
    this.BranchName$ = this.acct.currentUserBranchName;
    this.PharmacyName$ = this.acct.currentUserPharmacyName;
    this.CountryName$ = this.acct.currentUserCountryName;
    this.HospitalName$ = this.acct.currentUserHospitalName;
    this.ActiveState$ = this.acct.currentUserActiveState;
    this.FullName$ = this.acct.currentUserFullName;




    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchName.subscribe(result => { this.BranchName = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.acct.currentUserHospitalName.subscribe(result => { this.HospitalName = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CountryId = result });
    this.acct.currentUserActiveState.subscribe(result => { this.ActiveState = result });
    this.acct.currentUserFullName.subscribe(result => { this.FullName = result });
    this.acct.currentUserPharmacyName.subscribe(result => { this.PharmacyName = result });




    if (this.UserRole == "الإدارة") {
      this.GetAllP_TransactionsOutsideIsWaiting();
    } else {
      if (this.UserRole == "مشرف إداري") {
        this.GetAllPatientsIsAcceptedByManagment();
      }

    }
  }



  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }



  onLogout() {
    this.acct.logout();
    this.acct.clearCache();
    //window.location.reload()

  }



  GetAllP_TransactionsOutsideIsWaiting() {

    this.pa.clearCache();
    this.pa.GetAllP_TransactionsOutsideIsWaiting().subscribe(result => {
      this.pTransOutside = result;
      if (this.pTransOutside.length > 0) {
        this.pa.clearCache();

      }
      this.pa.clearCache();

    });
  }

  GetAllPatientsIsAcceptedByManagment() {
    this.pa.GetAllPatientsIsAcceptedByManagment(this.CountryId.toString()).subscribe(result => {
      this.pTransOutside1 = result;
      if (this.pTransOutside1.length > 0) {
        this.pa.clearCache();
      }
      this.pa.clearCache();

    });
  }



}

