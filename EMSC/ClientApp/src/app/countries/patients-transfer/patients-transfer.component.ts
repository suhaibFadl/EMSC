import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { CountryService } from '../../services/country.service';
import { TravelingService } from '../../services/traveling.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { TreatmentService } from '../../services/treatment.service';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
  selector: 'app-patients-transfer',
  templateUrl: './patients-transfer.component.html',
  styleUrls: ['./patients-transfer.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientsTransferComponent implements OnInit {
  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private tr: TreatmentService,
    private ts: TravelingService,
    private br: BranchService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder


  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('forwardtemplate') Forwardmodal!: TemplateRef<any>;
  @ViewChild('viewNotesTemplate') viewnotesmodal!: TemplateRef<any>;


  UserId!: string;
  CountryId!: string;
  UserRole!: string;
  UserDate!: string;


  search: any;
  selection: any;

  dataSource!: MatTableDataSource<PTransOutside>;
  dataSource2!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth','ten', 'add', 'transfer'];


  LoginStatus$!: Observable<boolean>;

  AddForm!: FormGroup;
  PID!: FormControl;
  TRId!: FormControl;
  FlightNom!: FormControl;
  FlightDate!: FormControl;
  AirlineName!: FormControl;
  Attach!: FormControl;


  ReferredForm!: FormGroup;
  PIDR!: FormControl;
  TRIdR!: FormControl;
  AttachR!: FormControl;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;

  @Output() public onUploadFinished = new EventEmitter();


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CountryId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.fileText = "إرفاق ملف pdf";

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      closingDate: '',
      userDate: '',
      phoneNumber: '',
    })


    this.PID = new FormControl('', [Validators.required]);
    this.TRId = new FormControl('', [Validators.required]);
    this.FlightNom = new FormControl('', [Validators.required]);
    this.FlightDate = new FormControl('', [Validators.required]);
    this.AirlineName = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();

    this.PIDR = new FormControl('', [Validators.required]);
    this.TRIdR = new FormControl('', [Validators.required]);
    this.AttachR = new FormControl();

    this.AddForm = this.fb.group({
      'PatientId': this.PID,
      'TRId': this.TRId,
      'FlightNom': this.FlightNom,
      'FlightDate': this.FlightDate,
      'AirlineName': this.AirlineName,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'UserRole': this.UserRole,

    });

    this.ReferredForm = this.fb.group({
      'PatientId': this.PIDR,
      'TRId': this.TRIdR,
      'Attach': this.AttachR,
      'CountryId': this.CountryId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });
    this.GetPatientsClosedFilesToTransferByCountryId();
    this.GetPatsRejected();
    this.GetBranches();
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetPatientsClosedFilesToTransferByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientsClosedFilesToTransferByCountryId(this.CountryId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.closingDate || moment(data.closingDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.closingDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }

  GetPatsRejected() {
    this.tr.clearCache();
    this.tr.GetPatsRejected(this.CountryId).subscribe(data => {
      this.dataSource2 = new MatTableDataSource(data);
      this.dataSource2.paginator = this.paginator2;

      //this.dataSource2.filterPredicate = ((data, filter) => {
      //  const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
      //  const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo);
      //  const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
      //  const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
      //  const e = !filter.country || data.country.toLowerCase().includes(filter.country);
      //  const f = !filter.closingDate || moment(data.closingDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.closingDate).format('yyyy-MM-DD'));
      //  const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
      //  const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

      //  return a && b && c && d && e && f && g && h;
      //}) as (PeriodicElement, string) => boolean;


      //this.formControl.valueChanges.subscribe(value => {
      //  const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
      //  this.dataSource2.filter = filter;
      //});
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
    this.fileName = 'TrBack_' + this.TRId.value + '_' + Date.now().toString() + '.pdf';

    formData.append('file', this.fileToUpload, this.fileName);
  //  this.fileName = this.fileToUpload.name;
    this.AttachR.setValue(this.fileName);

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


  onAddTravel(items: PTransOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.PID.setValue(items.patientId);
    this.TRId.setValue(items.id);
    this.modalRef = this.modalService.show(this.modal);

  }

  onForwardTrans(items: PTransOutside): void {
    this.modalMessage2 = "هل أنت متأكد من إحالة المعاملة للفرع الرئيسي؟";

    this.TRIdR.setValue(items.id);
    this.PIDR.setValue(items.patientId);
    this.modalRef = this.modalService.show(this.Forwardmodal);
  }

  onClickYes() {

    //this.AttachR.setValue(this.fileName);
    this.ReferredForm.setValue({
      'PatientId': this.PIDR.value,
      'TRId': this.TRIdR.value,
      'Attach': this.AttachR.value,
      'CountryId': this.CountryId,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newData = this.ReferredForm.value;

    this.ts.ReferredPatientFromCountry(newData).subscribe(
      result => {
        this.tr.clearCache();
        this.GetPatientsClosedFilesToTransferByCountryId();
        this.GetPatsRejected();
        this.fileName = "";
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
      },
      error => this.modalMessage = "يرجى المحاولة لاحقا"
    )

    this.modalRef.hide();
    this.ReferredForm.reset();

  }


  //on submit reply
  AddTravel() {

    this.AddForm.setValue({
      'PatientId': this.PID.value,
      'TRId': this.TRId.value,
      'FlightNom': this.FlightNom.value,
      'FlightDate': this.FlightDate.value,
      'AirlineName': this.AirlineName.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'UserRole': this.UserRole,
    });

    let newtravel = this.AddForm.value;

    this.ts.AddTravelingBack(newtravel).subscribe(
      result => {

        this.tr.clearCache();
        this.GetPatientsClosedFilesToTransferByCountryId();
        this.fileName = "";
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
      },
      error => this.modalMessage = "لم تتم عملية الإضافة "
    )

    this.modalRef.hide();
    this.AddForm.reset();
  }


  ViewlNotesModal(p: PTransOutside) {
    this.modalMessage = p.notes;

    this.modalRef = this.modalService.show(this.viewnotesmodal);
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetClosingDate() { this.formControl.controls['closingDate'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }




}
