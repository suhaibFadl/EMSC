import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Country } from '../../interfaces/country';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { PatientTrans } from '../../interfaces/patient-trans';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { HotelOutside } from '../../interfaces/hotel-outside';
import { HotelOutsideService } from '../../services/hotel-outside.service';
import { HousingLetter } from '../../interfaces/housing-letter';
import { HousingLettersService } from '../../services/housing-letters.service';
import { Router } from '@angular/router';


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

@Component({
  selector: 'app-hotels-entry-procedures',
  templateUrl: './hotels-entry-procedures.component.html',
  styleUrls: ['./hotels-entry-procedures.component.css'], providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HotelsEntryProceduresComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private hoOut: HotelOutsideService,
    private br: BranchService,
    private re: HousingLettersService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,


  ) { }

  LoginStatus$!: Observable<boolean>;


  dataSource!: MatTableDataSource<HousingLetter>;
  dataSource2!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten', 'eleventh', 'twelve', 'edit', 'delete', 'details', 'renewal','leaving'];


  updateForm!: FormGroup;
  id!: FormControl;
  HotelId!: FormControl;
  EntryDate!: FormControl;
  Attach!: FormControl;
  pId!: FormControl;
  trId!: FormControl;
  hmId!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;
  DidTr!: FormControl;
  AttachDelete!: FormControl;


  LeavingForm!: FormGroup;
  TRID!: FormControl;
  HotelEntryId!: FormControl;
  HouLetterId!: FormControl;
  LeavingDate!: FormControl;
  LeavingAttach!: FormControl;

  RenewalForm!: FormGroup;
  RTRID!: FormControl;
  RHotelEntryId!: FormControl;
  RHouLetterId!: FormControl;
  RenewalDateStart!: FormControl;
  RenewalDateEnd!: FormControl;
  RenewalAttach!: FormControl;
  Notes!: FormControl;



  UserId!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;
  UserDate!: string;

  changeid!: number;
  UserRole!: string;
  BranchUserId!: string;
  UserCountryId!: string;
  CountryName!: string;

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('Renewaltemplate') renewalmodal!: TemplateRef<any>;



  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  selection: any;

  @Output() public onUploadFinished = new EventEmitter();

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  Hotels: HotelOutside[] = [];
  Hotels$!: Observable<HotelOutside[]>;

  renewal!: number;
  currentDate!: number;
  currentMonth!: number;

  date!: Date;

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.fileText = "إرفاق ملف pdf";

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      letterDateHouse: '',
      userDate: '',
      phoneNumber: '',
      entryDate: '',
      hotelName: '',
    })

    // update form
    this.id = new FormControl('', [Validators.required]);
    this.HotelId = new FormControl('', [Validators.required]);
    this.EntryDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({

      'id': this.id,
      'HotelId': this.HotelId,
      'EntryDate': this.EntryDate,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });
    //==============================================================


    // delete form
    this.Did = new FormControl();
   // this.DidTr = new FormControl();
    this.AttachDelete = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        'attach': this.AttachDelete,
      });

        //==============================================================

    // leaving form
    this.HouLetterId = new FormControl('', [Validators.required]);
    this.TRID = new FormControl('', [Validators.required]);
    this.LeavingDate = new FormControl('', [Validators.required]);
    this.HotelEntryId = new FormControl('', [Validators.required]);
    this.LeavingAttach = new FormControl();

    this.LeavingForm = this.fb.group({
      'HouLetterId': this.HouLetterId,
      'TRID': this.TRID,
      'HotelEntryId': this.HotelEntryId,
      'LeavingDate': this.LeavingDate,
      'Attach': this.LeavingAttach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });

    // renewal form
    this.RHouLetterId = new FormControl('', [Validators.required]);
    this.RTRID = new FormControl('', [Validators.required]);
    this.RenewalDateStart = new FormControl('', [Validators.required]);
    this.RenewalDateEnd = new FormControl('', [Validators.required]);
    this.RHotelEntryId = new FormControl('', [Validators.required]);
    this.RenewalAttach = new FormControl();
    this.Notes = new FormControl();

    this.RenewalForm = this.fb.group({
      'HouLetterId': this.RHouLetterId,
      'TRID': this.RTRID,
      'HotelEntryId': this.RHotelEntryId,
      'RenewalDateStart': this.RenewalDateStart,
      'RenewalDateEnd': this.RenewalDateEnd,
      'Attach': this.RenewalAttach,
      'Notes': this.Notes,
      'UserId': this.UserId,
      'UserDate': this.UserDate,

    });

    this.GetHotelEntryProcedures();

    this.currentDate = new Date().getUTCDate();
    this.currentMonth = (new Date().getMonth() + 1);
    this.renewal = 0;

   
    //if (this.currentMonth != 2 && (this.currentDate == 10 || this.currentDate == 20 || this.currentDate == 30 || this.currentDate == 18 )) {
    //  this.renewal = 1;
    //}
    //else if (this.currentMonth == 2 && (this.currentDate == 10 || this.currentDate == 20 || this.currentDate == 28)) {
    //  this.renewal = 1;

    //}
    //else if (this.currentDate == 10 || this.currentDate == 20 || this.currentDate == 28 || this.currentDate == 30) {
    //  this.renewal = 0;

    //}

    this.GetCountries();
    this.GetBranches();
    this.GetHotels();
  }
 
  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countries = result;
    });
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetHotels() {
    this.hoOut.clearCache();
    this.hoOut.GetHotelsOutsideByCountryId(this.UserCountryId.toString()).subscribe(result => {
      this.Hotels = result;
    });
  }



  //عرض إجراءات الدخول للفنادق
  GetHotelEntryProcedures() {
    this.re.clearCache();
    this.re.GetHotelEntryProcedures(this.UserCountryId.toString()).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.hotelName || data.hotelName.toLowerCase().includes(filter.hotelName);
        const f = !filter.letterDateHouse || moment(data.letterDateHouse).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDateHouse).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.entryDate || moment(data.entryDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.entryDate).format('yyyy-MM-DD'));

        return a && b && c && d && e && f && g && h && i;
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

    this.fileName = 'HotelAttach_' + this.id.value + '_' + Date.now().toString() + '.pdf';

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






  //hotel update modal
  onUpdateModal(edithotel: HousingLetter): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوب تعديلها";

    this.id.setValue(edithotel.id);
    this.HotelId.setValue(edithotel.hotelId);
    this.Attach.setValue(edithotel.attach);
    this.EntryDate.setValue(edithotel.entryDate);

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
        'HotelId': this.HotelId.value,
        'EntryDate': this.EntryDate.value,
        'Attach': this.fileName,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    else if (this.fileName == '') {

      this.updateForm.setValue({
        'id': this.id.value,
        'HotelId': this.HotelId.value,
        'EntryDate': this.EntryDate.value,
        'Attach': this.Attach.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }

    let edithotel = this.updateForm.value;
    this.re.UpdateHotelEntryProcedure(edithotel.id, edithotel).subscribe(
      result => {
        this.re.clearCache();
        this.GetHotelEntryProcedures();

        this.modalRef.hide();
        this.updateForm.reset();
        this.fileName = '';
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

      },
      error => this.modalMessage = "لم تتم عملية التعديل "
    )
  }



  //hotel delete modal
  onDeleteModal(hoteldelete: HousingLetter) {
    this.modalMessage2 = "هل انت متأكد من عملية حذف اجراء الدخول إلى الساحة";

    this.Did.setValue(hoteldelete.id);
    this.AttachDelete.setValue(hoteldelete.attach);

    this.deleteForm.setValue({
      'id': this.Did.value,
      'attach': this.AttachDelete.value

    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }


  onDelete(): void {
    let hoteldelete = this.deleteForm.value;
    this.re.DeleteHotelEntryProcedure(hoteldelete.id).subscribe(result => {
      this.re.clearCache();

      this.GetHotelEntryProcedures();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.modalMessage2 = "لا يمكن حذف إجراء التسكين لارتباطه ببيانات أخرى"
    )
    this.pa.DeleteFile(this.AttachDelete.value).subscribe(
      result => {
        this.pa.clearCache();
      }
    )
  }


  onAddHotelLeavingModal(items: HousingLetter): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.TRID.setValue(items.trid);
    this.HouLetterId.setValue(items.houLetterId);
    this.HotelEntryId.setValue(items.id);

    this.modalRef = this.modalService.show(this.modal);
  }


  ////on submit save
  onSubmit() {

    this.LeavingForm.setValue({
      'TRID': this.TRID.value,
      'HotelEntryId': this.HotelEntryId.value,
      'HouLetterId': this.HouLetterId.value,
      'LeavingDate': this.LeavingDate.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newData = this.LeavingForm.value;

    this.re.AddHotelLeavingProcedure(newData).subscribe(
      result => {
        this.re.clearCache();
        this.GetHotelEntryProcedures();
        this.fileName = "";

        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )

    this.modalRef.hide();
    this.LeavingForm.reset();
  }


  onAddHotelRenewalModal(items: HousingLetter): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.RTRID.setValue(items.trid);
    this.RHouLetterId.setValue(items.houLetterId);
    this.RHotelEntryId.setValue(items.id);
    this.Notes.setValue("تجديد لمدة 10 أيام");
    this.RenewalDateStart.setValue(items.endDate);
    this.RenewalDateEnd.setValue(items.renewalDateEnd);

    this.modalRef = this.modalService.show(this.renewalmodal);
  }


  ////on submit save
  onSubmitRenewal() {

    this.RenewalForm.setValue({
      'HouLetterId': this.RHouLetterId.value,
      'TRID': this.RTRID.value,
      'HotelEntryId': this.RHotelEntryId.value,
      'RenewalDateStart': this.RenewalDateStart.value,
      'RenewalDateEnd': this.RenewalDateEnd.value,
      'Attach': this.fileName,
      'Notes': this.Notes.value,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newData = this.RenewalForm.value;

    this.re.AddHotelRenewalProcedure(newData).subscribe(
      result => {
        this.re.clearCache();
        this.GetHotelEntryProcedures();
        this.fileName = "";

        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )

    this.modalRef.hide();
    this.LeavingForm.reset();
  }



  onSelect(p: HousingLetter): void {
    this.router.navigateByUrl('/countries/all-renewals-by-hotel-entry-id/' + p.id);
  }


  //================================================================
  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetHotelName() { this.formControl.controls['hotelName'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDateHouse'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetEntryDate() { this.formControl.controls['entryDate'].setValue(null); }

}
