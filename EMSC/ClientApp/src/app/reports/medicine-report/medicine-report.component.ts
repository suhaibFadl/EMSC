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

@Component({
  selector: 'app-medicine-report',
  templateUrl: './medicine-report.component.html',
  styleUrls: ['./medicine-report.component.css']
})
export class MedicineReportComponent implements OnInit {

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

  dataSource!: MatTableDataSource<Pharmacy>;

  displayedColumns: string[] = ['index', 'name', 'name2', 'print'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('Template') modal!: TemplateRef<any>;


  ReportPatsMedicationForm!: FormGroup;
  PHId!: FormControl;
  MedId!: FormControl;
  OrderState!: FormControl;
  patNameCol!: FormControl;
  natNomCol!: FormControl;
  passNomCol!: FormControl;
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
  UserRole!: string;
  PharmacyId!: string;


  ngOnInit(): void {

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserPharmacyId.subscribe(result => { this.PharmacyId = result });

    this.PHId = new FormControl();
    this.MedId = new FormControl();
    this.OrderState = new FormControl();
    this.patNameCol = new FormControl();
    this.natNomCol = new FormControl();
    this.passNomCol = new FormControl();
    this.pharmacyCol = new FormControl();
    this.requestQuantCol = new FormControl();
    this.requestDateCol = new FormControl();
    this.dispensedQuantCol = new FormControl();
    this.dispensedDateCol = new FormControl();
    this.notesCol = new FormControl();

    this.ReportPatsMedicationForm = this.fb.group({
      'PHId': this.PharmacyId,
      'MedId': this.MedId,
      'OrderState': this.OrderState,
      'patNameCol': this.patNameCol,
      'natNomCol': this.natNomCol,
      'passNomCol': this.passNomCol,
      'pharmacyCol': this.pharmacyCol,
      'requestQuantCol': this.requestQuantCol,
      'requestDateCol': this.requestDateCol,
      'dispensedQuantCol': this.dispensedQuantCol,
      'dispensedDateCol': this.dispensedDateCol,
      'notesCol': this.notesCol,
    });

    this.patNameCol.setValue(1);
    this.natNomCol.setValue(1);
    this.passNomCol.setValue(1);
    this.requestDateCol.setValue(1);
    this.requestQuantCol.setValue(1);
    this.dispensedDateCol.setValue(1);
    this.dispensedQuantCol.setValue(1);
    this.notesCol.setValue(1);
    this.pharmacyCol.setValue(1);
    this.PHId.setValue(0);

    this.GetMedications();
  }



  GetMedications() {
    this.bra.GetMedications().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }


  reportModal(p) {
    this.MedId.setValue(p)

    this.modalMessage2 = "تحديد الأعمدة المراد إظهارها في التقرير";

    this.modalRef = this.modalService.show(this.modal);

  }

  onCreatePDF() {

    if (this.UserRole == 'موظف الصيدلية') {
      this.ReportPatsMedicationForm.setValue({
        'PHId': this.PharmacyId,
        'MedId': this.MedId.value,
        'OrderState': 9,
        'patNameCol': this.patNameCol.value ? 1 : 0,
        'natNomCol': this.natNomCol.value ? 1 : 0,
        'passNomCol': this.passNomCol.value ? 1 : 0,
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
        'PHId': this.PHId.value,
        'MedId': this.MedId.value,
        'OrderState': 4,
        'patNameCol': this.patNameCol.value ? 1 : 0,
        'natNomCol': this.natNomCol.value ? 1 : 0,
        'passNomCol': this.passNomCol.value ? 1 : 0,
        'pharmacyCol': this.pharmacyCol.value ? 1 : 0,
        'requestQuantCol': this.requestQuantCol.value ? 1 : 0,
        'requestDateCol': this.requestDateCol.value ? 1 : 0,
        'dispensedQuantCol': this.dispensedQuantCol.value ? 1 : 0,
        'dispensedDateCol': this.dispensedDateCol.value ? 1 : 0,
        'notesCol': this.notesCol.value ? 1 : 0,

      });

    }

    console.log(this.ReportPatsMedicationForm.value)
    this.http.post<string[]>("/api/PDFCreator/ReportAllPatsMedicationByPharmacy", this.ReportPatsMedicationForm.value).subscribe((event: any) => {
      window.open("PDFCreator/" + event.value);
    },
      error => this.app.NoDataToShowInReport()
    );

    this.modalRef.hide();

  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
