import { ChangeDetectorRef, Component, Directive, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm} from '@angular/forms';
import { MatTableDataSource, } from '@angular/material/table';
import { HospitalRank } from '../../../interfaces/hospital-ranks';
import { HospitalRanksService } from './../../../services/hospital-ranks.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { AppComponent } from '../../../app.component';



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
  selector: 'app-hospital-ranks',
  templateUrl: './hospital-ranks.component.html',
  styleUrls: ['./hospital-ranks.component.css']
})
export class HospitalRanksComponent implements OnInit {
  dataSource!: MatTableDataSource<HospitalRank>;


  displayedColumns: string[] = ['index', 'name', 'rankPer','edit', 'delete'];

  addForm!: FormGroup;
  rankControl!: FormControl;
  rankPerControl!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _rankControl!: FormControl;
  _rankPerControl!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;



  UserId!: string;
  UserRole!: string;
  id!: number;
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

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
    private hospitalRankServices: HospitalRanksService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private app: AppComponent,
  ) { }
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  ngOnInit(): void {
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    //=======================  add form
    this.rankControl = new FormControl('', [Validators.required]);
    this.rankPerControl = new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]);

    this.addForm = this.fb.group({
      'rankName': this.rankControl,
      'rankPer': this.rankPerControl,
    });


    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._rankControl = new FormControl('', [Validators.required]);
    this._rankPerControl = new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'rankName': this._rankControl,
      'rankPer': this._rankPerControl,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    //this.matcher = new MyErrorStateMatcher();


    this.loadAllHospitalRanks();
  }

  loadAllHospitalRanks() {
    this.hospitalRankServices.GetHospitalRanks().subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  //add modal Hospita lRank
  onAddHospitalRank() {
    this.modalMessage1 = "الرجاء إدخال اسم تصنيف ";

    this.modalRef = this.modalService.show(this.modal);
  }

  onSubmit() {
    let newHospitalRank: HospitalRank = this.addForm.value;
    newHospitalRank.userId = this.UserId;
    newHospitalRank.userDate = new Date();
    this.hospitalRankServices.AddHospitalRank(newHospitalRank).subscribe(
      result => {
        this.hospitalRankServices.clearCache();
        this.loadAllHospitalRanks();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage1 = "تم إضافة هذا التصنيف من قبل"
    )

  }

  //Hospital Rank update modal
  onUpdateModal(editrankControl: HospitalRank): void {
    this.modalMessage = "الرجاء ادخال اسم التصنيف الجديد ";
    this._id.setValue(editrankControl.id);
    this._rankControl.setValue(editrankControl.rankName);
    this._rankPerControl.setValue(editrankControl.rankPer);
    this.updateForm.setValue({
      'id': this._id.value,
      'rankName': this._rankControl.value,
      'rankPer':  this._rankPerControl.value
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    let editrankControl = this.updateForm.value;
    console.log(editrankControl);
    this.hospitalRankServices.updateHospitalRank(editrankControl.id, editrankControl).subscribe(
      result => {
        this.hospitalRankServices.clearCache();
        this.loadAllHospitalRanks();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم تصنيف موجود من قبل"

    )

  }

  // delete modal country
  onDeleteModal(deleteRankControl: HospitalRank) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(deleteRankControl.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletedRank = this.deleteForm.value;
    console.log(deletedRank);
    this.hospitalRankServices.DeleteHospitalRank(deletedRank.id).subscribe(result => {
      this.hospitalRankServices.clearCache();
      this.loadAllHospitalRanks ();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();
    },
      error => this.modalMessage2 = "لا يمكن حذف تصنيف لإرتباطها ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
