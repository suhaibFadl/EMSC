import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Output, Input, TemplateRef, EventEmitter, ElementRef, Directive } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe, formatDate } from '@angular/common';
import { Country } from '../../interfaces/country';
import { CountryService } from '../../services/country.service';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { PTransOutside } from '../../interfaces/p-trans-outside';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { ReplyService } from '../../services/reply.service';
import { TravelingService } from '../../services/traveling.service';
import { PatientTrans } from '../../interfaces/patient-trans';
import { Reply } from '../../interfaces/reply';
import { TravelingPr } from '../../interfaces/traveling-pr';
import { AppComponent } from '../../app.component';
import { Branch } from '../../interfaces/branch';
import { BranchService } from '../../services/branch.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { HousingLettersService } from '../../services/housing-letters.service';


const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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
  selector: 'app-add-housing-letters',
  templateUrl: './add-housing-letters.component.html',
  styleUrls: ['./add-housing-letters.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddHousingLettersComponent implements OnInit {

  public formControl!: FormGroup;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private acct: AccountService,
    private tr: TravelingService,
    private br: BranchService,
    private coun: CountryService,
    private http: HttpClient,
    private app: AppComponent,
    private rs: HousingLettersService,
    private formBuilder: FormBuilder
  ) { }


  Reply!: Observable<PTransOutside[]>;
  dataSource!: MatTableDataSource<PTransOutside>;

  displayedColumns: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ehigth', 'ninth','ten', 'add'];

  displayedColumns2: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh','add'];


  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  AddForm!: FormGroup;
 // PID!: FormControl;
  PId!: FormControl;
  LetterIndex!: FormControl;
  LetterDate!: FormControl;
  Attach!: FormControl;
  CountryId!: FormControl;

  fileToUpload!: File;
  fileText!: string;
  fileName = '';

  selection: any;

  selectedreply!: Reply;
  UserId!: string;
  BranchId!: string;
  CountryName!: string;
  CountryUserId!: string;
  UserRole!: string;
  UserDate!: string;
  id!: number;

  // add Modal
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter', { static: false }) filter!: ElementRef;




  pTransactions$!: Observable<PatientTrans[]>;
  pTransactions: PatientTrans[] = [];

  branches: Branch[] = [];
  branches$!: Observable<Branch[]>;

  countries: Country[] = [];
  countries$!: Observable<Country[]>;


  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage2!: string;
  public progress!: number;
  public message!: string;

  @Output() public onUploadFinished = new EventEmitter();




  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CountryUserId = result });
    this.UserDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formControl = this.formBuilder.group({
      patientName: '',
      passportNo: '',
      nationalNo: '',
      country: '',
      branchName: '',
      letterDate: '',
      userDate: '',
      phoneNumber: '',
    })

    this.PId = new FormControl('', [Validators.required]);
    this.LetterDate = new FormControl('', [Validators.required]);
    this.LetterIndex = new FormControl('', [Validators.required]);
    this.Attach = new FormControl();
    this.CountryId = new FormControl();

    this.AddForm = this.fb.group({
      'PId': this.PId,
      'LetterDate': this.LetterDate,
      'LetterIndex': this.LetterIndex,
      'Attach': this.Attach,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'CountryId': this.CountryId,
    });


    this.fileText = "إرفاق ملف pdf";

    this.GetPatsAcceptedByCountryForManagement()

    this.GetBranches();
    this.GetCountries();
  }

  //=====================Get Replies Accepted======================

  GetCountries() {
    this.coun.clearCache();
    this.coun.GetCountries().subscribe(result => {
      this.countries = result;
    });
  }

  GetBranches() {
    this.br.clearCache();
    this.br.GetBranches().subscribe(result => {
      this.branches = result;
    });
  }

  lengthData!: number;

  GetPatsAcceptedByCountryForManagement() {
    this.rs.clearCache();
    this.rs.GetPatsAcceptedByCountryForManagement().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;


      this.dataSource.filterPredicate = ((data, filter) => {
        const a = !filter.patientName || data.patientName.toLowerCase().includes(filter.patientName);
        const b = !filter.passportNo || data.passportNo.toLowerCase().includes(filter.passportNo)
          || data.passportNo.toUpperCase().includes(filter.passportNo);
        const c = !filter.nationalNo || data.nationalNo.toLowerCase().includes(filter.nationalNo);
        const d = !filter.branchName || data.branchName.toLowerCase().includes(filter.branchName);
        const e = !filter.country || data.country.toLowerCase().includes(filter.country);
        const f = !filter.letterDate || moment(data.letterDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.letterDate).format('yyyy-MM-DD'));
        const g = !filter.userDate || moment(data.userDate).format('yyyy-MM-DD').toLowerCase().includes(moment(filter.userDate).format('yyyy-MM-DD'));
        const h = !filter.phoneNumber || data.phoneNumber.toLowerCase().includes(filter.phoneNumber);

        return a && b && c && d && e && f && g && h;
      }) as (PeriodicElement, string) => boolean;


      this.formControl.valueChanges.subscribe(value => {
        const filter = { ...value, patientName: value.patientName.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      });

      if (this.dataSource.data.length == 0) {
        this.lengthData = 0;
      }
    });
  }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = <File>files[0];
    this.fileText = this.fileToUpload.name;
    this.fileText = "تم الرفع";
    const formData = new FormData();

    this.fileName = this.PId.value + '_' + Date.now().toString() + '.pdf';

    formData.append('file', this.fileToUpload, this.fileName);


    this.http.post('/api/Upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const total: number = event.total;

            this.progress = Math.round(100 * event.loaded / total);
          }
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'تم الرفع';
          this.onUploadFinished.emit(event.body);
        }
      });
  }


  onAddModal(items: PTransOutside): void {

    this.modalMessage = "الرجاء تعبئة جميع الحقول مطلوبة";
    this.PId.setValue(items.id);
    this.modalRef = this.modalService.show(this.modal);

  }




  //on submit reply
  onSubmit() {

    this.AddForm.setValue({
      'PId': this.PId.value,
      'LetterDate': this.LetterDate.value,
      'LetterIndex': this.LetterIndex.value,
      'Attach': this.fileName,
      'UserId': this.UserId,
      'UserDate': this.UserDate,
      'CountryId': this.CountryId.value,
    });

    let newData = this.AddForm.value;

    this.rs.AddHousingLetter(newData).subscribe(
      result => {

        this.tr.clearCache();
        this.GetPatsAcceptedByCountryForManagement()
        this.fileName = "";
        this.fileText = "إرفاق ملف pdf";
        this.message = "";
        this.progress = 0

        this.app.showToasterSuccess()
      },
      error => this.modalMessage = "لم تتم عملية الإضافة "
    )

    this.modalRef.hide();
    this.AddForm.reset();
  }


  resetBranchesFilter() {

    this.formControl.controls['branchName'].setValue(null);

  }
  resetCountriesFilter() {

    this.formControl.controls['country'].setValue(null);

  }

  resetLetterDate() {

    this.formControl.controls['letterDate'].setValue(null);

  }

  resetUserDate() {

    this.formControl.controls['userDate'].setValue(null);

  }

}
