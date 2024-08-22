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
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

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
  selector: 'app-medications-provided-pats',
  templateUrl: './medications-provided-pats.component.html',
  styleUrls: ['./medications-provided-pats.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class MedicationsProvidedPatsComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private acct: AccountService,
    private phar: PharmacyService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private http: HttpClient,
    private pa: PatientsLettersOutsideService,

    @Inject(DOCUMENT) private document

  ) { }

  @Output() public onUploadFinished = new EventEmitter();


  //====================================تحديد عدد الأعمدة في الجدول

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'personAttach', 'fourth', 'fourth2','pharmacy', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelve','edit'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;


  updateForm!: FormGroup;
  Id!: FormControl;
  MangDispensedAttach!: FormControl;
  MangDispensDate!: FormControl;


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  patients: PatientData[] = [];
  patients$!: Observable<PatientData[]>;


  UserId!: string;
  UserRole!: string;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  public progress!: number;
  public message!: string;


  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    this.Id = new FormControl();
    this.MangDispensDate = new FormControl('', [Validators.required]);
    this.MangDispensedAttach = new FormControl('');



    this.updateForm = this.fb.group({
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
      orderState: '',
    })

    this.GetMedications();
    this.GetMedicationsProvidedToPatients();

    this.fileText = "استبدال المرفقات";

  }


  GetMedicationsProvidedToPatients() {
    this.phar.clearCache();
    this.phar.GetMedicationsProvidedToPatients().subscribe(data => {
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
        const i = !filter.orderState || data.orderState.toString().toLowerCase().includes(filter.orderState);

        return a && b && c && d && g && h && i;

      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }


  GetMedications() {
    this.phar.clearCache();
    this.phar.GetMedications().subscribe((result: any) => {
      this.medications = result;
    });
  }


  onUpdateModal(P: Pharmacy) {
    this.modalMessage1 = "الرجاء إدخال كافة البيانات المطلوبة ";

    this.modalRef = this.modalService.show(this.editmodal);

    this.Id.setValue(P.id);
    this.MangDispensedAttach.setValue(P.mangDispensedAttach);
    this.MangDispensDate.setValue(P.mangDispensDate);

  }

  onSubmit() {

    if (this.fileName != '') {
      this.pa.DeleteFile(this.MangDispensedAttach.value).subscribe(
        result => {
          this.pa.clearCache();
        }
      )
      this.updateForm.setValue({
        'Id': this.Id.value,
        'MangDispensDate': this.MangDispensDate.value,
        'MangDispensedAttach': this.fileName,
      });

    }
    else if (this.fileName == '') {
      this.updateForm.setValue({
        'Id': this.Id.value,
        'MangDispensDate': this.MangDispensDate.value,
        'MangDispensedAttach': this.MangDispensedAttach.value,
      });
    }

    let newData = this.updateForm.value;

    this.phar.UpdateMedicationDispensedByManag(this.Id.value, newData).subscribe(
      result => {
        this.phar.clearCache();
        this.GetMedicationsProvidedToPatients();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error =>
        this.app.showToasterError()

    )

  }



  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }
  resetOrderState() { this.formControl.controls['orderState'].setValue(null); }

  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }


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

}
