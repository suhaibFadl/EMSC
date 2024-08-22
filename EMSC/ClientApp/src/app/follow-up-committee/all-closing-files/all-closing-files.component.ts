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
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { Branch } from '../../interfaces/branch';
import { FollowUpCommitteeService } from '../../services/follow-up-committee.service';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { HotelMovement } from '../../interfaces/hotel-movement';
import { Treatment } from '../../interfaces/treatment';
import * as moment from 'moment';

interface FileStatues {
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
@Component({
  selector: 'app-all-closing-files',
  templateUrl: './all-closing-files.component.html',
  styleUrls: ['./all-closing-files.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AllClosingFilesComponent implements OnInit {

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
    private formBuilder: FormBuilder) { }

  statues: FileStatues[] = [
    { name: 'انتهاء العلاج بالكامل', id: 1 },
    { name: 'وجود مراجعة أخرى لاستكمال العلاج', id: 2 },
    { name: 'انتهاء العلاج بالساحة و ضرورة نقله لساحة أخرى', id: 3 },
    { name: 'ترحيل الجريح بسبب مشاكل قام بها', id: 4 },
  ];
  LoginStatus$!: Observable<boolean>;


  TransOutside!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<Treatment>;

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
  countries$!: Observable<Country[]>;

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;


  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh','eighth','ninth','ten'];

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
      countryId: '',
      closingDate: '',
      phoneNumber: '',
      fileStatus: '',

    })

    this.GetAllBranches();
    this.GetAllCountriesFilter();
    this.GetAllClosingFiles();
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


  GetAllClosingFiles() {
    this.fcs.clearCache();
    this.fcs.GetAllClosingFiles().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.countryId || data.countryId.toString().toLowerCase().includes(filter.countryId);
        const f = !filter.closingDate || moment(data.closingDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.closingDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.fileStatus || data.fileStatus.toString().toLowerCase().includes(filter.fileStatus);

        return a && b && c && d && e && f  && h && i;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

    });

  }


  ViewlMedicalModal(pat: Treatment) {
    this.modalMessage = pat.medical_Diagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }

  resetBranchesFilter() {

    this.formControl.controls['branchName'].setValue(null);

  }
  resetCountriesFilter() {

    this.formControl.controls['countryId'].setValue(null);

  }

  resetclosingDate() {

    this.formControl.controls['closingDate'].setValue(null);

  }
  resetFileStatus() { this.formControl.controls['fileStatus'].setValue(null); }



}
