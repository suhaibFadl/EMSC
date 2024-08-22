import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Patients } from '../../interfaces/patients';
import { Country } from '../../interfaces/country';
import { Hospital } from '../../interfaces/hospital';
import { Reply } from '../../interfaces/reply';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { PatientTrans } from '../../interfaces/patient-trans';
import { PatientData } from '../../interfaces/patient-data';
//import { BranchUser } from '../../interfaces/branch-user';
import { Treatment } from '../../interfaces/treatment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TreatmentService } from '../../services/treatment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';

@Directive({
  selector: '[errorStateMatcherDirective]'
})

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-treatment-branch',
  templateUrl: './treatment-branch.component.html',
  styleUrls: ['./treatment-branch.component.css']
})
export class TreatmentBranchComponent implements OnInit {

  LoginStatus$!: Observable<boolean>;

  dataSaved = false;
  employeeForm: any;
  TravelingPr!: Observable<Treatment[]>;
  dataSource!: MatTableDataSource<Treatment>;
  selection = new SelectionModel<Treatment>(true, []);
  employeeIdUpdate = null;
  massage = null;

  PatientId = null;
  StateId = null;
  SelectedDate = null;
  isMale = true;
  isFeMale = false;

  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',  'nineth', 'ten'];

  clickedRows = new Set<Treatment>();


  UserId!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;
  UserDate!: string;

  changeid!: number;
  UserRole!: string;
  BranchUserId!: string;



  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private ho: HospitalService,
    private re: ReplyService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private tr: TreatmentService,
  ) { }




  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  pData$!: Observable<PatientData[]>;
  pData: PatientData[] = [];

  patients: Patients[] = [];
  patients$!: Observable<Patients[]>;

  

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });





    if (this.UserRole == "مدير الفرع") {

      this.GetPatientTransactionTreatmentByBranchId();
    } else {
      if (this.UserRole == "موظف إدخال الفرع") {

        this.GetPatientTransactionTreatmentByUserId();
      }
    }
  


  }





  GetPatientTransactionTreatmentByBranchId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      

    });
  }

  GetPatientTransactionTreatmentByUserId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByUserId(this.UserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

    });
  }







  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
