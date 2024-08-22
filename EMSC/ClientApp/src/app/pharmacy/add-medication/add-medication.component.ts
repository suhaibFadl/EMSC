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
  selector: 'app-add-medication',
  templateUrl: './add-medication.component.html',
  styleUrls: ['./add-medication.component.css']
})
export class AddMedicationComponent implements OnInit {

  constructor(
    private formbulider: FormBuilder, private bra: PharmacyService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private app: AppComponent,
  ) { }

  dataSource!: MatTableDataSource<Pharmacy>;

  displayedColumns: string[] = ['index', 'name', 'name2', 'edit', 'delete'];

  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  addForm!: FormGroup;
  MedArName!: FormControl;
  MedEnName!: FormControl;


  updateForm!: FormGroup;
  _id!: FormControl;
  _MedArName!: FormControl;
  _MedEnName!: FormControl;


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

    this.MedArName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.MedEnName = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.addForm = this.fb.group({
      'MedArName': this.MedArName,
      'MedEnName': this.MedEnName,
      'UserId': this.UserId,
    });




    //  // delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });




    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._MedArName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this._MedEnName = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.updateForm = this.fb.group({
      'id': this._id,
      'MedArName': this._MedArName,
      'MedEnName': this._MedEnName,

    });


    this.matcher = new MyErrorStateMatcher();

    this.GetMedications();

  }

  GetMedications() {
    this.bra.GetMedications().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }







  onAddMedicine() {
    this.modalMessage1 = "الرجاء إدخال اسم الدواء ";

    this.modalRef = this.modalService.show(this.modal);
  }

  //Medicine delete modal
  onDeleteModal(DeleteMedicine: Pharmacy) {
    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(DeleteMedicine.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }



  //Medicine update modal
  onUpdateModal(edit: Pharmacy): void {
    this.modalMessage = "الرجاء ادخال اسم الدواء الجديد ";

    this._id.setValue(edit.id);
    this._MedArName.setValue(edit.medArName);
    this._MedEnName.setValue(edit.medEnName);

    this.updateForm.setValue({
      'id': this._id.value,
      'MedArName': this._MedArName.value,
      'MedEnName': this._MedEnName.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);


  }



  onSubmit() {
    this.addForm.setValue({
      'MedArName': this.MedArName.value,
      'MedEnName': this.MedEnName.value,
      'UserId': this.UserId,
    });


    let newData = this.addForm.value;

    this.bra.AddMedication(newData).subscribe(
      result => {
        this.bra.clearCache();
        this.GetMedications();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => (this.modalMessage1 = "تم إضافة هذا الدواء من قبل", this.app.showToasterError()
      )
    )
    this.addForm.reset();


  }

  onDelete(): void {
    let deleteMedicine = this.deleteForm.value;
    this.bra.DeleteMedication(deleteMedicine.id).subscribe(result => {
      this.bra.clearCache();
      this.GetMedications();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();

    },
      error => this.modalMessage2 = "لا يمكن حذف الدواء لإرتباطه ببيانات أخرى"

    )
  }

  onUpdate() {
    let edited = this.updateForm.value;
    this.bra.UpdateMedication(edited.id, edited).subscribe(
      result => {
        this.bra.clearCache();
        this.GetMedications();
        this.modalRef.hide();


        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم الدواء موجود من قبل"

    )
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
