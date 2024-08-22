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
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { HttpClient } from '@angular/common/http';


interface PersonType {
  name: string;
  id: number;
}

interface PatType {
  name: string;
  id: number;
}

@Component({
  selector: 'app-pat-report',
  templateUrl: './pat-report.component.html',
  styleUrls: ['./pat-report.component.css']
})
export class PatReportComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private acct: AccountService,
    private PMDS: PatientsMainDataService,
    private phar: PharmacyService,
    private br: BranchService,
    private http: HttpClient,
    private app: AppComponent,
    private formBuilder: FormBuilder
  ) { }

  personTypes: PersonType[] = [
    { name: 'مريض', id: 1 },
    { name: 'مرافق', id: 2 },
  ];

  patTypes: PatType[] = [
    { name: 'حالة إنسانية', id: 1 },
    { name: 'جريح حرب', id: 2 },
  ];

  //====================================تحديد عدد الأعمدة في الجدول
  displayedColumns: string[] = ['index', 'first', 'second', 'third','fourth','print'];

  // Modals
  @ViewChild('Template') modal!: TemplateRef<any>;
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  LoginStatus$!: Observable<boolean>;
  dataSource!: MatTableDataSource<Pharmacy>;

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  ReportPatsMedicationForm!: FormGroup;
  PatientId!: FormControl;
  OrderState!: FormControl;
  PHId!: FormControl;
  medEnMedicineCol!: FormControl;
  medArMedicineCol!: FormControl;
  pharmacyCol!: FormControl;
  requestQuantCol!: FormControl;
  requestDateCol!: FormControl;
  dispensedQuantCol!: FormControl;
  dispensedDateCol!: FormControl;
  notesCol!: FormControl;


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  UserId!: string;
  UserRole!: string;
  PharmacyId!: string;



  //==========================================================

  ngOnInit(): void {

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserPharmacyId.subscribe(result => { this.PharmacyId = result });



    this.PatientId = new FormControl();
    this.PHId = new FormControl();
    this.OrderState = new FormControl();
    this.requestQuantCol = new FormControl();
    this.requestDateCol = new FormControl();
    this.dispensedQuantCol = new FormControl();
    this.dispensedDateCol = new FormControl();
    this.notesCol = new FormControl();
    this.pharmacyCol = new FormControl();
    this.medEnMedicineCol = new FormControl();
    this.medArMedicineCol = new FormControl();

    this.ReportPatsMedicationForm = this.fb.group({
      'PatientId': this.PatientId,
      'PHId': this.PharmacyId,
      'OrderState': this.OrderState,
      'medEnMedicineCol': this.medEnMedicineCol,
      'medArMedicineCol': this.medArMedicineCol,
      'pharmacyCol': this.pharmacyCol,
      'requestQuantCol': this.requestQuantCol,
      'requestDateCol': this.requestDateCol,
      'dispensedQuantCol': this.dispensedQuantCol,
      'dispensedDateCol': this.dispensedDateCol,
      'notesCol': this.notesCol,
    });

    this.requestDateCol.setValue(1);
    this.requestQuantCol.setValue(1);
    this.dispensedDateCol.setValue(1);
    this.dispensedQuantCol.setValue(1);
    this.notesCol.setValue(1);
    this.medEnMedicineCol.setValue(1);
    this.medArMedicineCol.setValue(1);
    this.pharmacyCol.setValue(1);
    this.PHId.setValue(0);

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      branchName: '',
      dependencyType: '',
      event: '',
      userDate: '',
      phoneNumber: '',
      personType: '',
      patType: '',

    })


    if (this.UserRole == "موظف الصيدلية") {
      this.GetALlPatsFilesByPharmacy();
    }
    else {
      this.GetAllPats();

    }
    this.GetBranches();
  }


  GetAllPats() {
    this.PMDS.clearCache();
    this.phar.GetALlPatsFiles().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);

        return a && b && c && d ;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }

  GetALlPatsFilesByPharmacy() {
    this.PMDS.clearCache();
    this.phar.GetALlPatsFilesByPharmacy(this.PharmacyId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);

        return a && b && c && d ;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });
    });
  }





  GetBranches() {
    this.branches$ = this.br.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });
  }


  reportModal(p) {
    this.PatientId.setValue(p.patientId)

    this.modalMessage2 = "تحديد الأعمدة المراد إظهارها في التقرير";

    this.modalRef = this.modalService.show(this.modal);

  }

  onCreatePDF() {

    console.log(this.PharmacyId)
    console.log(this.PatientId)


    if (this.UserRole == 'موظف الصيدلية') {
      this.ReportPatsMedicationForm.setValue({
        'PatientId': this.PatientId.value,
        'PHId': this.PharmacyId,
        'OrderState': 9,
        'medEnMedicineCol': this.medEnMedicineCol.value ? 1 : 0,
        'medArMedicineCol': this.medArMedicineCol.value ? 1 : 0,
        'pharmacyCol': this.pharmacyCol.value ? 1 : 0,
        'requestQuantCol': this.requestQuantCol.value ? 1 : 0,
        'requestDateCol': this.requestDateCol.value ? 1 : 0,
        'dispensedQuantCol': this.dispensedQuantCol.value ? 1 : 0,
        'dispensedDateCol': this.dispensedDateCol.value ? 1 : 0,
        'notesCol': this.notesCol.value ? 1 : 0,
      });

    }

    if (this.UserRole != 'موظف الصيدلية') {
      this.ReportPatsMedicationForm.setValue({
        'PatientId': this.PatientId.value,
        'PHId': this.PHId.value,
        'OrderState': 4,
        'medEnMedicineCol': this.medEnMedicineCol.value ? 1 : 0,
        'medArMedicineCol': this.medArMedicineCol.value ? 1 : 0,
        'pharmacyCol': this.pharmacyCol.value ? 1 : 0,
        'requestQuantCol': this.requestQuantCol.value ? 1 : 0,
        'requestDateCol': this.requestDateCol.value ? 1 : 0,
        'dispensedQuantCol': this.dispensedQuantCol.value ? 1 : 0,
        'dispensedDateCol': this.dispensedDateCol.value ? 1 : 0,
        'notesCol': this.notesCol.value ? 1 : 0,

      });

    }
    console.log(this.ReportPatsMedicationForm.value)
    this.http.post<string[]>("/api/PDFCreator/ReportAllMedicationsDispensingForPatient", this.ReportPatsMedicationForm.value).subscribe((event: any) => {
      window.open("PDFCreator/" + event.value);
    },
       error => this.app.NoDataToShowInReport2()
    );


    this.modalRef.hide();

  }


  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }

}
