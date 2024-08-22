import { ChangeDetectorRef, Component, Directive, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Priceslists } from '../../interfaces/priceslists';
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
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {

  dataSource!: MatTableDataSource<Priceslists>;


  displayedColumns: string[] = ['index', 'name', 'edit', 'delete'];

  addForm!: FormGroup;
  listname!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _listname!: FormControl;


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

  loadAllPricesLists() {
    this.PLService.GetPricesLists().subscribe(data => {
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
    this.listname = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.addForm = this.fb.group({
      'listname': this.listname,
      'UserId': this.UserId,
    });


    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._listname = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'listname': this._listname,
      'UserId': this.UserId,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.matcher = new MyErrorStateMatcher();


    this.loadAllPricesLists();
  }



  //add modal country
  onAddPricelist() {
    this.modalMessage1 = "الرجاء إدخال اسم كراسة الأسعار ";

    this.modalRef = this.modalService.show(this.modal);
  }
  onSubmit() {
    let newPricelist = this.addForm.value;

    this.PLService.AddPriceList(newPricelist).subscribe(
      result => {
        this.PLService.clearCache();
        this.loadAllPricesLists();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage1 = "تم إضافة هذه الكراسة من قبل"
    )

  }

  //country update modal
  onUpdateModal(editlistname: Priceslists): void {
    this.modalMessage = "الرجاء ادخال اسم الكراسة الجديد الجديد ";
    this._id.setValue(editlistname.id);
    this._listname.setValue(editlistname.listName);
    this.updateForm.setValue({
      'id': this._id.value,
      'listname': this._listname.value,
      'UserId': this.UserId
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    let editpricelist = this.updateForm.value;
    this.PLService.updatePriceList(editpricelist.id, editpricelist).subscribe(
      result => {
        this.PLService.clearCache();
        this.loadAllPricesLists();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم الكراسة موجود من قبل"

    )

  }

  // delete modal country
  onDeleteModal(pricelistdelete: Priceslists) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(pricelistdelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletecountry = this.deleteForm.value;
    this.PLService.DeletePriceList(deletecountry.id).subscribe(result => {
      this.PLService.clearCache();
      this.loadAllPricesLists();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();
    },
      error => this.modalMessage2 = "لا يمكن حذف كراسة الأسعار لإرتباطها ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
