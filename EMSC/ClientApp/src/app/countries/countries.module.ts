import { NgModule, ɵINJECTOR_IMPL__POST_R3__ } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesRoutingModule } from './countries-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientsListAcceptedComponent } from './patients-list-accepted/patients-list-accepted.component';
import { HotelMovementsComponent } from './hotel-movements/hotel-movements.component';
import { TreatmentMovementsComponent } from './treatment-movements/treatment-movements.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PatientsService } from '.././services/patients.service';
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
import { ReplyCountriesComponent } from './reply-countries/reply-countries.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { PatientsHousingComponent } from './patients-housing/patients-housing.component';
import { AppendPMainDataComponent } from './append-p-main-data/append-p-main-data.component';
import { AppendLettersOutsideComponent } from './append-letters-outside/append-letters-outside.component';
import { AddTreatmentComponent } from './add-treatment/add-treatment.component';
import { PatientsTransferComponent } from './patients-transfer/patients-transfer.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { TravelersBackComponent } from './travelers-back/travelers-back.component';
import { PatientsInCountriesComponent } from './patients-in-countries/patients-in-countries.component';
import { CheckPatExistComponent } from './check-pat-exist/check-pat-exist.component';
import { FilesPatientsComponent } from './files-patients/files-patients.component';
import { MatDividerModule } from '@angular/material/divider';
import { PatsInWaitingListComponent } from './pats-in-waiting-list/pats-in-waiting-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectFilterModule } from 'mat-select-filter';
import { HousingLettersComponent } from './housing-letters/housing-letters.component';
import { HotelsEntryProceduresComponent } from './hotels-entry-procedures/hotels-entry-procedures.component';
import { AllHotelsProceduresComponent } from './all-hotels-procedures/all-hotels-procedures.component';
import { AllRenewalsByHotelEntryIdComponent } from './all-renewals-by-hotel-entry-id/all-renewals-by-hotel-entry-id.component';
import { HotelsLeavingProceduresComponent } from './hotels-leaving-procedures/hotels-leaving-procedures.component';




@NgModule({
  declarations: [PatientsListAcceptedComponent,
    HotelMovementsComponent,
    TreatmentMovementsComponent,
    ReplyCountriesComponent,
    PatientsHousingComponent,
    AppendPMainDataComponent,
    AppendLettersOutsideComponent,
    AddTreatmentComponent,
    PatientsTransferComponent,
    TravelersBackComponent,
    PatientsInCountriesComponent,
    CheckPatExistComponent,
    FilesPatientsComponent,
    PatsInWaitingListComponent,
    HousingLettersComponent, HotelsEntryProceduresComponent, AllHotelsProceduresComponent, AllRenewalsByHotelEntryIdComponent, HotelsLeavingProceduresComponent],

  imports: [
    CommonModule,
    CountriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    //  HttpClientModule,
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
    MatDatepickerModule,
    MatRadioModule,
    MatOptionModule,
    MatSelectModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSelectFilterModule,
    MatCheckboxModule,
  ],
  providers: [

    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

  ],
})
export class CountriesModule { }
