import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive, Inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl, MinLengthValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DependencyService } from '../../services/dependency.service';
import { InjuryEventsService } from '../../services/injury-events.service';
import { Dependency } from '../../interfaces/dependency';
import { InjuryEvents } from '../../interfaces/injury-events';
import { PatientData } from '../../interfaces/patient-data';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from '../../interfaces/pharmacy';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


import { saveAs } from 'file-saver';

const moment = _rollupMoment || _moment;

interface PersonType {
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
  selector: 'app-request-medication',
  templateUrl: './request-medication.component.html',
  styleUrls: ['./request-medication.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class RequestMedicationComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: BsModalService,
    private acct: AccountService,
    private PMDS: PatientsMainDataService,
    private phar: PharmacyService,
    private dep: DependencyService,
    private ev: InjuryEventsService,
    private br: BranchService,
    private app: AppComponent,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document

  ) { }

  @Output() public onUploadFinished = new EventEmitter();

  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'edit3', 'delete2','add'];

  // Modals
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  inputType = 'number';
  BranchUserId!: string;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<PatientData>;


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  dependency: Dependency[] = [];
  dependency$!: Observable<Dependency[]>;


  injuryEvents: InjuryEvents[] = [];
  injuryEvents$!: Observable<InjuryEvents[]>;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;

  pharmacies: Pharmacy[] = [];
  pharmacies$!: Observable<Pharmacy[]>;


  reqs: Pharmacy[] = [];
  reqs$!: Observable<Pharmacy[]>;

  addForm!: FormGroup;
  MedId!: FormControl;
  PatientId!: FormControl;
  PHId!: FormControl;
  CountRows!: FormControl;
  RequestedQuantity!: FormControl;
  PersonAttach!: FormControl;
  MedicationsForm!: FormGroup;

  uploadForm!: FormGroup;
  Id!: FormControl;
  ReqestLetter!: FormControl;


  UserId!: string;
  UserRole!: string; 


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  public progress!: number;
  public message!: string;

  //==========================================================

  selectedItemsM: any[] = [];

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
    { name: 'موظف', id: 3 },
  ];

  values = [{ value: 1, title: 'حالة إنسانية' },
  { value: 2, title: 'جريح حرب' }];
  favoriteSeason: number = 2;

  //=============================إضافة بيانات الجريح الرئيسية
  addPatForm!: FormGroup;
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

  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });


    // this.MedId = new FormControl('', [Validators.required, Validators.minLength(1)]);
    this.PatientId = new FormControl();
    this.PHId = new FormControl([Validators.required]);
    this.CountRows = new FormControl();
    this.RequestedQuantity = new FormControl('', [Validators.required]);
    this.PersonAttach = new FormControl('');

    this.addForm = this.fb.group({
      'MedId': this.MedId,
      'PatientId': this.PatientId,
      'PHId': this.PHId,
      'RequestedQuantity': this.RequestedQuantity,
      'PersonAttach': this.PersonAttach,
      'CountRows': this.CountRows,
      'UserId': this.UserId,
    });


    this.Id = new FormControl();
    this.ReqestLetter = new FormControl();

    this.uploadForm = this.fb.group({
      'Id': this.Id,
      'ReqestLetter': this.ReqestLetter,
    });

    this.MedicationsForm = this.fb.group({
      'Med': [this.selectedItemsM, [Validators.required, Validators.minLength(1)]],
    });



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

    //====================================================================
    this.PatientName = new FormControl('', [Validators.minLength(15)]);
    this.PassportNo = new FormControl('', [Validators.pattern('[A-Z0-9]*'), Validators.minLength(6), Validators.maxLength(10)]);
    this.NationalNo = new FormControl('', [Validators.pattern('[0-9]*'), Validators.minLength(12), Validators.maxLength(12)]);

    this.BranchId = new FormControl('', [Validators.required]);
    this.PatType = new FormControl('', [Validators.required]);
    this.DepenId = new FormControl('', [Validators.required]);
    this.EventId = new FormControl('', [Validators.required]);
    this.PersonType = new FormControl('', [Validators.required]);

    this.addPatForm = this.fb.group({
      'PatientName': this.PatientName,
      'PassportNo': this.PassportNo,
      'NationalNo': this.NationalNo,
      'UserId': this.UserId,
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


    //========================================================
    //تعديل بيانات الجريح الرئيسية
    this._id = new FormControl('', [Validators.required]);
    this._PatientName = new FormControl('', [Validators.required, Validators.minLength(15)]);
    this._PassportNo = new FormControl('', [Validators.required, Validators.pattern('[A-Z0-9]*'), Validators.maxLength(10), Validators.minLength(6)]);
    this._NationalNo = new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(12), Validators.minLength(12)]);
    this._PatType = new FormControl('', [Validators.required]);
    this._DepenId = new FormControl('', [Validators.required]);
    this._EventId = new FormControl('', [Validators.required]);
    this._BranchId = new FormControl('', [Validators.required]);
  //  this._PersonType = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({
      'id': this._id,
      'PatientName': this._PatientName,
      'PassportNo': this._PassportNo,
      'NationalNo': this._NationalNo,
      'UserId': this.UserId,
      'BranchId': this._BranchId,
      'PatType': this._PatType,
      'DepenId': this._DepenId,
      'EventId': this._EventId,
     // 'PersonType': this._PersonType,
    });

    this.DepenId.setValue(null);
    this.EventId.setValue(null);


    //==============================================================================
    if (this.UserRole == "الإدارة") {
      this.GetAllPats();
    }
    else {
      this.GetAllPMainDataByBranchId();
    }
    this.GetAllDependencies();
    this.GetAllInjuryEvents();
    this.GetMedications();
    this.GetPharmacies();
    this.GetBranches();
    this.GetALlRequests();

    this.fileText = "إرفاق ملف pdf";


  }




  onRequestMedication(P: PatientData) {
    this.modalMessage1 = "الرجاء إدخال كافة البيانات المطلوبة ";

    this.GetALlRequests();
    this.modalRef = this.modalService.show(this.modal);
    this.PatientId.setValue(P.id);

    if (this.reqs.length == 0) {
      this.CountRows.setValue(0);

    }
    else {
      this.CountRows.setValue(this.reqs.length);
    }
  }

  Me!: number;
  get Med(): any {
    return this.MedicationsForm.get('Med');
  }

  ReqId!: number;

  onSubmit() {

    this.Me = this.Med.value;

    this.addForm.setValue({
      'MedId': this.Me,
      'PatientId': this.PatientId.value,
      'PHId': this.PHId.value,
      'RequestedQuantity': this.RequestedQuantity.value,
      'PersonAttach': this.fileName,
      'CountRows': this.CountRows.value,
      'UserId': this.UserId,
    });

    let newData = this.addForm.value;

    this.phar.RequestMedication(newData).subscribe(
      result => {
        this.phar.clearCache();
        this.ReqId = result.id;
        this.GetAllPats();
        this.GetALlRequests();
        this.modalRef.hide();

        this.addForm.reset();
        this.MedicationsForm.reset();

        this.app.showToasterSuccess();

        this.fileText = "إرفاق ملف pdf";
        this.fileName = "";
        this.progress = 0;
      },
      error =>
        this.app.showToasterError()

    )
    this.addForm.reset();
    this.MedicationsForm.reset();


  }



  //click on add patient
  onAddPatient(): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.modalRef = this.modalService.show(this.addmodal);
  }


  //إضافة بيانات الجريح الرئيسية
  onAddPat() {

    //إضافة جريح

    this.addPatForm.setValue({
      'PatientName': this.PatientName.value,
      'PassportNo': this.PassportNo.value,
      'NationalNo': this.NationalNo.value,
      'UserId': this.UserId,
      'BranchId': this.BranchId.value,
      'PatType': this.PatType.value,
      'DepenId': this.DepenId.value,
      'EventId': this.EventId.value,
      'PersonType': this.PersonType.value,
    });


    let newpatients = this.addPatForm.value;
    this.phar.AddNewPatient(newpatients).subscribe(
      result => {
        this.PMDS.clearCache();
        this.GetAllPats();

        this.addPatForm.reset();
        this.modalRef.hide();
      },
      error => this.app.PatIsExist()
    )

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
      this.GetAllPats()

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
      'BranchId': this._BranchId.value,
      'PatType': this._PatType.value,
      'DepenId': this._DepenId.value,
      'EventId': this._EventId.value,
    });

    let editpatients = this.updateForm.value;

    this.PMDS.UpdatePatientData(editpatients.id, editpatients).subscribe(
      result => {
        this.PMDS.clearCache();
        this.GetAllPats();
        this.GetBranches();
        this.modalRef.hide();
        this.updateForm.reset();
        this.modalMessage = "هل أنت متأكد من حفظ التغييرات ؟ ";
      },
      error => this.modalMessage = "تم إضافة بيانات هذا المريض من قبل"
    )
  }



  createPdf() {
    const data = this.document.getElementById('content');

    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var margins = {
        top: 40,
        bottom: 60,
        left: 40,
        width: 522
      };
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      const fileName = `${Date.now()}.pdf`;

      pdf.save(fileName);

      // Convert the PDF to a Blob
      const file = new Blob([pdf.output('blob')], { type: 'application/pdf' });

      // Create a FormData object and append the Blob file
      const formData = new FormData();

      formData.append('file', file, fileName);

      // Send the FormData to the ASP.NET API for saving
      this.http.post('/api/Upload/save-pdf', formData).subscribe(
        response => {
          this.ReqestLetter.setValue(fileName)
          this.Id.setValue(this.ReqId)

       //   this.uploadFile();
        },
        error => {
          console.error('Error occurred while saving the PDF file:', error);
        }
      );
    });

  }



  generateAndSavePDF(): void {
    const doc = new jsPDF();
    doc.text('Hello, World!', 10, 10);

    // Generate a unique file name for the PDF
    const fileName = `${Date.now()}.pdf`;

    // Save the PDF on the client-side
    doc.save(fileName);

    // Convert the PDF to a Blob
    const file = new Blob([doc.output('blob')], { type: 'application/pdf' });

    // Create a FormData object and append the Blob file
    const formData = new FormData();
    formData.append('file', file, fileName);

    // Send the FormData to the ASP.NET API for saving
    this.http.post('/api/Upload/save-pdf', formData).subscribe(
      response => {
        console.log('PDF file saved successfully in wwwroot folder.');
      },
      error => {
        console.error('Error occurred while saving the PDF file:', error);
      }
    );
  }


  GetAllPats() {
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

  GetALlRequests() {
    this.reqs$ = this.phar.GetALlRequests(this.BranchUserId);
    this.reqs$.subscribe(result => {
      this.reqs = result;
    });
  }

  GetAllDependencies() {
    this.dependency$ = this.dep.GetDependencies();
    this.dependency$.subscribe((result: any) => {
      this.dependency = result;
    });
  }

  GetAllInjuryEvents() {
    this.injuryEvents$ = this.ev.GetInjuryEvents();
    this.injuryEvents$.subscribe(result => {
      this.injuryEvents = result;
    });
  }


  GetBranches() {
    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });
  }


  GetMedications() {
    this.medications$ = this.phar.GetMedications();
    this.medications$.subscribe(result => {
      this.medications = result;
    });
  }

  GetPharmacies() {
    this.pharmacies$ = this.phar.GetPharmacies();
    this.pharmacies$.subscribe(result => {
      this.pharmacies = result;
    });
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetDependenciesFilter() { this.formControl.controls['dependencyType'].setValue(null); }
  resetInjuryEventsDate() { this.formControl.controls['event'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetPersonType() { this.formControl.controls['personType'].setValue(null); }
  resetPatType() { this.formControl.controls['patType'].setValue(null); }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = <File>files[0];
    this.fileText = this.fileToUpload.name;
    this.fileText = "تم الرفع";
    const formData = new FormData();

    this.fileName = this.PatientId.value + '_' + Date.now().toString() + '.pdf';

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


  GetAllPMainDataByBranchId() {
    this.PMDS.clearCache();
    this.PMDS.GetAllPatientsMainDataByBranchId(this.BranchUserId.toString()).subscribe(data => {
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


}

