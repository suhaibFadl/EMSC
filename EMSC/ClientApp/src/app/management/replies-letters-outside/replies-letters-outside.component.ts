import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { ReplyMOutside } from '../../interfaces/reply-m-outside';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Country } from '../../interfaces/country';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { Reply } from '../../interfaces/reply';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

interface LetterStatues {
  name: string;
  id: number;
}

interface PersonType {
  name: string;
  id: number;
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
  selector: 'app-replies-letters-outside',
  templateUrl: './replies-letters-outside.component.html',
  styleUrls: ['./replies-letters-outside.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RepliesLettersOutsideComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private br: BranchService,
    private re: ReplyService,
    private datepipe: DatePipe,
    private formBuilder: FormBuilder
  ) { }

  statues: LetterStatues[] = [
   // { name: 'قيد الانتظار', id: 0 },
    { name: 'قيد الإجراء', id: 2 },
    { name: 'تم القبول', id: 3 },
    { name: 'تم الرفض من قِبل الإدارة', id: 1 },
    { name: 'تم الرفض من قِبل الساحة', id: 4 },
    { name: 'قائمة الانتظار', id: 6 },
    { name: 'تم إغلاق الملف', id: 5 },
  ];

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];

  selection: any;

  rere = [{ value: 2, title: 'قبول' },
  { value: 1, title: 'رفض' }];
  favoriteSeason: number = 2;

  @Input() titlee!: string;
  @Input() groupName!: string;
  @Input()
  value!: string;
  @Input() defaultValue!: string;
  @Input() isRequired!: boolean;




  // Updating the Reply
  updateForm!: FormGroup;
  _Reply!: FormControl;
  _PatientId!: FormControl;
  ReplyState!: FormControl;
  _id!: FormControl;
  _TRID!: FormControl;
  _Rid!: FormControl;


  dataSource!: MatTableDataSource<ReplyMOutside>;
  

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth',  'thirteen', 'seventh', 'ehigth', 'ninth', 'ten','eleventh','twelve', 'edit'];


  trId!: number;
  repId!: number;
  ReplyDate!: string;
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


  // Reply Modal
  @ViewChild('template') modal!: TemplateRef<any>;

  reply!: FormControl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // delete Modal
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('replayTemplate') replaymodal!: TemplateRef<any>;
  @ViewChild('viewTemplate') viewmodal!: TemplateRef<any>;

  countries$!: Observable<Country[]>;
  countries: Country[] = [];


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  ngOnInit(): void {
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.ReplyDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      countryId: '',
      branchName: '',
      letterDate: '',
      replyDate: '',
      phoneNumber: '',
      replyState: '',
      personType: '',

    })


    //===============initial Reply form
    //=======================initial update form
    this._id = new FormControl();
    this._Reply = new FormControl();
    this.ReplyState = new FormControl();
    this._TRID = new FormControl();

    this.updateForm = this.fb.group({
      'id': this._id,
      'Reply': this._Reply,
      'ReplyState': this.ReplyState,
      'UserId': this.UserId,
      'TRID': this._TRID,
      'ReplyDate': this.ReplyDate,
    });

    this.GetRepliesManagementTransactionsOutside();

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



  //=====================Get Replies Rejected======================
  GetRepliesManagementTransactionsOutside() {
    this.re.clearCache();
    this.re.GetRepliesManagementTransactionsOutside().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toString().toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.countryId || data.countryId.toString().toLowerCase().includes(filter.countryId);
        const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
        const g = !filter.replyDate || moment(data.replyDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.replyDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const i = !filter.replyState || data.replyState.toString().toLowerCase().includes(filter.replyState);
        const j = !filter.personType || data.personType.toString().toLowerCase().includes(filter.personType);

        return a && b && c && d && e && f && g && h && i && j;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }
  //===============================================
  // update modal
  onUpdateModal(editpatients: ReplyMOutside): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول المطلوبة";

    this._id.setValue(editpatients.id);
    this._Reply.setValue(editpatients.reply);
    this.ReplyState.setValue(editpatients.replyState);
    this._TRID.setValue(editpatients.trId);

    this.updateForm.setValue({
      'id': this._id.value,
      'Reply': this._Reply.value,
      'ReplyState': this.ReplyState.value,
      'UserId': this.UserId,
      'TRID': this._TRID.value,
      'ReplyDate': this.ReplyDate,

    });

    this.modalRef = this.modalService.show(this.editmodal);

  }


  onUpdate() {
    let editreply = this.updateForm.value;
    this.re.UpdateReplyManagementOutside(editreply.id, editreply.TRID, editreply).subscribe(
      result => {
        this.re.clearCache();
        this.GetRepliesManagementTransactionsOutside();

        this.modalRef.hide();

        this.modalMessage = "تم تعديل الرد";
      },
      error => this.modalMessage = "لم تتم العملية بنجاح"

    )
  }


  ViewlModal(pat: Reply) {

      this.modalMessage2 = "عرض سبب الرفض"
      this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }

  ViewlModal2(pat: Reply) {

      this.modalMessage2 = "عرض سبب الانتظار"
      this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }


    ViewlModal3(pat: Reply) {

      this.modalMessage2 = "عرض الملاحظات"
      this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null);}
  resetCountriesFilter() { this.formControl.controls['countryId'].setValue(null);}
  resetLetterDate() { this.formControl.controls['letterDate'].setValue(null);}
  resetUserDate() { this.formControl.controls['replyDate'].setValue(null); }
  resetReplyState() { this.formControl.controls['replyState'].setValue(null);}
  resetPersonType() { this.formControl.controls['personType'].setValue(null);}

}
