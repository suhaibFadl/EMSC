import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Directive, Input, Output, TemplateRef, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe, formatDate } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { User } from '../../../interfaces/user';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Branch } from '../../../interfaces/branch';
import { Role } from '../../../interfaces/role';
import { RoleService } from '../../../services/role.service';
import { BranchService } from '../../../services/branch.service';



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
  selector: 'app-branches-users',
  templateUrl: './branches-users.component.html',
  styleUrls: ['./branches-users.component.css']
})
export class BranchesUsersComponent implements OnInit {

  constructor(private formbulider: FormBuilder,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private rol: RoleService,
    private ho: BranchService,
  ) {

    this.navLinks = [
      {
        label: 'حسابات الموظفين داخل الفرع الرئيسي',
        link: '/management/manage-users/main-branch-users',

        index: 0
      }, {
        label: 'حسابات الموظفين في الفروع داخل ليبيا',
        link: '/management/manage-users/branches-users',

        index: 1
      },
      {
        label: 'حسابات الموظفين في الصيدليات داخل ليبيا',
        link: '/management/manage-users/pharmacies-users',

        index: 1
      }, {
        label: 'حسابات الموظفين داخل المصحات',
        link: '/management/manage-users/clinics-users',
        index: 2
      }, {
        label: 'حسابات الموظفين في الساحات خارج ليبيا',
        link: '/management/manage-users/countries-users',

        index: 3
      },
    ];
  }

  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = 0;


  dataSource!: MatTableDataSource<User>;


  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'block', 'delete'];



  UserId!: string;
  UserRole!: string;
  ActiveState!: string;
  id!: number;


  BlockForm!: FormGroup;
  Did!: FormControl;


  deleteForm!: FormGroup;
  UID!: FormControl;

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @Output() change!: EventEmitter<MatSlideToggleChange>
  // add Modal
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('blockTemplate') blockmodal!: TemplateRef<any>;
  @ViewChild('unblockTemplate') unblockmodal!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;

  insertForm!: FormGroup;
  username!: FormControl;
  password!: FormControl;
  cpassword!: FormControl;
  PhoneNumber!: FormControl;
  Role!: FormControl;
  BranchId!: FormControl;
  // modalRef!: BsModalRef;
  invalidRegister!: boolean;
  // modalMessage!: string;
  errorList!: string[];


  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild('modalSuccededtemplate') modalSucceded!: TemplateRef<any>;


  BranchUserId!: string;

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  roles: Role[] = [];
  roles$!: Observable<Role[]>;

  //custom validator
  MustMatch(passwordControl: AbstractControl): ValidatorFn {

    return (cpasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialised yet
      if (!passwordControl && !cpasswordControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (cpasswordControl.hasError && !passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (passwordControl.value !== cpasswordControl.value) {
        return { 'mustMatch': true };
      }
      else {
        return null;
      }

    }
  }


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  modalMessage3!: string;


  ngOnInit(): void {

    this.loadAllUsers();

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserActiveState.subscribe(result => { this.ActiveState = result });


    this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.PhoneNumber = new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(10)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]);
    this.cpassword = new FormControl('', [Validators.required, this.MustMatch(this.password)]);
    this.Role = new FormControl('', [Validators.required]);
    this.BranchId = new FormControl('', [Validators.required]);

    this.errorList = [];


    this.insertForm = this.fb.group(
      {
        "username": this.username,
        "PhoneNumber": this.PhoneNumber,
        "password": this.password,
        "cpassword": this.cpassword,
        "Role": this.Role,
        "BranchId": this.BranchId,
      });

    //=======================  block form
    this.Did = new FormControl();
    this.BlockForm = this.fb.group(
      {
        'id': this.Did,
      });

    //=======================  delete form
    this.UID = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.matcher = new MyErrorStateMatcher();

    this.roles$ = this.rol.GetRolesForBranches();
    this.roles$.subscribe(result => {
      this.roles = result;

    });
    this.branches$ = this.ho.GetBranches();
    this.branches$.subscribe(result => {
      this.branches = result;
    });

    this.loadAllUsers();

  }

  loadAllUsers() {
    this.acct.GetUsersInside().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }


  onAddUser(): void {
    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.insertForm.setValue({
      "username": '',
      "PhoneNumber": '',
      "password": '',
      "cpassword": '',
      "Role": '',
      "BranchId": '',
    });
    this.modalRef = this.modalService.show(this.modal);
    this.modalRef.hide();
    this.errorList = [];

  }

  onSubmit() {

    let newpAccount = this.insertForm.value;
    this.acct.clearCache();
    this.acct.AddAccountBr(newpAccount).subscribe(
      result => {
        this.acct.clearCache();
        this.loadAllUsers();
        this.modalMessage = "تم انشاء حساب المستخدم بنجاح";
        this.insertForm.reset();
        this.insertForm.controls.Role.setErrors(null);
        this.modalRef = this.modalService.show(this.modalSucceded)
        this.modalRef.hide();
      }, error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
        }

        this.modalMessage = "لم يتم انشاء الحساب";
        this.modalRef = this.modalService.show(this.modalSucceded);
        this.modalRef.hide();

      });


  }
  //
  onBlockModal(editBlock: User) {

    this.modalMessage2 = "هل أنت متأكد من إيقاف حساب المستخدم ؟";
    this.Did.setValue(editBlock.id);
    this.BlockForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.blockmodal);
  }
  //
  onBlockModall(editBlock: User) {

    this.modalMessage3 = " هل أنت متأكد من تفعيل حساب المستخدم ؟";
    this.Did.setValue(editBlock.id);
    this.BlockForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.unblockmodal);
  }

  onBlock(): void {
    let editBlock = this.BlockForm.value;
    this.acct.GetBlockedUser(editBlock.id, editBlock).subscribe(result => {
      this.acct.clearCache();
      this.loadAllUsers();
      this.modalRef.hide();
      this.BlockForm.reset();
      this.modalMessage2 = "هل أنت متأكد من عملية إيقاف حساب المستخدم ؟";
    },
      error => this.modalMessage2 = "لا يمكن  "

    )
  }

  onUnBlock(): void {
    let editBlock = this.BlockForm.value;
    this.acct.GetBlockedUser(editBlock.id, editBlock).subscribe(result => {
      this.acct.clearCache();
      this.loadAllUsers();
      this.modalRef.hide();
      this.BlockForm.reset();
      this.modalMessage3 = "هل أنت متأكد من عملية تفعيل حساب المستخدم ؟";
    },
      error => this.modalMessage3 = "لا يمكن  "

    )
  }


  onDeleteModal(delUser: User) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.UID.setValue(delUser.id);
    this.deleteForm.setValue({
      'id': this.UID.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }


  onDelete(): void {
    let deleteuser = this.deleteForm.value;
    this.acct.DeleteUser(deleteuser.id).subscribe(result => {
      this.acct.clearCache();
      this.loadAllUsers();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    },
      error => this.modalMessage2 = "لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
