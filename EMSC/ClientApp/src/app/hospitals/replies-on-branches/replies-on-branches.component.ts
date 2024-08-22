import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef, Input, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { ReplyMOutside } from '../../interfaces/reply-m-outside';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ReplyHospitalService } from '../../services/reply-hospital.service';
import { Reply } from '../../interfaces/reply';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


import * as _moment from 'moment';
import * as _rollupMoment from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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
  selector: 'app-replies-on-branches',
  templateUrl: './replies-on-branches.component.html',
  styleUrls: ['./replies-on-branches.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RepliesOnBranchesComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private ho: HospitalService,
    private re: ReplyHospitalService,
    private datepipe: DatePipe,
  ) { }


  @Input() titlee!: string;
  @Input() groupName!: string;
  @Input()
  value!: string;
  @Input() defaultValue!: string;
  @Input() isRequired!: boolean;
  @Input() matcher!: ErrorStateMatcher;


  // Updating the Reply
  updateForm!: FormGroup;
  _Reply!: FormControl;
  _PatientId!: FormControl;
  _id!: FormControl;
  _TRID!: FormControl;
  EntryDate!: FormControl;
  _Rid!: FormControl;


  dataSource!: MatTableDataSource<Reply>;


  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigth','ninth','ten', 'edit'];


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
  HospitalUserId!: string;


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


  ngOnInit(): void {
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserHospitalId.subscribe(result => { this.HospitalUserId = result });
    this.ReplyDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    //=======================initial update form
    this._id = new FormControl();
    this._Reply = new FormControl();
   // this.ReplyState = new FormControl();
    this._TRID = new FormControl();
    this.EntryDate = new FormControl();

    this.updateForm = this.fb.group({
      'id': this._id,
      'Reply': this._Reply,
      'UserId': this.UserId,
      'TRID': this._TRID,
      'EntryDate': this.EntryDate,
    });

    this.GetRepliesByHospitalId();
  }

  //=====================Get Replies======================
  GetRepliesByHospitalId() {
    this.re.clearCache();
    this.re.GetRepliesByHospitalId(this.HospitalUserId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }


  //===============================================
  // update modal
  onUpdateModal(editpatients: Reply): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول المطلوبة";
    this._id.setValue(editpatients.id);
    this._Reply.setValue(editpatients.reply);
    this._TRID.setValue(editpatients.trId);
    this.EntryDate.setValue(editpatients.entryDate);

    this.updateForm.setValue({
      'id': this._id.value,
      'Reply': this._Reply.value,
      'UserId': this.UserId,
      'TRID': this._TRID.value,
      'EntryDate': this.EntryDate.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }


  onUpdate() {
    let editreply = this.updateForm.value;
    this.re.UpdateReplyByHospitalInside(editreply).subscribe(
      result => {
        this.re.clearCache();
        this.GetRepliesByHospitalId();
        this.modalRef.hide();
        this.updateForm.reset();
      },
      error => this.modalMessage = "لم تتم العملية بنجاح"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
