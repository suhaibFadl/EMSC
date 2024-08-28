import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef, Input, Directive } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Hospital } from '../../../interfaces/hospital';
import { HospitalService } from '../../../services/hospital.service';
import * as $ from 'jquery';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { AppComponent } from '../../../app.component';
import { HospitalRanksComponent } from '../hospital-ranks/hospital-ranks.component';
import { HospitalRanksService } from '../../../services/hospital-ranks.service';
import { HospitalRank } from '../../../interfaces/hospital-ranks';
import { PriceslistsService } from '../../../services/priceslists.service';
import { Priceslists } from '../../../interfaces/priceslists';

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
  selector: 'app-clinics-inside',
  templateUrl: './clinics-inside.component.html',
  styleUrls: ['./clinics-inside.component.css']
})
export class ClinicsInsideComponent implements OnInit {

  dataSource!: MatTableDataSource<Hospital>;
  hospitalRanks!: HospitalRank[];
  pricesLists!: Priceslists[];
  displayedColumns: string[] = ['index', 'name', 'rankName', 'rankPer', 'priceslist','edit', 'delete'];
  clickedRows = new Set<Hospital>();
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  addForm!: FormGroup;
  hospName!: FormControl;
  rank!: FormControl;
  listId!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _hospName!: FormControl;
  _rank!: FormControl;
  _listId!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;



  UserId!: string;
  UserRole!: string;
  id!: number;

  // add Modal
  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;



  constructor(
    private formbulider: FormBuilder,
    private hos: HospitalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private hospitalRankServices: HospitalRanksService,
    private pricesListsService: PriceslistsService,
    private app: AppComponent,

  ) {

  }


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  modalMessage1!: string;

  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    //=======================  add form
    this.hospName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.rank = new FormControl('', [Validators.required]);
    this.listId = new FormControl('', [Validators.required]);
    this.addForm = this.fb.group({
      'hospName': this.hospName,
      'rank': this.rank,
      'listId': this.listId,
    });



    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._hospName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this._rank = new FormControl('', [Validators.required]);
    this._listId = new FormControl('', [Validators.required]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'hospName': this._hospName,
      'rank': this._rank,
      'listId': this._listId,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });


    this.matcher = new MyErrorStateMatcher();

    this.loadAllHospitals();
    this.loadAllHospitalRanks();
    this.loadAllPricesLists();
  }

  loadAllHospitals() {
    this.hos.GetHospitals().subscribe(data => {
      console.log(data)
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadAllHospitalRanks() {
    this.hospitalRankServices.GetHospitalRanks().subscribe(data => {
      this.hospitalRanks = data;
    });
  }

  loadAllPricesLists() {
    this.pricesListsService.GetPricesLists().subscribe(data => {
      this.pricesLists = data;
    });
  }
  //add modal hospital

  onAddHospital() {
    this.modalMessage1 = "الرجاء إدخال اسم المصحة ";
    this.modalRef = this.modalService.show(this.modal);
  }

  onSubmit() {
    let newHospital = this.addForm.value;
    console.log(newHospital);
    this.hos.AddHospital(newHospital).subscribe(
      result => {
        this.hos.clearCache();
        this.loadAllHospitals();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();      },
      error => this.modalMessage1 = "تم إضافة هذه المصحة من قبل"
    )

  }

  //hospital update modal
  onUpdateModal(edithospital: Hospital): void {
    this.modalMessage = "الرجاء ادخال اسم المصحة الجديد ";
    console.log(edithospital)
    this._id.setValue(edithospital.id);
    this._hospName.setValue(edithospital.hospName);
    this._rank.setValue(edithospital.rank);
    this._listId.setValue(edithospital.listId);
    this.updateForm.setValue({
      'id': this._id.value,
      'hospName': this._hospName.value,
      'rank': this._rank.value,
      'listId': this._listId.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }


  onUpdate() {
    let edithospital = this.updateForm.value;
    this.hos.updatehospital(edithospital.id, edithospital).subscribe(
      result => {
        this.hos.clearCache();
        this.loadAllHospitals();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم المصحة موجود من قبل"
    )
  }

  //hospital delete modal
  onDeleteModal(hospitaldelete: Hospital) {
    console.log(hospitaldelete)
    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(hospitaldelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }
  onDelete(): void {
    let deletecountry = this.deleteForm.value;

    this.hos.DeleteHospital(deletecountry.id).subscribe(result => {
      this.hos.clearCache();
      this.loadAllHospitals();
      this.modalRef.hide();
      this.deleteForm.reset();
  

      this.app.showToasterSuccess();


    },
      error => this.modalMessage2 = "لا يمكن حذف المصحة لارتباطها ببيانات أخرى"
    )
  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
