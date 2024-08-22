import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Country } from '../../interfaces/country';
import { Reply } from '../../interfaces/reply';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormGroup, FormControl, Validators, ControlContainer, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import * as $ from 'jquery';
import { PatientTrans } from '../../interfaces/patient-trans';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ElementRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-letters-outside-incoming',
  templateUrl: './letters-outside-incoming.component.html',
  styleUrls: ['./letters-outside-incoming.component.css']
  ,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LettersOutsideIncomingComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsLettersOutsideService,
    private coun: CountryService,
    private br: BranchService,
    private re: ReplyService,
    private datepipe: DatePipe,
    private formBuilder: FormBuilder  ) {
    this.navLinks = [
      {
        label: 'قائمة رسائل ضم الجرحى للعلاج داخل ليبيا',
        link: '/management/letters-inside-incoming',
        index: 0
      },
      {
        label: 'قائمة رسائل ضم الجرحى للعلاج بالخارج',
        link: '/management/letters-outside-incoming',
        index: 1
      }
     
    ];
  }


  values = [{ value: 2, title: 'قبول' },
  { value: 1, title: 'رفض' }];
  favoriteSeason: number = 2;

  values2 = [{ value: 2, title: 'قبول المرافق' },
  { value: 1, title: 'رفض المرافق' }];
  counts: number = 2;

  @Input() titlee!: string;
  @Input() groupName!: string;
  @Input()
  value!: string;
  @Input() defaultValue!: string;
  @Input() isRequired!: boolean;


  dataSource!: MatTableDataSource<PTransOutside>;
  dataSource2!: MatTableDataSource<PTransOutside>;

  selection: any;

  ss: string = '';

  cc() {
    this.ss;
  }


  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigtht', 'ninth', 'ten', 'elevent','twelve', 'reply'];


  //updateForm the 
  updateForm!: FormGroup;
  Country!: FormControl;
  CountryId!: FormControl;
  pidUp!: FormControl;

  //replayForm the 
  replayForm!: FormGroup;
  Reply!: FormControl;
  PatientId!: FormControl;
  ReplyState!: FormControl;
  AttendState!: FormControl;
  id!: FormControl;
  TRID!: FormControl;
  PlcTreatment!: FormControl;
  Rid!: FormControl;

  UserId!: string;
  UserName!: string;
  ReplyDate!: string;
  UserRole!: string;


  changeid!: number;
  repId!: number;
  selectedpat!: PTransOutside;


  // Reply Modal
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('replayTemplate') replaymodal!: TemplateRef<any>;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;
  @ViewChild('viewAttendantTemplate') viewAttendantmodal!: TemplateRef<any>;

  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = -1;



  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;


  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  countries$!: Observable<Country[]>;
  countries: Country[] = [];


  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
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
    this.Reply = new FormControl('', [Validators.required]);
    this.ReplyState = new FormControl('', [Validators.required]);
    this.AttendState = new FormControl('', [Validators.required]);
    this.id = new FormControl('', [Validators.required]);
    this.TRID = new FormControl('', [Validators.required]);
    this.PlcTreatment = new FormControl('', [Validators.required]);

    this.replayForm = this.fb.group({
      'Reply': this.Reply,
      'UserId': this.UserId,
      'ReplyDate': this.ReplyDate,
      'ReplyState': this.ReplyState,
      'AttendState': this.AttendState,
    });

    this.GetAllP_TransactionsOutsideIsWaiting();

    this.GetBranches();
    this.GetCountries();

    this.ReplyState.setValue(2)
    this.AttendState.setValue(2)
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

  lengthData!: number;

  GetAllP_TransactionsOutsideIsWaiting() {
    this.pa.clearCache();
    this.pa.GetAllP_TransactionsOutsideIsWaiting().subscribe(data => {
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

        return a && b && c && d && e && f && g && h;
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


  //reply modal
  onReplyModal(rpid: PTransOutside): void {

    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";

    this.id.setValue(rpid.patientId);
    this.TRID.setValue(rpid.id);

    this.modalRef = this.modalService.show(this.modal);

    this.pa.GetPatAttendantByTRID(this.TRID.value).subscribe(data => {

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

    if (this.ckeckAttendant == 0) {
        this.replayForm.setValue({
          'Reply': this.Reply.value,
          'UserId': this.UserId,
          'ReplyDate': this.ReplyDate,
          'ReplyState': this.ReplyState.value,
          'AttendState': 0,
        });
    }

     
    else if (this.ckeckAttendant == 1) {

      if (this.ReplyState.value == 2 && this.AttendState.value == 2)
        this.replayForm.setValue({
          'Reply': this.Reply.value,
          'UserId': this.UserId,
          'ReplyDate': this.ReplyDate,
          'ReplyState': this.ReplyState.value,
          'AttendState': this.AttendState.value,
        });

      if (this.ReplyState.value == 1)
        this.replayForm.setValue({
          'Reply': this.Reply.value,
          'UserId': this.UserId,
          'ReplyDate': this.ReplyDate,
          'ReplyState': this.ReplyState.value,
          'AttendState': 1,
        });

      if (this.ReplyState.value == 2 && this.AttendState.value == 1)
        this.replayForm.setValue({
          'Reply': this.Reply.value,
          'UserId': this.UserId,
          'ReplyDate': this.ReplyDate,
          'ReplyState': this.ReplyState.value,
          'AttendState': this.AttendState.value,
        });

    }

 
    let newReply = this.replayForm.value;
    this.re.ReplyOnBranchByManagement(this.TRID.value, newReply).subscribe(
      result => {
        this.re.clearCache();
        this.pa.clearCache();
        this.GetAllP_TransactionsOutsideIsWaiting();
      

      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )
    this.modalRef.hide();
    this.replayForm.reset();
    this.ReplyState.setValue(2)
    this.AttendState.setValue(2)
  }



  ViewlMedicalModal(p: PTransOutside) {
    this.modalMessage = p.medicalDiagnosis;
    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }

  ckeckAttendant!: number;
  AttendantName!: string;
  AttendantPassportNom!: string;
  AttendantNationalNom!: number;
 

  GetPatAttendantByTRID(p: PTransOutside) {
    this.pa.clearCache();
    this.pa.GetPatAttendantByTRID(p.id).subscribe(data => {
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

  ViewlAttendantData(p: PTransOutside) {
    this.GetPatAttendantByTRID(p)
    this.modalMessage = "بيانات مرافق الجريح : " + p.patientName;

    this.modalRef = this.modalService.show(this.viewAttendantmodal);
  }

  clearModal() {
      this.AttendantName = "",
      this.AttendantPassportNom = "",
      this.AttendantNationalNom = 0,
      this.ckeckAttendant = 0;
  }



  resetBranchesFilter() {

    this.formControl.controls['branchName'].setValue(null);

  }
  resetCountriesFilter() {

    this.formControl.controls['country'].setValue(null);

  }

  resetLetterDate() {

    this.formControl.controls['letterDate'].setValue(null);

  }

  resetUserDate() {

    this.formControl.controls['userDate'].setValue(null);

  }

}
