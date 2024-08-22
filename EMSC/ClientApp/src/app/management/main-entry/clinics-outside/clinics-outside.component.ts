import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef, Input, Directive } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { HospitalsCountries } from '../../../interfaces/hospitals-countries';
import { Country } from '../../../interfaces/country';
import { HospitalCountryService } from '../../../services/hospital-country.service';
import { CountryService } from '../../../services/country.service';
import * as $ from 'jquery';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { DatePipe, formatDate } from '@angular/common';
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
  selector: 'app-clinics-outside',
  templateUrl: './clinics-outside.component.html',
  styleUrls: ['./clinics-outside.component.css']
})
export class ClinicsOutsideComponent implements OnInit {

  dataSource!: MatTableDataSource<HospitalsCountries>;

  displayedColumns: string[] = ['index', 'name', 'name1', 'edit', 'delete'];
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  addForm!: FormGroup;
  HospitalName!: FormControl;
  CountryId!: FormControl;

  updateForm!: FormGroup;
  _id!: FormControl;
  _HospitalName!: FormControl;
  _CountryId!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;


  UserDate!: string;

  UserId!: string;
  UserRole!: string;
  UserCountryId!: string;
  CountryName!: string;
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
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private coun: CountryService,
    private hoco: HospitalCountryService,
    private app: AppComponent,

  ) {
  }


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;



  countries: Country[] = [];
  countries$!: Observable<Country[]>;


  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    //=======================  add form
    this.HospitalName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.CountryId = new FormControl('', [Validators.required]);

    this.addForm = this.fb.group({
      'HospitalName': this.HospitalName,
      'CountryId': this.CountryId,
      'UserId': this.UserId,
    });



    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._HospitalName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this._CountryId = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'HospitalName': this._HospitalName,
      'CountryId': this._CountryId,
      'UserId': this.UserId,

    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });


    this.matcher = new MyErrorStateMatcher();

    this.GetCountries();
    this.loadAllHospitalsCountries();

  }

  loadAllHospitalsCountries() {
    this.hoco.GetHospitalsCountriesByManagemet().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }


  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountriesMainBrach().subscribe(result => {
      this.countries = result;
    });
  }
  //add modal hospital

  onAddHospital() {
    this.modalMessage = "جميع الحقول مطلوبة";

    this.addForm.setValue({
      'HospitalName': this.HospitalName.value,
      'UserId': this.UserId,
      'CountryId': this.CountryId.value,
    });
    this.modalRef = this.modalService.show(this.modal);

  }
  onSubmit() {
    let newHospitalsCountries = this.addForm.value;
    this.hoco.AddHospitalsCountriesManagemet(newHospitalsCountries).subscribe(
      result => {
        this.hoco.clearCache();
        this.loadAllHospitalsCountries();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.app.HospitalAlreadyExist()

    )

  }

  //hospital update modal
  onUpdateModal(edithospitalscountries: HospitalsCountries): void {
    this.modalMessage = "جميع الحقول مطلوبة";

    this._id.setValue(edithospitalscountries.id);
    this._HospitalName.setValue(edithospitalscountries.hospitalName);
    this._CountryId.setValue(edithospitalscountries.countryId);
    this.updateForm.setValue({
      'id': this._id.value,
      'HospitalName': this._HospitalName.value,
      'CountryId': this._CountryId.value,
      'UserId': this.UserId,

    });

    this.modalRef = this.modalService.show(this.editmodal);


  }


  onUpdate() {
    let edithospitalscountries = this.updateForm.value;
    this.hoco.UpdateHospitalsCountriesManagemet(edithospitalscountries.id, edithospitalscountries).subscribe(
      result => {
        this.hoco.clearCache();
        this.loadAllHospitalsCountries();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.app.HospitalAlreadyExist()
    )
  }

  //hospital delete modal
  onDeleteModal(hospitalscountriesdelete: HospitalsCountries) {
    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(hospitalscountriesdelete.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }
  onDelete(): void {
    let deletehospitalcountry = this.deleteForm.value;

    this.hoco.DeleteHospitalsCountriesManagemet(deletehospitalcountry.id).subscribe(result => {
      this.hoco.clearCache();
      this.modalRef.hide();
      this.app.showToasterSuccess();
      this.loadAllHospitalsCountries();
      this.deleteForm.reset();


    },
      error => this.modalMessage2 = "لا يمكن حذف المصحة لارتباطها ببيانات أخرى"
    )
  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
