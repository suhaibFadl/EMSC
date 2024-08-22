import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, TemplateRef, EventEmitter, ElementRef } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { Patients } from '../../interfaces/patients';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
@Component({
  selector: 'app-letters-inside-incoming',
  templateUrl: './letters-inside-incoming.component.html',
  styleUrls: ['./letters-inside-incoming.component.css']
})
export class LettersInsideIncomingComponent implements OnInit {

  TransInside!: Observable<PTransInside[]>;
  dataSource!: MatTableDataSource<PTransInside>;


  values = [{ value: 3, title: 'قبول' },
  { value: 4, title: 'رفض' }];
  favoriteSeason: number = 2;;



  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigtht', 'ninth','ten', 'reply' ];


  UserDate!: string;
  BRID!: number;



  UserId!: string;
  UserRole!: string;
  BranchUserId!: string;
  HospitalUserId!: string;


  selectedpat!: PTransInside;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;


  //replayForm the 
  replayForm!: FormGroup;
  PatientId!: FormControl;
  TRID!: FormControl;
  Reply!: FormControl;
  EntryDate!: FormControl;

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
    this.Reply = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.EntryDate = new FormControl('', [Validators.required]);
    // this.id = new FormControl('', [Validators.required]);

    this.replayForm = this.fb.group({
      'PatientId': this.PatientId,
      'TRId': this.TRID,
      'Reply': this.Reply,
      'EntryDate': this.EntryDate,
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

  GetAllPatientsByUserID() {
    this.pa.clearCache();
    this.pa.GetPatientsTransactionsInsideByUserId(this.UserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


  }
  ViewlMedicalModal(p: PTransInside) {
    this.modalMessage = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }



  //reply modal
  onReplyModal(rpid: PTransInside): void {
    this.modalMessage = "الرجاء تعبئة البيانات المطلوبة";

    this.PatientId.setValue(rpid.patientId);
    this.TRID.setValue(rpid.id);

    this.modalRef = this.modalService.show(this.modal);

  }

  //on submit reply
  onSubmit() {
    this.replayForm.setValue({
      'Reply': this.Reply.value,
      'TRId': this.TRID.value,
      'PatientId': this.PatientId.value,
      'EntryDate': this.EntryDate.value,
      'UserId': this.UserId

    });
    let newReply = this.replayForm.value;

    this.rh.ReplyOnBranchByHospitalInside(this.TRID.value, newReply).subscribe(
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
