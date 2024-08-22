import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { BranchService } from '../../services/branch.service';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { Branch } from '../../interfaces/branch';
import { FollowUpCommitteeService } from '../../services/follow-up-committee.service';
import { Reply } from '../../interfaces/reply';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PatientData } from '../../interfaces/patient-data';
import { PatientsService } from '../../services/patients.service';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { Dependency } from '../../interfaces/dependency';
import { InjuryEvents } from '../../interfaces/injury-events';
import { DependencyService } from '../../services/dependency.service';
import { InjuryEventsService } from '../../services/injury-events.service';
const moment = _rollupMoment || _moment;

interface ReplyStatues {
  name: string;
  id: number;
}
interface PersonType {
  name: string;
  id: number;
}

interface PatType {
  name: string;
  id: number;
}


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
  selector: 'app-replies-main-branch-and-countries',
  templateUrl: './replies-main-branch-and-countries.component.html',
  styleUrls: ['./replies-main-branch-and-countries.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RepliesMainBranchAndCountriesComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private fcs: FollowUpCommitteeService,
    private coun: CountryService,
    private br: BranchService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private PMDS: PatientsMainDataService,
    private dep: DependencyService,
    private ev: InjuryEventsService,

    private formBuilder: FormBuilder) {
    this.datepipe = new DatePipe('en');
  }

  patTypes: PatType[] = [
    { name: 'حالة إنسانية', id: 1 },
    { name: 'جريح حرب', id: 2 },
  ];

  statues: ReplyStatues[] = [
    { name: 'قيد الإجراء', id: 2 },
    { name: 'تم القبول', id: 3 },
    { name: 'تم الرفض من قِبل الإدارة', id: 1 },
    { name: 'تم الرفض من قِبل الساحة', id: 4 },
    { name: 'قائمة الانتظار', id: 6 },
    { name: 'تم إغلاق الملف', id: 5 },
  ];

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];

  dependency: Dependency[] = [];
  dependency$!: Observable<Dependency[]>;


  injuryEvents: InjuryEvents[] = [];
  injuryEvents$!: Observable<InjuryEvents[]>;

  LoginStatus$!: Observable<boolean>;


  TransOutside!: Observable<PatientData[]>;
  dataSource!: MatTableDataSource<PatientData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;
  @ViewChild('viewTemplate') viewmodal!: TemplateRef<any>;
  @ViewChild('picker1', { read: MatInput }) picker1!: MatInput;
  @ViewChild('picker', { read: MatInput }) picker!: MatInput;


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;

  UserId!: string;
  UserRole!: string;
  UserDate!: string;

  selection: any;

  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;


  countries: Country[] = [];
  countriesFilter: Country[] = [];
  countries$!: Observable<Country[]>;

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;


  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh','details'];


  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      branchName: '',
      dependencyType: '',
      event: '',
      userDate: '',
      phoneNumber: '',
      personType: '',
      patType: '',

    })


    this.GetAllBranches();
    this.GetAllCountriesFilter();
    this.GetAllPatientsMainData();
    this.GetAllDependencies();
    this.GetAllInjuryEvents();
  }

  GetAllCountriesFilter() {
    this.coun.clearCache();
    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countries = result;
    });
  }
  GetAllBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetAllDependencies() {
    this.dependency$ = this.dep.GetDependencies();
    this.dependency$.subscribe((result: any) => {
      this.dependency = result;
    });
  }

  GetAllInjuryEvents() {
    this.injuryEvents$ = this.ev.GetInjuryEvents();
    this.injuryEvents$.subscribe(result => {
      this.injuryEvents = result;
    });
  }

  GetAllPatientsMainData() {
    this.PMDS.clearCache();
    this.PMDS.GetAllPatientsMainData().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.dependencyType || data.dependencyType.toLowerCase().includes(filter.dependencyType);
        const f = !filter.event || data.event.toLowerCase().includes(filter.event);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const j = !filter.personType || data.personType.toString().toLowerCase().includes(filter.personType);
        const i = !filter.patType || data.patType.toString().toLowerCase().includes(filter.patType);

        return a && b && c && d && e && f && g && h && j && i;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }

  //GetAllPatTransactionsOutside() {
  //  this.fcs.clearCache();
  //  this.fcs.GetAllPatTransactionsOutside().subscribe(data => {
  //    this.dataSource = new MatTableDataSource(data);
  //    this.dataSource.paginator = this.paginator;

  //    this.dataSource.filterPredicate = ((data, filter) => {
  //      const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
  //      const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
  //        || data.passportNo.toUpperCase().includes(filter.passportNo);
  //      const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
  //      const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
  //      const e = !filter.countryId || data.countryId.toString().toLowerCase().includes(filter.countryId);
  //      const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
  //      const g = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
  //      const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
  //      const i = !filter.replyState || data.replyState.toString().toLowerCase().includes(filter.replyState);
  //      const j = !filter.personType || data.personType.toString().toLowerCase().includes(filter.personType);

  //      return a && b && c && d && e && f && g && h && i && j;
  //    }) as (PeriodicElement, string) => boolean;


  //    this.formControl.valueChanges.subscribe(value => {
  //      const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
  //      this.dataSource.filter = filter;
  //    });



  //  });

  //}


  ViewlMedicalModal(p: PTransOutside) {
    this.modalMessage = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }

  ViewlModal(pat: Reply) {

    this.modalMessage2 = "عرض سبب الرفض"
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }

  ViewlModal2(pat: Reply) {

    this.modalMessage2 = "عرض سبب الانتظار"
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }



  ViewlModal3(pat: Reply) {

    this.modalMessage2 = "عرض الملاحظات"
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }


  //patiant details
  onSelect(patiant: PatientData): void {
   // this.selectedPatient = patiant;
    this.router.navigateByUrl('/branches/p-details/' + patiant.id);
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null);}
  resetCountriesFilter() { this.formControl.controls['countryId'].setValue(null);}
  resetLetterDate() {this.formControl.controls['letterDate'].setValue(null);}
  resetUserDate() { this.formControl.controls['replyDate'].setValue(null);}
  resetReplyState() {this.formControl.controls['replyState'].setValue(null);}
  resetPersonType() { this.formControl.controls['personType'].setValue(null); }

  resetDependenciesFilter() { this.formControl.controls['dependencyType'].setValue(null); }
  resetInjuryEventsDate() { this.formControl.controls['event'].setValue(null); }
  resetPatType() { this.formControl.controls['patType'].setValue(null); }

}
