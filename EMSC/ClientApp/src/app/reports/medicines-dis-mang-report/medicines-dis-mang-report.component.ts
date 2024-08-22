import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, Directive, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Pharmacy } from '../../interfaces/pharmacy';
import { PharmacyService } from '../../services/pharmacy.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-medicines-dis-mang-report',
  templateUrl: './medicines-dis-mang-report.component.html',
  styleUrls: ['./medicines-dis-mang-report.component.css']
})
export class MedicinesDisMangReportComponent implements OnInit {

  constructor(
    private formbulider: FormBuilder, private bra: PharmacyService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private http: HttpClient,
    private acct: AccountService,
    private app: AppComponent,
  ) { }

  dataSource!: MatTableDataSource<Pharmacy>;

  dataSource2!: MatTableDataSource<Pharmacy>;

  DataSource = new MatTableDataSource([]);
  sourceDataSource = new MatTableDataSource<any>([]);
  targetDataSource = new MatTableDataSource<any>([]);

  filteredDataArray: any[] = [];
  sourceList: any[] = [];
  destinationList: any[] = [];
  itemsSelected: any[] = [];
  itemsCount!: number;


  displayedColumns: string[] = ['index', 'first', 'second', 'add']
  displayedColumns1: string[] = ['index', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'ninth', 'addMed', 'upload', 'delete'];

  headerStyle = {
    'background-color': '#393E46', /* set the background color of the header */
    'color': 'white', /* set the text color of the header */
    'font-weight': 'bold' /* set the font weight of the header */
  };


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  UserId!: string;
  UserRole!: string;

  //===============================

  ReportDispensedMedicinesForm!: FormGroup;
  medids!: FormControl;
  medidsAll: any[] = [];
  checked!: number;



  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });

    this.medids = new FormControl();

    this.ReportDispensedMedicinesForm = this.fb.group({
      'medids': this.medids,
    });


    this.itemsCount = 0;
    this.checked = 0;
    this.GetMedications();
  }

  GetMedications() {
    this.bra.GetMedications().subscribe((data: any) => {
      this.sourceDataSource = new MatTableDataSource(data);
      this.sourceDataSource.paginator = this.paginator;
    });
  }
  GetMedications2() {
    this.bra.GetMedications().subscribe((data: any) => {
      this.targetDataSource = new MatTableDataSource(data);
      this.targetDataSource.paginator = this.paginator;
    });
  }

  moveAllItems() {

    this.targetDataSource.data.push(...this.sourceDataSource.data);

    this.sourceDataSource.data = [];
    this.targetDataSource._updateChangeSubscription();
    this.itemsCount += 1;
    this.checked = 1;
  }

  returnAllItems() {

    this.sourceDataSource.data.push(...this.targetDataSource.data);

    this.targetDataSource.data = [];
    this.sourceDataSource._updateChangeSubscription();

    this.itemsCount = 0;
    this.checked = 0;

  }

  moveItem(id: number) {
    const index = this.sourceDataSource.data.findIndex((item: any) => item.id === id);
    if (index > -1) {
      this.targetDataSource.data.push(this.sourceDataSource.data.splice(index, 1)[0]);
    }
    this.sourceDataSource._updateChangeSubscription();
    this.targetDataSource._updateChangeSubscription();
    this.itemsCount += 1;
  }

  returnItem(id: number) {
    const index = this.targetDataSource.data.findIndex((item: any) => item.id === id);
    if (index > -1) {
      this.sourceDataSource.data.push(this.targetDataSource.data.splice(index, 1)[0]);
    }
    this.sourceDataSource._updateChangeSubscription();
    this.targetDataSource._updateChangeSubscription();
    this.itemsCount -= 1;
  }




  onCreatePDF() {


    this.targetDataSource.data.map((obj: any) => this.medidsAll.push(obj.id))

    this.medids.setValue(this.medidsAll)
    this.ReportDispensedMedicinesForm.setValue({
      'medids': this.medids.value,
    });


    this.http.post<string[]>("/api/PDFCreator/ReportAllMedicationsDispensedByMang", this.ReportDispensedMedicinesForm.value).subscribe((event: any) => {
      window.open("PDFCreator/" + event.value);
    },
       error => this.app.NoDataToShowInReport()
    );

    this.medidsAll = [];
    this.targetDataSource.data = [];
    this.itemsCount = 0;
    this.checked = 0;
    this.GetMedications();

  }

  applyFilter(filterValue: string) {
    this.sourceDataSource.filter = filterValue.trim().toLowerCase();
  }



}
