import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Country } from '../../interfaces/country';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { PatientTrans } from '../../interfaces/patient-trans';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { TreatmentService } from '../../services/treatment.service';
import { Treatment } from '../../interfaces/treatment';
import { HospitalCountryService } from '../../services/hospital-country.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { HospitalsCountries } from '../../interfaces/hospitals-countries';
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
  selector: 'app-treatment-movements',
  templateUrl: './treatment-movements.component.html',
  styleUrls: ['./treatment-movements.component.css']
  ,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TreatmentMovementsComponent implements OnInit{


  date = new FormControl(moment());



  Treatment$!: Observable<Treatment[]>;
  Treatment: Treatment[] = [];

  LoginStatus$!: Observable<boolean>;

  dataSource!: MatTableDataSource<Treatment>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth','ten', 'edit', 'delete'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten', 'eleventh'];
  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten'];

  selection: any;


  UserId!: string;
  UserDate!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;
  UserCountryId!: string;
  CountryName!: string;

  changeid!: number;
  UserRole!: string;
  BranchUserId!: string;



  updateForm!: FormGroup;
  id!: FormControl;
  Medical_Diagnosis!: FormControl;
  Date_Diagnosis!: FormControl;
  Attach!: FormControl;
  pId!: FormControl;
  TRId!: FormControl;
  tpId!: FormControl;
  HospitalCountryId!: FormControl;

  AttachDelete!: FormControl;

  deleteForm!: FormGroup;
  Did!: FormControl;
  DidTr!: FormControl;

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsService,
    private br: BranchService,
    private co: CountryService,
    private hos: HospitalCountryService,
    private http: HttpClient,
    private tr: TreatmentService,
    private route: ActivatedRoute,

  ) { }


  fileToUpload!: File;
  fileText!: string;
  fileName = '';


  @Output() public onUploadFinished = new EventEmitter();

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches$!: Observable<Branch[]>;
  branches: Branch[] = [];

  HospitalCountry$!: Observable<HospitalsCountries[]>;
  HospitalCountry: HospitalsCountries[] = [];

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });



    //=======================initial update form   
    this.id = new FormControl('', [Validators.required]);
    this.pId = new FormControl('', [Validators.required]);
    this.TRId = new FormControl('', [Validators.required]);
    this.tpId = new FormControl('', [Validators.required]);
    this.Medical_Diagnosis = new FormControl('', [Validators.required]);
    this.Date_Diagnosis = new FormControl('', [Validators.required]);
    this.Attach = new FormControl('', [Validators.required]);
    this.HospitalCountryId = new FormControl('', [Validators.required]);


    this.updateForm = this.fb.group({
      'id': this.id,
      'PatientId': this.pId,
      'TRId': this.TRId,
      'Medical_Diagnosis': this.Medical_Diagnosis,
      'Date_Diagnosis': this.Date_Diagnosis,
      'HospitalCountryId': this.HospitalCountryId,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });
    //===============================================================
    //initialize delete form
    this.Did = new FormControl();
    this.AttachDelete = new FormControl();

    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        'attach': this.AttachDelete,


      });
    this.fileText = "إرفاق ملف pdf";



    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });

    this.co.GetCountries().subscribe(result => {
      this.countries = result;
    });


    this.GetPatientTransactionTreatmentByTrid();


    switch (this.UserRole) {
      case "مشرف طبي" || "مشرف إداري": this.GetHospitalsCountry();
        break;
      case "لجنة الحصر": this.GetHospitalsCountry2();
        break;
    }

  }
  

  GetPatientTransactionTreatmentByTrid() {
    let id = + this.route.snapshot.params['id'];

    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByTrid(id).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }
  GetPatientTransactionTreatmentByBranchId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTreatmentByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    });
  }

  GetAllTreatmentsProceduresManagement() {
    this.tr.clearCache();
    this.tr.GetAllTreatmentsProceduresManagement().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

    });
  }

 
  GetHospitalsCountry() {
    this.hos.clearCache();
    this.hos.GetHospitalsByCountryId(this.UserCountryId.toString()).subscribe(result => {
      this.HospitalCountry = result;
    });
  }

  GetHospitalsCountry2() {
    this.hos.clearCache();
    this.hos.GetHospitalsByCountryId("2099").subscribe(result => {
      this.HospitalCountry = result;
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
    this.fileName = 'Treat_'+ this.id.value + '_' + Date.now().toString() + '.pdf';

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


  //treatment update modal
  onUpdateModal(edittreatment: Treatment): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.id.setValue(edittreatment.id);
    this.pId.setValue(edittreatment.patientId);
    this.TRId.setValue(edittreatment.trId);
    this.Attach.setValue(edittreatment.attach);
    this.Medical_Diagnosis.setValue(edittreatment.medical_Diagnosis);
    this.Date_Diagnosis.setValue(edittreatment.date_Diagnosis);
    this.HospitalCountryId.setValue(edittreatment.hospitalCountryId);

   
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
        'PatientId': this.pId.value,
        'TRId': this.TRId.value,
        'Medical_Diagnosis': this.Medical_Diagnosis.value,
        'Date_Diagnosis': this.Date_Diagnosis.value,
        'HospitalCountryId': this.HospitalCountryId.value,
        'Attach': this.fileName,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    else if (this.fileName == '') {
      this.updateForm.setValue({
        'id': this.id.value,
        'PatientId': this.pId.value,
        'TRId': this.TRId.value,
        'Medical_Diagnosis': this.Medical_Diagnosis.value,
        'Date_Diagnosis': this.Date_Diagnosis.value,
        'HospitalCountryId': this.HospitalCountryId.value,
        'Attach': this.Attach.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    let edittreatment = this.updateForm.value;
    this.tr.UpdateTreatmentMovement(edittreatment.id, edittreatment).subscribe(
      result => {
        this.tr.clearCache();
        this.GetPatientTransactionTreatmentByTrid();
        this.modalRef.hide();
        this.updateForm.reset();
        this.fileName = '';
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0      },
      error => this.modalMessage = "لم تتم عملية التعديل "
    )
  }

  //Travel delete modal
  onDeleteModal(treatmmentdelete: Treatment) {
    this.modalMessage2 = "هل انت متأكد من عملية حذف الإجراء الطبي";

    this.Did.setValue(treatmmentdelete.id);
    this.AttachDelete.setValue(treatmmentdelete.attach);
    this.TRId.setValue(treatmmentdelete.trId);
    this.deleteForm.setValue({
      'id': this.Did.value,
      'attach': this.AttachDelete.value,
    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {

    let treatmmentdelete = this.deleteForm.value;
    this.tr.DeleteTreatmentMovement(treatmmentdelete.id).subscribe(result => {

      this.tr.clearCache();
      this.GetPatientTransactionTreatmentByTrid();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"     

      //this.tr.UpdateTreatmentFieldWhenDelete(this.TRId.value).subscribe(
      //  result => {
      //    this.tr.clearCache();
      //    this.pa.clearCache();

      //  }
      //)
    },
      error => this.modalMessage2 = "لا يمكن الحذف  لارتباطها ببيانات أخرى"
    )
    this.pa.DeleteFile(treatmmentdelete.attach).subscribe(
      result => {
        this.pa.clearCache();


      }
    )
   
  }

  selectedPatient!: PatientData;




  ViewlMedicalModal(pat: Treatment) {
    this.modalMessage = pat.medical_Diagnosis;

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
    this.GetPatientTransactionTreatmentByTrid();
  }


}
