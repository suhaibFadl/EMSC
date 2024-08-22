import { ChangeDetectorRef, Component, Directive, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country } from '../../../interfaces/country';
import { CountryService } from './../../../services/country.service';
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
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  dataSource!: MatTableDataSource<Country>;


  displayedColumns: string[] = ['index', 'name', 'edit', 'delete'];

  addForm!: FormGroup;
  country!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _country!: FormControl;


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


  constructor(private formbulider: FormBuilder, private countryService: CountryService,
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

  loadAllCountries() {
    this.countryService.GetCountriesMainBrach().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
    });
  }
  ngOnInit(): void {

   // this.dataSource.sort = this.sort;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    //=======================  add form
    this.country = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.addForm = this.fb.group({
      'country': this.country,
    });


    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._country = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'country': this._country,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.matcher = new MyErrorStateMatcher();


    this.loadAllCountries();

  }





  //add modal country
  onAddCountry() {
    this.modalMessage1 = "الرجاء إدخال اسم الدولة ";

    this.modalRef = this.modalService.show(this.modal);
  }
  onSubmit() {
    let newCountry = this.addForm.value;

    this.countryService.AddCountry(newCountry).subscribe(
      result => {
        this.countryService.clearCache();
        this.loadAllCountries();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage1 = "تم إضافة هذه الدولة من قبل"
    )

  }

  //country update modal
  onUpdateModal(editcountry: Country): void {
    this.modalMessage = "الرجاء ادخال اسم الدولة الجديد ";
    this._id.setValue(editcountry.id);
    this._country.setValue(editcountry.country);
    this.updateForm.setValue({
      'id': this._id.value,
      'country': this._country.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    let editcountry = this.updateForm.value;
    this.countryService.updateCountry(editcountry.id, editcountry).subscribe(
      result => {
        this.countryService.clearCache();
        this.loadAllCountries();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم الدولة موجود من قبل"

    )

  }

  // delete modal country
  onDeleteModal(countrydelete: Country) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(countrydelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletecountry = this.deleteForm.value;
    this.countryService.DeleteCountry(deletecountry.id).subscribe(result => {
      this.countryService.clearCache();
      this.loadAllCountries();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();
    },
      error => this.modalMessage2 = "لا يمكن حذف الدولة لإرتباطها ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
