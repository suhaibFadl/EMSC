import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Patients } from '../../interfaces/patients';
import { Country } from '../../interfaces/country';
import { Hospital } from '../../interfaces/hospital';
import { Reply } from '../../interfaces/reply';
import { ReplyMInside } from '../../interfaces/reply-m-inside';
import { PatientsService } from '../../services/patients.service';
import { CountryService } from '../../services/country.service';
import { HospitalService } from '../../services/hospital.service';
import { ReplyService } from '../../services/reply.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { TravelingService } from '../../services/traveling.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { HttpClient, HttpEventType } from '@angular/common/http';



@Component({
  selector: 'app-reply-inside',
  templateUrl: './reply-inside.component.html',
  styleUrls: ['./reply-inside.component.css']
})
export class ReplyInsideComponent implements OnInit {




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
  TravelingPr!: Observable<ReplyMInside[]>;
  dataSource!: MatTableDataSource<ReplyMInside>;
  selection = new SelectionModel<ReplyMInside>(true, []);
  employeeIdUpdate = null;
  massage = null;

  //PatientId = null;
  StateId = null;
  SelectedDate = null;
  isMale = true;
  isFeMale = false;
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'letterIndexNO', 'fourth', 'fifth', 'branchName', 'userName', 'sixth', 'eighth', 'edit2'];
  clickedRows = new Set<ReplyMInside>();


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

  constructor(private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private pa: PatientsService,
    private coun: CountryService,
    private ho: HospitalService,
    private re: ReplyService,
    private datepipe: DatePipe,
  ) { }


  countries: Country[] = [];
  countries$!: Observable<Country[]>;


  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;




  ngOnInit(): void {
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.ReplyDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    //===============initial Reply form
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


    this.countries$ = this.coun.GetCountries();
    this.countries$.subscribe(result => {
      this.countries = result;
    });





    this.GetRepliesManagementTransactionsInside();


  }

  //=====================Get Replies Rejected======================
  GetRepliesManagementTransactionsInside() {
    this.re.clearCache();
    this.re.GetRepliesManagementTransactionsInside().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }
  //===============================================
  // update modal
  onUpdateModal(editpatients: ReplyMInside): void {
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
    this.re.UpdateReplyManagementInside(editreply.id, editreply.TRID, editreply).subscribe(
      result => {
        this.re.clearCache();
        this.GetRepliesManagementTransactionsInside();

        this.modalRef.hide();

        this.modalMessage = "تم تعديل المعاملة";
      },
      error => this.modalMessage = "لم يتم تعديل المعاملة"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}



