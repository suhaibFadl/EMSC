import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, TemplateRef, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { Patients } from '../../interfaces/patients';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
import { HospitalService } from '../../services/hospital.service';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { ReplyService } from '../../services/reply.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { BranchService } from '../../services/branch.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Reply } from '../../interfaces/reply';
import * as $ from 'jquery';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ElementRef } from '@angular/core';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { ReplyMOutside } from '../../interfaces/reply-m-outside';
import { Branch } from '../../interfaces/branch';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { AppComponent } from '../../app.component';


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
  selector: 'app-reply-countries',
  templateUrl: './reply-countries.component.html',
  styleUrls: ['./reply-countries.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReplyCountriesComponent implements OnInit {
  LoginStatus$!: Observable<boolean>;

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private br: BranchService,
    private re: ReplyService,
    private formBuilder: FormBuilder,
    private app: AppComponent,

  ) { }



  // Updating the patients
  updateForm!: FormGroup;
  _Reply!: FormControl;
  _PatientId!: FormControl;
  _ReplyState!: FormControl;
  _id!: FormControl;
  _TRID!: FormControl;
  _Rid!: FormControl;

  dataSaved = false;
  employeeForm: any;
  PTransInside!: Observable<ReplyMOutside[]>;
  dataSource!: MatTableDataSource<ReplyMOutside>;
  massage = null;


  SelectedDate = null;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'tenth','eleventh', 'edit2'];

  selection: any;


  trId!: number;

  UserId!: string;
  UserName!: string;
  ReplyDate!: string;
  UserRole!: string;
  CUserId!: string;


  changeid!: number;
  repId!: number;
  selectedpat!: PTransOutside;


  // Reply Modal
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('replayTemplate') replaymodal!: TemplateRef<any>;
  @ViewChild('viewTemplate') viewmodal!: TemplateRef<any>;



  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];


  patients$!: Observable<Patients[]>;
  patients: Patients[] = [];

  pTransOutside$!: Observable<PTransOutside[]>;
  pTransOutside: PTransOutside[] = [];

  Replies$!: Observable<Reply[]>;
  Replies: Reply[] = [];


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;


  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;

  rere = [{ value: 3, title: 'قبول' },
  { value: 4, title: 'رفض' }];
  favoriteSeason: number = 2;

  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CUserId = result });
    this.ReplyDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      letterDate: '',
      replyDate: '',
      phoneNumber: '',
    })

    //=======================initial update form
    this._id = new FormControl();
    this._Reply = new FormControl();
    this._ReplyState = new FormControl();
    this._TRID = new FormControl();

    this.updateForm = this.fb.group({
      'id': this._id,
      'Reply': this._Reply,
      'ReplyState': this._ReplyState,
      'UserId': this.UserId,
      'TRID': this._TRID,
      'ReplyDate': this.ReplyDate,

    });

    switch (this.UserRole) {
      case "الإدارة": this.GetRepliesCountryTransactionsOutside();
        break;
      case "مشرف إداري": this.GetRepliesCountryTransactionsOutsideByCountryId();
        break;

    }

    this.GetBranches();

  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  GetRepliesCountryTransactionsOutsideByCountryId() {
    this.re.clearCache();
    this.re.GetRepliesCountryTransactionsOutsideByCountryId(this.CUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
        const g = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

    });

  }

  GetRepliesCountryTransactionsOutside() {
    this.re.clearCache();
    this.re.GetRepliesCountryTransactionsOutside().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
        const g = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

    });

  }
  // update modal
  onUpdateModal(editpatients: ReplyMOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوب تعديلها";

    this._id.setValue(editpatients.id);
    this._Reply.setValue(editpatients.reply);
    this._ReplyState.setValue(editpatients.replyState);
    this._TRID.setValue(editpatients.trId);



    this.updateForm.setValue({
      'id': this._id.value,
      'Reply': this._Reply.value,
      'ReplyState': this._ReplyState.value,
      'UserId': this.UserId,
      'TRID': this._TRID.value,
      'ReplyDate': this.ReplyDate,

    });

    this.modalRef = this.modalService.show(this.editmodal);

  }


  onUpdate() {
    let editreply = this.updateForm.value;
    this.re.UpdateReplyCountryOutside(editreply.id, editreply.TRID, editreply).subscribe(
      result => {
        this.re.clearCache();
        this.GetRepliesCountryTransactionsOutsideByCountryId();
        this.modalRef.hide();
      },
      error => this.app.showToasterError()

    )
  }



  ViewlModal(pat: Reply) {

    if (pat.replyState == 4) {
      this.modalMessage2 = "عرض سبب الرفض"
    }
    else if (pat.replyState = 6) {
      this.modalMessage2 = "عرض سبب الانتظار"

    }
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }

  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDate'].setValue(null); }
  resetUserDate() { this.formControl.controls['replyDate'].setValue(null); }


}




