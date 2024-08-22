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
import { Reply } from '../../interfaces/reply';
import { Branch } from '../../interfaces/branch';
const moment = _rollupMoment || _moment;

interface LetterStatues {
  name: string;
  id: number;
}

interface PersonType {
  name: string;
  id: number;
}

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
  selector: 'app-p-letters-outside',
  templateUrl: './p-letters-outside.component.html',
  styleUrls: ['./p-letters-outside.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PLettersOutsideComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsLettersOutsideService,
    private coun: CountryService,
    private datepipe: DatePipe,
    private br: BranchService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.navLinks = this.navLinks = [

      {
        label: 'قائمة رسائل إحالة الجرحى للعلاج داخل ليبيا',
        link: '/branches/p-letters-inside',
        index: 0
      }, {
        label: 'قائمة رسائل الجرحى للعلاج بالخارج',
        link: '/branches/p-letters-outside',
        index: 1
      },
    ];
  }

  statues: LetterStatues[] = [
  //  { name: 'قيد الانتظار', id: 0 },
    { name: 'قيد الإجراء', id: 2 },
    { name: 'تم القبول', id: 3 },
   // { name: 'تم الرفض من قِبل الإدارة', id: 1 },
    { name: 'تم الرفض من قِبل الساحة', id: 4 },
    { name: 'قائمة الانتظار', id: 6 },
    { name: 'تم إغلاق الملف', id: 5 },
  ];


  statues2: LetterStatues[] = [
  //  { name: 'قيد الانتظار', id: 0 },
    { name: 'قيد الإجراء', id: 2 },
    { name: 'تم القبول', id: 3 },
    { name: 'تم الرفض', id: 1 },
    { name: 'تم الرفض', id:4 },
    { name: 'قائمة الانتظار', id: 6 },
    { name: 'تم إغلاق الملف', id: 5 },
  ];

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];


  navLinks: any[];
  activeLinkIndex = -1;


  date = new FormControl(moment());

  title = 'angular-material-tab-router';
  selection: any;

  LoginStatus$!: Observable<boolean>;


  TransOutside!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'eleventh','twelve','thirteen', 'edit', 'delete'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'edit', 'delete'];


  // Updating the patients
  updateForm!: FormGroup;
  id!: FormControl;
  PatientName!: FormControl;
  PassportNo!: FormControl;
  LetterDate!: FormControl;
  NationalNo!: FormControl;
  Attach!: FormControl;
  LetterDest!: FormControl;
  LetterIndexNO!: FormControl;
  MedicalDiagnosis!: FormControl;
  CountryId!: FormControl;



  // reply the patients
  rejectForm!: FormGroup;
  Rid!: FormControl;
  reason!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;
  AttachDelete!: FormControl;


  fileToUpload!: File;
  fileText!: string;
  fileName = '';



  UserId!: string;
  UserRole!: string;
  //id!: number;
  BranchUserId!: string;
  UserDate!: string;
  BRID!: number;
  checkIndex!: number;
  checkIndexout!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;
  @ViewChild('viewTemplate') viewmodal!: TemplateRef<any>;


  @ViewChild('filter', { static: false }) filter!: ElementRef;




  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;

  //@Input() patien!: PTransOutside;

  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  branches: Branch[] = [];
 branches$!: Observable<Branch[]>;

  countries: Country[] = [];
  countriesFilter: Country[] = [];
  countries$!: Observable<Country[]>;

  checked: PatientTrans[] = [];
  checked$!: Observable<PatientTrans[]>;

  checkedOut: PatientTrans[] = [];
  checkedOut$!: Observable<PatientTrans[]>;


  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.fileText = "إرفاق ملف pdf";
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      letterDate: '',
      userDate: '',
      phoneNumber: '',
      replyState: '',
      personType: '',

    })


    //initialize delete form
    this.Did = new FormControl();
    this.AttachDelete = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        'attach': this.AttachDelete,
      });

    //===============initial reject form
    this.Rid = new FormControl();
    this.reason = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this.rejectForm = this.fb.group(
      {
        'id': this.Rid,
        'reason': this.reason
      });


    //=======================initial update form
    this.id = new FormControl('', [Validators.required]);
    this.PatientName = new FormControl('', [Validators.required]);
    this.PassportNo = new FormControl('', [Validators.required]);
    this.LetterDate = new FormControl('', [Validators.required]);
    this.NationalNo = new FormControl('', [Validators.required]);
    this.Attach = new FormControl('', [Validators.required]);
    this.LetterDest = new FormControl('', [Validators.required]);
    this.LetterIndexNO = new FormControl('', [Validators.required]);
    this.MedicalDiagnosis = new FormControl('', [Validators.required]);
    this.CountryId = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({
      'id': this.id,
      'PatientName': this.PatientName,
      'PassportNo': this.PassportNo,
      'LetterDate': this.LetterDate,
      'NationalNo': this.NationalNo,
      'Attach': this.Attach,
      'LetterDest': this.LetterDest,
      'LetterIndexNO': this.LetterIndexNO,
      'MedicalDiagnosis': this.MedicalDiagnosis,
      'CountryId': this.CountryId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });

    if (this.UserRole == "الإدارة") {
      this.GetAllCountries();
    }
    else {
          this.GetCountries();

    }
   // this.GetCountries();
    this.GetAllPatientsTransByBranchId();
    this.GetAllCountriesFilter();
    this.GetBranches();

  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });
  }

  GetAllCountries() {
    this.coun.clearCache();
    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countries = result;
    });
  }

  GetAllCountriesFilter() {
    this.coun.clearCache();
    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countriesFilter = result;
    });
  }

  GetAllPatientsTransByBranchId() {
    this.pa.clearCache();
    this.pa.GetAllPatientsTransactionsOutsideByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
      //  const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.replyState || data.replyState.toString().toLowerCase().includes(filter.replyState);
        const j = !filter.personType || data.personType.toString().toLowerCase().includes(filter.personType);

        return a && b && c  && e && f && g && h && i && j;
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
    this.fileName = this.id.value + '_' + Date.now().toString() + '.pdf';

    formData.append('file', this.fileToUpload, this.fileName);

    // = this.fileName;
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


  // update modal
  onUpdateModal(editpatients: PTransOutside): void {


    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوب تعديلها";

    this.id.setValue(editpatients.id);
    this.PatientName.setValue(editpatients.patientName);
    this.PassportNo.setValue(editpatients.passportNo);
    this.LetterDate.setValue(editpatients.letterDate);
    this.NationalNo.setValue(editpatients.nationalNo);
    this.Attach.setValue(editpatients.attach);
    this.LetterDest.setValue(editpatients.letterDest);
    this.LetterIndexNO.setValue(editpatients.letterIndexNO);
    this.MedicalDiagnosis.setValue(editpatients.medicalDiagnosis);
    this.CountryId.setValue(editpatients.countryId);


    this.modalRef = this.modalService.show(this.editmodal);
  }
  onUpdate() {

    if (this.fileName != '') {
      this.pa.DeleteFile(this.Attach.value).subscribe(
        result => {
          this.pa.clearCache();
        }
      )
      this.updateForm.setValue({
        'id': this.id.value,
        'PatientName': this.PatientName.value,
        'PassportNo': this.PassportNo.value,
        'LetterDate': this.LetterDate.value,
        'NationalNo': this.NationalNo.value,
        'Attach': this.fileName,
        'LetterDest': this.LetterDest.value,
        'LetterIndexNO': this.LetterIndexNO.value,
        'MedicalDiagnosis': this.MedicalDiagnosis.value,
        'CountryId': this.CountryId.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });

    }
    else if (this.fileName == '') {
      this.updateForm.setValue({
        'id': this.id.value,
        'PatientName': this.PatientName.value,
        'PassportNo': this.PassportNo.value,
        'LetterDate': this.LetterDate.value,
        'NationalNo': this.NationalNo.value,
        'Attach': this.Attach.value,
        'LetterDest': this.LetterDest.value,
        'LetterIndexNO': this.LetterIndexNO.value,
        'MedicalDiagnosis': this.MedicalDiagnosis.value,
        'CountryId': this.CountryId.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    let editpatients = this.updateForm.value;
    this.pa.UpdatePatientTransactionOutside(editpatients.id, editpatients).subscribe(
      result => {
        this.pa.clearCache();
          this.GetAllPatientsTransByBranchId();
        this.updateForm.reset();
        this.fileName = '';
        this.modalRef.hide();

        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
      },
      error => this.modalMessage = "يرجى التحقق من الرقم الإشاري"

    )

  }

  onDeleteModal(pd: PTransOutside) {
    this.Did.setValue(pd.id);
    this.AttachDelete.setValue(pd.attach);
    this.deleteForm.setValue({
      'id': pd.id,
      'attach': pd.attach
    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }
  onDelete() {
    let deletepatiant = this.deleteForm.value;
    this.pa.DeleteReply(deletepatiant.id).subscribe(
      result => {
        this.pa.clearCache();
      }
    )
    this.pa.DeletePatientTransactionsOutside(deletepatiant.id).subscribe(result => {
      this.pa.clearCache();
      this.GetAllPatientsTransByBranchId();

      this.modalRef.hide();
    })
    this.pa.DeleteFile(deletepatiant.attach).subscribe(
      result => {
        this.pa.clearCache();
      }
    )



  }


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


  resetBranchesFilter() {    this.formControl.controls['branchName'].setValue(null);}
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null);}
  resetLetterDate() { this.formControl.controls['letterDate'].setValue(null);}
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetReplyState() { this.formControl.controls['replyState'].setValue(null); }
  resetPersonType() { this.formControl.controls['personType'].setValue(null); }


}
