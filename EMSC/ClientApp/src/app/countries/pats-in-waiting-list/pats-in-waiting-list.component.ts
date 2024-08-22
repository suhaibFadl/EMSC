import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, TemplateRef, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Patients } from '../../interfaces/patients';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
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
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { Branch } from '../../interfaces/branch';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';


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
  selector: 'app-pats-in-waiting-list',
  templateUrl: './pats-in-waiting-list.component.html',
  styleUrls: ['./pats-in-waiting-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatsInWaitingListComponent implements OnInit {
  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsLettersOutsideService,
    private coun: CountryService,
    private br: BranchService,
    private re: ReplyService,
    private formBuilder: FormBuilder
  ) { }


  values = [
    { value: 3, title: 'قبول' },
    { value: 4, title: 'رفض' },
  ];
  favoriteSeason: number = 2;;

  values2 = [{ value: 3, title: 'قبول المرافق' },
  { value: 4, title: 'رفض المرافق' }];
  counts: number = 2;

  dataSource!: MatTableDataSource<PTransOutside>;
  dataSource2!: MatTableDataSource<PTransOutside>;

  ss: string = '';

  cc() {
    this.ss;
  }


  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigtht', 'ninth', 'ten', 'reply'];

  //updateForm the 
  updateForm!: FormGroup;
  Country!: FormControl;
  CountryId!: FormControl;
  upid!: FormControl;

  //replayForm the 
  replayForm!: FormGroup;
  Reply!: FormControl;
  AttendState!: FormControl;
  ReplyState!: FormControl;
  TRId!: FormControl;
  pidUp!: FormControl;

  //ReplyDate!: FormControl;
  Rid!: FormControl;

  UserId!: string;
  UserName!: string;
  ReplyDate!: string;
  UserRole!: string;
  CUserId!: string;


  changeid!: number;
  repId!: number;
  selectedpat!: PTransOutside;
  selection: any;


  // Reply Modal
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('replayTemplate') replaymodal!: TemplateRef<any>;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;
  @ViewChild('viewAttendantTemplate') viewAttendantmodal!: TemplateRef<any>;



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


  ngOnInit(): void {


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
      userDate: '',
      phoneNumber: '',
    })

    //===============initial update hospital form
    this.pidUp = new FormControl('', [Validators.required]);
    this.CountryId = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group({
      'PateintId': this.pidUp,
      'CountryId': this.CountryId
    });



    //===============initial Reply form
    this.Reply = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.ReplyState = new FormControl('', [Validators.required]);
    this.AttendState = new FormControl('', [Validators.required]);
    this.TRId = new FormControl('', [Validators.required]);

    this.replayForm = this.fb.group({
      'Reply': this.Reply,
      'TRId': this.TRId,
      'UserId': this.UserId,
      'ReplyDate': this.ReplyDate,
      'ReplyState': this.ReplyState,
      'AttendState': this.AttendState,
    });


    this.GetAllPatientsInWaitingListByCountry();

    this.GetBranches();
    this.GetCountries();

    this.ReplyState.setValue(3)
    this.AttendState.setValue(0)
  }


  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  lengthData!: number;

  GetAllPatientsInWaitingListByCountry() {
    this.pa.clearCache();
    this.pa.GetAllPatientsInWaitingListByCountry(this.CUserId.toString()).subscribe(data => {
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
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && e && f && g && h && d;
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

  ckeckAttendant!: number;
  AttendantName!: string;
  AttendantPassportNom!: string;
  AttendantNationalNom!: number;


  GetPatAttendantByTRIDInWaitingList(id) {
    this.pa.clearCache();
    this.pa.GetPatAttendantByTRIDInWaitingList(id).subscribe(data => {
      this.dataSource2 = new MatTableDataSource(data);

      if (this.dataSource2.data.length == 1) {
        this.AttendantName = data[0].patientName,
          this.AttendantPassportNom = data[0].passportNo,
          this.AttendantNationalNom = data[0].nationalNo,
          this.ckeckAttendant = 1;
      }
      else if (this.dataSource2.data.length == 0) {
        this.ckeckAttendant = 0;
      }

    });
  }


  //reply modal
  onReplyModal(rpid: PTransOutside): void {

    this.modalMessage = "الرجاء تعبئة البيانات المطلوبة";

    this.TRId.setValue(rpid.id);
    this.modalRef = this.modalService.show(this.modal);



    this.pa.GetPatAttendantByTRIDInWaitingList(this.TRId.value).subscribe(data => {

      if (data.length == 1) {
        this.AttendantName = data[0].patientName,
          this.AttendantPassportNom = data[0].passportNo,
          this.AttendantNationalNom = data[0].nationalNo,
          this.ckeckAttendant = 1;

      }
      else if (data.length == 0) {
        this.ckeckAttendant = 0;
      }
    });

  }

  //on submit reply
  onSubmit() {

    if (this.ckeckAttendant == 0)
      this.replayForm.setValue({
        'Reply': this.Reply.value,
        'UserId': this.UserId,
        'ReplyDate': this.ReplyDate,
        'ReplyState': this.ReplyState.value,
        'AttendState': 0,
        'TRId': this.TRId.value,
      });

    else if (this.ckeckAttendant == 1) {

      if (this.ReplyState.value == 3 && this.AttendState.value == 3)
        this.replayForm.setValue({
          'Reply': this.Reply.value,
          'UserId': this.UserId,
          'ReplyDate': this.ReplyDate,
          'ReplyState': this.ReplyState.value,
          'AttendState': this.AttendState.value,
          'TRId': this.TRId.value,

        });

      if (this.ReplyState.value == 4)
        this.AttendState.setValue(4)
      this.replayForm.setValue({
        'Reply': this.Reply.value,
        'UserId': this.UserId,
        'ReplyDate': this.ReplyDate,
        'ReplyState': this.ReplyState.value,
        'AttendState': this.AttendState.value,
        'TRId': this.TRId.value,

      });

      //if (this.ReplyState.value == 6)
      //  this.AttendState.setValue(6)
      //this.replayForm.setValue({
      //  'Reply': this.Reply.value,
      //  'UserId': this.UserId,
      //  'ReplyDate': this.ReplyDate,
      //  'ReplyState': this.ReplyState.value,
      //  'AttendState': this.AttendState.value,
      //  'TRId': this.TRId.value,

      //});

      if (this.ReplyState.value == 3 && this.AttendState.value == 4)
        this.replayForm.setValue({
          'Reply': this.Reply.value,
          'UserId': this.UserId,
          'ReplyDate': this.ReplyDate,
          'ReplyState': this.ReplyState.value,
          'AttendState': this.AttendState.value,
          'TRId': this.TRId.value,
        });

    }


    let newReply = this.replayForm.value;

    this.re.ReplyOnBranchByCountry(this.TRId.value, newReply).subscribe(
      result => {
        this.re.clearCache();
        this.pa.clearCache();
        this.GetAllPatientsInWaitingListByCountry();

      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )
    this.modalRef.hide();
    this.replayForm.reset();

  }


  ViewlMedicalModal(p: PTransOutside) {
    this.modalMessage2 = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }


  ViewlAttendantData(p: PTransOutside) {
    this.GetPatAttendantByTRIDInWaitingList(p.id)
    this.modalMessage = "بيانات مرافق الجريح : " + p.patientName;

    this.modalRef = this.modalService.show(this.viewAttendantmodal);
  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetLetterDate() { this.formControl.controls['letterDate'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }


}
