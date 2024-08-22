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
  selector: 'app-hotels-leaving-procedures',
  templateUrl: './hotels-leaving-procedures.component.html',
  styleUrls: ['./hotels-leaving-procedures.component.css'], providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HotelsLeavingProceduresComponent implements OnInit {

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
    private formBuilder: FormBuilder

  ) { }

  LoginStatus$!: Observable<boolean>;


  dataSource!: MatTableDataSource<HousingLetter>;
  dataSource2!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'edit'];


  updateForm!: FormGroup;
  id!: FormControl;
  LeavingDate!: FormControl;
  Attach!: FormControl;
  pId!: FormControl;
  trId!: FormControl;
  hmId!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;
  DidTr!: FormControl;
  AttachDelete!: FormControl;

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
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;


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
      leavingDate: '',
      hotelName: '',
    })

    // update form
    this.id = new FormControl('', [Validators.required]);
    this.LeavingDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({

      'id': this.id,
      'LeavingDate': this.LeavingDate,
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


    this.GetHotelLeavingProcedures();



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

  //عرض إجراءات مغادرة الفنادق
  GetHotelLeavingProcedures() {
    this.re.clearCache();
    this.re.GetHotelLeavingProcedures(this.UserCountryId.toString()).subscribe(data => {
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
        const i = !filter.leavingDate || moment(data.leavingDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.leavingDate).format('yyyy-MM-DD'));

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

    this.fileName = 'HotelLeavingAttach' + this.id.value + '_' + Date.now().toString() + '.pdf';

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
    this.Attach.setValue(edithotel.attach);
    this.LeavingDate.setValue(edithotel.leavingDate);

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
        'LeavingDate': this.LeavingDate.value,
        'Attach': this.fileName,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    else if (this.fileName == '') {

      this.updateForm.setValue({
        'id': this.id.value,
        'LeavingDate': this.LeavingDate.value,
        'Attach': this.Attach.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }

    let edithotel = this.updateForm.value;
    this.re.UpdateHotelLeavingProcedure(edithotel.id, edithotel).subscribe(
      result => {
        this.re.clearCache();
        this.GetHotelLeavingProcedures();
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
    this.modalMessage2 = "هل انت متأكد من عملية حذف اجراء مغادرة الفندق";

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
    this.re.DeleteHotelLeavingProcedure(hoteldelete.id).subscribe(result => {
      this.re.clearCache();

      this.GetHotelLeavingProcedures();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.modalMessage2 = "يوجد خطأ يرجى المحاولة لاحقاً"
    )
    this.pa.DeleteFile(this.AttachDelete.value).subscribe(
      result => {
        this.pa.clearCache();
      }
    )
  }


  //================================================================
  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetHotelsFilter() { this.formControl.controls['hotelName'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDateHouse'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }
  resetLeavingDate() { this.formControl.controls['leavingDate'].setValue(null); }


}
