import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { HospitalService } from '../../services/hospital.service';
import { CountryService } from '../../services/country.service';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../interfaces/branch';
import _ from 'lodash';
import { version } from 'moment';
import moment from 'moment';
import { Country } from '../../interfaces/country';
import { Hospital } from '../../interfaces/hospital';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { DependencyService } from '../../services/dependency.service';
import { InjuryEventsService } from '../../services/injury-events.service';
import { Dependency } from '../../interfaces/dependency';
import { InjuryEvents } from '../../interfaces/injury-events';
import { map, startWith } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Serviceslists } from '../../interfaces/serviceslists';
import { PriceslistsService } from '../../services/priceslists.service';
import { ClaimsService } from '../../services/claims.service';
import { Claimsservices } from '../../interfaces/claimsservices';

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
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddClaimComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private hos: HospitalService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private pa: PatientsService,
    private paout: PatientsLettersOutsideService,
    private pain: PatientsLettersInsideService,
    private PMDS: PatientsMainDataService,
    private coun: CountryService,
    private dep: DependencyService,
    private br: BranchService,
    private ev: InjuryEventsService,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private formBuilder: FormBuilder,
    private ps: PriceslistsService,
    private cl: ClaimsService
  ) { }

  patientname!: string;
  nationalno!: string;
  passport!: string;
  indexno!: string;
  fileno!: string;
  UserId!: string;
  listid!: number;
  HospitalUserId!: string;
  sourceList: any[] = [];
  claimid!: string;
  claimtotal!: string;
  entrydate!: Date;


  modalRef!: BsModalRef;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  sourceDataSource = new MatTableDataSource([]);
  DataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @Input() matcher!: ErrorStateMatcher;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'add'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth',  'update', 'delete'];

  headerStyle = {
    'background-color': '#393E46', /* set the background color of the header */
    'color': 'white', /* set the text color of the header */
    'font-weight': 'bold' /* set the font weight of the header */
  };

  AddForm!: FormGroup;
  deleteForm!: FormGroup;
  updateForm!: FormGroup;
  servId!: FormControl;
  ServArName!: FormControl;
  ServEnName!: FormControl;
  ServPrice!: FormControl;
  quan!: FormControl;
  ServDate!: FormControl;
  Did!: FormControl;

  _servId!: FormControl;
  _ServArName!: FormControl;
  _ServEnName!: FormControl;
  _ServPrice!: FormControl;
  _Quantity!: FormControl;
  _ServDate!: FormControl;
  _Uid!: FormControl;
   
  modalMessage2!: string;
  modalMessage3!: string;
  modalMessage1!: string;
  modalMessage!: string;

  GetPatientData() {
    let id = + this.route.snapshot.params['id'];

    this.pain.GetPatientsTransactionsInsideByTraId(id.toString()).subscribe((data: any) => {
      this.patientname = data[0].patientName;
      this.nationalno = data[0].nationalNo;
      this.passport = data[0].passportNo;
      this.indexno = data[0].letterIndexNO;
      this.fileno = data[0].fileNo;
     

    });
  }
  GetClaimDetails() {
    let id = + this.route.snapshot.params['id'];

    this.cl.GetClaimDetails(id.toString()).subscribe((data: any) => {
      this.claimid = data[0].id;
      this.entrydate = data[0].entryDate;
      this.claimtotal = data[0].claimTotal;
     
    });
    }
      


  moveItem(c: any) {
    
    console.log(c);
    this.servId.setValue(c.id);
    this.ServArName.setValue(c.servArName);
    this.ServEnName.setValue(c.servEnName);
    this.ServPrice.setValue(c.servPrice);
  }
  ngOnInit(): void {
    this.GetPatientData();
    this.GetClaimDetails();


    let id = + this.route.snapshot.params['id'];

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
   


    this.GetAllServices();

    this.servId = new FormControl('',Validators.required);
    this.ServArName = new FormControl('',Validators.required);
    this.ServEnName = new FormControl('', Validators.required);
    this.ServDate = new FormControl('', Validators.required);
    this.ServPrice = new FormControl('', Validators.required);
    this.quan = new FormControl('', [Validators.required, Validators.minLength(1)]);
    this.Did = new FormControl();

    this._servId = new FormControl('', Validators.required);
    this._ServArName = new FormControl('', Validators.required);
    this._ServEnName = new FormControl('', Validators.required);
    this._ServDate = new FormControl('', Validators.required);
    this._ServPrice = new FormControl('', Validators.required);
    this._Quantity = new FormControl('', [Validators.required, Validators.minLength(1)]);
    this._Uid = new FormControl('', [Validators.required, Validators.minLength(1)]);


    this.AddForm = this.fb.group(
      {
        'servId': this.servId,
        'ServArName': this.ServArName,
        'ServEnName': this.ServEnName,
        'ServDate': this.ServDate,
        'Quantity': this.quan,
        'Price': this.ServPrice,
        'hospUserId': this.UserId,
      });

    this.updateForm = this.fb.group(
      {
        '_servId': this._servId,
        '_ServArName': this._ServArName,
        '_ServEnName': this._ServEnName,
        '_ServDate': this._ServDate,
        '_Quantity': this._Quantity,
        '_Price': this._ServPrice,
        '_hospUserId': this.UserId,
        '_Uid': this._Uid,
      });


    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
        
      });
     

    this.GetClaimServices();
  }

  GetAllServices() {
    let id = + this.route.snapshot.params['id'];

    this.acct.currentUserHospitalId.subscribe(result => { this.HospitalUserId = result });
    console.log(this.HospitalUserId);
    this.hos.GetHospitalById(this.HospitalUserId).subscribe((data: any) => {
      this.listid = data[0].listId;
    
      this.ps.GetMeedicalServicesByListID(this.listid).subscribe((data: any) => {
        this.sourceList = data;
        this.sourceDataSource = new MatTableDataSource(data);
        this.sourceDataSource.paginator = this.paginator;
    });
       
    
    });


    this.modalMessage1 = "الرجاء إختيار خدمة من القائمة";
    this.modalMessage2 = "إضافة بيانات رسالة الإحالة";
    this.modalMessage3 = "هل أنت متأكد من حذف الخدمة";
  }


  onSubmit() {
    this.AddForm.setValue({
      'servId': this.servId.value,
      'ServArName': this.ServArName.value,
      'ServEnName': this.ServEnName.value,
      'ServDate': this.ServDate.value,
      'Quantity': this.quan.value,
      'Price': this.ServPrice.value,
      'hospUserId': this.UserId,
    });

    let newData = this.AddForm.value;

    console.log(newData);

    let id = + this.route.snapshot.params['id'];

    this.cl.AddServiceToClaim(id, newData).subscribe(
      (result: any) => {
        this.cl.clearCache();
        this.GetClaimServices();
        this.GetClaimDetails();
        this.AddForm.reset();
        this.app.showToasterSuccess();
         

      },
      error => this.app.showToasterError()
    )



  }

  onDeleteModal(c: Claimsservices) {
    this.modalMessage3 = "هل أنت متأكد من حذف البيانات"
    
    this.Did.setValue(c.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });
    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onUpdateModal(editdata: Claimsservices): void {
    console.log(editdata);
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this._Uid.setValue(editdata.id);
    this._servId.setValue(editdata.servId);
    this._ServArName.setValue(editdata.servArName);
    this._ServEnName.setValue(editdata.servEnName);
    this._ServDate.setValue(editdata.servDate);
    this._Quantity.setValue(editdata.quantity);

    console.log(this._ServDate.value);
    this._ServPrice.setValue(editdata.price);
   

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onDelete(): void {
    let claimdelete = this.deleteForm.value;
    this.cl.DeleteClaimService(claimdelete.id).subscribe(result => {
      this.cl.clearCache();
      this.GetClaimServices();
      this.GetClaimDetails();

      this.modalRef.hide();
      this.modalMessage3 = "هل أنت متأكد من حذف البيانات"
    },
      error => this.app.CannotDeletePat()
    )
  }

  onUpdate() {

  }


  GetClaimServices() {
    let id = + this.route.snapshot.params['id'];
    this.cl.GetClaimsServices(id.toString()).subscribe((data: any) => {
      this.DataSource = data;
      this.DataSource = new MatTableDataSource(data);
      this.DataSource.paginator = this.paginator2;
      console.log(data);

    });
  }

  applyFilter(filterValue: string) {
    this.sourceDataSource.filter = filterValue.trim().toLowerCase();
  }


}