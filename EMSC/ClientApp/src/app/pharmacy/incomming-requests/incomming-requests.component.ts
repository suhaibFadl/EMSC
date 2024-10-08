import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive, Inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl, MinLengthValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
import { DOCUMENT } from '@angular/common';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


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
  selector: 'app-incomming-requests',
  templateUrl: './incomming-requests.component.html',
  styleUrls: ['./incomming-requests.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class IncommingRequestsComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private phar: PharmacyService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document

  ) { }


  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'personAttach', 'fourth','fourth2', 'fifth', 'sixth', 'seventh', 'print', 'add'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Modals
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('Lettertemplate') LetterModal!: TemplateRef<any>;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;

  replyForm!: FormGroup;
  Id!: FormControl;
  DispensedQuantity!: FormControl;
  DispensDate!: FormControl;
  OrderState!: FormControl;
  DispensedAttach!: FormControl;
  Notes!: FormControl;

  PrePrice!: FormControl;
  PreDays!: FormControl;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';
  public progress!: number;
  public message!: string;


  UserId!: string;
  UserRole!: string;
  PharmacyId!: string;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  @Output() public onUploadFinished = new EventEmitter();


  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserPharmacyId.subscribe(result => { this.PharmacyId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.PrePrice = new FormControl('', [Validators.required]);
    this.PreDays = new FormControl('', [Validators.required]);
    this.OrderState = new FormControl('');
    this.Id = new FormControl();


    this.replyForm = this.fb.group({
      'Id': this.Id,
      'PrePrice': this.PrePrice,
      'PreDays': this.PreDays,
      'OrderState': this.OrderState,
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

    this.GetNotResponsedRequests();
    this.GetMedications();
  }


  GetNotResponsedRequests() {
    this.phar.clearCache();
    this.phar.GetNotResponsedRequests(this.PharmacyId,1).subscribe(data => {
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


  onReplyModal(P: PatientData) {
    this.modalMessage1 = "الرجاء إدخال كافة البيانات المطلوبة ";

    this.modalRef = this.modalService.show(this.modal);

    this.Id.setValue(P.id);
  }


  onSubmit() {

    this.replyForm.setValue({
      'Id': this.Id.value,
      'PrePrice': this.PrePrice.value,
      'PreDays': this.PreDays.value,
      'OrderState': 5,
    });

      let newData = this.replyForm.value;

      this.phar.ResponseRequestMedication(this.Id.value, newData).subscribe(
        result => {
          this.phar.clearCache();
          this.GetNotResponsedRequests();
          this.modalRef.hide();
          this.replyForm.reset();
          this.app.showToasterSuccess();
          this.ngOnInit();
        },
        error =>
          this.app.showToasterError()

      )
  }

  resetForm() {
    this.ngOnInit();
  }

  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }



  viewLetter(P: PatientData) {
    const url = '/pharmacy/request-letter/' + P.id;
    window.open(url, '_blank');
  }


  createPdf() {
    // this.modalRef = this.modalService.show(this.LetterModal);

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
      this.modalRef.hide();

    });

  }


}
