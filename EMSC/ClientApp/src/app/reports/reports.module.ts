import { NgModule, ɵINJECTOR_IMPL__POST_R3__ } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '.././_Helper/jwt.interceptor';
import { AuthGuardService } from '../guards/auth-guard.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';


import { ReportsRoutingModule } from './reports-routing.module';
import { AllReportsComponent } from './all-reports/all-reports.component';
import { PatReportComponent } from './pat-report/pat-report.component';
import { MedicineReportComponent } from './medicine-report/medicine-report.component';
import { MedicineDispensedReportComponent } from './medicine-dispensed-report/medicine-dispensed-report.component';
import { MedicinesDisMangReportComponent } from './medicines-dis-mang-report/medicines-dis-mang-report.component';
import { PharmacyReportsComponent } from './pharmacy-reports/pharmacy-reports.component';


@NgModule({
  declarations: [AllReportsComponent, PatReportComponent, MedicineReportComponent, MedicineDispensedReportComponent, MedicinesDisMangReportComponent, PharmacyReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSelectFilterModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgSelectModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule
  ]
  ,
  providers: [


    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },


    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

  ],
})
export class ReportsModule { }
