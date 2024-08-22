import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceslistsRoutingModule } from './priceslists-routing.module';
import { PricelistComponent } from './pricelist/pricelist.component';
import { AuthGuardService } from '../guards/auth-guard.service';
 
import { JwtInterceptor } from '../_Helper/jwt.interceptor';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DateAdapter, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { MedicalservicesComponent } from './medicalservices/medicalservices.component';
import { ServiceslistsComponent } from './serviceslists/serviceslists.component';


@NgModule({
  declarations: [PricelistComponent, MedicalservicesComponent, ServiceslistsComponent],
  imports: [
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
    PriceslistsRoutingModule
  ],
  providers: [


    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },


    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

  ],
})
export class PriceslistsModule { }
