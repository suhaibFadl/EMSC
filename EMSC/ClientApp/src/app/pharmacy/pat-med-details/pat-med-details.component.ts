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
import { Pharmacy } from '../../interfaces/pharmacy';
import { PharmacyService } from '../../services/pharmacy.service';
import { AppComponent } from '../../app.component';

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
  selector: 'app-pat-med-details',
  templateUrl: './pat-med-details.component.html',
  styleUrls: ['./pat-med-details.component.css']
})
export class PatMedDetailsComponent implements OnInit {

  constructor(private modalService: BsModalService,
    private phs: PharmacyService,
    private PMDS: PatientsMainDataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private acct: AccountService,
    private app: AppComponent,

) { }

  LoginStatus$!: Observable<boolean>;

  displayedColumns: string[] = ['index','personAttach', 'third', 'fourth','pharmacy', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'edit3', 'delete3'];

  dataSource!: MatTableDataSource<Pharmacy>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;



  patients: PatientData[] = [];
  patients$!: Observable<PatientData[]>;

  medications: Pharmacy[] = [];
  medications$!: Observable<Pharmacy[]>;



  updateForm!: FormGroup;
  MedId!: FormControl;
  Id!: FormControl;
  RequestedQuantity!: FormControl;

  deleteForm!: FormGroup;

  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  UserId!: string;
  UserRole!: string;

  ngOnInit(): void {


    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.MedId = new FormControl('', [Validators.required, Validators.minLength(1)]);
    this.Id = new FormControl();
    this.RequestedQuantity = new FormControl('', [Validators.required]);



    this.updateForm = this.fb.group({
      'MedId': this.MedId,
      'Id': this.Id,
      'RequestedQuantity': this.RequestedQuantity,
    });


    this.deleteForm = this.fb.group({
      'Id': this.Id,
    });



    let id = + this.route.snapshot.params['id'];

    this.PMDS.GetPatientsMainDataByPatientId(id).subscribe(result => this.patients = result);

    this.GetMedicinesPatient();
  }


  GetMedicinesPatient() {
    let id = + this.route.snapshot.params['id'];

    this.phs.clearCache();
    this.phs.GetMedicinesPatient(id).subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
    });
  }


  GetMedications() {
    this.phs.clearCache();
    this.phs.GetMedications().subscribe((result: any) => {
      this.medications = result;
    });
  }


  onUpdateModal(P: Pharmacy) {
    this.modalMessage1 = "الرجاء إدخال كافة البيانات المطلوبة ";

    this.modalRef = this.modalService.show(this.editmodal);

    this.Id.setValue(P.id);
    this.RequestedQuantity.setValue(P.requestedQuantity);
    this.MedId.setValue(P.medId);

  }

  onSubmit() {

    this.updateForm.setValue({
      'Id': this.Id.value,
      'MedId': this.MedId.value,
      'RequestedQuantity': this.RequestedQuantity.value,
    });

    let newData = this.updateForm.value;

    this.phs.UpdateRequestMedication(this.Id.value, newData).subscribe(
      result => {
        this.phs.clearCache();
        this.GetMedicinesPatient();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error =>
        this.app.showToasterError()

    )

  }



  onDeleteModal(P: Pharmacy) {
    this.modalMessage2 = "هل أنت متأكد من عميلة حذف طلب الدواء";

    this.modalRef = this.modalService.show(this.deletemodal);

    this.Id.setValue(P.id);

  }

  onSubmitDel() {

    this.deleteForm.setValue({
      'Id': this.Id.value,
    });

    let newData = this.deleteForm.value;

    this.phs.DeleteRequestMedication(this.Id.value).subscribe(
      result => {
        this.phs.clearCache();
        this.GetMedicinesPatient();
        this.modalRef.hide();
        this.deleteForm.reset();
        this.app.showToasterSuccess();
      },
      error =>
        this.app.showToasterError()

    )

  }


}
