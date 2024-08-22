import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Country } from '../../interfaces/country';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { AccountService } from '../../services/account.service';
import { CountryService } from '../../services/country.service';
import { TravelingService } from '../../services/traveling.service';

@Component({
  selector: 'app-traveling-procedures-br',
  templateUrl: './traveling-procedures-br.component.html',
  styleUrls: ['./traveling-procedures-br.component.css']
})
export class TravelingProceduresBrComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private tr: TravelingService,
    private coun: CountryService,
    private datepipe: DatePipe,
    private http: HttpClient, private formBuilder: FormBuilder ) { }

  LoginStatus$!: Observable<boolean>;
  selection: any;

  dataSource!: MatTableDataSource<TravelingPr>;

  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth', 'ten'];

  Traveling$!: Observable<TravelingPr[]>;
  Traveling: TravelingPr[] = [];

  countries: Country[] = [];
  countries$!: Observable<Country[]>;

  UserId!: string;
  BranchId!: string;
  UserRole!: string;

  ngOnInit(): void {
    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchId = result });


    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      branchName: '',
      country: '',
      flightDate: '',
      userDate: '',
      phoneNumber: '',
    })

    this.GetTravelingProceduresByBranchId();
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });

  }


  GetTravelingProceduresByBranchId() {
    this.tr.clearCache();
    this.tr.GetTravelingProceduresByBranchId(this.BranchId.toString()).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);

      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.flightDate || moment(data.flightDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.flightDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

    });
  }


  resetBranchesFilter() {

    this.formControl.controls['branchName'].setValue(null);

  }
  resetCountriesFilter() {

    this.formControl.controls['country'].setValue(null);

  }

  resetflightDate() {

    this.formControl.controls['flightDate'].setValue(null);

  }

  resetUserDate() {

    this.formControl.controls['userDate'].setValue(null);

  }

}
