import { ChangeDetectorRef, Component, Directive, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Medicalservices } from '../../interfaces/medicalservices';
import { PriceslistsService } from '../../services/priceslists.service';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { AppComponent } from '../../app.component';
import { AccountService } from '../../services/account.service';
import { promise } from 'selenium-webdriver';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-medicalservices',
  templateUrl: './medicalservices.component.html',
  styleUrls: ['./medicalservices.component.css']
})
export class MedicalservicesComponent implements OnInit {

  dataSource!: MatTableDataSource<Medicalservices>;


  displayedColumns: string[] = ['index', 'arname','enname', 'edit', 'delete'];

  addForm!: FormGroup;
  servarname!: FormControl;
  servenname!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _servarname!: FormControl;
  _servenname!: FormControl;


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


  constructor(private formbulider: FormBuilder, private PLService: PriceslistsService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private app: AppComponent,
    private acct: AccountService

  ) {
  }
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;

  loadAllMedicalServices() {
    this.PLService.GetMeedicalServices().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(data);
    });
  }


  ngOnInit(): void {
    // this.dataSource.sort = this.sort;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    //=======================  add form
    this.servarname = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.servenname = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.addForm = this.fb.group({
      'servarname': this.servarname,
      'servenname': this.servenname,
      'UserId': this.UserId,
    });


    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._servarname = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this._servenname = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'servarname': this._servarname,
      'servenname': this._servenname,
      'UserId': this.UserId,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.matcher = new MyErrorStateMatcher();


    this.loadAllMedicalServices();
  }


  //add modal country
  onAddMedicalService() {
    this.modalMessage1 = "الرجاء إدخال بيانات الخدمة الطبية ";

    this.modalRef = this.modalService.show(this.modal);
  }
  onSubmit() {
    let newMedicalservice = this.addForm.value;

    this.PLService.AddMedicalService(newMedicalservice).subscribe(
      result => {
        this.PLService.clearCache();
        this.loadAllMedicalServices();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage1 = "تم إضافة هذه الخدمة من قبل"
    )

  }

  //country update modal
  onUpdateModal(editmedserv: Medicalservices): void {
    this.modalMessage = "الرجاء ادخال بيانات الخدمة ";
    this._id.setValue(editmedserv.id);
    this._servarname.setValue(editmedserv.servArName);
    this._servenname.setValue(editmedserv.servEnName);
    this.updateForm.setValue({
      'id': this._id.value,
      'servarname': this._servarname.value,
      'servenname': this._servenname.value,
      'UserId': this.UserId
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    let editmedserv = this.updateForm.value;
    this.PLService.updateMedicalService(editmedserv.id, editmedserv).subscribe(
      result => {
        this.PLService.clearCache();
        this.loadAllMedicalServices();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم الخدمة موجود من قبل"

    )

  }

  // delete modal country
  onDeleteModal(medservdelete: Medicalservices) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(medservdelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletecountry = this.deleteForm.value;
    this.PLService.DeleteMedicalService(deletecountry.id).subscribe(result => {
      this.PLService.clearCache();
      this.loadAllMedicalServices();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();
    },
      error => this.modalMessage2 = "لا يمكن حذف الخدمة لإرتباطها ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
