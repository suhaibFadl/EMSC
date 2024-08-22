import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { PatientTrans } from '../../interfaces/patient-trans';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { TreatmentService } from '../../services/treatment.service';
import { Treatment } from '../../interfaces/treatment';
import { HospitalCountryService } from '../../services/hospital-country.service';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { HospitalsCountries } from '../../interfaces/hospitals-countries';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HousingLettersService } from '../../services/housing-letters.service';
import { HotelOutside } from '../../interfaces/hotel-outside';
import { HousingLetter } from '../../interfaces/housing-letter';
import { HotelOutsideService } from '../../services/hotel-outside.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-all-hotels-procedures',
  templateUrl: './all-hotels-procedures.component.html',
  styleUrls: ['./all-hotels-procedures.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class AllHotelsProceduresComponent implements OnInit {

  public formControl!: FormGroup;

  LoginStatus$!: Observable<boolean>;

  dataSource!: MatTableDataSource<HousingLetter>;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private acct: AccountService,
    private br: BranchService,
    private co: CountryService,
    private hos: HotelOutsideService,
    private hl: HousingLettersService,
    private formBuilder: FormBuilder

  ) { }

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh','eighth','ninth','tenth','eleventh', 'details'];

  UserId!: string;
  UserDate!: string;
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;

  UserCountryId!: string;
  RoleId!: string;
  CountryName!: string;
  changeid!: number;
  UserRole!: string;
  BranchUserId!: string;


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  @ViewChild('viewmedicalTemplate') viewmedicalmodal!: TemplateRef<any>;

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches$!: Observable<Branch[]>;
  branches: Branch[] = [];

  HotelsCountry$!: Observable<HotelOutside[]>;
  HotelsCountry: HotelOutside[] = [];

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchUserId = result });
    this.acct.currentUserCountryId.subscribe(result => { this.UserCountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.acct.currentUserRoleId.subscribe(result => { this.RoleId = result });

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      entryDate: '',
      leavingDate: '',
      phoneNumber: '',
      hotelName: '',
    })

    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });

    this.co.GetCountries().subscribe(result => {
      this.countries = result;
    });

    this.GetHotelsCountry();
    this.GetAllHotelProcedures();

  }


  GetHotelsCountry() {
    this.hos.clearCache();
    this.hos.GetHotelsOutsideByCountryId(this.UserCountryId.toString()).subscribe(result => {
      this.HotelsCountry = result;
    });
  }

  GetAllHotelProcedures() {
    this.hl.clearCache();
    this.hl.GetAllHotelProcedures(this.UserCountryId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const g = !filter.entryDate || moment(data.entryDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.entryDate).format('yyyy-MM-DD'));
        const h = !filter.leavingDate || moment(data.leavingDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.leavingDate).format('yyyy-MM-DD'));
        const i = !filter.hotelName || data.hotelName.toLowerCase().includes(filter.hotelName);

        return a && b && c && d && e && g && h && i;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });


    });
  }




  onSelect(p: HousingLetter): void {
    this.router.navigateByUrl('/countries/all-renewals-by-hotel-entry-id/' + p.id);
  }



  resetBranchesFilter() { this.formControl.controls['branchName'].setValue(null); }
  resetCountriesFilter() { this.formControl.controls['country'].setValue(null); }
  resetEntryDate() { this.formControl.controls['entryDate'].setValue(null); }
  resetLeavingDate() { this.formControl.controls['leavingDate'].setValue(null); }
  resetHotelName() { this.formControl.controls['hotelName'].setValue(null); }


}
