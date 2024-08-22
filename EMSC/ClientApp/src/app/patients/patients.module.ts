import { NgModule, ɵINJECTOR_IMPL__POST_R3__ } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from './patients-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, MatOptionModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSelectModule } from '@angular/material/select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatButtonModule } from '@angular/material/button';
import { TreatmentBranchComponent } from './treatment-branch/treatment-branch.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatRadioModule } from '@angular/material/radio';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [TreatmentBranchComponent ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  //  HttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    NgxMatFileInputModule,
    MatSelectModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    DataTablesModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTooltipModule,
    NgxMatFileInputModule,
    NgxDropzoneModule,
    MatDatepickerModule,
    MatRadioModule  ]
  ,
  providers: [


    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },

    
 { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

  ],
})
export class PatientsModule { }
