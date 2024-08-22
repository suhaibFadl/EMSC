import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
import { HospitalService } from '../../services/hospital.service';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { DependencyService } from '../../services/dependency.service';
import { InjuryEventsService } from '../../services/injury-events.service';
import { PatientData } from '../../interfaces/patient-data';
import { Dependency } from '../../interfaces/dependency';
import { InjuryEvents } from '../../interfaces/injury-events';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { HotelOutsideService } from '../../services/hotel-outside.service';
import { HotelOutside } from '../../interfaces/hotel-outside';
import { AppComponent } from '../../app.component';
import { map, startWith } from 'rxjs/operators';

interface PersonType {
  name: string;
  id: number;
}



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
  selector: 'app-append-p-main-data',
  templateUrl: './append-p-main-data.component.html',
  styleUrls: ['./append-p-main-data.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AppendPMainDataComponent implements OnInit {
  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsService,
    private paout: PatientsLettersOutsideService,
    private pain: PatientsLettersInsideService,
    private PMDS: PatientsMainDataService,
    private http: HttpClient,
  //  private ho: BranchService,
    private dep: DependencyService,
    private ev: InjuryEventsService,
    private br: BranchService,
    private coun: CountryService,
    private hoOut: HotelOutsideService,
    private app: AppComponent,
    private formBuilder: FormBuilder 

  ) { }
  // Modals
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('checkedTemplate') checkedmodal!: TemplateRef<any>;
  @ViewChild('AddTransactionModalTemplate') AddTransactionModal!: TemplateRef<any>;
  @ViewChild('CheckReplyStateModalTemplate') CheckReplyStateModal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];


  clickedRows = new Set<PatientData>();
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth','ninth', 'edit2', 'delete2', 'add'];
  //displayedColumns3: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'edit2', 'delete2', 'add'];


  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<PatientData>;
  //==========================================================

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  Hotels$!: Observable<HotelOutside[]>;
  Hotels: HotelOutside[] = [];

  checkPatientIdOut: PTransOutside[] = [];
  checkPatientIdOut$!: Observable<PTransOutside[]>;

  checkReplyStateOut: PTransOutside[] = [];
  checkReplySteteOut$!: Observable<PTransOutside[]>;

  checkPatientIdIn: PTransInside[] = [];
  checkPatientIdIn$!: Observable<PTransInside[]>;

  checkReplyStateIn: PTransInside[] = [];
  checkReplySteteIn$!: Observable<PTransInside[]>;

  dependency: Dependency[] = [];
  dependency$!: Observable<Dependency[]>;


  injuryEvents: InjuryEvents[] = [];
  injuryEvents$!: Observable<InjuryEvents[]>;

  pData: PatientData[] = [];
  pData$!: Observable<PatientData[]>;


  pAttenData: PatientData[] = [];
  pAttenData$!: Observable<PatientData[]>;

  filteredNames!: Observable<PatientData[]>;
  filteredPassports!: Observable<PatientData[]>;
  filteredNational!: Observable<PatientData[]>;

  variables: any[] = [];;
  public filteredList4;



  //==========================================================

  values = [{ value: 1, title: 'حالة إنسانية' },
  { value: 2, title: 'جريح حرب' }];
  favoriteSeason: number = 2;


  values2 = [{ value: 1, title: 'جريح' },
  { value: 2, title: 'مرافق' }];
  countValues: number = 2;


  inputType = 'number';

  fileToUpload!: File;
  fileText!: string;
  fileText2!: string;
  fileName = '';
  entryfileName = '';

  selection: any;

  UserId!: string;
  UserRole!: string;
  id!: number;
  CountryUserId!: string;
  UserDate!: string;

  checkPIDInside!: number;
  checkPIDOutside!: number;

  checkReplySteteInside!: number;
  checkReplySteteOutside!: number;


  //=============================إضافة بيانات الجريح الرئيسية
  addForm!: FormGroup;
  PersonType!: FormControl;
  PatientName!: FormControl;
  PassportNo!: FormControl;
  NationalNo!: FormControl;
  BranchId!: FormControl;
  PatType !: FormControl;
  DepenId !: FormControl;
  EventId !: FormControl;

  //=============================تعديل بيانات الجريح الرئيسية
  updateForm!: FormGroup;
  _id!: FormControl;
  _PatientName!: FormControl;
  _PassportNo!: FormControl;
  _NationalNo!: FormControl;
  _BranchId!: FormControl;
  _PatType!: FormControl;
  _DepenId!: FormControl;
  _EventId!: FormControl;
  _PersonType!: FormControl;

  //=============================حذف بيانات الجريح
  deleteForm!: FormGroup;
  Did!: FormControl;
  //=============================التحقق من وجود رسائل إحالة للجريح من قبل أم لا
  checkPIDForm!: FormGroup;
  PIDAdd!: FormControl;
  //=============================إضافة رسالة ضم للجريح
  AddtraForm!: FormGroup;
  PID!: FormControl;
  LetterDate!: FormControl;
  LetterDest!: FormControl;
  Attach!: FormControl;
  LetterIndexNO!: FormControl;
  MedicalDiagnosis!: FormControl;
  EntryDate!: FormControl;
  EntryAttach!: FormControl;
  CountryId!: FormControl;
  HotelId!: FormControl;
  Select!: FormControl;

  //=============================


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  modalMessage3!: string;
  modalMessage4!: string;



  @Input() patien!: PatientData;

  public progress!: number;
  public progress2!: number;
  public message!: string;
  public message2!: string;
  @Output() public onUploadFinished = new EventEmitter();

  displayFn(user: PatientData): string {
    return user && user.patientName ? user.patientName : '';
  }

  displayPass(user: PatientData): string {
    return user && user.passportNo ? user.passportNo : '';
  }

  displayNational(user: PatientData): string {
    return user && user.nationalNo ? user.nationalNo : '';
  }

  private _filter(name: string): PatientData[] {
    const filterValue = name.toLowerCase();

    return this.pAttenData.filter(option => option.patientName.toLowerCase().includes(filterValue));
  }

  private _filterPass(name: string): PatientData[] {
    const filterValue = name.toLowerCase();

    return this.pAttenData.filter(option => option.passportNo.toLowerCase().includes(filterValue));
  }

  private _filterNational(name: string): PatientData[] {
    const filterValue = name.toLowerCase();

    return this.pAttenData.filter(option => option.nationalNo.toLowerCase().includes(filterValue));
  }


  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CountryUserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      branchName: '',
      dependencyType: '',
      event: '',
      userDate: '',
      phoneNumber: '',
    })

   // this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });

    //=======================initial add P-Main data form
    this.PatientName = new FormControl('', [Validators.minLength(15)]);
    this.PassportNo = new FormControl('', [Validators.pattern('[A-Z0-9]*'), Validators.minLength(6), Validators.maxLength(10)]);
    this.NationalNo = new FormControl('', [Validators.pattern('[0-9]*'), Validators.minLength(12), Validators.maxLength(12)]);

    this.BranchId = new FormControl('');
    this.PatType = new FormControl('');
    this.DepenId = new FormControl('');
    this.EventId = new FormControl('');
    this.PersonType = new FormControl('');

    this.addForm = this.fb.group({
      'PatientName': this.PatientName,
      'PassportNo': this.PassportNo,
      'NationalNo': this.NationalNo,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'BranchId': this.BranchId,
      'PatType': this.PatType,
      'DepenId': this.DepenId,
      'EventId': this.EventId,
      'PersonType': this.PersonType,
    });

    //initial delete P-Main data form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.PIDAdd = new FormControl();
    this.checkPIDForm = this.fb.group(
      {
        'PatientId': this.PIDAdd,
      });

    //=======================initial update P-Main data form
    this._id = new FormControl('', [Validators.required]);
    this._PatientName = new FormControl('', [Validators.required, Validators.minLength(15)]);
    this._PassportNo = new FormControl('', [Validators.required, Validators.pattern('[A-Z0-9]*'), Validators.minLength(6), Validators.maxLength(10)]);
    this._NationalNo = new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
    this._BranchId = new FormControl('', [Validators.required]);
    this._PatType = new FormControl('', [Validators.required]);
    this._DepenId = new FormControl('', [Validators.required]);
    this._EventId = new FormControl('', [Validators.required]);
    this._PersonType = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({
      'id': this._id,
      'PatientName': this._PatientName,
      'PassportNo': this._PassportNo,
      'NationalNo': this._NationalNo,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'BranchId': this._BranchId,
      'PatType': this._PatType,
      'DepenId': this._DepenId,
      'EventId': this._EventId,
      'PersonType': this._PersonType,
    });



    //=======================initial add Letter form 
    this.PID = new FormControl('', [Validators.required]);
    this.LetterDate = new FormControl(moment().format("dddd, MMMM Do YYY,"));
    this.Attach = new FormControl();
    this.LetterIndexNO = new FormControl('', [Validators.required]);
    this.LetterDest =  new FormControl('', [Validators.required]);
    this.MedicalDiagnosis = new FormControl('', [Validators.required]);
    this.EntryDate = new FormControl(moment().format("dddd, MMMM Do YYY,"));
    this.EntryAttach = new FormControl();
    this.CountryId = new FormControl();
    this.HotelId = new FormControl();
    this.Select = new FormControl();

    this.AddtraForm = this.fb.group({
      'PatientId': this.PID,
      'LetterDate': this.LetterDate,
      'Attach': this.Attach,
      'LetterDest': this.LetterDest,
      'LetterIndexNO': this.LetterIndexNO,
      'CountryId': this.CountryId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'MedicalDiagnosis': this.MedicalDiagnosis,
      'EntryDate': this.EntryDate,
      'EntryAttach': this.EntryAttach,
      'HotelId': this.HotelId,
      'Select': this.Select,
      'PatientName': this.PatientName,
      'PassportNo': this.PassportNo,
      'NationalNo': this.NationalNo,
      'DepenId': "",
      'EventId': "",
      'PatType': "",

    });

    this.filteredNames = this.PatientName.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.pAttenData.slice();
      }),
    );

    this.filteredPassports = this.PassportNo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPass(name as string) : this.pAttenData.slice();
      }),
    );

    this.filteredNational = this.NationalNo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterNational(name as string) : this.pAttenData.slice();
      }),
    );

    this.Select.setValue(1);
    this.PersonType.setValue(1);
    this.DepenId.setValue(null);
    this.EventId.setValue(null);
    this.countValues = 1;


    this.matcher = new MyErrorStateMatcher();


    this.fileText = "إرفاق ملف pdf";
    this.fileText2 = "إرفاق ملف pdf";

    switch (this.UserRole) {
      case "مشرف إداري": this.GetPMainDataByUserId();
        break;
      case "لجنة الحصر": this.GetAllPatientsMainData();
        break;
    }



    this.GetCountries();
    this.GetAllBranches();
    this.GetAllDependencies();
    this.GetAllInjuryEvents();
    this.GetHotelsByCountryId();

    this.GetAllAttendByUserId()
    this.GetAllPatByUserId()
  }

  GetHotelsByCountryId() {
    this.hoOut.clearCache();
    this.hoOut.GetHotelsOutsideByCountryId(this.CountryUserId).subscribe(result => {
      this.Hotels = result;
    });
  }


  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });
  }
  GetAllBranches() {
    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });
  }

  GetAllDependencies() {
    this.dependency$ = this.dep.GetDependencies();
    this.dependency$.subscribe(result => {
      this.dependency = result;
    });
  }

  GetAllInjuryEvents() {
    this.injuryEvents$ = this.ev.GetInjuryEvents();
    this.injuryEvents$.subscribe(result => {
      this.injuryEvents = result;
    });
  }

  GetPMainDataByUserId() {
    this.PMDS.clearCache();
    this.PMDS.GetPatientsMainDataByUserId(this.UserId).subscribe(data => {
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

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
     // this.dataSource.sort = this.sort;
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

        return a && b && c && d && e && f && g && h;
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
    const formData = new FormData();
    this.fileName = ""



    if (this.Attach.value == null) {

      this.fileName = 'PLOut_' + this.PID.value + '_' + Date.now().toString() + '.pdf';

      formData.append('file', this.fileToUpload, this.fileName);

      this.Attach.setValue(this.fileName)
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
            this.fileText = "تم الرفع";

            this.onUploadFinished.emit(event.body);
          }
        });

    }
    else {
      this.fileName = 'EntryAttch_' + this.PID.value + '_' + Date.now().toString() + '.pdf';

      formData.append('file', this.fileToUpload, this.fileName);

      this.EntryAttach.setValue(this.fileName)
      this.http.post('/api/Upload', formData, { reportProgress: true, observe: 'events' })
        .subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              const total: number = event.total;

              this.progress2 = Math.round(100 * event.loaded / total);
            }
          }
          else if (event.type === HttpEventType.Response) {
            this.message2 = 'تم الرفع';
            this.fileText2 = "تم الرفع";

            this.onUploadFinished.emit(event.body);
          }
        });

    }
  }


  //click on add patient
  onAddPatient(): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.modal);
  }


  //on click add P-data
  onSubmit() {

    //إضافة مرافق
    if (this.PersonType.value == 2) {
      this.addForm.setValue({
        'PatientName': this.PatientName.value,
        'PassportNo': this.PassportNo.value,
        'NationalNo': this.NationalNo.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
        'BranchId': this.BranchId.value,
        'PatType': 0,
        'DepenId': 99,
        'EventId': 12,
        'PersonType': this.PersonType.value,
      });
    }

    //إضافة جريح
    if (this.PersonType.value == 1) {

      if (this.UserRole == "مشرف إداري")
      {
        this.addForm.setValue({
          'PatientName': this.PatientName.value,
          'PassportNo': this.PassportNo.value,
          'NationalNo': this.NationalNo.value,
          'UserId': this.UserId,
          'UserDate': this.UserDate,
          'BranchId': this.BranchId.value,
          'PatType': this.PatType.value,
          'DepenId': this.DepenId.value,
          'EventId': this.EventId.value,
          'PersonType': this.PersonType.value,
        });
      }
      else (this.UserRole == "لجنة الحصر")
      {
        this.addForm.setValue({
          'PatientName': this.PatientName.value,
          'PassportNo': this.PassportNo.value,
          'NationalNo': this.NationalNo.value,
          'UserId': this.UserId,
          'UserDate': this.UserDate,
          'BranchId': this.BranchId.value,
          'PatType': 2,
          'DepenId': 72,
          'EventId': 1,
          'PersonType': this.PersonType.value,
        });
      } 
     
    }
    if (this.PersonType.value == 1 && (this.PatientName.value == "" ||
      this.PassportNo.value == "" || this.NationalNo.value == "" ||
      this.DepenId.value == null || this.PatType.value == null || this.EventId.value == null)) {
      this.app.FillAllFieldsPlease()
    }

    else if (this.PersonType.value == 2 && (this.PatientName.value == "" || this.PassportNo.value == "" || this.NationalNo.value == "")) {
      this.app.FillAllFieldsPlease()
    }

    else if (this.PatientName.value != "" ||
      this.PassportNo.value != "" || this.NationalNo.value != "" ||
      this.DepenId.value != null || this.PatType.value != null || this.EventId.value != null) {

      let newpatients = this.addForm.value;
      this.PMDS.AddPatient(newpatients).subscribe(
        result => {
          this.PMDS.clearCache();
          switch (this.UserRole) {
            case "مشرف إداري": this.GetPMainDataByUserId();
              break;
            case "لجنة الحصر": this.GetAllPatientsMainData();
              break;
          }
          this.addForm.reset();
          this.modalRef.hide();
          this.PersonType.setValue(1);
          this.countValues = 1;
          this.PatientName.setValue("");
          this.PassportNo.setValue("");
          this.NationalNo.setValue("");
        },
        error => this.app.PatIsExist()
      )

    }
    //let newpatients = this.addForm.value;
    //this.PMDS.AddPatient(newpatients).subscribe(
    //  result => {
    //    this.PMDS.clearCache();
    //    switch (this.UserRole) {
    //      case "مشرف إداري": this.GetPMainDataByUserId();
    //        break;
    //      case "لجنة الحصر": this.GetAllPatientsMainData();
    //        break;
    //    }
    //    this.addForm.reset();
    //    this.modalRef.hide();
    //  },
    //  error => this.modalMessage = "تم إضافة هذا الجريح من قبل"
    //)
  }



  //Patients delete modal
  onDeleteModal(patiantdelete: PatientData) {
    this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    this.Did.setValue(patiantdelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }

  // click on delete
  onDelete(): void {
    let patiantdelete = this.deleteForm.value;
    this.PMDS.DeletePatientData(patiantdelete.id).subscribe(result => {
      this.PMDS.clearCache();
      switch (this.UserRole) {
        case "مشرف إداري": this.GetPMainDataByUserId();
          break;
        case "لجنة الحصر": this.GetAllPatientsMainData();
          break;
      }
      this.modalRef.hide();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.app.CannotDeletePat()
    )
  }

  //on click save new data
  //مودل تعديل البيانات الرئيسية
  onUpdateModal(editpatients: PatientData): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this._id.setValue(editpatients.id);
    this._PatientName.setValue(editpatients.patientName);
    this._PassportNo.setValue(editpatients.passportNo);
    this._NationalNo.setValue(editpatients.nationalNo);
    this._PatType.setValue(editpatients.patType);
    this._DepenId.setValue(editpatients.depenId);
    this._EventId.setValue(editpatients.eventId);
    this._PersonType.setValue(editpatients.personType);
    this._BranchId.setValue(editpatients.branchId);

    console.log("dsds"+editpatients.branchId)
    this.modalRef = this.modalService.show(this.editmodal);
  }

  // تعديل البيانات الرئيسية
  onUpdate() {

    if (this.UserRole == "مشرف إداري") {
      this.updateForm.setValue({
        'id': this._id.value,
        'PatientName': this._PatientName.value,
        'PassportNo': this._PassportNo.value,
        'NationalNo': this._NationalNo.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
        'BranchId': this._BranchId.value,
        'PatType': this._PatType.value,
        'DepenId': this._DepenId.value,
        'EventId': this._EventId.value,
        'PersonType': 0,

      });
    }
    else if (this.UserRole == "لجنة الحصر") {
      this.updateForm.setValue({
        'id': this._id.value,
        'PatientName': this._PatientName.value,
        'PassportNo': this._PassportNo.value,
        'NationalNo': this._NationalNo.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
        'BranchId': this._BranchId.value,
        'PatType': 2,
        'DepenId':72,
        'EventId': 1,
        'PersonType': 0,

      });
    }
  

    let editpatients = this.updateForm.value;

    this.PMDS.UpdateAppendPatientData(editpatients.id, editpatients).subscribe(
      result => {
        this.PMDS.clearCache();
        switch (this.UserRole) {
          case "مشرف إداري": this.GetPMainDataByUserId();
            break;
          case "لجنة الحصر": this.GetAllPatientsMainData();
            break;
        }        this.modalRef.hide();
        this.addForm.reset();
        this.modalMessage = "هل أنت متأكد من حفظ التغييرات ؟ ";
      },
      error => this.modalMessage = "تم إضافة بيانات هذا الجريح من قبل"
    )
  }

  onUpdate2() {

    this.updateForm.setValue({
      'id': this._id.value,
      'PatientName': this._PatientName.value,
      'PassportNo': this._PassportNo.value,
      'NationalNo': this._NationalNo.value,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'BranchId': this._BranchId.value,
      'PatType': 0,
      'DepenId': 99,
      'EventId': 12,
      'PersonType': 0,
    });

    let editpatients = this.updateForm.value;
    console.log(editpatients)

    this.PMDS.UpdateAppendPatientData(editpatients.id, editpatients).subscribe(
      result => {
        this.PMDS.clearCache();
        console.log(editpatients)
        switch (this.UserRole) {
          case "مشرف إداري": this.GetPMainDataByUserId();
            break;
          case "لجنة الحصر": this.GetAllPatientsMainData();
            break;
        }        this.modalRef.hide();
        this.addForm.reset();
        this.modalMessage = "هل أنت متأكد من حفظ التغييرات ؟ ";
      },
      error => this.modalMessage = "تم إضافة بيانات هذا الجريح من قبل"
    )
  }


  //onUpdate() {
  //  this.updateForm.setValue({
  //    'id': this._id.value,
  //    'PatientName': this._PatientName.value,
  //    'PassportNo': this._PassportNo.value,
  //    'NationalNo': this._NationalNo.value,
  //    'UserId': this.UserId,
  //    'UserDate': this.UserDate,
  //    'BranchId': this._BranchId.value,
  //    'PatType': this._PatType.value,
  //    'DepenId': this._DepenId.value,
  //    'EventId': this._EventId.value,
  //  });

  //  let editpatients = this.updateForm.value;
  //  this.PMDS.UpdateAppendPatientData(editpatients.id, editpatients).subscribe(
  //    result => {
  //      this.PMDS.clearCache();
  //      switch (this.UserRole) {
  //        case "مشرف إداري": this.GetPMainDataByUserId();
  //          break;
  //        case "لجنة الحصر": this.GetAllPatientsMainData();
  //          break;
  //      }        this.modalRef.hide();
  //      this.addForm.reset();
  //      this.modalMessage = "هل أنت متأكد من حفظ التغييرات ؟ ";
  //    },
  //    error => this.modalMessage = "تم إضافة بيانات هذا الجريح من قبل"
  //  )
  //}


  CheckPatientIdIfHaveTransctionInside() {
    this.pain.clearCache();
    this.pain.CheckPatientIdIfHaveTransInside(this.PID.value).subscribe(result => {
      this.checkPatientIdIn = result;
      this.checkPIDInside = this.checkPatientIdIn.length;
    });
  }

  CheckPatientIdIfHaveTransctionOutside() {
    this.paout.clearCache();
    this.paout.CheckPatientIdIfHaveTransOutside(this.PID.value).subscribe(result => {
      this.checkPatientIdOut = result;
      this.checkPIDOutside = this.checkPatientIdOut.length;
    });
  }

  personType!: number;
  Test(pid): void {

      this.paout.CheckReplyStateTransOutside(pid).subscribe(result => {
        this.checkReplyStateOut = result;
        this.checkReplySteteOutside = this.checkReplyStateOut.length;


        this.paout.GetPersonType(pid).subscribe((result: any) => {
          this.personType = result[0];
        });

        if (this.checkReplySteteOutside != 0) {
          this.modalMessage4 = "لا يمكن إضافة رسالة ضم جديدة في حالة الجريح لديه رسائل قيد الانتظار أو قيد الإجراء أو تم قبولها";
          this.modalRef = this.modalService.show(this.CheckReplyStateModal);
          this.modalRef.hide();
        }
        else {
          this.modalMessage3 = "هذا الجريح لا يوجد لديه رسائل ضم من قبل";
          this.modalRef = this.modalService.show(this.checkedmodal);
          this.modalRef.hide();
        }

      });
  }


  test(event: Event) {

    if ((event.target as HTMLInputElement).value == "") {
      this.PatientName.reset()
      this.PassportNo.reset()
      this.NationalNo.reset()
    }

    console.log((event.target as HTMLInputElement).value)
  }

  resetValues() {
    this.PatientName.reset()
    this.PassportNo.reset()
    this.NationalNo.reset()

    this.name = "undefined";
    this.passport = "undefined";
    this.national = "undefined";
  }

  name!: string;
  national!: string;
  passport!: string;


  GetDataByName(id) {
    this.resetValues()
    this.PMDS.clearCache();
    this.PMDS.GetDataByName(id).subscribe((data: any) => {
      this.pData = data
      this.name = data[0].patientName;
      this.national = data[0].nationalNo;
      this.passport = data[0].passportNo;


      if (this.name != undefined && this.passport != undefined && this.national != undefined) {
        this.PatientName.setValue(this.name);
        this.PassportNo.setValue(this.passport);
        this.NationalNo.setValue(this.national);
       // this.flag = 1;
      }
      else {
        this.PatientName.setValue(0)
        this.PassportNo.setValue(0)
        this.NationalNo.setValue(0)
      }

    });

  }


  GetDataByPassport(id) {

    this.resetValues()
    this.PMDS.clearCache();
    this.PMDS.GetDataByPassport(id).subscribe((data: any) => {
      this.pData = data
      this.name = data[0].patientName;
      this.national = data[0].nationalNo;
      this.passport = data[0].passportNo;


      if (this.name != undefined && this.passport != undefined && this.national != undefined) {
        this.PatientName.setValue(this.name);
        this.PassportNo.setValue(this.passport);
        this.NationalNo.setValue(this.national);
       // this.flag = 2;

      }
      else {
        this.PatientName.setValue(0)
        this.PassportNo.setValue(0)
        this.NationalNo.setValue(0)
      }
    });
  }


  GetDataByNational(id) {
    this.resetValues()

    this.PMDS.clearCache();
    this.PMDS.GetDataByNational(id).subscribe((data: any) => {
      this.pData = data

      this.name = data[0].patientName;
      this.passport = data[0].passportNo;
      this.national = data[0].nationalNo;


      if (this.name != undefined && this.passport != undefined && this.national != undefined) {
        this.PatientName.setValue(this.name);
        this.PassportNo.setValue(this.passport);
        this.NationalNo.setValue(this.national);
      //  this.flag = 3;

      }
      else {
        this.PatientName.setValue(0)
        this.PassportNo.setValue(0)
        this.NationalNo.setValue(0)
      }
    });
  }

      //عرض كافة المرافقين التابعين للفرع

  GetAllAttendByUserId() {
    this.PMDS.clearCache();
    this.PMDS.GetAllAttendByUserId(this.UserId.toString()).subscribe(data => {
      this.pAttenData = data
    });
  }

  //عرض كافة الجرحى التابعين للفرع والذين لديهم رسائل

  GetAllPatByUserId() {
    this.PMDS.clearCache();
    this.PMDS.GetAllPatByUserId(this.UserId.toString()).subscribe(data => {
      this.pData = data
      this.pData.map((obj: any) => this.variables.push(obj.patientName))
      this.filteredList4 = this.variables.slice();
    });
  }

  clickMe(item) {
    this.PatientName.setValue(item)
  }

  onSubmitAddTrans(p: PatientData) {
    this.PIDAdd.setValue(p.id);
    this.LetterDest.setValue(p.branchId);
    this.Test(this.PIDAdd.value);
  }


  //إلحاق رسالة ظم بواسطة المشرف الاداري بالساحات
  onAddtraModal(): void {
    this.PID.setValue(this.PIDAdd.value);
    this.LetterDest.setValue(this.LetterDest.value);

    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.AddTransactionModal);
    this.resetValues()

  }

    //إلحاق رسالة ظم بواسطة لجنة الحصر
  onAddtraModal2(p: PatientData): void {
    this.PID.setValue(p.id);
    this.LetterDest.setValue(p.branchId);

    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.AddTransactionModal);
   // this.resetValues()

  }

  trid!: number;


  onSubmittra() {

    if (this.UserRole == "لجنة الحصر") {
      this.AddtraForm.setValue({
        'PatientId': this.PID.value,
        'LetterDate': this.LetterDate.value,
        'Attach': this.Attach.value,
        'LetterDest': this.LetterDest.value,
        'LetterIndexNO': this.LetterIndexNO.value,
        'CountryId': this.CountryId.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
        'MedicalDiagnosis': this.MedicalDiagnosis.value,

        'EntryDate': this.EntryDate.value,
        'EntryAttach': this.EntryAttach.value,
        'HotelId': this.HotelId.value,

        'PatientName': "",
        'PassportNo': "",
        'NationalNo': "",
        'PatType': 0,
        'DepenId': 0,
        'EventId': 0,

        'Select': 2,

      });

      let newpatients = this.AddtraForm.value;
      this.paout.AddPatientTransByCommittees(newpatients).subscribe(
        result => {
          this.trid = result.id
          this.pa.clearCache();
          this.paout.AddTravelAndHotelByCommittees(this.trid, newpatients).subscribe(
            result => {
              this.pa.clearCache();
              this.AddtraForm.reset();
              this.modalRef.hide();
            })
        },
        error => this.modalMessage = "يرجى المحاولة لاحقا"

      )    
    }

    else if (this.UserRole == "مشرف إداري") {

      if (this.Select.value == 1 && (this.PatientName.value == null || this.PassportNo.value == null || this.NationalNo.value == null)) {
        this.app.FillAllFieldsPlease()
      }

      if (this.Select.value == 1 && (this.PatientName.value != null && this.PassportNo.value != null && this.NationalNo.value != null)) {
        this.AddtraForm.setValue({
          'PatientId': this.PID.value,
          'LetterDate': this.LetterDate.value,
          'Attach': this.Attach.value,
          'LetterDest': this.LetterDest.value,
          'LetterIndexNO': this.LetterIndexNO.value,
          'CountryId': this.CountryUserId,
          'UserId': this.UserId,
          'UserDate': this.UserDate,
          'MedicalDiagnosis': this.MedicalDiagnosis.value,
          'EntryDate': this.LetterDate.value,
          'EntryAttach': "",
          'HotelId': 0,

          'PatientName': this.PatientName.value,
          'PassportNo': this.PassportNo.value,
          'NationalNo': this.NationalNo.value,
          'PatType': 0,
          'DepenId': 99,
          'EventId': 12,
          'Select': this.Select.value,

        });

      }

      else if (this.Select.value == false) {
        this.AddtraForm.setValue({
          'PatientId': this.PID.value,
          'LetterDate': this.LetterDate.value,
          'Attach': this.Attach.value,
          'LetterDest': this.LetterDest.value,
          'LetterIndexNO': this.LetterIndexNO.value,
          'CountryId': this.CountryUserId,
          'UserId': this.UserId,
          'UserDate': this.UserDate,
          'MedicalDiagnosis': this.MedicalDiagnosis.value,
          'EntryDate': this.LetterDate.value,
          'EntryAttach': "",
          'HotelId': 0,

          'PatientName': "",
          'PassportNo': "",
          'NationalNo': "",
          'PatType': 0,
          'DepenId': 0,
          'EventId': 0,

          'Select': 2,

        });
      }



      let newpatients = this.AddtraForm.value;
      this.paout.AddPLetterOutByCountry(newpatients).subscribe(
        result => {
          this.pa.clearCache();
          this.AddtraForm.reset();
          this.modalRef.hide();
          this.Select.setValue(1)
          this.fileName = ""
          this.PatientName.setValue("");
          this.PassportNo.setValue("");
          this.NationalNo.setValue("");
          //this.GetAllPMainDataByBranchId()
          this.GetAllAttendByUserId()
          this.GetAllPatByUserId()
          this.fileText = "إرفاق ملف pdf";
          this.message = "";
          this.progress = 0

        },
        error => this.modalMessage = "يرجى المحاولة لاحقا"

      )  
    }

  }



  //إضافة رسالة ضم للمرافق
  onSubmitAdd() {

    this.AddtraForm.setValue({
      'PatientId': this.PID.value,
      'LetterDate': this.LetterDate.value,
      'Attach': this.Attach.value,
      'LetterDest': this.LetterDest.value,
      'LetterIndexNO': this.LetterIndexNO.value,
      'CountryId': this.CountryUserId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'MedicalDiagnosis': this.MedicalDiagnosis.value,
      'EntryDate': this.LetterDate.value,
      'EntryAttach': "",
      'HotelId': 0,

      'PatientName': this.PatientName.value,
      'PassportNo': "",
      'NationalNo': "",
      'PatType': 0,
      'DepenId': 0,
      'EventId': 0,

      'Select': 0,


    });

    let newpatients = this.AddtraForm.value;

    if (this.UserRole == "مشرف إداري") {
      this.paout.AddAttendantTransByCountry(newpatients).subscribe(
        result => {
          this.pa.clearCache();
          this.AddtraForm.reset();
          this.modalRef.hide();
          this.GetAllAttendByUserId()
          this.GetAllPatByUserId()


          this.fileName = ""

          this.fileText = "إرفاق ملف pdf";
          this.message = "";
          this.progress = 0

        },
        error => this.modalMessage = "يرجى المحاولة لاحقاً"

      )

    } else {

      console.log("error")
      //this.paout.AddAttendantTrans(newpatients).subscribe(
      //  result => {
      //    this.paout.clearCache();
      //    this.AddtraForm.reset();
      //    this.modalRef.hide();
      //    this.GetAllAttendByUserId()
      //    this.GetAllPatByUserId()


      //    this.fileName = ""

      //    this.fileText = "إرفاق ملف pdf";
      //    this.message = "";
      //    this.progress = 0

      //  },
      //  error => this.modalMessage = "الرقم الإشاري موجود مسبقا"

      //)
    }
  }



  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetDependenciesFilter() { this.formControl.controls['dependencyType'].setValue(null); }
  resetInjuryEventsDate() { this.formControl.controls['event'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }


}
