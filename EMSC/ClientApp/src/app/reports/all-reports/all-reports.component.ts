import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, Directive, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Pharmacy } from '../../interfaces/pharmacy';
import { PharmacyService } from '../../services/pharmacy.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ElementRef } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';
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

interface OrderState {
  name: string;
  id: number;
}


@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class AllReportsComponent implements OnInit {

  constructor(
    private formbulider: FormBuilder, private bra: PharmacyService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private http: HttpClient,
    private acct: AccountService,
    private app: AppComponent,
  ) { }

  orderStates: OrderState[] = [
    { name: 'طلبات الأدوية التي لم يتم الرد عليها', id: 1 },
    { name: 'كافة العروض المبدئية المعلقة', id: 5 },
    { name: 'العروض المبدئية التي تم رفضها', id: 6 },
    { name: 'العروض المبدئية التي تم قبولها', id: 7 },
    { name: 'الأدوية التي تم توفيرها من الصيدلية وجاهزة للاستلام', id: 8 },
    { name: 'الأدوية التي تم تسليمها للمندوب', id: 3 },
  ];

  orderStatesPhar: OrderState[] = [
    { name: 'كافة الطلبات المبدئية', id: 1 },
    { name: 'كافة العروض المبدئية المعلقة', id: 5 },
    { name: 'العروض المبدئية التي تم قبولها', id: 7 },
    { name: 'الأدوية التي تم توفيرها من الصيدلية وجاهزة للتسليم', id: 8 },
    { name: 'الأدوية التي تم تسليمها للمندوب', id: 3 },
  ];


  ReportRequestsMedicationsInWaiting!: FormGroup;
  ReportRequestsMedicationsHandling!: FormGroup;
  MedId!: FormControl;
  PHId!: FormControl;
  OrderState!: FormControl;
  patNameCol!: FormControl;
  natNomCol!: FormControl;
  passNomCol!: FormControl;
  medEnMedicineCol!: FormControl;
  medArMedicineCol!: FormControl;
  requestQuantCol!: FormControl;
  requestDateCol!: FormControl;
  pharmacyCol!: FormControl;
  prePriceCol!: FormControl;
  preDaysCol!: FormControl;
  preDateCol!: FormControl;
  provideDateCol!: FormControl;
  dispensedQuantityCol!: FormControl;
  dispensedDateCol!: FormControl;
  DateType!: FormControl;
  fromDate!: FormControl;
  toDate!: FormControl;
  fromDateD!: FormControl;
  toDateD!: FormControl;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  UserRole!: string;
  PharmacyId!: string;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;

  pharmacies: Pharmacy[] = [];
  pharmacies$!: Observable<Pharmacy[]>;


  ngOnInit(): void {

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.acct.currentUserPharmacyId.subscribe(result => { this.PharmacyId = result });


    this.MedId = new FormControl();
    this.PHId = new FormControl();
    this.OrderState = new FormControl();
    this.patNameCol = new FormControl();
    this.natNomCol = new FormControl();
    this.medEnMedicineCol = new FormControl();
    this.medArMedicineCol = new FormControl();
    this.passNomCol = new FormControl();
    this.requestQuantCol = new FormControl();
    this.requestDateCol = new FormControl();
    this.pharmacyCol = new FormControl();
    this.prePriceCol = new FormControl();
    this.preDaysCol = new FormControl();
    this.preDateCol = new FormControl();
    this.provideDateCol = new FormControl();
    this.dispensedQuantityCol = new FormControl();
    this.dispensedDateCol = new FormControl();
    this.DateType = new FormControl();
    this.fromDate = new FormControl();
    this.toDate = new FormControl();
    this.fromDateD = new FormControl();
    this.toDateD = new FormControl();


    this.ReportRequestsMedicationsHandling = this.fb.group({
      'MedId': this.MedId,
      'PHId': this.PHId,
      'OrderState': this.OrderState,
      'fromDate': this.fromDate,
      'toDate': this.toDate,
      'fromDateD': this.fromDateD,
      'toDateD': this.toDateD,
      'patNameCol': this.patNameCol,
      'natNomCol': this.natNomCol,
      'passNomCol': this.passNomCol,
      'medEnMedicineCol': this.medEnMedicineCol,
      'medArMedicineCol': this.medArMedicineCol,
      'requestQuantCol': this.requestQuantCol,
      'requestDateCol': this.requestDateCol,
      'pharmacyCol': this.pharmacyCol,
      'prePriceCol': this.prePriceCol,
      'preDaysCol': this.preDaysCol,
      'preDateCol': this.preDateCol,
      'provideDateCol': this.provideDateCol,
      'dispensedQuantityCol': this.dispensedQuantityCol,
      'dispensedDateCol': this.dispensedDateCol,
    });

    this.resetValues();

    if (this.UserRole == 'موظف الصيدلية') {
      this.PHId.setValue(this.PharmacyId)
    }


    this.GetMedications();
    this.GetPharmacies();

  }

  resetValues() {
    this.MedId.setValue(0);
    this.PHId.setValue(0);
    this.OrderState.setValue(0);
    this.fromDate.setValue(null);
    this.toDate.setValue(null);

    this.fromDateD.setValue(null);
    this.toDateD.setValue(null);

    this.patNameCol.setValue(1);
    this.natNomCol.setValue(1);
    this.passNomCol.setValue(1);
    this.medEnMedicineCol.setValue(1);
    this.medArMedicineCol.setValue(1);
    this.requestDateCol.setValue(1);
    this.requestQuantCol.setValue(1);
    this.pharmacyCol.setValue(1);
    this.prePriceCol.setValue(1);
    this.preDaysCol.setValue(1);
    this.preDateCol.setValue(1);
    this.provideDateCol.setValue(1);
    this.dispensedQuantityCol.setValue(1);
    this.dispensedDateCol.setValue(1);

  }

  GetMedications() {
    this.medications$ = this.bra.GetMedications();
    this.medications$.subscribe(result => {
      this.medications = result;
    });
  }

  GetPharmacies() {
    this.pharmacies$ = this.bra.GetPharmacies();
    this.pharmacies$.subscribe(result => {
      this.pharmacies = result;
    });
  }


  onCreatePDF2() {

    if (this.OrderState.value == 0) {
      this.app.PleaseSelectTypeViewReport();
    }
    else {

      if (this.fromDate.value == null)
        this.fromDate.setValue('1900-01-01');
      if (this.toDate.value == null)
        this.toDate.setValue('2800-01-01');

      if (this.fromDateD.value == null)
        this.fromDateD.setValue('1900-01-01');
      if (this.toDateD.value == null)
        this.toDateD.setValue('2800-01-01');


      this.ReportRequestsMedicationsHandling.setValue({
        'MedId': this.MedId.value,
        'PHId': this.PHId.value,
        'OrderState': this.OrderState.value,
        'fromDate': this.fromDate.value,
        'toDate': this.toDate.value,
        'fromDateD': this.fromDateD.value,
        'toDateD': this.toDateD.value,
        'patNameCol': this.patNameCol.value ? 1 : 0,
        'natNomCol': this.natNomCol.value ? 1 : 0,
        'passNomCol': this.passNomCol.value ? 1 : 0,
        'medEnMedicineCol': this.medEnMedicineCol.value ? 1 : 0,
        'medArMedicineCol': this.medArMedicineCol.value ? 1 : 0,
        'requestQuantCol': this.requestQuantCol.value ? 1 : 0,
        'requestDateCol': this.requestDateCol.value ? 1 : 0,
        'pharmacyCol': this.pharmacyCol.value ? 1 : 0,
        'prePriceCol': this.prePriceCol.value ? 1 : 0,
        'preDaysCol': this.preDaysCol.value ? 1 : 0,
        'preDateCol': this.preDateCol.value ? 1 : 0,
        'provideDateCol': this.provideDateCol.value ? 1 : 0,
        'dispensedQuantityCol': this.dispensedQuantityCol.value ? 1 : 0,
        'dispensedDateCol': this.dispensedDateCol.value ? 1 : 0,

      });

      this.http.post<string[]>("/api/PDFCreator/ReportAllReportsMedications", this.ReportRequestsMedicationsHandling.value).subscribe((event: any) => {
        window.open("PDFCreator/" + event.value);
      },
        error => this.app.NoData()
      );
      this.resetValues();
      if (this.UserRole == 'موظف الصيدلية') {
        this.PHId.setValue(this.PharmacyId)
      }



    }

  }


  //onCreatePDF() {

  //  if (this.UserRole == "موظف الصيدلية") {
  //    this.ReportRequestsMedicationsInWaiting.setValue({
  //      'MedId': this.MedId.value,
  //      'PHId': this.PharmacyId,
  //      'patNameCol': this.patNameCol.value ? 1 : 0,
  //      'natNomCol': this.natNomCol.value ? 1 : 0,
  //      'passNomCol': this.passNomCol.value ? 1 : 0,
  //      'medEnMedicineCol': this.medEnMedicineCol.value ? 1 : 0,
  //      'medArMedicineCol': this.medArMedicineCol.value ? 1 : 0,
  //      'requestQuantCol': this.requestQuantCol.value ? 1 : 0,
  //      'requestDateCol': this.requestDateCol.value ? 1 : 0,
  //      'pharmacyCol': this.pharmacyCol.value ? 1 : 0,

  //    });
  //  }
  //  else {
  //    this.ReportRequestsMedicationsInWaiting.setValue({
  //      'MedId': this.MedId.value,
  //      'PHId': this.PHId.value,
  //      'patNameCol': this.patNameCol.value ? 1 : 0,
  //      'natNomCol': this.natNomCol.value ? 1 : 0,
  //      'passNomCol': this.passNomCol.value ? 1 : 0,
  //      'medEnMedicineCol': this.medEnMedicineCol.value ? 1 : 0,
  //      'medArMedicineCol': this.medArMedicineCol.value ? 1 : 0,
  //      'requestQuantCol': this.requestQuantCol.value ? 1 : 0,
  //      'requestDateCol': this.requestDateCol.value ? 1 : 0,
  //      'pharmacyCol': this.pharmacyCol.value ? 1 : 0,

  //    });

  //  }

  //  this.http.post<string[]>("/api/PDFCreator/ReportAllRequestsMedicationsInWaiting", this.ReportRequestsMedicationsInWaiting.value).subscribe((event: any) => {
  //    window.open("PDFCreator/" + event.value);
  //  },
  //    error => this.app.NoData()
  //  );

  //  this.resetValues();

  //}


}
