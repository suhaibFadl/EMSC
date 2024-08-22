import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';
import { PatientData } from '../../interfaces/patient-data';
import { Pharmacy } from '../../interfaces/pharmacy';
import { AccountService } from '../../services/account.service';
import { PharmacyService } from '../../services/pharmacy.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-initial-offers',
  templateUrl: './initial-offers.component.html',
  styleUrls: ['./initial-offers.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class InitialOffersComponent implements OnInit {
  public formControl!: FormGroup;

  constructor(
    private modalService: BsModalService,
    private acct: AccountService,
    private phar: PharmacyService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,

) { }


  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'personAttach', 'fourth', 'fourth2', 'fifth', 'sixth', 'print', 'seventh','eight','ninth','tenth',  'add'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('template') modal!: TemplateRef<any>;

  replyForm!: FormGroup;
  Id!: FormControl;
  OrderState!: FormControl;


  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  UserId!: string;
  UserRole!: string;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;


  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.OrderState = new FormControl('',Validators.required);
    this.Id = new FormControl();


    this.replyForm = this.fb.group({
      'Id': this.Id,
      'OrderState': this.OrderState,
    });

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      medEnName: '',
      userDate: '',
      phoneNumber: '',
      personType: '',
      patType: '',

    })

    this.GetMedications();
    this.GetALLPreOffersRequestes();

  }

  GetALLPreOffersRequestes() {
    this.phar.clearCache();
    this.phar.GetALLPreOffersRequestes(5).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.medEnName || data.medEnName.includes(filter.medEnName);
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);
        const j = !filter.personType || data.personType.toString().toLowerCase().includes(filter.personType);
        const i = !filter.patType || data.patType.toString().toLowerCase().includes(filter.patType);

        return a && b && c && d && g && h && j && i;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }

  GetMedications() {
    this.phar.clearCache();
    this.phar.GetMedications().subscribe((result: any) => {
      this.medications = result;
    });
  }

  onReplyModal(P: PatientData) {
    this.modalMessage1 = "الرجاء إدخال كافة البيانات المطلوبة ";

    this.modalRef = this.modalService.show(this.modal);

    this.Id.setValue(P.id);
  }


  onSubmit() {

    this.replyForm.setValue({
      'Id': this.Id.value,
      'OrderState': this.OrderState.value,
    });

    let newData = this.replyForm.value;

    this.phar.ReplyManagementOnPharmacy(this.Id.value, newData).subscribe(
      result => {
        this.phar.clearCache();
        this.GetALLPreOffersRequestes();
        this.modalRef.hide();
        this.replyForm.reset();
        this.app.showToasterSuccess();
        this.ngOnInit();
      },
      error =>
        this.app.showToasterError()

    )
  }

  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }

  resetForm() {
    this.ngOnInit();
  }

  viewLetter(P: PatientData) {

    // this.router.navigateByUrl('/branches/p-details/' + patiant.id);

    const url = '/pharmacy/request-letter/' + P.id;
    window.open(url, '_blank');

    //  this.router.navigateByUrl('/pharmacy/request-letter/' + P.id);
  }

}
