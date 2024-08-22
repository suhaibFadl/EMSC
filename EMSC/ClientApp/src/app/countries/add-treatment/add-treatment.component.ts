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
  selector: 'app-add-treatment',
  templateUrl: './add-treatment.component.html',
  styleUrls: ['./add-treatment.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddTreatmentComponent implements OnInit {

  public formControl!: FormGroup;

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
    private formBuilder: FormBuilder

  ) { }
  Reply!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<PTransOutside>;
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth','ninth', 'add', 'close'];



  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  //add treatment
  AddForm!: FormGroup;
  Medical_Diagnosis!: FormControl;
  Date_Diagnosis!: FormControl;
  Attach!: FormControl;
  pId!: FormControl;
  trId!: FormControl;
  HospitalCountryId!: FormControl;

  //close medical file
  CloseForm!: FormGroup;
  PID!: FormControl;
  TRID!: FormControl;
  FileStatus!: FormControl;
  Notes!: FormControl;
  ClosingDate!: FormControl;


  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  selection: any;

  selectedreply!: Reply;
  UserId!: string;
  BranchId!: string;
  UserRole!: string;
  UserDate!: string;
  //travel!: number;
  id!: number;



  UserCountryId!: string;
  CountryName!: string;

  // add Modal
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;

  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('closeFileTemplate') closeFilemodal!: TemplateRef<any>;



  values = [
  { value: 1, title: 'انتهاء العلاج بالكامل' },
  { value: 2, title: 'انتهاء العلاج مع وجود مراجعة (عودة أخرى)' },
  { value: 3, title: 'انتهاء العلاج بالساحة مع ضرورة نقله لساحة علاج أخرى' },
  { value: 4, title: 'إغلاق الملف وترحيل الجريح' }
  ];
  status: number = 4;





  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  Replies$!: Observable<Reply[]>;
  Replies: Reply[] = [];


  HospitalCountry$!: Observable<HospitalsCountries[]>;
  HospitalCountry: HospitalsCountries[] = [];



  LoginStatus$!: Observable<boolean>;



  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;

  @Output() public onUploadFinished = new EventEmitter();




  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      letterDate: '',
      userDate: '',
      phoneNumber: '',
    })

    this.pId = new FormControl('', [Validators.required]);
    this.trId = new FormControl('', [Validators.required]);
    this.Medical_Diagnosis = new FormControl('', [Validators.required]);
    this.Date_Diagnosis = new FormControl('', [Validators.required]);
    this.HospitalCountryId = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();

    this.AddForm = this.fb.group({
      'PatientId': this.pId,
      'TRId': this.trId,
      'Medical_Diagnosis': this.Medical_Diagnosis,
      'Date_Diagnosis': this.Date_Diagnosis,
      'HospitalCountryId': this.HospitalCountryId,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });


    //close medical file
    this.PID = new FormControl('', [Validators.required]);
    this.TRID = new FormControl('', [Validators.required]);
    this.FileStatus = new FormControl('', [Validators.required]);
    this.Notes = new FormControl('', [Validators.required]);
    this.ClosingDate = new FormControl('', [Validators.required]);

    this.CloseForm = this.fb.group({
      'PatientId': this.PID,
      'TRID': this.TRID,
      'FileStatus': this.FileStatus,
      'Notes': this.Notes,
      'ClosingDate': this.ClosingDate,
      'UserId': this.UserId,
    });

    this.fileText = "إرفاق ملف pdf";

    this.GetPatientTransactionToTreatmentByCountryId();
    this.GetBranches();
    this.GetCountries();
    this.GetHospitalsCountry();
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  //=====================Get Replies Accepted======================

  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });
  }
  GetHospitalsCountry() {
    this.hos.clearCache();
    this.hos.GetHospitalsByCountryId(this.UserCountryId.toString()).subscribe(result => {
      this.HospitalCountry = result;
    });
  }
  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetPatientTransactionToTreatmentByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionToTreatmentByCountryId(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && e && f && g && h && d;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
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
    this.fileName = 'Treat_'+ this.trId.value + '_' + Date.now().toString() + '.pdf';
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

  onAddTreatment(newtratment: PTransOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.pId.setValue(newtratment.patientId);
    this.trId.setValue(newtratment.id);
    this.modalRef = this.modalService.show(this.modal);
  }


  //on submit 
  AddTreatment() {
    this.AddForm.setValue({
      'PatientId': this.pId.value,
      'TRId': this.trId.value,
      'Medical_Diagnosis': this.Medical_Diagnosis.value,
      'Date_Diagnosis': this.Date_Diagnosis.value,
      'HospitalCountryId': this.HospitalCountryId.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });
    let newtratment = this.AddForm.value;

    this.tr.AddTreatmentMovement(newtratment).subscribe(
      result => {
        this.tr.clearCache();
        this.GetPatientTransactionToTreatmentByCountryId();
        this.fileName = "";
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

      },
      error => this.modalMessage = "لم تتم عملية الإضافة "
    )

    this.modalRef.hide();
    this.AddForm.reset();
  }



  onCloseMedicalFile(newtratment: PTransOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.PID.setValue(newtratment.patientId);
    this.TRID.setValue(newtratment.id);
    this.modalRef = this.modalService.show(this.closeFilemodal);
  }


  CloseFile() {
    this.CloseForm.setValue({
      'PatientId': this.PID.value,
      'TRID': this.TRID.value,
      'FileStatus': this.FileStatus.value,
      'Notes': this.Notes.value,
      'ClosingDate': this.ClosingDate.value,
      'UserId': this.UserId,
    });

    let closefile = this.CloseForm.value;
    this.tr.CloseMedicalFile(closefile).subscribe(
      result => {
        this.tr.clearCache();
        this.pa.clearCache();
        this.GetPatientTransactionToTreatmentByCountryId();
      },
      error => this.modalMessage = "لم تتم العملية بنجاح"
    )
    this.modalRef.hide();

    this.CloseForm.reset();
  }



  ViewlMedicalModal(p: PTransOutside) {
    this.modalMessage = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDate'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }

}







