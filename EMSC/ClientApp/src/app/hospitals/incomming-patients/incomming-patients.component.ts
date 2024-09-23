import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, TemplateRef, EventEmitter, ElementRef, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { Patients } from '../../interfaces/patients';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
import { CountryService } from '../../services/country.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { BranchService } from '../../services/branch.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ReplyHospitalService } from '../../services/reply-hospital.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { ClaimsService } from '../../services/claims.service';




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-incomming-patients',
  templateUrl: './incomming-patients.component.html',
  styleUrls: ['./incomming-patients.component.css']
})
export class IncommingPatientsComponent implements OnInit {

  TransInside!: Observable<PTransInside[]>;
  dataSource!: MatTableDataSource<PTransInside>;
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  values = [{ value: 3, title: 'قبول' },
  { value: 4, title: 'رفض' }];
  favoriteSeason: number = 2;;



  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigtht', 'ninth', 'ten', 'reply'];


  UserDate!: string;
  BRID!: number;

  isHospitalFileNoExist: boolean = false;

  UserId!: string;
  UserRole!: string;
  BranchUserId!: string;
  HospitalUserId!: string;
  id!: number;


  selectedpat!: PTransInside;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;


  //replayForm the 
  replayForm!: FormGroup;
  PatientId!: FormControl;
  TRID!: FormControl;
  Reply!: FormControl;
  OpenDate!: FormControl;
  FileNo!: FormControl;

  //id!: FormControl;
  pidUp!: FormControl;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsLettersInsideService,
    private rh: ReplyHospitalService,
    private count: CountryService,
    private br: BranchService,
    private cs: ClaimsService,
    private datepipe: DatePipe,
    private http: HttpClient
  ) {

  }


  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;



  ngOnInit(): void {


    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserHospitalId.subscribe(result => { this.HospitalUserId = result });


    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    //===============initial Reply form
    this.PatientId = new FormControl('', [Validators.required]);
    this.TRID = new FormControl('', [Validators.required]);
    //this.Reply = new FormControl('');
    this.OpenDate = new FormControl('', [Validators.required]);
    this.FileNo = new FormControl('', [Validators.required, Validators.minLength(3)]);
    // this.id = new FormControl('', [Validators.required]);

    this.replayForm = this.fb.group({
      'PatientId': this.PatientId,
     // 'TRId': this.TRID,
     // 'Reply': this.Reply,
      'OpenDate': this.OpenDate,
      'FileNo': this.FileNo,
      'UserId': this.UserId
    });



    this.GetAllPatientsTransByHospitalId();


  }

  lengthData!: number;

  GetAllPatientsTransByHospitalId() {
    this.pa.clearCache();
    this.pa.GetAllPatientsTransactionsInsideByHospitalId(this.HospitalUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
    });

  }

  //GetAllPatientsByUserID() {
  //  this.pa.clearCache();
  //  this.pa.GetPatientsTransactionsInsideByUserId(this.UserId.toString()).subscribe(data => {
  //    this.dataSource = new MatTableDataSource(data);
  //    this.dataSource.paginator = this.paginator;
  //    this.dataSource.sort = this.sort;
  //  });


  //}
  ViewlMedicalModal(p: PTransInside) {
    this.modalMessage = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }



  //reply modal
  onReplyModal(rpid: PTransInside): void {
    this.replayForm.reset();
    this.isHospitalFileNoExist = false;

    this.modalMessage = "الرجاء تعبئة البيانات المطلوبة";


    this.cs.GetPatientHospitalFileId(rpid.patientId, rpid.hospitalId).subscribe(data => {
      if (data != null) {
        this.isHospitalFileNoExist = data.fileNo ? true : false ;
        this.FileNo.setValue(data.fileNo);
      }
    });

    this.PatientId.setValue(rpid.patientId);
    this.TRID.setValue(rpid.id);

    this.modalRef = this.modalService.show(this.modal);

  }

  //on submit reply
  onSubmit() {
    this.replayForm.setValue({
     /* 'Reply': this.Reply.value,*/
      //'TRId': this.TRID.value,
      'PatientId': this.PatientId.value,
      'OpenDate': this.OpenDate.value,
      'UserId': this.UserId,
      'FileNo': this.FileNo.value

    });
    let newReply = this.replayForm.value;

    this.rh.OpenPatientFileInHospital(this.TRID.value, newReply).subscribe(
      result => {
        this.rh.clearCache();
        this.pa.clearCache();
        this.GetAllPatientsTransByHospitalId();
      },
      error => this.modalMessage = "لم يتم الرد على الفرع "
    )
    this.modalRef.hide();

    //this.rh.UpdateReplyStateByHospital(this.TRID.value).subscribe(
    //  result => {
    //    this.rh.clearCache();
    //    this.pa.clearCache();
    //    this.GetAllPatientsTransByHospitalId();
    //  }
    //)
    this.replayForm.reset();

  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
