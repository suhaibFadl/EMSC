import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { PatientTrans } from '../../interfaces/patient-trans';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { TreatmentService } from '../../services/treatment.service';
import { Treatment } from '../../interfaces/treatment';
import { HospitalCountryService } from '../../services/hospital-country.service';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { HospitalsCountries } from '../../interfaces/hospitals-countries';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';

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

interface FileStatues {
  name: string;
  id: number;
}

@Component({
  selector: 'app-files-patients',
  templateUrl: './files-patients.component.html',
  styleUrls: ['./files-patients.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FilesPatientsComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private acct: AccountService,
    private br: BranchService,
    private co: CountryService,
    private hos: HospitalCountryService,
    private tr: TreatmentService,
    private formBuilder: FormBuilder

  ) { }

  statues: FileStatues[] = [
    { name: 'انتهاء العلاج بالكامل',id:1 },
    { name: 'وجود مراجعة أخرى لاستكمال العلاج', id: 2 },
    { name: 'انتهاء العلاج بالساحة و ضرورة نقله لساحة أخرى', id: 3 },
    { name: 'ترحيل الجريح بسبب مشاكل قام بها', id: 4 },
  ];

  Treatment$!: Observable<Treatment[]>;
  Treatment: Treatment[] = [];

  LoginStatus$!: Observable<boolean>;

  dataSource!: MatTableDataSource<Treatment>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth','fifth','sixth','details'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth','seventh', 'details'];

  selection: any;


  UserId!: string;
  UserDate!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;

  UserCountryId!: string;
  RoleId!: string;
  CountryName!: string;
  changeid!: number;
  UserRole!: string;
  BranchUserId!: string;


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;


  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches$!: Observable<Branch[]>;
  branches: Branch[] = [];

  HospitalCountry$!: Observable<HospitalsCountries[]>;
  HospitalCountry: HospitalsCountries[] = [];

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.acct.currentUserRoleId.subscribe(result => { this.RoleId = result });

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      userDate: '',
      phoneNumber: '',
      fileStatus: '',
    })

    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });

    this.co.GetCountries().subscribe(result => {
      this.countries = result;
    });

    switch (this.UserRole) {
      case "مشرف طبي": this.GetPatientTransactionTreatmentByCountryId();
        break;
      case "مشرف إداري": this.GetPatientTransactionTreatmentByCountryId();
        break;
      case "الإدارة": this.GetAllTreatmentsProceduresManagement();
        break;
      case "موظف إدخال الفرع": this.GetPatientTransactionTreatmentByBranchId();
        break;
      case "مدير الفرع": this.GetPatientTransactionTreatmentByBranchId();
        break;
      case "لجنة الحصر": this.GetPatientTransactionTreatmentByCountryId();
        break;
    }

    this.GetHospitalsCountry();
   

  }


  GetPatientTransactionTreatmentByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByCountryId(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.fileStatus || data.fileStatus.toString().toLowerCase().includes(filter.fileStatus);

        return a && b && c && d && e  && g && h && i;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });


    });
  }


  GetPatientTransactionTreatmentByRoleId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByRoleId(this.RoleId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.fileStatus || data.fileStatus.toLowerCase().includes(filter.fileStatus);

        return a && b && c && d && e && g && h && i;
      }) as (PeriodicElement, string) => boolean;



      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

    });
  }


  GetPatientTransactionTreatmentByBranchId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        const i = !filter.fileStatus || data.fileStatus.toLowerCase().includes(filter.fileStatus);

        return a && b && c && d && e && g && h && i;
      }) as (PeriodicElement, string) => boolean;



      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }

  GetAllTreatmentsProceduresManagement() {
    this.tr.clearCache();
    this.tr.GetAllTreatmentsProceduresManagement().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.fileStatus || data.fileStatus.toLowerCase().includes(filter.fileStatus);

        return a && b && c && d && e && g && h && i;
      }) as (PeriodicElement, string) => boolean;



      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

    });
  }


  GetHospitalsCountry() {
    this.hos.clearCache();
    this.hos.GetHospitalsByCountryId(this.UserCountryId.toString()).subscribe(result => {
      this.HospitalCountry = result;
    });
  }


  onSelect(p: Treatment): void {
    this.router.navigateByUrl('/countries/treatment-movement/' + p.id);
  }


  ViewlMedicalModal(pat: Treatment) {
    this.modalMessage = pat.medical_Diagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }




  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetFileStatus() { this.formControl.controls['fileStatus'].setValue(null); }



}
