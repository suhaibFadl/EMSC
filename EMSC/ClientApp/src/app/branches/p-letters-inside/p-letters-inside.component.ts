import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
import { HospitalService } from '../../services/hospital.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { BranchService } from '../../services/branch.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { ReplyHospitalService } from '../../services/reply-hospital.service';

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
  selector: 'app-p-letters-inside',
  templateUrl: './p-letters-inside.component.html',
  styleUrls: ['./p-letters-inside.component.css']
  ,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PLettersInsideComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsLettersInsideService,
    private ho: HospitalService,
    private rh: ReplyHospitalService,
    private br: BranchService,
    private datepipe: DatePipe,
    private http: HttpClient
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

  date = new FormControl(moment());

  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = -1;

  LoginStatus$!: Observable<boolean>;
  selection: any;


  TransInside!: Observable<PTransInside[]>;
  dataSource!: MatTableDataSource<PTransInside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'elevent','twelve', 'edit', 'delete'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'edit', 'delete'];
  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'eleventh','twelve'];


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
  HospitalId!: FormControl;


  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  UserDate!: string;
  BRID!: number;


  rejectForm!: FormGroup;
  Rid!: FormControl;
  reason!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;
  AttachDelete!: FormControl;


  UserId!: string;
  UserRole!: string;
  BranchUserId!: string;


  selectedpat!: PTransInside;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  checkIndex!: number;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;


  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;



  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;


  checked: PatientTrans[] = [];
  checked$!: Observable<PatientTrans[]>;


  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });


    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.fileText = "إرفاق ملف pdf";
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

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
    this.Attach = new FormControl();
    this.LetterDest = new FormControl('', [Validators.required]);
    this.LetterIndexNO = new FormControl('', [Validators.required]);
    this.MedicalDiagnosis = new FormControl('', [Validators.required]);
    this.HospitalId = new FormControl('', [Validators.required]);

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
      'HospitalId': this.HospitalId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });

    this.GetHospitals();


   // this.GetAllPatientsTransByBranchId();


         this.GetAllPatientsTransByBranchId();
   

  }

  GetAllPatientsTransByBranchId() {
    this.pa.clearCache();
    this.pa.GetAllPatientsTransactionsInsideByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  GetAllP_TransactionsInsideForManagement() {
    this.pa.clearCache();
    this.pa.GetAllP_TransactionsInsideForManagement().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  GetAllPatientsByUserID() {
    this.pa.clearCache();
    this.pa.GetPatientsTransactionsInsideByUserId(this.UserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }
  GetHospitals() {
    this.ho.clearCache();
    this.ho.GetHospitals().subscribe(result => {
      this.hospitals = result;
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

    this.http.put('/api/Upload', formData, { reportProgress: true, observe: 'events' })
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

  ViewlMedicalModal(p: PTransInside) {
    this.modalMessage = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }


  onDeleteModal(pd: PTransInside) {
    this.Did.setValue(pd.id);
    this.AttachDelete.setValue(pd.attach);
    this.deleteForm.setValue({
      'id': pd.id,
      'attach': pd.attach
    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }

  // update modal
  onUpdateModal(editpatients: PTransInside): void {
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
    this.HospitalId.setValue(editpatients.hospitalId);

    this.modalRef = this.modalService.show(this.editmodal);

  }


  onDelete() {
    let deletepatiant = this.deleteForm.value;

    this.rh.DeleteReplyInside(this.Did.value).subscribe(
      result => {
        this.pa.clearCache();
      }
    )
    this.pa.DeletePatientTransactionsInside(deletepatiant.id).subscribe(result => {
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
        'HospitalId': this.HospitalId.value,
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
        'HospitalId': this.HospitalId.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    let editpatients = this.updateForm.value;

    this.pa.UpdatePatientTransactionInside(editpatients.id, editpatients).subscribe(
      result => {
        this.pa.clearCache();
        this.GetAllPatientsTransByBranchId();

        this.modalRef.hide();
        this.updateForm.reset();
        this.fileName = '';
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

        this.modalMessage = "تم تعديل البيانات بنجاح";
      },
      error => this.modalMessage = "يرجى التحقق من الرقم الإشاري"

    )

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

    if (this.UserRole == "مدير الفرع" || this.UserRole == "موظف إدخال الفرع") {
      this.GetAllPatientsTransByBranchId();
    }
    else {

      if (this.UserRole == "الإدارة") {
        this.GetAllP_TransactionsInsideForManagement();
      }

    }
  }

}
