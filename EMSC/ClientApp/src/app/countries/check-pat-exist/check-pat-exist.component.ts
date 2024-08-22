import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { HospitalCountryService } from '../../services/hospital-country.service';
import { CountryService } from '../../services/country.service';
import { TreatmentService } from '../../services/treatment.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HospitalsCountries } from '../../interfaces/hospitals-countries';
import { Country } from '../../interfaces/country';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { PatientTrans } from '../../interfaces/patient-trans';
import { Reply } from '../../interfaces/reply';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { AppComponent } from '../../app.component';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-check-pat-exist',
  templateUrl: './check-pat-exist.component.html',
  styleUrls: ['./check-pat-exist.component.css']
})
export class CheckPatExistComponent implements OnInit {

  Reply!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<PTransOutside>;
  dataSource2!: MatTableDataSource<PTransOutside>;
  displayedColumns: string[] = ['index', 'first', 'second'];

  UserId!: string;
  BranchId!: string;
  UserRole!: string;
  UserDate!: string;
  UserCountryId!: string;
  CountryName!: string;


  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private br: BranchService,
    private coun: CountryService,
    private http: HttpClient,
    private app: AppComponent,
    private pa: PatientsService,
    private tr: TreatmentService,
    private hos: HospitalCountryService,

  ) { }

  pTransactions$!: Observable<PTransOutside[]>;
  pTransactions: PTransOutside[] = [];
  LoginStatus$!: Observable<boolean>;

  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });

  
  }


  GetPatientTransactionToTreatmentByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionToTreatmentByCountryId(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    //  this.dataSource.paginator = this.paginator;
    });
  }


  applyFilter2(filterValue: string) {
    this.tr.clearCache();
   
    this.tr.GetPatientTransactionToTreatmentByCountryId(this.UserCountryId.toString()).subscribe((data: any) => {

      if (filterValue != "") {
        this.dataSource = new MatTableDataSource(data);

        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();

        this.dataSource.filter = filterValue;
      }
      else {
        this.dataSource = this.dataSource2;

      }

    });
  }

}
