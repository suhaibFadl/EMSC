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
import { HotelOutsideService } from '../../services/hotel-outside.service';
import { HotelOutside } from '../../interfaces/hotel-outside';
import { HotelMovementsService } from '../../services/hotel-movements.service';
import { Branch } from '../../interfaces/branch';
import { TreatmentService } from '../../services/treatment.service';
import { HospitalCountryService } from '../../services/hospital-country.service';
import { HospitalsCountries } from '../../interfaces/hospitals-countries';
import { AppComponent } from '../../app.component';

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
  selector: 'app-append-letters-outside',
  templateUrl: './append-letters-outside.component.html',
  styleUrls: ['./append-letters-outside.component.css'] ,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AppendLettersOutsideComponent implements OnInit {
  public formControl!: FormGroup;

   constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsLettersOutsideService,
     private br: BranchService,
     private coun: CountryService,
     private http: HttpClient,
     private hoOut: HotelOutsideService,
     private ho: HotelMovementsService,
     private tr: TreatmentService,
     private hos: HospitalCountryService,
     private app: AppComponent,
     private formBuilder: FormBuilder
  ) { }

date = new FormControl(moment());

  title = 'angular-material-tab-router';

  LoginStatus$!: Observable<boolean>;

  selection: any;

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  TransOutside!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth','ten','eleventh', 'edit', 'delete'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten','eleventh','twelve', 'edit', 'delete','add'];
  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'eleventh', 'twelve','thirteen','edit', 'delete', 'add', 'close'];


  // Updating the Letter
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


  AddForm!: FormGroup;
  PID!: FormControl;
  TRId!: FormControl;
 // TPId!: FormControl;
  HotelId!: FormControl;
  EntryDate!: FormControl;
  AttachHotel!: FormControl;


  // reply the patients
  rejectForm!: FormGroup;
  Rid!: FormControl;
  reason!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;
  AttachDelete!: FormControl;
  EntryAttachDelete!: FormControl;


  //add treatment
  AddTreatForm!: FormGroup;
  Medical_Diagnosis!: FormControl;
  Date_Diagnosis!: FormControl;
  TreatAttach!: FormControl;
  pId!: FormControl;
  trId!: FormControl;
  HospitalCountryId!: FormControl;

  //close medical file
  CloseForm!: FormGroup;
  PId!: FormControl;
  TRID!: FormControl;
  FileStatus!: FormControl;
  Notes!: FormControl;
  ClosingDate!: FormControl;

  values = [{ value: 1, title: 'انتهاء العلاج بالكامل' },
  { value: 2, title: 'انتهاء العلاج مع وجود مراجعة (عودة أخرى)' },
  { value: 3, title: 'انتهاء العلاج بالساحة مع ضرورة نقله لساحة علاج أخرى' },
  { value: 4, title: 'إغلاق الملف وترحيل الجريح' }
  ];
  status: number = 4;


  fileToUpload!: File;
  fileText!: string;
  fileName = '';



  UserId!: string;
  UserRole!: string;
  RoleId!: string;
  //id!: number;
  CountryUserId!: string;
  UserDate!: string;
  BRID!: number;
  checkIndex!: number;
  checkIndexout!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('template') modal!: TemplateRef<any>;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;
  @ViewChild('viewTemplate') viewmodal!: TemplateRef<any>;

  @ViewChild('Treattemplate') Treatmodal!: TemplateRef<any>;
  @ViewChild('closeFileTemplate') closeFilemodal!: TemplateRef<any>;



  @ViewChild('filter', { static: false }) filter!: ElementRef;

  Hotels$!: Observable<HotelOutside[]>;
  Hotels: HotelOutside[] = [];


  countries$!: Observable<Country[]>;
  countries: Country[] = [];


  HospitalCountry$!: Observable<HospitalsCountries[]>;
  HospitalCountry: HospitalsCountries[] = [];


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;

  //@Input() patien!: PTransOutside;

  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;


  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentUserCountryId.subscribe(result => { this.CountryUserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserRoleId.subscribe(result => { this.RoleId = result });

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


    //initialize delete form
    this.Did = new FormControl();
    this.AttachDelete = new FormControl();
    this.EntryAttachDelete = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        'attach': this.AttachDelete,
        'entryAttach': this.EntryAttachDelete,
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
    this.LetterDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl('', [Validators.required]);
    this.LetterDest = new FormControl('', [Validators.required]);
    this.LetterIndexNO = new FormControl('', [Validators.required]);
    this.MedicalDiagnosis = new FormControl('', [Validators.required]);
   
    this.updateForm = this.fb.group({
      'id': this.id,  
      'LetterDate': this.LetterDate,
      'Attach': this.Attach,
      'CountryId': this.CountryUserId,
      'LetterDest': this.LetterDest,
      'LetterIndexNO': this.LetterIndexNO,
      'MedicalDiagnosis': this.MedicalDiagnosis,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });

    //=======================================Add hotel movement form
    this.PID = new FormControl('', [Validators.required]);
    this.TRId = new FormControl('', [Validators.required]);
   // this.TPId = new FormControl('', [Validators.required]);
    this.HotelId = new FormControl('', [Validators.required]);
    this.EntryDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();


    this.AddForm = this.fb.group({
      'PatientId': this.PID,
      'TRId': this.TRId,
      'EntryDate': this.EntryDate,
      'HotelId': this.HotelId,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });


    this.pId = new FormControl('', [Validators.required]);
    this.trId = new FormControl('', [Validators.required]);
    this.Medical_Diagnosis = new FormControl('', [Validators.required]);
    this.Date_Diagnosis = new FormControl('', [Validators.required]);
    this.HospitalCountryId = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();

    this.AddTreatForm = this.fb.group({
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
    this.PId = new FormControl('', [Validators.required]);
    this.TRID = new FormControl('', [Validators.required]);
    this.FileStatus = new FormControl('', [Validators.required]);
    this.Notes = new FormControl('', [Validators.required]);
    this.ClosingDate = new FormControl('', [Validators.required]);

    this.CloseForm = this.fb.group({
      'PatientId': this.PId,
      'TRID': this.TRID,
      'FileStatus': this.FileStatus,
      'Notes': this.Notes,
      'ClosingDate': this.ClosingDate,
      'UserId': this.UserId,
    });

    switch (this.UserRole) {
      case "مشرف إداري": this.GetPatientsTransactionsOutsideByUserId();
        break;
      case "لجنة الحصر": this.GetPatientsTransactionsOutsideByUserRole();
        break;
    }

    this.GetHospitalsCountry();

    this.hoOut.clearCache();
    this.hoOut.GetHotelsOutsideByCountryId(this.CountryUserId.toString()).subscribe(result => {
      this.Hotels = result;
    });


    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });

    this.countries$ = this.coun.GetCountriesMainBrach();
    this.countries$.subscribe(result => {
      this.countries = result;
    });


  }
  GetHospitalsCountry() {
    this.hos.clearCache();
    this.hos.GetHospitalsByCountryId(this.CountryUserId.toString()).subscribe(result => {
      this.HospitalCountry = result;
    });
  }



  GetPatientsTransactionsOutsideByUserId() {
    this.pa.clearCache();
    this.pa.GetPatientsTransactionsOutsideByUserId(this.UserId.toString()).subscribe(data => {
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

  GetPatientsTransactionsOutsideByUserRole() {
    this.pa.clearCache();
    this.pa.GetPatientsTransactionsOutsideByUserRole(this.CountryUserId).subscribe(data => {
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
    this.Attach.setValue(editpatients.attach);
    this.LetterDate.setValue(editpatients.letterDate);
    this.LetterDest.setValue(editpatients.letterDest);
    this.LetterIndexNO.setValue(editpatients.letterIndexNO);
    this.MedicalDiagnosis.setValue(editpatients.medicalDiagnosis);
  
    this.fileText = " إرفاق ملف pdf";

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
        'Attach': this.fileName,
        'LetterIndexNO': this.LetterIndexNO.value,
        'LetterDate': this.LetterDate.value,
        'LetterDest': this.LetterDest.value,
        'MedicalDiagnosis': this.MedicalDiagnosis.value,
        'CountryId': this.CountryUserId,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    else if (this.fileName == '') {

      this.updateForm.setValue({
        'id': this.id.value,
        'Attach': this.Attach.value,
        'LetterIndexNO': this.LetterIndexNO.value,
        'LetterDate': this.LetterDate.value,
        'LetterDest': this.LetterDest.value,
        'MedicalDiagnosis': this.MedicalDiagnosis.value,
        'CountryId': this.CountryUserId,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    let editpatients = this.updateForm.value;
    this.pa.UpdatePatientTransactionOutside(editpatients.id, editpatients).subscribe(
      result => {
        this.pa.clearCache();
      
        switch (this.UserRole) {
          case "مشرف إداري": this.GetPatientsTransactionsOutsideByUserId();
            break;
          case "لجنة الحصر": this.GetPatientsTransactionsOutsideByUserRole();
            break;
        }
        this.modalRef.hide();
        this.updateForm.reset();
        this.fileName = '';
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

        this.modalMessage = "تم تعديل البيانات بنجاح";
      },
      error => this.modalMessage = "يرجى المحاولة لاحقا"

    )

  }

  onDeleteModal(pd: PTransOutside) {
    this.Did.setValue(pd.id);
    this.AttachDelete.setValue(pd.attach);
    this.EntryAttachDelete.setValue(pd.entryAttach);
   
    this.modalRef = this.modalService.show(this.deletemodal);
  }


  onDelete() {

    if (this.UserRole == "لجنة الحصر") {

      this.deleteForm.setValue({
        'id': this.Did.value,
        'attach': this.AttachDelete.value,
        'entryAttach': this.EntryAttachDelete.value
      });
      let deletepatiant = this.deleteForm.value;

      this.pa.DeletePatientTransactionsOutsideByCommit(this.Did.value).subscribe(result => {
        this.pa.clearCache();

        switch (this.UserRole) {
          case "مشرف إداري": this.GetPatientsTransactionsOutsideByUserId();
            break;
          case "لجنة الحصر": this.GetPatientsTransactionsOutsideByUserRole();
            break;
        }

        this.modalRef.hide();

        this.pa.DeleteFile(this.AttachDelete.value).subscribe(
          result => {
            this.pa.clearCache();
          }
        )

        this.pa.DeleteFile(this.EntryAttachDelete.value).subscribe(
          result => {
            this.pa.clearCache();
          }
        )

      }
      )
    }
    else {
      this.deleteForm.setValue({
        'id': this.Did.value,
        'attach': this.AttachDelete.value,
        'entryAttach': ""
      });
       let deletepatiant = this.deleteForm.value;
    this.pa.DeleteReply(deletepatiant.id).subscribe(
      result => {
        this.pa.clearCache();
      }
    )

      this.pa.DeletePatientTransactionsOutside(deletepatiant.id).subscribe(result => {
      this.pa.clearCache();
      switch (this.UserRole) {
        case "مشرف إداري": this.GetPatientsTransactionsOutsideByUserId();
          break;
        case "لجنة الحصر": this.GetPatientsTransactionsOutsideByUserRole();
          break;
      }
      this.modalRef.hide();

      this.pa.DeleteFile(deletepatiant.attach).subscribe(
        result => {
          this.pa.clearCache();
        }
      )
    },
    )
    }
   
  }




  ViewlMedicalModal(p: PTransOutside) {
    this.modalMessage = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }

  onAddhotelMovementModal(items: PTransOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.PID.setValue(items.patientId);
    this.TRId.setValue(items.id);
    this.modalRef = this.modalService.show(this.modal);

  }

  //on submit save
  onSubmitAdd() {

    this.AddForm.setValue({
      'PatientId': this.PID.value,
      'TRId': this.TRId.value,
      'EntryDate': this.EntryDate.value,
      'HotelId': this.HotelId.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newHotel = this.AddForm.value;
    this.ho.AddHotelMovementByCountry(newHotel).subscribe(
      result => {
        this.ho.clearCache();
        this.GetPatientsTransactionsOutsideByUserId();
        this.modalMessage = "تم إضافة إجراء التسكين بنجاح";
      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )
    this.modalRef.hide();


    this.ho.UpdateFieldsByCountry(this.TRId.value).subscribe(
      result => {
        this.ho.clearCache();

      }
    )

    this.AddForm.reset();
  }


  ViewlModal(pat: PTransOutside) {
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }



  onAddTreatment(newtratment: PTransOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.pId.setValue(newtratment.patientId);
    this.trId.setValue(newtratment.id);
    this.modalRef = this.modalService.show(this.Treatmodal);

    this.fileText = " إرفاق ملف الإجراء الطبي pdf";

  }


  //on submit 
  AddTreatment() {
    this.AddTreatForm.setValue({
      'PatientId': this.pId.value,
      'TRId': this.trId.value,
      'Medical_Diagnosis': this.Medical_Diagnosis.value,
      'Date_Diagnosis': this.Date_Diagnosis.value,
      'HospitalCountryId': this.HospitalCountryId.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });
    let newtratment = this.AddTreatForm.value;
    this.tr.AddTreatmentMovement(newtratment).subscribe(
      result => {
        this.tr.clearCache();
        switch (this.UserRole) {
          case "مشرف إداري": this.GetPatientsTransactionsOutsideByUserId();
            break;
          case "لجنة الحصر": this.GetPatientsTransactionsOutsideByUserRole();
            break;
        }
        this.fileName = "";
      },
      error => this.modalMessage = "لم تتم عملية الإضافة "
    )

    this.modalRef.hide();
    this.AddTreatForm.reset();
  }



  onCloseMedicalFile(newtratment: PTransOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.PId.setValue(newtratment.patientId);
    this.TRID.setValue(newtratment.id);
    this.modalRef = this.modalService.show(this.closeFilemodal);
  }


  CloseFile() {
    this.CloseForm.setValue({
      'PatientId': this.PId.value,
      'TRID': this.TRID.value,
      'FileStatus': this.FileStatus.value,
      'Notes': this.Notes.value,
      'ClosingDate': this.ClosingDate.value,
      'UserId': this.UserId,
    });

    let closefile = this.CloseForm.value;
    this.tr.CloseMedicalFileByCommittees(closefile).subscribe(
      result => {
        this.tr.clearCache();
        this.pa.clearCache();
        switch (this.UserRole) {
          case "مشرف إداري": this.GetPatientsTransactionsOutsideByUserId();
            break;
          case "لجنة الحصر": this.GetPatientsTransactionsOutsideByUserRole();
            break;
        }
      },
      error => this.modalMessage = "لم تتم العملية بنجاح"
    )
    this.modalRef.hide();

    this.CloseForm.reset();
  }



  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDate'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }



}
