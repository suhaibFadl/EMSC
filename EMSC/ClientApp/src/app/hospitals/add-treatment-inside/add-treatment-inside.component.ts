import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
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
import { PTransInside } from '../../interfaces/p-trans-inside';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { ReplyService } from '../../services/reply.service';
import { TravelingService } from '../../services/traveling.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { Reply } from '../../interfaces/reply';


import { DataTableDirective } from 'angular-datatables';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ReplyMOutside } from '../../interfaces/reply-m-outside';
import { AppComponent } from '../../app.component';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { HospitalService } from '../../services/hospital.service';


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
  selector: 'app-add-treatment-inside',
  templateUrl: './add-treatment-inside.component.html',
  styleUrls: ['./add-treatment-inside.component.css'],
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
export class AddTreatmentInsideComponent implements OnInit {

  Reply!: Observable<PTransInside[]>;
  dataSource!: MatTableDataSource<PTransInside>;
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth','ninth', 'add', 'close'];



  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  AddForm!: FormGroup;
  Medical_Diagnosis!: FormControl;
  Date_Diagnosis!: FormControl;
  Attach!: FormControl;
  pId!: FormControl;
  trId!: FormControl;
  HospitalId!: FormControl;


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

  //close medical file
  CloseForm!: FormGroup;
  PID!: FormControl;
  TRID!: FormControl;
  FileState!: FormControl;
  Notes!: FormControl;
  ClosingDate!: FormControl;

  UserHospitalId!: string;
  UserBranchId!: string;
  HospitalName!: string;

  // add Modal
  //  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  //  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  //  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  // add Modal
  //  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;

  @ViewChild('closeFileTemplate') closeFilemodal!: TemplateRef<any>;



  values = [{ value: 1, title: 'انتهاء العلاج بالكامل' },
  { value: 2, title: 'انتهاء العلاج مع وجود مراجعة (عودة أخرى)' },
  ];
  status: number = 2;


  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private br: BranchService,
    private ho: HospitalService,
    private re: ReplyService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private app: AppComponent,

    private pa: PatientsService,
    private tr: TreatmentService,
    private pli: PatientsLettersInsideService,

  ) { }



  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;


  Replies$!: Observable<Reply[]>;
  Replies: Reply[] = [];


  hosps$!: Observable<Hospital[]>;
  hosps: Hospital[] = [];



  LoginStatus$!: Observable<boolean>;



  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;

  @Output() public onUploadFinished = new EventEmitter();



  hospId!: number;
  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    this.acct.currentUserHospitalId.subscribe(result => { this.UserHospitalId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.UserBranchId = result });
    this.acct.currentUserHospitalName.subscribe(result => { this.HospitalName = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    this.pId = new FormControl('', [Validators.required]);
    this.trId = new FormControl('', [Validators.required]);
    this.Medical_Diagnosis = new FormControl('', [Validators.required]);
    this.Date_Diagnosis = new FormControl('', [Validators.required]);

    this.AddForm = this.fb.group({
      'PatientId': this.pId,
      'TRId': this.trId,
      'Medical_Diagnosis': this.Medical_Diagnosis,
      'Date_Diagnosis': this.Date_Diagnosis,
      'HospitalId': this.UserHospitalId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });


    //close medical file
    this.PID = new FormControl('', [Validators.required]);
    this.TRID = new FormControl('', [Validators.required]);
    this.FileState = new FormControl();
    this.Notes = new FormControl('', [Validators.required]);
    this.ClosingDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();

    this.CloseForm = this.fb.group({
      'PatientId': this.PID,
      'TRID': this.TRID,
      'FileState': this.FileState,
      'Notes': this.Notes,
      'ClosingDate': this.ClosingDate,
      'Attach': this.Attach,
      'UserId': this.UserId,
    });

    this.fileText = "إرفاق ملف pdf";



    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });

    this.hosps$ = this.ho.GetHospitals();
    this.hosps$.subscribe(result => {
      this.hosps = result;
    });

    switch (this.UserRole) {
      case "مدير المصحة": this.GetAllPatientsTransInsideByToAddTreatment();
        break;
      case "موظف إدخال المصحة": this.GetAllPatientsTransInsideByToAddTreatment();
        break;
      case "موظف إدخال الفرع": this.GetAllPatientsTransInsideByBranchToAddTreatment();
        break;
      case "مدير الفرع": this.GetAllPatientsTransInsideByBranchToAddTreatment();
        break;

    }
  }

  //=====================Get Replies Accepted======================



  GetAllPatientsTransInsideByToAddTreatment() {
    this.pli.clearCache();
    this.pli.GetAllPatientsTransInsideByToAddTreatment(this.UserHospitalId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (data.length != 0) {
        this.hospId = data[0].hospitalId;
      }
    });
  }

  GetAllPatientsTransInsideByBranchToAddTreatment() {
    this.pli.clearCache();
    this.pli.GetAllPatientsTransInsideByBranchToAddTreatment(this.UserId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (data.length != 0) {
        this.hospId = data[0].hospitalId;
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
    this.fileName = this.PID.value + '_' + this.trId.value + '_' + Date.now().toString() + '.pdf';
    formData.append('file', this.fileToUpload, this.fileName);

    this.Attach.setValue(this.fileName);
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


  onAddTreatment(newtratment: PTransInside): void {

    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.pId.setValue(newtratment.patientId);
    this.trId.setValue(newtratment.id);

    this.modalRef = this.modalService.show(this.modal);

  }


  //on submit reply
  AddTreatment() {

    this.AddForm.setValue({
      'PatientId': this.pId.value,
      'TRId': this.trId.value,
      'Medical_Diagnosis': this.Medical_Diagnosis.value,
      'Date_Diagnosis': this.Date_Diagnosis.value,
      'HospitalId': this.hospId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });
    let newtratment = this.AddForm.value;

    this.pli.AddTreatmentMovement(newtratment).subscribe(
      result => {

        this.pli.clearCache();


        switch (this.UserRole) {
          case "مدير المصحة": this.GetAllPatientsTransInsideByToAddTreatment();
            break;
          case "موظف إدخال المصحة": this.GetAllPatientsTransInsideByToAddTreatment();
            break;
          case "موظف إدخال الفرع": this.GetAllPatientsTransInsideByBranchToAddTreatment();
            break;
          case "مدير الفرع": this.GetAllPatientsTransInsideByBranchToAddTreatment();
            break;
        }
      },
      error => this.modalMessage = "يرجى المحاولة لاحقا"
    )

    this.modalRef.hide();
    this.AddForm.reset();
  }



  onCloseMedicalFile(newtratment: PTransInside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.PID.setValue(newtratment.patientId);
    this.TRID.setValue(newtratment.id);
    this.modalRef = this.modalService.show(this.closeFilemodal);
  }


  CloseFile() {
    this.CloseForm.setValue({
      'PatientId': this.PID.value,
      'TRID': this.TRID.value,
      'FileState': 1,
      'Notes': this.Notes.value,
      'ClosingDate': this.ClosingDate.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
    });

    let closefile = this.CloseForm.value;
    this.pli.CloseMedicalFileInside(closefile).subscribe(
      result => {
        this.pli.clearCache();
        this.GetAllPatientsTransInsideByToAddTreatment();
      //  this.modalMessage = "تمت عملية إغلاق الملف بنجاح";

        this.fileName = ""

        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
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
    this.GetAllPatientsTransInsideByToAddTreatment();
  }

}
