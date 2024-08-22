import { ChangeDetectorRef, Component, Directive, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Dependency } from '../../../interfaces/dependency';
import { DependencyService } from './../../../services/dependency.service';
import { MatTableDataSource, } from '@angular/material/table';
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

//new country
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
  selector: 'app-dependency',
  templateUrl: './dependency.component.html',
  styleUrls: ['./dependency.component.css']
})
export class DependencyComponent implements OnInit {

  dataSource!: MatTableDataSource<Dependency>;


  displayedColumns: string[] = ['index', 'name', 'edit', 'delete'];

  addForm!: FormGroup;
  DependencyType!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _DependencyType!: FormControl;


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



  constructor(private formbulider: FormBuilder, private dep: DependencyService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private app: AppComponent,

  ) {
  }
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    //=======================  add form
    this.DependencyType = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.addForm = this.fb.group({
      'DependencyType': this.DependencyType,
    });


    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._DependencyType = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'DependencyType': this._DependencyType,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.matcher = new MyErrorStateMatcher();


    this.loadAllDependencies();

  }

  loadAllDependencies() {
    this.dep.GetDependencies().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  //add modal Dependency
  onAddDependency() {
    this.modalMessage1 = "الرجاء إدخال اسم التبعية ";

    this.modalRef = this.modalService.show(this.modal);
  }
  onSubmit() {
    let newDep = this.addForm.value;

    this.dep.AddDependency(newDep).subscribe(
      result => {
        this.dep.clearCache();
        this.loadAllDependencies();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage1 = "تم إضافة هذه التبعية من قبل"
    )

  }

  //country update modal
  onUpdateModal(editdependency: Dependency): void {
    this.modalMessage = "الرجاء ادخال اسم التبعية الجديد ";
    this._id.setValue(editdependency.id);
    this._DependencyType.setValue(editdependency.dependencyType);
    this.updateForm.setValue({
      'id': this._id.value,
      'DependencyType': this._DependencyType.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    let editDependency = this.updateForm.value;
    this.dep.updateDependency(editDependency.id, editDependency).subscribe(
      result => {
        this.dep.clearCache();
        this.loadAllDependencies();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم التبعية موجود من قبل"

    )

  }

  // delete modal country
  onDeleteModal(deletedep: Dependency) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(deletedep.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletedep = this.deleteForm.value;
    this.dep.DeleteDependency(deletedep.id).subscribe(result => {
      this.dep.clearCache();
      this.loadAllDependencies();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();
    },
      error => this.modalMessage2 = "لا يمكن حذف التبعية لإرتباطها ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
