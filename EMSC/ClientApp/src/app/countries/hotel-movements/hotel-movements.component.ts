import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Patients } from '../../interfaces/patients';
import { Country } from '../../interfaces/country';
import { Hospital } from '../../interfaces/hospital';
import { Reply } from '../../interfaces/reply';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { PatientTrans } from '../../interfaces/patient-trans';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TravelingService } from '../../services/traveling.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatInput } from '@angular/material/input';
import { HotelMovementsService } from '../../services/hotel-movements.service';
import { HotelMovement } from '../../interfaces/hotel-movement';
import { HotelOutside } from '../../interfaces/hotel-outside';
import { HotelOutsideService } from '../../services/hotel-outside.service';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


@Directive({
  selector: '[errorStateMatcherDirective]'
})

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

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
  selector: 'app-hotel-movements',
  templateUrl: './hotel-movements.component.html',
  styleUrls: ['./hotel-movements.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HotelMovementsComponent implements OnInit {
  LoginStatus$!: Observable<boolean>;


  TravelingPr!: Observable<HotelMovement[]>;
  dataSource!: MatTableDataSource<HotelMovement>;

  selection: any;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth','ninth', 'edit', 'delete'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten','eleventh','twelve'];
  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth','ten','eleventh'];
  displayedColumns3: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth','ten', 'edit', 'delete'];


  UserId!: string;
  RoleId!: string;
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


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private ho: HotelMovementsService,
    private hoout: HotelOutsideService,
    private br: BranchService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private tr: TravelingService,
    private formBuilder: FormBuilder

  ) { }


  fileToUpload!: File;
  fileText!: string;
  fileName = '';


  @Output() public onUploadFinished = new EventEmitter();

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches$!: Observable<Branch[]>;
  branches: Branch[] = [];


  HotelMov: HotelMovement[] = [];
  HotelMov$!: Observable<HotelMovement[]>;


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
    this.acct.currentUserRoleId.subscribe(result => { this.RoleId = result });
    this.fileText = "إرفاق ملف pdf";

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      entryDate: '',
      userDate: '',
      phoneNumber: '',
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
    this.DidTr = new FormControl();
    this.AttachDelete = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        'TRId': this.DidTr,
        'attach': this.AttachDelete,
      });

    switch (this.UserRole) {
      case "مشرف تسكين": this.GetHotelMovementsByCountryId(); 
        break;
      case "مشرف إداري": this.GetHotelMovementsByCountryId(); 
        break;
      case "الإدارة": this.GetHotelMovements();
        break;
      case "مدير الفرع": this.GetHotelMovementsByBranchId();
        break;
      case "موظف إدخال الفرع": this.GetHotelMovementsByBranchId();
        break;
      case "لجنة الحصر": this.GetHotelMovementsByCountryId();
        break;
    }

  //  this.GetHotelsOutsideByCountryId();


    switch (this.UserRole) {
      case "مشرف تسكين" : this.GetHotelsOutsideByCountryId();
        break;
      case  "مشرف إداري" : this.GetHotelsOutsideByCountryId();
        break;
      case "لجنة الحصر": this.GetHotelsOutsideByCountryId();
        break;
    }

    

    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });

    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countries = result;
    });
  
  }

  GetHotelsOutsideByCountryId() {
    this.hoout.clearCache();
    this.hoout.GetHotelsOutsideByCountryId(this.UserCountryId.toString()).subscribe(result => {
      this.Hotels = result;
    });

  }

  GetHotelMovementsByCountryId() {
    this.ho.clearCache();
    this.ho.GetHotelMovementsByCountryId(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.entryDate || moment(data.entryDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.entryDate).format('yyyy-MM-DD'));
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
  GetHotelMovementsByRoleId() {
    this.ho.clearCache();
    this.ho.GetHotelMovementsByRoleId(this.RoleId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.entryDate || moment(data.entryDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.entryDate).format('yyyy-MM-DD'));
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

  GetHotelMovementsByBranchId() {
    this.ho.clearCache();
    this.ho.GetHotelMovementsByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.entryDate || moment(data.entryDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.entryDate).format('yyyy-MM-DD'));
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

  GetHotelMovements() {
    this.ho.clearCache();
    this.ho.GetHotelMovements().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.entryDate || moment(data.entryDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.entryDate).format('yyyy-MM-DD'));
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

    this.fileName = 'Ho_'+this.trId.value + '_' + Date.now().toString() + '.pdf';

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
  onUpdateModal(edithotel: HotelMovement): void {
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
    this.ho.updateHotelMovements(edithotel.id, edithotel).subscribe(
      result => {
        this.tr.clearCache();
        switch (this.UserRole) {
          case "مشرف تسكين": this.GetHotelMovementsByCountryId();
            break;
          case "مشرف إداري": this.GetHotelMovementsByCountryId();
            break;
          case "لجنة الحصر": this.GetHotelMovementsByRoleId();
            break;
        }
        this.modalRef.hide();
        this.updateForm.reset();
        this.fileName = '';
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

        this.modalMessage = "تمت عملية التعديل بنجاح";
      },
      error => this.modalMessage = "لم تتم عملية التعديل "
    )
  }



  //hotel delete modal
  onDeleteModal(hoteldelete: HotelMovement) {
    this.modalMessage2 = "هل انت متأكد من عملية حذف اجراء الدخول إلى الساحة";

    this.Did.setValue(hoteldelete.id);
    this.DidTr.setValue(hoteldelete.trId);
    this.AttachDelete.setValue(hoteldelete.attach);
    this.deleteForm.setValue({
      'id': this.Did.value,
      'TRId': this.DidTr.value,
      'attach': this.AttachDelete.value

    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }
  onDelete(): void {
    let hoteldelete = this.deleteForm.value;
    this.ho.DeleteHotelMovements(hoteldelete.id).subscribe(result => {
      this.tr.clearCache();
      switch (this.UserRole) {
        case "مشرف تسكين": this.GetHotelMovementsByCountryId();
          break;
        case "مشرف إداري": this.GetHotelMovementsByCountryId();
          break;
        case "لجنة الحصر": this.GetHotelMovementsByRoleId();
          break;
      }
      this.modalRef.hide();
      this.deleteForm.reset();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.modalMessage2 = "لا يمكن حذف إجراء التسكين لارتباطه ببيانات أخرى"
    )
    this.pa.DeleteFile(hoteldelete.attach).subscribe(
      result => {
        this.pa.clearCache();
      }
    )
    //this.ho.UpdateHotelField(this.DidTr.value).subscribe(
    //  result => {
    //    this.tr.clearCache();

    //  }
    //)
  }


  resetBranchesFilter() {

    this.formControl.controls['branchName'].setValue(null);

  }
  resetCountriesFilter() {

    this.formControl.controls['country'].setValue(null);

  }

  resetentryDate() {

    this.formControl.controls['entryDate'].setValue(null);

  }

  resetUserDate() {

    this.formControl.controls['userDate'].setValue(null);

  }


}


















