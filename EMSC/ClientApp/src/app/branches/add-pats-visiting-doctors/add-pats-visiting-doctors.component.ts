import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { HospitalService } from '../../services/hospital.service';
import { CountryService } from '../../services/country.service';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-pats-visiting-doctors',
  templateUrl: './add-pats-visiting-doctors.component.html',
  styleUrls: ['./add-pats-visiting-doctors.component.css']
})
export class AddPatsVisitingDoctorsComponent implements OnInit {

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
  ) { }

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

  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  dependency: Dependency[] = [];
  dependency$!: Observable<Dependency[]>;


  injuryEvents: InjuryEvents[] = [];
  injuryEvents$!: Observable<InjuryEvents[]>;


  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth','ten', 'details', 'edit2', 'delete2', 'add'];

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
  //=============================حذف بيانات الجريح
  deleteForm!: FormGroup;
  Did!: FormControl;

  //=============================إضافة رسالة ضم للجريح
  AddtraForm!: FormGroup;
  PID!: FormControl;
  BRID!: FormControl;
  LetterDate!: FormControl;
  Attach!: FormControl;
  LetterIndexNO!: FormControl;
  PlcTreatment!: FormControl;
  HospitalId!: FormControl;
  MedicalDiagnosis!: FormControl;


  values = [{ value: 1, title: 'حالة إنسانية' },
  { value: 2, title: 'جريح حرب' }];
  favoriteSeason: number = 2;


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

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  selectedPatient!: PatientData;

  inputType = 'number';


  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();

  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


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
    });


    this.PID = new FormControl('', [Validators.required]);
    this.LetterDate = new FormControl(moment().format("dddd, MMMM Do YYY,"));
    this.Attach = new FormControl();
    this.LetterIndexNO = new FormControl('', [Validators.required]);
    this.PlcTreatment = new FormControl('', [Validators.required]);
    this.HospitalId = new FormControl();
    this.MedicalDiagnosis = new FormControl('', [Validators.required]);

    this.AddtraForm = this.fb.group({
      'PatientId': this.PID,
      'LetterDate': this.LetterDate,
      'Attach': this.Attach,
      'LetterDest': this.BranchUserId,
      'LetterIndexNO': this.LetterIndexNO,
      'PlcTreatment': this.PlcTreatment,
      'HospitalId': this.HospitalId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'MedicalDiagnosis': this.MedicalDiagnosis,
    });


    this.matcher = new MyErrorStateMatcher();

    this.GetHospitals();
    this.GetAllDependencies();
    this.GetAllInjuryEvents();
    this.fileText = "إرفاق ملف pdf";

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.GetAllPatientsMainData();


    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });

  }


  GetHospitals() {
    this.hos.clearCache();
    this.hos.GetHospitals().subscribe(result => {
      this.hospitals = result;
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



  GetAllPatientsMainData() {
    this.PMDS.clearCache();
    this.PMDS.GetAllPatientsMainDataTripoliBranch().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
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

    this.fileName = this.PID.value + '_' + Date.now().toString() + '.pdf';
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


  //click on add patient
  onAddPatient(): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.modal);
  }


  //إضافة بيانات الجريح والمرافق الرئيسية
  onSubmit() {

    //إضافة جريح
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
        'PersonType': 1,
      });

    if (this.PatientName.value == "" ||
      this.PassportNo.value == "" || this.NationalNo.value == "" ||
      this.DepenId.value == null || this.PatType.value == null || this.EventId.value == null) {
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

  //patiant details
  onSelect(patiant: PatientData): void {
    this.selectedPatient = patiant;
    this.router.navigateByUrl('/branches/p-details/' + patiant.id);
  }



  onAddtraModal(p: PatientData): void {
    this.PID.setValue(p.id);
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.AddTransactionModal);
  }

  //إضافة رسالة ضم للجريح
  onSubmittra() {
      this.AddtraForm.setValue({
        'PatientId': this.PID.value,
        'LetterDate': this.LetterDate.value,
        'Attach': this.fileName,
        'LetterDest': this.BranchUserId,
        'LetterIndexNO': this.LetterIndexNO.value,
        'PlcTreatment': 1,
        'HospitalId': this.HospitalId.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
        'MedicalDiagnosis': this.MedicalDiagnosis.value
      });

    let newpatients = this.AddtraForm.value;

    this.pa.AddPatientTransManagement(newpatients).subscribe(
      result => {
        this.pa.clearCache();
        this.AddtraForm.reset();
        this.modalRef.hide();

        this.fileName = ""
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
        this.GetAllPatientsMainData();
      },
      error => this.modalMessage = "يرجى المحاولة لاحقا"

    )
  }


  applyFilter2(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {

    if (filterValue != "") {
      this.dataSource.filter = filterValue.trim().toLowerCase() || this.search.trim().toLowerCase();

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter3() {
    this.GetAllPatientsMainData();
  }

}
