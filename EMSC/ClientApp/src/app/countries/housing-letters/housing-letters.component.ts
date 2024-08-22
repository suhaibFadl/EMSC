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
  selector: 'app-housing-letters',
  templateUrl: './housing-letters.component.html',
  styleUrls: ['./housing-letters.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HousingLettersComponent implements OnInit {

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

  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ten', 'eleventh','add'];


  AddForm!: FormGroup;
 // PID!: FormControl;
  TRID!: FormControl;
  HouLetterId!: FormControl;
  HotelId!: FormControl;
  EntryDate!: FormControl;
  Attach!: FormControl;


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
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('template') modal!: TemplateRef<any>;



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
    })

    this.TRID = new FormControl('', [Validators.required]);
    this.HouLetterId = new FormControl('', [Validators.required]);
    this.HotelId = new FormControl('', [Validators.required]);
    this.EntryDate = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();


    this.AddForm = this.fb.group({
      'TRID': this.TRID,
      'HouLetterId': this.HouLetterId,
      'EntryDate': this.EntryDate,
      'HotelId': this.HotelId,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    this.GetAllHousingLettersByCountryId();
   

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

  //عرض رسائل التسكين للمشرف الإداري وشركات التسكين في الساحة
  GetAllHousingLettersByCountryId() {
    this.re.clearCache();
    this.re.GetAllHousingLettersIncomingByCountryId(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.letterDateHouse || moment(data.letterDateHouse).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDateHouse).format('yyyy-MM-DD'));
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


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = <File>files[0];
    this.fileText = this.fileToUpload.name;
    this.fileText = "تم الرفع";
    const formData = new FormData();

    this.fileName = 'HEntryAttach_00_' + this.HouLetterId.value + '_' + Date.now().toString() + '.pdf';

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


  onAddhotelMovementModal(items: HousingLetter): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.TRID.setValue(items.trid);
    this.HouLetterId.setValue(items.id);

    this.modalRef = this.modalService.show(this.modal);
  }


  //on submit save
  onSubmitAdd() {

    this.AddForm.setValue({
      'TRID': this.TRID.value,
      'HouLetterId': this.HouLetterId.value,
      'EntryDate': this.EntryDate.value,
      'HotelId': this.HotelId.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    let newData = this.AddForm.value;
    this.re.AddHotelEntryProcedure(newData).subscribe(
      result => {
        this.re.clearCache();
        this.GetAllHousingLettersByCountryId();
        this.fileName = "";

        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0
      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )

    this.modalRef.hide();
    this.AddForm.reset();
  }


  //================================================================
  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDateHouse'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }


}
