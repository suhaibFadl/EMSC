import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
import { HospitalService } from '../../services/hospital.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { BranchService } from '../../services/branch.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { ReplyHospitalService } from '../../services/reply-hospital.service';
import { Branch } from '../../interfaces/branch';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  selector: 'app-letters-inside-incoming',
  templateUrl: './letters-inside-incoming.component.html',
  styleUrls: ['./letters-inside-incoming.component.css']
})
export class LettersInsideIncomingComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsLettersInsideService,
    private ho: HospitalService,
    private br: BranchService,
    private datepipe: DatePipe,
    private http: HttpClient
  ) {
    this.navLinks = [

      {
        label: 'قائمة رسائل ضم الجرحى للعلاج داخل ليبيا',
        link: '/management/letters-inside-incoming',
        index: 0
      },
      {
        label: 'قائمة رسائل ضم الجرحى للعلاج بالخارج',
        link: '/management/letters-outside-incoming',
        index: 1
      }

    ];
  }

  date = new FormControl(moment());

  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = -1;

  LoginStatus$!: Observable<boolean>;
  selection: any;


  TransInside!: Observable<PTransInside[]>;
  dataSource!: MatTableDataSource<PTransInside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'eleventh', 'twelve', 'thirteen','fourteen'];



  UserDate!: string;
  BRID!: number;


  UserId!: string;
  UserRole!: string;
  BranchUserId!: string;


  selectedpat!: PTransInside;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  checkIndex!: number;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;


  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;



  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;



  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

   

    this.GetHospitals();
    this.GetBranches();
        this.GetAllP_TransactionsInsideForManagement();
      

  }


  GetAllP_TransactionsInsideForManagement() {
    this.pa.clearCache();
    this.pa.GetAllP_TransactionsInsideForManagement().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  GetHospitals() {
    this.ho.clearCache();
    this.ho.GetHospitals().subscribe(result => {
      this.hospitals = result;
    });
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }


  ViewlMedicalModal(p: PTransInside) {
    this.modalMessage = p.medicalDiagnosis;
    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }


  applyFilter2(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {

    if (filterValue != "") {
      this.dataSource.filter = filterValue.trim().toLowerCase();

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter3() {

      if (this.UserRole == "الإدارة") {
        this.GetAllP_TransactionsInsideForManagement();
      }

    }
  
}
