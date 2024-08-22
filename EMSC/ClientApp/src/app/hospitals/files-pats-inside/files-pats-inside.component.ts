import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Hospital } from '../../interfaces/hospital';
import { HospitalService } from '../../services/hospital.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { PatientTrans } from '../../interfaces/patient-trans';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { TreatmentService } from '../../services/treatment.service';
import { Treatment } from '../../interfaces/treatment';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { PatientsLettersInsideService } from '../../services/patients-letters-inside.service';

@Component({
  selector: 'app-files-pats-inside',
  templateUrl: './files-pats-inside.component.html',
  styleUrls: ['./files-pats-inside.component.css']
})
export class FilesPatsInsideComponent implements OnInit {

  Treatment$!: Observable<Treatment[]>;
  Treatment: Treatment[] = [];

  LoginStatus$!: Observable<boolean>;

  dataSource!: MatTableDataSource<Treatment>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh','eighth','ninth','ten', 'details'];
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'details'];

  selection: any;


  UserId!: string;
  UserDate!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;

  UserHospId!: string;
  CountryName!: string;
  changeid!: number;
  UserRole!: string;
  BranchUserId!: string;


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private acct: AccountService,
    private br: BranchService,
    private co: HospitalService,
    private pt: PatientsLettersInsideService,
  ) { }

  hospitals: Hospital[] = [];
  hospitals$!: Observable<Hospital[]>;

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches$!: Observable<Branch[]>;
  branches: Branch[] = [];

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserHospitalId.subscribe(result => { this.UserHospId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });

    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });

    this.co.GetHospitals().subscribe(result => {
      this.hospitals = result;
    });


    switch (this.UserRole) {
      case "مدير المصحة": this.GetPatsFilesInsideByHospId();
        break;
      case "موظف إدخال المصحة": this.GetPatsFilesInsideByHospId();
        break;
      case "موظف إدخال الفرع": this.GetPatsFilesInsideByBranchId();
        break;
      case "مدير الفرع": this.GetPatsFilesInsideByBranchId();
        break;
    } 

  }


  GetPatsFilesInsideByHospId() {
    this.pt.clearCache();
    this.pt.GetPatsFilesInsideByHospId(this.UserHospId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }


  GetPatsFilesInsideByBranchId() {
    this.pt.clearCache();
    this.pt.GetPatsFilesInsideByBranchId(this.BranchUserId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }



  onSelect(p: Treatment): void {
    this.router.navigateByUrl('/hospitals/treatment-move-inside/' + p.id);
  }


  ViewlMedicalModal(pat: Treatment) {
    this.modalMessage = pat.medical_Diagnosis;
    this.modalRef = this.modalService.show(this.viewmedicalmodal);
  }



  applyFilter2(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {

    if (filterValue != "") {
      this.dataSource.filter = filterValue.trim().toLowerCase();

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter3() {
    switch (this.UserRole) {
      case "مدير المصحة": this.GetPatsFilesInsideByHospId();
        break;
      case "موظف إدخال المصحة": this.GetPatsFilesInsideByHospId();
        break;
      case "موظف إدخال الفرع": this.GetPatsFilesInsideByBranchId();
        break;
      case "مدير الفرع": this.GetPatsFilesInsideByBranchId();
        break;
    } 

  }

}
