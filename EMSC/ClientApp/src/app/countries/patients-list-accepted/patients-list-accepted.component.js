////import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, TemplateRef, EventEmitter } from '@angular/core';
////import { AccountService } from '../../services/account.service';
////import { Observable, Subject } from 'rxjs';
////import { PatientsService } from '../../services/patients.service';
////import { Patients } from '../../interfaces/patients';
////import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
////import { Router, ActivatedRoute } from '@angular/router';
////import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
////import { DataTableDirective } from 'angular-datatables';
////import { DatePipe, formatDate } from '@angular/common';
////import { Hospital } from '../../interfaces/hospital';
////import { HospitalService } from '../../services/hospital.service';
////import { Country } from '../../interfaces/country';
////import { CountryService } from '../../services/country.service';
////import { BranchUser } from '../../interfaces/branch-user';
////import { PatientTrans } from '../../interfaces/patient-trans';
////import { BranchService } from '../../services/branch.service';
////import { HttpClient, HttpEventType } from '@angular/common/http';
////import { Reply } from '../../interfaces/reply';
////@Component({
////  selector: 'app-patients-list-accepted',
////  templateUrl: './patients-list-accepted.component.html',
////  styleUrls: ['./patients-list-accepted.component.css']
////})
////export class PatientsListAcceptedComponent implements OnInit, OnDestroy {
////  constructor(private fb: FormBuilder,
////    private chRef: ChangeDetectorRef,
////    private router: Router,
////    private modalService: BsModalService,
////    private rout: ActivatedRoute,
////    private acct: AccountService,
////    private pa: PatientsService,
////    private ho: HospitalService,
////    private count: CountryService,
////    private br: BranchService,
////    private datepipe: DatePipe,
////    private http: HttpClient,
//// //   private re: ReplyService,
////  ) { }
////  // Update Modal
////  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
////  @ViewChild('template') modal!: TemplateRef<any>;
////  // reject Modal
////  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
////  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
////  //replayForm the 
////  replayForm!: FormGroup;
////  Reply!: FormControl;
////  PatientId!: FormControl;
////  ReplyState!: FormControl;
////  //UserId!: FormControl;
////  //ReplyDate!: FormControl;
////  id!: FormControl;
////  TRID!: FormControl;
////  pidUp!: FormControl;
////  //ReplyDate!: FormControl;
////  Rid!: FormControl;
////  deleteForm!: FormGroup;
////  Did!: FormControl;
////  patients$!: Observable<Patients[]>;
////  patients: Patients[] = [];
////  pTransactions$!: Observable<PatientTrans[]>;
////  pTransactions: PatientTrans[] = [];
////  data: BranchUser[] = [];
////  data$!: Observable<BranchUser[]>;
////  //selectedpat!: PatientTrans;
////  //UserId!: string;
////  //UserRole!: string;
////  UserId!: string;
////  ReplyDate!: string;
////  UserRole!: string;
////  modalRef!: BsModalRef;
////  modalMessage!: string;
////  modalMessage2!: string;
////  // Datatables Properties
////  dtOptions: DataTables.Settings = {};
////  dtTrigger: Subject<any> = new Subject();
////  countries: Country[] = [];
////  countries$!: Observable<Country[]>;
////  hospitals: Hospital[] = [];
////  hospitals$!: Observable<Hospital[]>;
////  rerender() {
////    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
////      // Destroy the table first in the current context
////      dtInstance.destroy();
////      // Call the dtTrigger to rerender again
////      this.dtTrigger.next();
////    });
////  }
////  reloadCurrentPage() {
////    window.location.reload();
////  }
////  ngOnInit(): void {
////    this.acct.currentuserid.subscribe(result => { this.UserId = result });
////    this.ReplyDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
////    //initialize delete form
////    this.Did = new FormControl();
////    this.deleteForm = this.fb.group(
////      {
////        'id': this.Did,
////      });
////    //===============initial Reply form
////    this.Reply = new FormControl('', [Validators.required, Validators.maxLength(50)]);
////    this.ReplyState = new FormControl('', [Validators.required]);
////    this.id = new FormControl('', [Validators.required]);
////    this.TRID = new FormControl('', [Validators.required]);
////    this.replayForm = this.fb.group({
////      // 'id': this.id,
////      'Reply': this.Reply,
////      'TRId': this.TRID,
////      'UserId': this.UserId,
////      'PatientId': this.id,
////      'ReplyDate': this.ReplyDate,
////      'ReplyState': this.ReplyState,
////    });
////    this.dtOptions = {
////      pagingType: 'full_numbers',
////      pageLength: 8,
////      autoWidth: true,
////      order: [[0, 'asc']],
////      //  responsive: true,
////      /* below is the relevant part, e.g. translated to spanish */
////      language: {
////        processing: "Procesando...",
////        search: "بحث:",
////        lengthMenu: "عرض _MENU_مدخلات",
////        info: "عرض من _START_ إلى _END_ من أصل _TOTAL_ مدخلات",
////        infoEmpty: "عرض ningún elemento.",
////        infoFiltered: "(filtrado _MAX_ elementos total)",
////        infoPostFix: "",
////        loadingRecords: "Cargando registros...",
////        zeroRecords: "لا يوجد بيانات ليتم عرضها",
////        emptyTable: "لا توجد بيانات ليتم عرضها",
////        paginate: {
////          first: "أولا",
////          previous: "السابق",
////          next: "التالي",
////          last: "الاخير"
////        },
////        aria: {
////          sortAscending: ":ترتيب تصاعدي",
////          sortDescending: ": ترتيب تنازلي"
////        }
////      }
////    };
////    console.log("UserId : " + this.UserId);
////    console.log("UserRole : " + this.UserRole);
////    //this.hospitals$ = this.ho.GetHospitals();
////    //this.hospitals$.subscribe(result => {
////    //  this.hospitals = result;
////    //  console.log(this.hospitals);
////    //});
////    //this.countries$ = this.count.GetCountries();
////    //this.countries$.subscribe(result => {
////    //  this.countries = result;
////    //  console.log(this.countries);
////    //});
////    this.pTransactions$ = this.pa.GetAllPatientsIsAcceptedByManagment();
////    this.pTransactions$.subscribe(result => {
////      this.pTransactions = result;
////      console.log(this.pTransactions);
////      this.chRef.detectChanges();
////      this.dtTrigger.next();
////    });
////  }
////  onReplyModal(rpid: PatientTrans): void {
////    this.id.setValue(rpid.patientId);
////    this.TRID.setValue(rpid.id);
////    console.log("PID is :" + rpid.patientId);
////    console.log("TRID is :" + this.TRID.value);
////    this.replayForm.setValue({
////      'Reply': this.Reply.value,
////      'TRId': this.TRID.value,
////      'UserId': this.UserId,
////      'PatientId': this.id.value,
////      'ReplyDate': this.ReplyDate,
////      'ReplyState': this.ReplyState,
////    });
////    this.modalRef = this.modalService.show(this.modal);
////  }
////  //onSubmit() {
////  //  let newReply = this.replayForm.value;
////  //  this.re.ReplyOnBranch(newReply).subscribe(
////  //    result => {
////  //      this.pa.clearCache();
////  //      this.pTransactions$ = this.pa.GetAllPatientsIsWaiting();
////  //      this.pTransactions$.subscribe(result => {
////  //        this.pTransactions = result;
////  //        this.chRef.detectChanges();
////  //        this.dtTrigger.next();
////  //      });
////  //      console.log(newReply.Reply);
////  //      console.log(newReply.PatientId);
////  //      this.modalMessage = "تم الرد على الفرع بنجاح";
////  //    },
////  //    error => this.modalMessage = "لم يتم الرد على الفرع "
////  //  )
////  //  this.re.UpdateReplyState(this.TRID.value).subscribe(
////  //    result => {
////  //      console.log('patients Updated');
////  //      this.pa.clearCache();
////  //      this.modalMessage = "?? up ";
////  //    },
////  //    error => this.modalMessage = "?? ??? up "
////  //  )
////  //  console.log('patients Updated' + this.TRID);
////  //}
////  ngOnDestroy() {
////    this.dtTrigger.unsubscribe();
////  }
////}
//# sourceMappingURL=patients-list-accepted.component.js.map