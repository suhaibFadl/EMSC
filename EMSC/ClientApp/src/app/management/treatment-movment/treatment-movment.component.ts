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
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';


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
  selector: 'app-treatment-movment',
  templateUrl: './treatment-movment.component.html',
  styleUrls: ['./treatment-movment.component.css']
})
export class TreatmentMovmentComponent implements OnInit {

  LoginStatus$!: Observable<boolean>;

  dataSource!: MatTableDataSource<Treatment>;

  selection: any;


  PatientId = null;
  StateId = null;

  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'third1', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth','ninth','ten'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third','third1','fourth','fifth', 'seventh', 'eighth','nineth','ten'];

  countries$!: Observable<Country[]>;
  countries: Country[] = [];


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  UserId!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;
  UserDate!: string;
  UserCountryId!: string;
  CountryName!: string;

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
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;


  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private br: BranchService,
    private re: ReplyService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private tr: TreatmentService,
  ) { }



  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];


  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
   
      this.GetAllTreatmentsProceduresManagement();

    this.GetCountries();
    this.GetBranches();
  }

 
  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }


  GetAllTreatmentsProceduresManagement() {
    this.tr.clearCache();
    this.tr.GetAllTreatmentsProceduresManagement().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

    });
  }



  GetPatientTransactionTreatmentByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByCountryId(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  ViewlMedicalModal(pat: Treatment) {
    this.modalMessage = pat.medical_Diagnosis;

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

    this.GetAllTreatmentsProceduresManagement();
  }

}
