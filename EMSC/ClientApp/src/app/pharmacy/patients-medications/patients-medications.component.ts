import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { HospitalService } from '../../services/hospital.service';
import { CountryService } from '../../services/country.service';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../interfaces/branch';
import _ from 'lodash';
import { version } from 'moment';
import moment from 'moment';
import { Country } from '../../interfaces/country';
import { Hospital } from '../../interfaces/hospital';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { DependencyService } from '../../services/dependency.service';
import { InjuryEventsService } from '../../services/injury-events.service';
import { Dependency } from '../../interfaces/dependency';
import { InjuryEvents } from '../../interfaces/injury-events';
import { map, startWith } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

interface PersonType {
  name: string;
  id: number;
}

interface PatType {
  name: string;
  id: number;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
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
  selector: 'app-patients-medications',
  templateUrl: './patients-medications.component.html',
  styleUrls: ['./patients-medications.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientsMedicationsComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private hos: HospitalService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsService,
    private paout: PatientsLettersOutsideService,
    private pain: PatientsLettersInsideService,
    private PMDS: PatientsMainDataService,
    private coun: CountryService,
    private dep: DependencyService,
    private br: BranchService,
    private ev: InjuryEventsService,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];

  patTypes: PatType[] = [
    { name: 'حالة إنسانية', id: 1 },
    { name: 'جريح حرب', id: 2 },
  ];

  // Modals
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('checkedTemplate') checkedmodal!: TemplateRef<any>;
  @ViewChild('AddTransactionModalTemplate') AddTransactionModal!: TemplateRef<any>;
  @ViewChild('CheckReplyStateModalTemplate') CheckReplyStateModal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;


  clickedRows = new Set<PatientData>();

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;


  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

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

  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'details', 'edit3', 'delete2', 'add'];
  columnsToDisplay: string[] = this.displayedColumns1.slice();

  allBranches!: Observable<Branch[]>;

  filteredNames!: Observable<PatientData[]>;
  filteredPassports!: Observable<PatientData[]>;
  filteredNational!: Observable<PatientData[]>;

  variables: any[] = [];;
  public filteredList4;

  //=============================إضافة بيانات الجريح الرئيسية
  addForm!: FormGroup;
  PatientName!: FormControl;
  PassportNo!: FormControl;
  NationalNo!: FormControl;
  BranchId!: FormControl;
  PatType !: FormControl;
  DepenId !: FormControl;
  EventId !: FormControl;
  PersonType !: FormControl;
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

  


  checkPIDForm!: FormGroup;
  PIDAdd!: FormControl;

  selectedPatient!: PatientData;

  inputType = 'number';

  values = [{ value: 1, title: 'حالة إنسانية' },
  { value: 2, title: 'جريح حرب' }];
  favoriteSeason: number = 2;


  values2 = [{ value: 1, title: 'جريح' },
  { value: 2, title: 'مرافق' }];
  countValues: number = 2;


  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  modalMessage3!: string;
  modalMessage4!: string;

  search: any;
  selection: any;
  versions: any = [];

  UserId!: string;
  UserRole!: string;
  id!: number;
  BranchUserId!: string;
  UserDate!: string;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<PatientData>;
  @Input() patien!: PatientData;

  public progress!: number;
  public message!: string;
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
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
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
      personType: '',
      patType: '',

    })

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
    //========================================================
    //initial delete P-Main data form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });
    //========================================================
    //تعديل بيانات الجريح والمرافق الرئيسية
    this._id = new FormControl('', [Validators.required]);
    this._PatientName = new FormControl('', [Validators.required, Validators.minLength(15)]);
    this._PassportNo = new FormControl('', [Validators.required, Validators.pattern('[A-Z0-9]*'), Validators.maxLength(10), Validators.minLength(6)]);
    this._NationalNo = new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(12), Validators.minLength(12)]);
    this._PatType = new FormControl('', [Validators.required]);
    this._DepenId = new FormControl('', [Validators.required]);
    this._EventId = new FormControl('', [Validators.required]);
    this._PersonType = new FormControl('', [Validators.required]);
    this._BranchId = new FormControl('', [Validators.required]);

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


    this.PIDAdd = new FormControl();
    this.checkPIDForm = this.fb.group(
      {
        'PatientId': this.PIDAdd,
      });

    this.matcher = new MyErrorStateMatcher();

   
    this.GetAllDependencies();
    
    this.fileText = "إرفاق ملف pdf";

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.GetAllPatientsMainData();
   


    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
      //  this.versions = result;
    });

    
    this.PersonType.setValue(1);
    this.DepenId.setValue(null);
    this.EventId.setValue(null);
    this.countValues = 1;

  }


  GetAllDependencies() {
    this.dependency$ = this.dep.GetDependencies();
    this.dependency$.subscribe(result => {
      this.dependency = result;
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

  

  clickMe(item) {
    this.PatientName.setValue(item)
  }


  test(event: Event) {

    if ((event.target as HTMLInputElement).value == "") {
      this.PatientName.reset()
      this.PassportNo.reset()
      this.NationalNo.reset()
    }
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

      }
      else {
        this.PatientName.setValue(0)
        this.PassportNo.setValue(0)
        this.NationalNo.setValue(0)
      }
    });
  }


  onSubmitAddMed(p: PatientData) {
    //this.PIDAdd.setValue(p.id);
    //this.modalMessage3 = "هذا الجريح لا يوجد لديه رسائل ضم من قبل";
    //this.modalRef = this.modalService.show(this.checkedmodal);
    //this.modalRef.hide();

  }




  //patiant details
  onSelect(patiant: PatientData): void {
    this.selectedPatient = patiant;
    this.router.navigateByUrl('/pharmacy/pat-med-details/' + patiant.id);
  }



  //click on add patient
  onAddPatient(): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.modal);
  }


  //إضافة بيانات الجريح والمرافق الرئيسية
  onSubmit() {
    //إضافة جريح
    if (this.PersonType.value == 1) {
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

    if (this.PersonType.value == 1 && (this.PatientName.value == "" ||
      this.PassportNo.value == "" || this.NationalNo.value == "" ||
      this.DepenId.value == null || this.PatType.value == null || this.EventId.value == null)) {
      this.app.FillAllFieldsPlease()
    }


    else if (this.PatientName.value != "" ||
      this.PassportNo.value != "" || this.NationalNo.value != "" ||
      this.DepenId.value != null || this.PatType.value != null || this.EventId.value != null) {

      let newpatients = this.addForm.value;
      this.PMDS.AddPatient(newpatients).subscribe(
        result => {
          this.PMDS.clearCache();
          this.GetAllPatientsMainData();
         

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
  }



  //مودل حذف البيانات الرئيسية
  onDeleteModal(patiantdelete: PatientData) {
    this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    this.Did.setValue(patiantdelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }

  // حذف البيانات الرئيسية
  onDelete(): void {
    let patiantdelete = this.deleteForm.value;
    this.PMDS.DeletePatientData(patiantdelete.id).subscribe(result => {
      this.PMDS.clearCache();
      this.GetAllPatientsMainData()
      //  this.GetAllPatByBranchId()
      //  this.GetAllAttendByBranchId()

      this.modalRef.hide();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.app.CannotDeletePat()
    )
  }

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

    this.modalRef = this.modalService.show(this.editmodal);
  }

  // تعديل البيانات الرئيسية
  onUpdate() {

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

    let editpatients = this.updateForm.value;
    this.PMDS.UpdatePatientData(editpatients.id, editpatients).subscribe(
      result => {
        this.PMDS.clearCache();
        this.GetAllPatientsMainData();
        this.modalRef.hide();
        this.updateForm.reset();
        this.modalMessage = "هل أنت متأكد من حفظ التغييرات ؟ ";
      },
      error => this.modalMessage = "تم إضافة بيانات هذا الجريح من قبل"
    )
  }





  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['dependencyType'].setValue(null); }
  resetLetterDate() { this.formControl.controls['event'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetPersonType() { this.formControl.controls['personType'].setValue(null); }
  resetPatType() { this.formControl.controls['patType'].setValue(null); }

}

