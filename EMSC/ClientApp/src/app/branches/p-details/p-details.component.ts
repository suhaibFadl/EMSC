import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Hospital } from '../../interfaces/hospital';
import { HospitalService } from '../../services/hospital.service';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { PatientData } from '../../interfaces/patient-data';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import { PTransInside } from '../../interfaces/p-trans-inside';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { PatientsLettersOutsideService } from '../../services/patients-letters-outside.service';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { Reply } from '../../interfaces/reply';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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
@Directive({
  selector: '[errorStateMatcherDirective]'
})

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-p-details',
  templateUrl: './p-details.component.html',
  styleUrls: ['./p-details.component.css']
})
export class PDetailsComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private paout: PatientsLettersOutsideService,
    private pain: PatientsLettersInsideService,
    private PMDS: PatientsMainDataService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  displayedColumns: string[] = ['index', 'first', 'second', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'ten', 'eleventh', 'twelve', 'thirteen','fourteen'];

  modalRef!: BsModalRef;
  modalMessage1!: string;
  modalMessage2!: string;
  modalMessage!: string;

  selectedpatient!: PatientData;
  @Input() patient!: PatientData;

  dataSource!: MatTableDataSource<PTransOutside>;


  patients: PatientData[] = [];
  patients$!: Observable<PatientData[]>;


  pTransOutside: PTransOutside[] = [];
  pTransOutside$!: Observable<PTransOutside[]>;


  pTransInside: PTransInside[] = [];
  pTransInside$!: Observable<PTransInside[]>;


  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('checkedTemplate') checkedmodal!: TemplateRef<any>;
  @ViewChild('AddTransactionModalTemplate') AddTransactionModal!: TemplateRef<any>;
  @ViewChild('CheckReplyStateModalTemplate') CheckReplyStateModal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate1') viewmedicalmodal1!: TemplateRef<any>;
  @ViewChild('viewmedicalTemplate2') viewmedicalmodal2!: TemplateRef<any>;
  @ViewChild('viewTravelingmodalTemplate') viewTravelingmodal!: TemplateRef<any>;
  @ViewChild('viewEntrymodalTemplate') viewEntrymodal!: TemplateRef<any>;
  @ViewChild('viewTravelBackTemplate') viewTravelBackmodal!: TemplateRef<any>;
  @ViewChild('viewFileClosedTemplate') viewFileClosedmodal!: TemplateRef<any>;
  @ViewChild('viewTemplate') viewmodal!: TemplateRef<any>;

  clickedRows1 = new Set<PTransInside>();
  clickedRows2 = new Set<PTransOutside>();
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  selectedPatient!: PatientData;

  LoginStatus$!: Observable<boolean>;
  dataSource1!: MatTableDataSource<PTransInside>;
  dataSource2!: MatTableDataSource<PTransOutside>;

  ngOnInit(): void {

    let id = + this.route.snapshot.params['id'];

    this.PMDS.GetPatientsMainDataByPatientId(id).subscribe(result => this.patients = result);

    this.GetPatientsTransactionsOutsideByPatientId();
   // this.GetPatientsTransactionsOutsideByPatientId();
  }





  GetPatientsTransactionsInsideByPatientId() {
    let id = + this.route.snapshot.params['id'];

    this.pain.clearCache();
    this.pain.GetPatientsTransactionsInsideByPatientId(id).subscribe(data => {
      this.dataSource1 = new MatTableDataSource(data);
      this.dataSource1.paginator = this.paginator;
      this.dataSource1.sort = this.sort;

    });
  }



  PatientName!: string;
  lengthData!: number;

  GetPatientsTransactionsOutsideByPatientId() {
    let id = + this.route.snapshot.params['id'];
    this.paout.clearCache();
    this.paout.GetPatientsTransactionsOutsideByPatientId(id).subscribe(data => {
      this.dataSource2 = new MatTableDataSource(data);
      this.dataSource2.paginator = this.paginator;
      if (this.dataSource2.data.length != 0) {
        this.PatientName = data[0].patientName
        this.lengthData = 1;

      }
      else {
        this.lengthData = 0;
      }
    });
  }
  //======================================================================
  AirLineName!: string;
  FlightNom!: string;
  Attach!: string;
  FlightDate!: string;

  GetTravelingProceduresByPatientId(id) {
    this.paout.clearCache();
    this.paout.GetTravelingProceduresByPatientId(id).subscribe(data => {
      this.AirLineName = data[0].airlineName,
        this.FlightNom = data[0].flightNom,
        this.FlightDate = data[0].flightDate.toString(),
        this.Attach = data[0].attach
    });
  }


  ClosingDate!: string;
  Notes!: string;
  FileStatuse!: string;
  GetFileClosedDataByPatientId(id) {
    this.paout.clearCache();
    this.paout.GetFileClosedDataByPatientId(id).subscribe(data => {

      this.ClosingDate = data[0].closingDate.toString(),
        this.Notes = data[0].notes,
        this.FileStatuse = data[0].fileStatus.toString()
    });
  }


  //======================================================================
  HotelName!: string;
  CountryName!: string;
  EntryAttach!: string;
  EntryDate!: string;

  GetHotelMovementsByPatientId(id) {
    this.paout.clearCache();
    this.paout.GetHotelMovementsByPatientId(id).subscribe(data => {
        this.HotelName = data[0].hotelName,
          this.CountryName = data[0].country,
          this.EntryDate = data[0].entryDate.toString(),
          this.EntryAttach = data[0].attach
    });
  }


  //======================================================================
  GetPatientTravelingBackByPatientId(id) {
    this.paout.clearCache();
    this.paout.GetPatientTravelingBackByPatientId(id).subscribe(data => {
        this.AirLineName = data[0].airlineName,
        this.FlightNom = data[0].flightNom,
        this.FlightDate = data[0].flightDate,
          this.Attach = data[0].attach

    });
  }



  ViewlMedicalModal1(p: PTransInside) {
    this.modalMessage1 = p.medicalDiagnosis;
    this.modalRef = this.modalService.show(this.viewmedicalmodal1);
  }


  ViewlMedicalModal2(p: PTransOutside) {
    this.modalMessage2 = p.medicalDiagnosis;

    this.modalRef = this.modalService.show(this.viewmedicalmodal2);
  }

  //======================================================================================

  ViewlTravelingData(p: PTransOutside) {
    this.GetTravelingProceduresByPatientId(p.id)
    this.modalMessage = "بيانات تذكرة الذهاب لـ : " + this.PatientName;

    this.modalRef = this.modalService.show(this.viewTravelingmodal);
  }


  ViewlEntryData(p: PTransOutside) {
    this.GetHotelMovementsByPatientId(p.id)
    this.modalMessage = "بيانات  إجراءات الدخول لـ : " + this.PatientName;

    this.modalRef = this.modalService.show(this.viewEntrymodal);
  }


  ViewlTravelingBackData(p: PTransOutside) {
    this.GetPatientTravelingBackByPatientId(p.id)
    this.modalMessage = "بيانات تذكرة العودة لـ : " + this.PatientName;

    this.modalRef = this.modalService.show(this.viewTravelBackmodal);
  }


  ViewlFileClosedData(p) {
    this.GetFileClosedDataByPatientId(p)
    this.modalMessage = "بيانات إغلاق الملف الطبي لـ : " + this.PatientName;

    this.modalRef = this.modalService.show(this.viewFileClosedmodal);
  }

  clearModal() {
    this.AirLineName = "",
    this.FlightDate = "",
    this.FlightNom = "",
    this.Attach = "";
    this.CountryName = "";
    this.HotelName = "";
    this.EntryDate = "";
    this.ClosingDate = "";
    this.Notes = "";
    this.FileStatuse = "";
  }


  viewMedicalFile(p: PTransOutside) {
    this.router.navigateByUrl('/countries/treatment-movement/' + p.id);
  }


  ViewlModal(pat: Reply) {

    this.modalMessage2 = "عرض سبب الرفض"
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }
  ViewlModal2(pat: Reply) {

    this.modalMessage2 = "عرض سبب الانتظار"
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }
  ViewlModal3(pat: Reply) {

    this.modalMessage2 = "عرض الملاحظات"
    this.modalMessage = pat.reply;

    this.modalRef = this.modalService.show(this.viewmodal);
  }


  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }



}
