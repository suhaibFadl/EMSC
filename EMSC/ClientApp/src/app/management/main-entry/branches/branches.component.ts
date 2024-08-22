import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, Directive, Input } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Branch } from '../../../interfaces/branch';
import { BranchService } from '../../../services/branch.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ElementRef } from '@angular/core';
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
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {

  constructor(
    private formbulider: FormBuilder, private bra: BranchService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private app: AppComponent,
  ) { }

  dataSource!: MatTableDataSource<Branch>;

  displayedColumns: string[] = ['index', 'name', 'edit', 'delete'];
  clickedRows = new Set<Branch>();
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  addForm!: FormGroup;
  BranchName!: FormControl;


  updateForm!: FormGroup;
  _id!: FormControl;
  _BranchName!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;

  UserId!: string;
  UserRole!: string;
  id!: number;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  // add Modal
  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;


  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    //======================= add form

    this.BranchName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.addForm = this.fb.group({
      'BranchName': this.BranchName,

    });




    //  // delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });




    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._BranchName = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.updateForm = this.fb.group({
      'id': this._id,
      'BranchName': this._BranchName,

    });


    this.matcher = new MyErrorStateMatcher();

    this.loadAllBranches();

  }

  loadAllBranches() {
    this.bra.GetBranches().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

    });
  }







  onAddBranch() {
    this.modalMessage1 = "الرجاء إدخال اسم الفرع ";

    this.modalRef = this.modalService.show(this.modal);
  }

  //Branch delete modal
  onDeleteModal(DeleteBranch: Branch) {
    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(DeleteBranch.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }



  //Branch update modal
  onUpdateModal(editBranch: Branch): void {
    this.modalMessage = "الرجاء ادخال اسم الفرع الجديد ";

    this._id.setValue(editBranch.id);
    this._BranchName.setValue(editBranch.branchName);
    this.updateForm.setValue({
      'id': this._id.value,
      'BranchName': this._BranchName.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);


  }



  onSubmit() {

    this.addForm.setValue({
      'BranchName': this.BranchName.value,
    });

    let newBranch = this.addForm.value;

    this.bra.AddBranch(newBranch).subscribe(
      result => {
        this.bra.clearCache();
        this.loadAllBranches();
        this.modalRef.hide();
        this.addForm.reset();
      //  this.modalMessage1 = "تمت الإضافة";
        this.app.showToasterSuccess();
      },
      error => (this.modalMessage1 = "تم إضافة هذا الفرع من قبل", this.app.showToasterError()
        )
    )
    this.addForm.reset();


  }

  onDelete(): void {
    let deletebranch = this.deleteForm.value;
    this.bra.DeleteBranch(deletebranch.id).subscribe(result => {
      this.bra.clearCache();
      this.loadAllBranches();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();

    },
      error => this.modalMessage2 = "لا يمكن حذف الفرع لإرتباطه ببيانات أخرى"

    )
  }

  onUpdate() {
    let editBranch = this.updateForm.value;
    this.bra.updateBranch(editBranch.id, editBranch).subscribe(
      result => {
        this.bra.clearCache();
        this.loadAllBranches();
        this.modalRef.hide();


        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم الفرع موجود من قبل"

    )
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
