import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Country } from '../../interfaces/country';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { PatientTrans } from '../../interfaces/patient-trans';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TravelingService } from '../../services/traveling.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { TravelBack } from '../../interfaces/travel-back';
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
  selector: 'app-travelers-back',
  templateUrl: './travelers-back.component.html',
  styleUrls: ['./travelers-back.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TravelersBackComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private br: BranchService,
    private http: HttpClient,
    private tr: TravelingService,
    private formBuilder: FormBuilder

  ) { }

  LoginStatus$!: Observable<boolean>;


  dataSource!: MatTableDataSource<TravelBack>;

  displayedColumns3: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten', 'eleventh','twelve','thirteen'];
  displayedColumns4: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten', 'eleventh', 'twelve','thirteen', 'edit', 'delete'];
  displayedColumns5: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten','eleventh','twelve'];

  clickedRows = new Set<TravelingPr>();


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
  updateForm!: FormGroup;
  id!: FormControl;
  flightDate!: FormControl;
  airlineName!: FormControl;
  flightNom!: FormControl;
  attach!: FormControl;
  pId!: FormControl;
  trId!: FormControl;
  tpId!: FormControl;
  AttachDelete!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;
  DidTr!: FormControl;

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;



  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  selection: any;

  @Output() public onUploadFinished = new EventEmitter();

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

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
      flightDate: '',
      userDate: '',
      phoneNumber: '',
    })


    // update form
    this.id = new FormControl('', [Validators.required]);
    this.pId = new FormControl('', [Validators.required]);
    this.trId = new FormControl('', [Validators.required]);
    this.flightDate = new FormControl('', [Validators.required]);
    this.airlineName = new FormControl('', [Validators.required]);
    this.flightNom = new FormControl('', [Validators.required]);
    this.attach = new FormControl('', [Validators.required]);
    this.updateForm = this.fb.group({
      'id': this.id,
      'PatientId': this.pId,
      'TRId': this.trId,
      'flightDate': this.flightDate,
      'airlineName': this.airlineName,
      'flightNom': this.flightNom,
      'attach': this.attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
    });

    // delete form
    this.Did = new FormControl();
    this.DidTr = new FormControl();
    this.AttachDelete = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        'TRId': this.DidTr,
        'attach': this.AttachDelete,
        'UserRole': this.UserRole
      });


    switch (this.UserRole) {   
      case "مشرف تسكين": this.GetTravelingProceduresByUserId();
        break;    
      case "مشرف إداري": this.GetPatientTransactionTravelingByCountryId();
        break;
      case "الإدارة": this.GetPTravelBacktoInsideforManagement();
        break;
      case "مدير الفرع": this.GetPTravelBacktoInsideByBranchId();
        break;
      case "موظف إدخال الفرع": this.GetPTravelBacktoInsideByBranchId();
        break;

    }

    this.GetCountries();
    this.GetBranches();
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
  GetTravelingProceduresByUserId() {
    this.tr.clearCache();
    this.tr.GetTravelingProceduresByUserId(this.UserId.toString()).subscribe(data => {
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

    });
  }
  GetPatientTransactionTravelingByCountryId() {
    this.tr.clearCache();
    this.tr.GetPatientTransactionTravelingByCountryId(this.UserCountryId.toString()).subscribe(data => {
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


    });
  }
  GetPTravelBacktoInsideByBranchId() {
    this.tr.clearCache();
    this.tr.GetPTravelBacktoInsideByBranchId(this.BranchUserId.toString()).subscribe(data => {
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


    });
  }
  GetPTravelBacktoInsideforManagement() {
    this.tr.clearCache();
    this.tr.GetPTravelBacktoInsideforManagement().subscribe(data => {
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
    this.fileName = 'TrBack_'+ this.trId.value + '_' + Date.now().toString() + '.pdf';
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




  //Travel update modal
  onUpdateModal(edittravel: TravelingPr): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوب تعديلها";

    this.id.setValue(edittravel.id);
    this.pId.setValue(edittravel.patientId);
    this.trId.setValue(edittravel.trId);
    this.attach.setValue(edittravel.attach);
    this.flightDate.setValue(edittravel.flightDate);
    this.airlineName.setValue(edittravel.airlineName);
    this.flightNom.setValue(edittravel.flightNom);
    this.attach.setValue(edittravel.attach);

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    if (this.fileName != '') {
      this.pa.DeleteFile(this.attach.value).subscribe(
        result => {
          this.pa.clearCache();
        }
      )
      this.updateForm.setValue({
        'id': this.id.value,
        'PatientId': this.pId.value,
        'TRId': this.trId.value,
        'flightDate': this.flightDate.value,
        'airlineName': this.airlineName.value,
        'flightNom': this.flightNom.value,
        'attach': this.fileName,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    else if (this.fileName == '') {
      this.updateForm.setValue({
        'id': this.id.value,
        'PatientId': this.pId.value,
        'TRId': this.trId.value,
        'flightDate': this.flightDate.value,
        'airlineName': this.airlineName.value,
        'flightNom': this.flightNom.value,
        'attach': this.attach.value,
        'UserId': this.UserId,
        'UserDate': this.UserDate,
      });
    }
    let edittravel = this.updateForm.value;
    this.tr.UpdateTravelBack(edittravel.id, edittravel).subscribe(
      result => {
        this.tr.clearCache();
        switch (this.UserRole) {
          case "مشرف تسكين": this.GetTravelingProceduresByUserId();
            break;
          case "مشرف إداري": this.GetPatientTransactionTravelingByCountryId();
            break;

        }
        this.modalRef.hide();
        this.updateForm.reset();
        this.fileName = '';
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0      },
      //  error => this.modalMessage = "لم تتم عملية التعديل "
    )
  }

  //Travel delete modal
  onDeleteModal(traveldelete: TravelingPr) {
    this.modalMessage2 = "هل انت متأكد من عملية حذف إجراء التسفير";

    this.Did.setValue(traveldelete.id);
    this.DidTr.setValue(traveldelete.trId);
    this.AttachDelete.setValue(traveldelete.attach);
    this.deleteForm.setValue({
      'id': this.Did.value,
      'TRId': this.DidTr.value,
      'attach': this.AttachDelete.value,
      'UserRole': this.UserRole

    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let traveldelete = this.deleteForm.value;
    this.tr.DeleteTravelingBack(traveldelete.id, this.DidTr.value, this.UserRole).subscribe(result => {
      this.tr.clearCache();
      switch (this.UserRole) {
        case "مشرف تسكين": this.GetTravelingProceduresByUserId();
          break;
        case "مشرف إداري": this.GetPatientTransactionTravelingByCountryId();
          break;

      }
      this.modalRef.hide();
      this.deleteForm.reset();
      this.modalMessage2 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.modalMessage2 = "لا يمكن حذف إجراءات التسفير لارتباطه ببيانات أخرى"
    )
    this.pa.DeleteFile(traveldelete.attach).subscribe(
      result => {
        this.pa.clearCache();
      }
    )

    //this.tr.UpdateTravelFieldBackByCountry(this.DidTr.value).subscribe(
    //  result => {
    //    this.tr.clearCache();
    //  }
    //)

  }


  resetBranchesFilter() {this.formControl.controls['branchName'].setValue(null);}
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetflightDate() {this.formControl.controls['flightDate'].setValue(null); }
  resetUserDate() {this.formControl.controls['userDate'].setValue(null); }

}
