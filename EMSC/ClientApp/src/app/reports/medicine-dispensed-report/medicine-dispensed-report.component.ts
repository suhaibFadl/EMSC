import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, Directive, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Pharmacy } from '../../interfaces/pharmacy';
import { PharmacyService } from '../../services/pharmacy.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DatePipe, formatDate } from '@angular/common';

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
  selector: 'app-medicine-dispensed-report',
  templateUrl: './medicine-dispensed-report.component.html',
  styleUrls: ['./medicine-dispensed-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    [DatePipe]
  ],

})
export class MedicineDispensedReportComponent implements OnInit {

  constructor(
    private formbulider: FormBuilder, private bra: PharmacyService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private http: HttpClient,
    private acct: AccountService,
    private app: AppComponent,
    private datePipe: DatePipe
  ) { }

  dataSource!: MatTableDataSource<Pharmacy>;

  dataSource2!: MatTableDataSource<Pharmacy>;

  DataSource = new MatTableDataSource([]);
  sourceDataSource = new MatTableDataSource<any>([]);
  targetDataSource = new MatTableDataSource<any>([]);

  filteredDataArray: any[] = [];
  sourceList: any[] = [];
  destinationList: any[] = [];
  itemsSelected: any[] = [];
  itemsCount!: number;


  displayedColumns: string[] = ['index', 'first', 'second','add']
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ninth', 'addMed', 'upload', 'delete'];

  headerStyle = {
    'background-color': '#393E46', /* set the background color of the header */
    'color': 'white', /* set the text color of the header */
    'font-weight': 'bold' /* set the font weight of the header */
  };


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;


  UserId!: string;
  UserRole!: string;
  PHIDUser!: string;

  //===============================

  ReportDispensedMedicinesForm!: FormGroup;
  medids!: FormControl;
  PHId!: FormControl;
  fromDate!: FormControl;
  toDate!: FormControl;
  fromDateD!: FormControl;
  toDateD!: FormControl;
  reportType!: FormControl;
  medidsAll: any[] = [];
  checked!: number;


  pharmacies: Pharmacy[] = [];
  pharmacies$!: Observable<Pharmacy[]>;


  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserPharmacyId.subscribe(result => { this.PHIDUser = result });

    this.medids = new FormControl();
    this.PHId = new FormControl();
    this.reportType = new FormControl();
    this.fromDate = new FormControl();
    this.toDate = new FormControl();
    this.fromDateD = new FormControl();
    this.toDateD = new FormControl();

    this.ReportDispensedMedicinesForm = this.fb.group({
      'medids': this.medids,
      'PHId': this.PHId,
      'fromDateD': this.fromDateD,
      'toDateD': this.toDateD,

      'reportType': this.reportType,
    });

    this.PHId.setValue(0);
    this.reportType.setValue(0);
    this.fromDateD.setValue(null);
    this.toDateD.setValue(null);

    this.itemsCount = 0;
    this.checked = 0;
    this.GetMedications();
    this.GetPharmacies();
  }

  GetMedications() {
    this.bra.GetMedications().subscribe((data:any) => {
      this.sourceDataSource = new MatTableDataSource(data);
      this.sourceDataSource.paginator = this.paginator;
    });
  }
  GetMedications2() {
    this.bra.GetMedications().subscribe((data: any) => {
      this.targetDataSource = new MatTableDataSource(data);
      this.targetDataSource.paginator = this.paginator2;

    });
  }

  GetPharmacies() {
    this.pharmacies$ = this.bra.GetPharmacies();
    this.pharmacies$.subscribe(result => {
      this.pharmacies = result;
    });
  }


  moveAllItems() {

    this.targetDataSource.data.push(...this.sourceDataSource.data);

    this.sourceDataSource.data = [];
    this.targetDataSource._updateChangeSubscription();
    this.itemsCount += 1;
    this.checked = 1;
    this.targetDataSource.paginator = this.paginator2;

  }

  returnAllItems() {

    this.sourceDataSource.data.push(...this.targetDataSource.data);

    this.targetDataSource.data = [];
    this.sourceDataSource._updateChangeSubscription();

    this.itemsCount = 0;
    this.checked = 0;
    this.targetDataSource.paginator = this.paginator2;

  }

  moveItem(id: number) {
    const index = this.sourceDataSource.data.findIndex((item: any) => item.id === id);
    if (index > -1) {
      this.targetDataSource.data.push(this.sourceDataSource.data.splice(index, 1)[0]);
    }
    this.sourceDataSource._updateChangeSubscription();
    this.targetDataSource._updateChangeSubscription();
    this.itemsCount += 1;
    this.targetDataSource.paginator = this.paginator2;

  }

  returnItem(id: number) {
    const index = this.targetDataSource.data.findIndex((item: any) => item.id === id);
    if (index > -1) {
      this.sourceDataSource.data.push(this.targetDataSource.data.splice(index, 1)[0]);
    }
    this.sourceDataSource._updateChangeSubscription();
    this.targetDataSource._updateChangeSubscription();
    this.itemsCount -= 1;
    this.targetDataSource.paginator = this.paginator2;

  }


  from!: string;
  to!: string;

  onCreatePDF() {


    if (this.reportType.value == 0) {
      this.app.PleaseSelectTypeViewReport()
    }
    else {
      this.targetDataSource.data.map((obj: any) => this.medidsAll.push(obj.id))

      this.medids.setValue(this.medidsAll)

      if (this.fromDateD.value == null)
        this.fromDateD.setValue('1900-01-01');
      if (this.toDateD.value == null)
        this.toDateD.setValue('2800-01-01');



      this.ReportDispensedMedicinesForm.setValue({
        'medids': this.medids.value,
        'PHId': this.PHId.value,
        'fromDateD': this.fromDateD.value,
        'toDateD': this.toDateD.value,

        'reportType': this.reportType.value,
      });



      this.http.post<string[]>("/api/PDFCreator/ReportAllMedicationsDispensedByPharmacy", this.ReportDispensedMedicinesForm.value).subscribe((event: any) => {
        window.open("PDFCreator/" + event.value);
        console.log(this.ReportDispensedMedicinesForm.value)

      },
        error => this.app.NoDataToShowInReport()
      );

      this.PHId.setValue(0);
      this.reportType.setValue(0);
      this.medidsAll = [];
      this.targetDataSource.data = [];
      this.itemsCount = 0;
      this.checked = 0;
      this.GetMedications();

    }


  }


  onCreatePDF2() {


    console.log("gggg")


    if (this.fromDateD.value == null)
      this.fromDateD.setValue('1900-01-01');
    if (this.toDateD.value == null)
      this.toDateD.setValue('2800-01-01');


      this.targetDataSource.data.map((obj: any) => this.medidsAll.push(obj.id))

      this.medids.setValue(this.medidsAll)

    const formattedDate = this.datePipe.transform(this.fromDateD.value, 'yyyy-MM-dd');
    const formattedDate2 = this.datePipe.transform(this.toDateD.value, 'yyyy-MM-dd');

    console.log(formattedDate);
    console.log(formattedDate2);

    console.log("gggg")

      this.ReportDispensedMedicinesForm.setValue({
        'medids': this.medids.value,
        'PHId': this.PHIDUser,
        'fromDateD': formattedDate,
        'toDateD': formattedDate2,
        'reportType': this.reportType.value,
      });

      console.log(this.ReportDispensedMedicinesForm.value)
      this.http.post<string[]>("/api/PDFCreator/ReportAllTotalMedicationsDispensesByPharmacy", this.ReportDispensedMedicinesForm.value).subscribe((event: any) => {
        window.open("PDFCreator/" + event.value);
        console.log(this.ReportDispensedMedicinesForm.value)

      },
        error => this.app.NoDataToShowInReport()
      );

      this.PHId.setValue(0);
      this.reportType.setValue(0);
      this.medidsAll = [];
      this.targetDataSource.data = [];
      this.itemsCount = 0;
      this.checked = 0;
      this.GetMedications();

  }


  applyFilter(filterValue: string) {
    this.sourceDataSource.filter = filterValue.trim().toLowerCase();
  }



}
