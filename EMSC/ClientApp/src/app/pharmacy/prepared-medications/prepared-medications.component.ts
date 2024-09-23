import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';
import { PatientData } from '../../interfaces/patient-data';
import { Pharmacy } from '../../interfaces/pharmacy';
import { AccountService } from '../../services/account.service';
import { PharmacyService } from '../../services/pharmacy.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpEventType } from '@angular/common/http';

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

@Component({
  selector: 'app-prepared-medications',
  templateUrl: './prepared-medications.component.html',
  styleUrls: ['./prepared-medications.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class PreparedMedicationsComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private modalService: BsModalService,
    private acct: AccountService,
    private phar: PharmacyService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private http: HttpClient,

  ) { }


  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'personAttach', 'fourth', 'fourth2', 'fifth', 'sixth', 'print', 'seventh', 'eight', 'ninth', 'tenth','eleventh'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('template') modal!: TemplateRef<any>;

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

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  UserId!: string;
  UserRole!: string;
  BranchUserId!: string;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });

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
      personType: '',
      patType: '',

    })
    this.fileText = "إرفاق ملف pdf";

    this.GetMedications();
    this.GetALLMedcationsPreparedFromPharmacy();

  }

  GetALLMedcationsPreparedFromPharmacy() {
    this.phar.clearCache();
    this.phar.GetALLMedcationsPreparedFromPharmacy(this.BranchUserId).subscribe(data => {
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
    this.phar.clearCache();
    this.phar.GetMedications().subscribe((result: any) => {
      this.medications = result;
    });
  }

  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }

  viewLetter(P: PatientData) {

    // this.router.navigateByUrl('/branches/p-details/' + patiant.id);

    const url = '/pharmacy/request-letter/' + P.id;
    window.open(url, '_blank');

    //  this.router.navigateByUrl('/pharmacy/request-letter/' + P.id);
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
        this.GetALLMedcationsPreparedFromPharmacy();
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

}
