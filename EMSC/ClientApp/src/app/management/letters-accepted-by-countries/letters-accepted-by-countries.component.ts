import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { ReplyService } from '../../services/reply.service';
import { TravelingService } from '../../services/traveling.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { Reply } from '../../interfaces/reply';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { AppComponent } from '../../app.component';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


const moment = _rollupMoment || _moment;

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
  selector: 'app-letters-accepted-by-countries',
  templateUrl: './letters-accepted-by-countries.component.html',
  styleUrls: ['./letters-accepted-by-countries.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LettersAcceptedByCountriesComponent implements OnInit {


  Reply!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth','ninth', 'add'];



  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  AddForm!: FormGroup;
  PID!: FormControl;
  TRId!: FormControl;
  FlightNom!: FormControl;
  FlightDate!: FormControl;
  AirlineName!: FormControl;
  Attach!: FormControl;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  selection: any;

  selectedreply!: Reply;
  UserId!: string;
  BranchId!: string;
  CountryName!: string;
  BranchName!: string;
  CountryUserId!: string;
  UserRole!: string;
  UserDate!: string;
  id!: number;

  // add Modal
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private tr: TravelingService,
    private br: BranchService,
    private coun: CountryService,
    private http: HttpClient,
    private app: AppComponent,
    private formBuilder: FormBuilder

  ) { }



  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  countries: Country[] = [];
  countries$!: Observable<Country[]>;


  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;

  @Output() public onUploadFinished = new EventEmitter();

  LoginStatus$!: Observable<boolean>;



  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;


    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.acct.currentUserBranchName.subscribe(result => { this.BranchName = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CountryUserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      replyDate: '',
      userDate: '',
      phoneNumber: '',
    })

    this.PID = new FormControl('', [Validators.required]);
    this.TRId = new FormControl('', [Validators.required]);
    this.FlightNom = new FormControl('', [Validators.required]);
    this.FlightDate = new FormControl('', [Validators.required]);
    this.AirlineName = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();

    this.AddForm = this.fb.group({
      'PatientId': this.PID,
      'TRId': this.TRId,
      'FlightNom': this.FlightNom,
      'FlightDate': this.FlightDate,
      'AirlineName': this.AirlineName,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });


    this.fileText = "إرفاق ملف pdf";


    if (this.UserRole == "مشرف إداري") {
      this.GetPatientTransactionToTravelByCountryId()
    }
    else if (this.UserRole== "مسؤول التسفير") {
      this.GetRepliesAcceptedByCountryforBranch();

    } else if (this.UserRole == "موظف إدخال الفرع" || this.UserRole == "مدير الفرع") {
      this.GetPatientTransactionToTravelByBranchId();

    }
    this.GetBranches();
    this.GetCountries();
  }

  //=====================Get Replies Accepted======================

  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countries = result;
    });
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  lengthData!: number;

  GetRepliesAcceptedByCountryforBranch() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionAcceptedByCountryToTravel().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
    });
  }

  GetPatientTransactionToTravelByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionToTravelByCountryId(this.CountryUserId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
    });
  }

  GetPatientTransactionToTravelByBranchId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionToTravelByBranchId(this.BranchId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
    });
  }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = <File>files[0];
    this.fileText = this.fileToUpload.name;
    this.fileText = "تم الرفع";
    const formData = new FormData();
    this.fileName = "Tr_"+this.PID.value + '_' + this.TRId.value + '_' + Date.now().toString() + '.pdf';
    formData.append('file', this.fileToUpload, this.fileName);

    this.http.post('/api/Upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const total: number = event.total;

            this.progress = Math.round(100 * event.loaded / total);
          }
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'تم الرفع';
          this.onUploadFinished.emit(event.body);
        }
      });
  }


  onAddTravel(items: PTransOutside): void {

    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.PID.setValue(items.patientId);
    this.TRId.setValue(items.id);

    this.modalRef = this.modalService.show(this.modal);

  }




  //on submit reply
  AddTravel() {

    this.AddForm.setValue({
      'PatientId': this.PID.value,
      'TRId': this.TRId.value,
      'FlightNom': this.FlightNom.value,
      'FlightDate': this.FlightDate.value,
      'AirlineName': this.AirlineName.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newtravel = this.AddForm.value;

    this.tr.AddTravelingProcedure(newtravel).subscribe(
      result => {

        this.tr.clearCache();
        if (this.UserRole == "مشرف إداري") {
          this.GetPatientTransactionToTravelByCountryId()
        }
        else if (this.UserRole == "مسؤول التسفير") {
          this.GetRepliesAcceptedByCountryforBranch();

        } else if (this.UserRole == "موظف إدخال الفرع" || this.UserRole == "مدير الفرع") {
          this.GetPatientTransactionToTravelByBranchId();

        }
        this.fileName = "";
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
        this.app.showToasterSuccess()
      },
      error => this.modalMessage = "لم تتم عملية الإضافة "
    )

    this.modalRef.hide();
    this.AddForm.reset();
  }


  resetBranchesFilter() {

    this.formControl.controls['branchName'].setValue(null);

  }
  resetCountriesFilter() {

    this.formControl.controls['country'].setValue(null);

  }

  resetreplyDate() {

    this.formControl.controls['replyDate'].setValue(null);

  }

  resetUserDate() {

    this.formControl.controls['userDate'].setValue(null);

  }

}
