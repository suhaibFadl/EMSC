import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  selector: 'app-final-requests',
  templateUrl: './final-requests.component.html',
  styleUrls: ['./final-requests.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class FinalRequestsComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private phar: PharmacyService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,

  ) { }

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'personAttach', 'fourth', 'fourth2', 'fifth', 'sixth', 'seventh','eighth','ninth','tenth', 'print', 'add'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Modals
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('Lettertemplate') LetterModal!: TemplateRef<any>;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;

  replyForm!: FormGroup;
  Id!: FormControl;
  OrderState!: FormControl;

  UserId!: string;
  UserRole!: string;
  PharmacyId!: string;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserPharmacyId.subscribe(result => { this.PharmacyId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.OrderState = new FormControl('');
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
    this.GetALLAcceptedOffersRequestes();
  }

  GetALLAcceptedOffersRequestes() {
    this.phar.clearCache();
    this.phar.GetALLAcceptedOffersRequestes(this.PharmacyId).subscribe(data => {
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
    this.modalMessage1 = "عند الضغط على زر موافق سيتم تبليغ المركز بتوفير الدواء من قِبل الصيدلية";

    this.modalRef = this.modalService.show(this.modal);

    this.Id.setValue(P.id);
  }


  onSubmit() {

    this.replyForm.setValue({
      'Id': this.Id.value,
      'OrderState': 8,
    });

    let newData = this.replyForm.value;

    this.phar.ResponseRequestMedication(this.Id.value, newData).subscribe(
      result => {
        this.phar.clearCache();
        this.GetALLAcceptedOffersRequestes();
        this.modalRef.hide();
        this.replyForm.reset();
        this.app.showToasterSuccess();
        this.ngOnInit();
      },
      error =>
        this.app.showToasterError()

    )
  }

  resetForm() {
    this.ngOnInit();
  }

  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }



  viewLetter(P: PatientData) {
    const url = '/pharmacy/request-letter/' + P.id;
    window.open(url, '_blank');
  }

}
