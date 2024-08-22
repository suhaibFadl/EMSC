import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { PatientsMainDataService } from '../../services/patients-main-data.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl, MinLengthValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DependencyService } from '../../services/dependency.service';
import { InjuryEventsService } from '../../services/injury-events.service';
import { Dependency } from '../../interfaces/dependency';
import { InjuryEvents } from '../../interfaces/injury-events';
import { PatientData } from '../../interfaces/patient-data';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from '../../interfaces/pharmacy';


interface PersonType {
  name: string;
  id: number;
}

interface PatType {
  name: string;
  id: number;
}

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
  selector: 'app-pats-files',
  templateUrl: './pats-files.component.html',
  styleUrls: ['./pats-files.component.css'],
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },

      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class PatsFilesComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private acct: AccountService,
    private PMDS: PatientsMainDataService,
    private phar: PharmacyService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }


  //====================================تحديد عدد الأعمدة في الجدول

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'details'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

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

  patients: PatientData[] = [];
  patients$!: Observable<PatientData[]>;


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

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      medEnName: '',
      userDate: '',
      phoneNumber: '',
    })

    this.GetMedications();
    this.GetALlPatsFiles();
  }


  GetALlPatsFiles() {
    this.phar.clearCache();
    this.phar.GetALlPatsFiles().subscribe(data => {
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

        return a && b && c && d && g && h;

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

    this.phar.UpdateRequestMedication(this.Id.value, newData).subscribe(
      result => {
        this.phar.clearCache();
        this.GetALlPatsFiles();
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

    this.phar.DeleteRequestMedication(this.Id.value).subscribe(
      result => {
        this.phar.clearCache();
        this.GetALlPatsFiles();
        this.modalRef.hide();
        this.deleteForm.reset();
        this.app.showToasterSuccess();
      },
      error =>
        this.app.showToasterError()

    )

  }


  onSelect(patiant: Pharmacy): void {
    this.router.navigateByUrl('/pharmacy/pat-med-details/' + patiant.patientId);
  }


  resetMedicineFilter() { this.formControl.controls['medEnName'].setValue(null); }
  resetUserDate() { this.formControl.controls['userDate'].setValue(null); }

}
