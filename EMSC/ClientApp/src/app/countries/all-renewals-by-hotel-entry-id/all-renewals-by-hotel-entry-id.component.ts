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
import { ActivatedRoute } from '@angular/router';


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
  selector: 'app-all-renewals-by-hotel-entry-id',
  templateUrl: './all-renewals-by-hotel-entry-id.component.html',
  styleUrls: ['./all-renewals-by-hotel-entry-id.component.css'], providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AllRenewalsByHotelEntryIdComponent implements OnInit {

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
    private route: ActivatedRoute,
  ) { }

  LoginStatus$!: Observable<boolean>;


  dataSource!: MatTableDataSource<HousingLetter>;
  displayedColumns: string[] = ['index', 'first', 'second', 'third','fourth', 'edit', 'delete'];

  updateForm!: FormGroup;
  id!: FormControl;
  HotelId!: FormControl;
  RenewalDateStart!: FormControl;
  RenewalDateEnd!: FormControl;
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
      entryDate: '',
    })


    // update form
    this.id = new FormControl('', [Validators.required]);
    this.RenewalDateStart = new FormControl('', [Validators.required]);
    this.RenewalDateEnd = new FormControl('', [Validators.required]);
    this.Attach = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({

      'id': this.id,
      'RenewalDateStart': this.RenewalDateStart,
      'RenewalDateEnd': this.RenewalDateEnd,
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


    this.GetHotelRenewalProceduresByHotelEntryId()
    this.GetEntryAndLeavingProceduresByHotelEntryId()
}


  lengthData!: number;

 //عرض تجديدات الحجز في الفندق للجريح
  GetHotelRenewalProceduresByHotelEntryId() {
    let id = + this.route.snapshot.params['id'];

    this.re.clearCache();
    this.re.GetHotelRenewalProceduresByHotelEntryId(id).subscribe(data => {

        this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
     
    });
  }

  PatientName!: string;
  PassportNo!: string;
  NationalNo!: number;
  HousingLetterIndex!: string;
  HotelEntryDate!: string;
  LeavingDate!: string;
  HousingAttach!: string;
  EntryAttach!: string;
  LeavingAttach!: string;
  Country!: string;
  BranchName!: string;
  HotelName!: string;
  PersonType!: number;
  PatType!: number;

  GetEntryAndLeavingProceduresByHotelEntryId() {
    let id = + this.route.snapshot.params['id'];

    this.re.clearCache();
    this.re.GetEntryAndLeavingProceduresByHotelEntryId(id).subscribe(data => {
      this.PatientName = data[0].patientName;
      this.PassportNo = data[0].passportNo;
      this.NationalNo = data[0].nationalNo;
      this.HousingLetterIndex = data[0].letterIndex;
      this.HotelEntryDate = data[0].entryDate;
      this.LeavingDate = data[0].leavingDate;
      this.PersonType = data[0].personType;
      this.PatType = data[0].patType;
      this.HousingAttach = data[0].housingAttach;
      this.EntryAttach = data[0].entryAttach;
      this.LeavingAttach = data[0].leavingAttach;
      this.Country = data[0].country;
      this.BranchName = data[0].branchName;
      this.HotelName = data[0].hotelName;

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
    this.Attach.setValue(edithotel.attach);
    this.RenewalDateStart.setValue(edithotel.renewalDateStart);
    this.RenewalDateEnd.setValue(edithotel.renewalDateEnd);

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
        'RenewalDateStart': this.RenewalDateStart.value,
        'RenewalDateEnd': this.RenewalDateEnd.value,
        'Attach': this.fileName,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    else if (this.fileName == '') {

      this.updateForm.setValue({
        'id': this.id.value,
        'RenewalDateStart': this.RenewalDateStart.value,
        'RenewalDateEnd': this.RenewalDateEnd.value,        'Attach': this.Attach.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }

    let edithotel = this.updateForm.value;
    this.re.UpdateHoteRenewalProcedure(edithotel.id, edithotel).subscribe(
      result => {
        this.re.clearCache();
        this.GetHotelRenewalProceduresByHotelEntryId();

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
    this.modalMessage2 = "هل انت متأكد من عملية حذف اجراء تجديد الحجز في الفندق";

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
    this.re.DeleteHotelRenewalProcedure(hoteldelete.id).subscribe(result => {
      this.re.clearCache();

      this.GetHotelRenewalProceduresByHotelEntryId();
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


}
