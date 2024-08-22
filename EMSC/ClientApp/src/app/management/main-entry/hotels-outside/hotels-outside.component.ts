import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef, Input, Directive } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Country } from '../../../interfaces/country';
import { CountryService } from '../../../services/country.service';
import * as $ from 'jquery';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { HotelOutside } from '../../../interfaces/hotel-outside';
import { HotelOutsideService } from '../../../services/hotel-outside.service';
import { AppComponent } from '../../../app.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-hotels-outside',
  templateUrl: './hotels-outside.component.html',
  styleUrls: ['./hotels-outside.component.css']
})
export class HotelsOutsideComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private coun: CountryService,
    private ho: HotelOutsideService,
    private app: AppComponent,

  ) {
  }

  dataSource!: MatTableDataSource<HotelOutside>;

  displayedColumns: string[] = ['index', 'hotelName', 'country', 'edit', 'delete'];
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  addForm!: FormGroup;
  HotelName!: FormControl;
  CountryId!: FormControl;


  updateForm!: FormGroup;
  _id!: FormControl;
  _HotelName!: FormControl;
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
    // this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');


    //=======================  add form
    this.HotelName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.CountryId = new FormControl('', [Validators.required]);

    this.addForm = this.fb.group({
      'HotelName': this.HotelName,
      'CountryId': this.CountryId,
    });



    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._HotelName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this._CountryId = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'HotelName': this._HotelName,
      'CountryId': this._CountryId,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });


    this.matcher = new MyErrorStateMatcher();

    this.GetCountries();
    this.loadAllHotelsOutside();

  }

  loadAllHotelsOutside() {
    this.ho.GetAllHotelsOutside().subscribe(data => {
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

  onAddHotel() {
    this.modalMessage = "جميع الحقول مطلوبة";

    this.addForm.setValue({
      'HotelName': this.HotelName.value,
      'CountryId': this.CountryId.value,
    });
    this.modalRef = this.modalService.show(this.modal);
  }

  onSubmit() {
    let newHotel = this.addForm.value;
    this.ho.AddHotelOutside(newHotel).subscribe(
      result => {
        this.ho.clearCache();
        this.loadAllHotelsOutside();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.app.HotelAlreadyExist()
    )
  }

  //hospital update modal
  onUpdateModal(hoteledit: HotelOutside): void {
    this.modalMessage = "جميع الحقول مطلوبة";

    this._id.setValue(hoteledit.id);
    this._HotelName.setValue(hoteledit.hotelName);
    this._CountryId.setValue(hoteledit.countryId);
    this.updateForm.setValue({
      'id': this._id.value,
      'HotelName': this._HotelName.value,
      'CountryId': this._CountryId.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);


  }


  onUpdate() {
    let edithotel = this.updateForm.value;
    this.ho.UpdateHotelOutside(edithotel.id, edithotel).subscribe(
      result => {
        this.ho.clearCache();
        this.loadAllHotelsOutside();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.app.HotelAlreadyExist()
    )
  }

  //hospital delete modal
  onDeleteModal(deletehotel: HotelOutside) {
    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(deletehotel.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletehotel = this.deleteForm.value;

    this.ho.DeleteHotelOutside(deletehotel.id).subscribe(result => {
      this.ho.clearCache();
      this.modalRef.hide();
      this.app.showToasterSuccess();
      this.loadAllHotelsOutside();
      this.deleteForm.reset();


    },
      error => this.modalMessage2 = "لا يمكن حذف الفندق لارتباطه ببيانات أخرى"
    )
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
