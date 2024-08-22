import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
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
import { HttpClient, HttpEventType } from '@angular/common/http';

interface PersonType {
  name: string;
  id: number;
}

interface PatType {
  name: string;
  id: number;
}

const moment = _rollupMoment || _moment;

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
  selector: 'app-dispense-medication',
  templateUrl: './dispense-medication.component.html',
  styleUrls: ['./dispense-medication.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class DispenseMedicationComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private acct: AccountService,
    private PMDS: PatientsMainDataService,
    private phar: PharmacyService,
    private dep: DependencyService,
    private ev: InjuryEventsService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private http: HttpClient,

  ) { }

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];

  patTypes: PatType[] = [
    { name: 'حالة إنسانية', id: 1 },
    { name: 'جريح حرب', id: 2 },
  ];

  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'personAttach', 'fourth', 'fourth2','pharmacy', 'fifth', 'sixth', 'seventh', 'eighth',  'ninth', 'tenth','add'];

  // Modals
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;

  replyForm!: FormGroup;
  Id!: FormControl;
  MangDispensDate!: FormControl;
  MangDispensedAttach!: FormControl;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';
  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  UserId!: string;
  UserRole!: string;
  PharmacyId!: string;



  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  //==========================================================

  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserPharmacyId.subscribe(result => { this.PharmacyId = result });


    this.MangDispensDate = new FormControl('', [Validators.required]);
    this.MangDispensedAttach = new FormControl();
    this.Id = new FormControl();


    this.replyForm = this.fb.group({
      'Id': this.Id,
      'MangDispensDate': this.MangDispensDate,
      'MangDispensedAttach': this.MangDispensedAttach,
    });


    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      medEnName: '',
      userDate: '',
      phoneNumber: '',

    })

    this.fileText = "إرفاق ملف pdf";


    this.GetResponsedRequests();
    this.GetMedications();
  }

  GetResponsedRequests() {
    this.phar.clearCache();
    this.phar.GetResponsedRequestForDispensing().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.medEnName || data.medEnName.includes(filter.medEnName);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const j = !filter.personType || data.personType.toString().toLowerCase().includes(filter.personType);
        const i = !filter.patType || data.patType.toString().toLowerCase().includes(filter.patType);

        return a && b && c && d && g && h && j && i;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }



  GetMedications() {
    this.medications$ = this.phar.GetMedications();
    this.medications$.subscribe(result => {
      this.medications = result;
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

    this.fileName = this.Id.value + '_' + Date.now().toString() + '.pdf';

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


  onReplyModal(P: Pharmacy) {
    this.modalMessage1 = "الرجاء إدخال كافة البيانات المطلوبة ";

    this.modalRef = this.modalService.show(this.modal);

    this.Id.setValue(P.id);
  }


  onSubmit() {

    this.replyForm.setValue({
      'Id': this.Id.value,
      'MangDispensDate': this.MangDispensDate.value,
      'MangDispensedAttach': this.fileName,
    });

    let newData = this.replyForm.value;

    this.phar.DispenseMedicationByManagement(this.Id.value, newData).subscribe(
      result => {
        this.phar.clearCache();
        this.GetResponsedRequests();
        this.modalRef.hide();
        this.replyForm.reset();
        this.app.showToasterSuccess();
        this.ngOnInit();

        this.fileName = "";
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

      },
      error =>
        this.app.showToasterError()

    )
    //  this.replyForm.reset();
  }


  resetForm() {
    this.ngOnInit();
  }

  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }

}
