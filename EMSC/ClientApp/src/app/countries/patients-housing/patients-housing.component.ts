import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { ReplyService } from '../../services/reply.service';
import { CountryService } from '../../services/country.service';
import { TravelingService } from '../../services/traveling.service';
import { HotelMovementsService } from '../../services/hotel-movements.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { Reply } from '../../interfaces/reply';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { TreatmentService } from '../../services/treatment.service';
import { HotelOutside } from '../../interfaces/hotel-outside';
import { HotelOutsideService } from '../../services/hotel-outside.service';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../interfaces/branch';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

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
  selector: 'app-patients-housing',
  templateUrl: './patients-housing.component.html',
  styleUrls: ['./patients-housing.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientsHousingComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private tr: TravelingService,
    private treat: TreatmentService,
    private ho: HotelMovementsService,
    private hoOut: HotelOutsideService,
    private br: BranchService,
    private re: ReplyService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }
 
  dataSource!: MatTableDataSource<TravelingPr>;

  LoginStatus$!: Observable<boolean>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'twelve', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten', 'eleventh', 'add'];


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  AddForm!: FormGroup;
  PID!: FormControl;
  TRId!: FormControl;
  TPId!: FormControl;
  HotelId!: FormControl;
  EntryDate!: FormControl;
  Attach!: FormControl;
  //  Travel!: FormControl;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  selectedreply!: Reply;
  UserId!: string;
  BranchId!: string;
  UserRole!: string;
  UserDate!: string;
  CUserId!: string;
  //travel!: number;
  id!: number;

  // add Modal
  //  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('filter', { static: false }) filter!: ElementRef;


  selection: any;


  Replies$!: Observable<Reply[]>;
  Replies: Reply[] = [];

  Hotels$!: Observable<HotelOutside[]>;
  Hotels: HotelOutside[] = [];

  branches$!: Observable<Branch[]>;
  branches: Branch[] = [];

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];



  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;

  @Output() public onUploadFinished = new EventEmitter();




  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;


    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CUserId = result });

    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      flightDate: '',
      userDate: '',
      phoneNumber: '',
    })

    this.PID = new FormControl('', [Validators.required]);
    this.TRId = new FormControl('', [Validators.required]);
    this.TPId = new FormControl('', [Validators.required]);
    this.HotelId = new FormControl('', [Validators.required]);
    this.EntryDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();


    this.AddForm = this.fb.group({
      'PatientId': this.PID,
      'TRId': this.TRId,
      'TPId': this.TPId,
      'EntryDate': this.EntryDate,
      'HotelId': this.HotelId,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    this.fileText = "إرفاق ملف pdf";

    this.GetTravelingProceduresToHousingByCountryId();


    this.GetHotels();

    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });

  }

  //=====================Get Replies Accepted======================
  lengthData!: number;

  GetTravelingProceduresToHousingByCountryId() {
    this.ho.clearCache();
    this.tr.GetTravelingProceduresToHousingByCountryId(this.CUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.flightDate || moment(data.flightDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.flightDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });


      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
    });
  }

  GetHotels() {
    this.hoOut.clearCache();
    this.hoOut.GetHotelsOutsideByCountryId(this.CUserId.toString()).subscribe(result => {
      this.Hotels = result;
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

    this.fileName = 'Ho_'+this.TRId.value + '_' + this.TPId.value + '_' + Date.now().toString() + '.pdf';

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


  onAddhotelMovementModal(items: TravelingPr): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.PID.setValue(items.patientId);
    this.TRId.setValue(items.trId);
    this.TPId.setValue(items.id);

    this.modalRef = this.modalService.show(this.modal);

  }


  //on submit save
  onSubmitAdd() {

    this.AddForm.setValue({
      'PatientId': this.PID.value,
      'TRId': this.TRId.value,
      'TPId': this.TPId.value,
      'EntryDate': this.EntryDate.value,
      'HotelId': this.HotelId.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newHotel = this.AddForm.value;
    this.ho.AddHotelMovement(newHotel).subscribe(
      result => {
        this.ho.clearCache();
        this.GetTravelingProceduresToHousingByCountryId();
        this.fileName = "";

        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

        this.modalMessage = "تم إضافة إجراء الدخول إلى الساحة بنجاح";
      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )
    this.modalRef.hide();


    //this.ho.UpdateHotelField(this.TRId.value).subscribe(
    //  result => {
    //    this.tr.clearCache();

    //  }
    //)
    //this.treat.UpdateTreatmentField(this.TRId.value).subscribe(
    //  result => {
    //    this.tr.clearCache();
    //    this.pa.clearCache();

    //  }
    //)
    this.AddForm.reset();
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetflightDate() { this.formControl.controls['flightDate'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }


}