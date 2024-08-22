import { NgModule, ɵINJECTOR_IMPL__POST_R3__ } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ReplyInsideComponent } from './reply-inside/reply-inside.component';
import { MatRadioModule } from '@angular/material/radio';
import { TreatmentMovmentComponent } from './treatment-movment/treatment-movment.component';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { AllPatientsMainDataComponent } from './all-patients-main-data/all-patients-main-data.component';
import { MainEntryModule } from './main-entry/main-entry.module';
import { LettersOutsideIncomingComponent } from './letters-outside-incoming/letters-outside-incoming.component';
import { LettersAcceptedByCountriesComponent } from './letters-accepted-by-countries/letters-accepted-by-countries.component';
import { TravelingProceduresComponent } from './traveling-procedures/traveling-procedures.component';
import { RepliesLettersOutsideComponent } from './replies-letters-outside/replies-letters-outside.component';
import { ManageUsersModule } from './manage-users/manage-users.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { LettersInsideIncomingComponent } from './letters-inside-incoming/letters-inside-incoming.component';
import { TrvelingProceduresBackComponent } from './trveling-procedures-back/trveling-procedures-back.component';
import { PatientsInHospitalsComponent } from './patients-in-hospitals/patients-in-hospitals.component';
import { TravelersUnderProcedureComponent } from './travelers-under-procedure/travelers-under-procedure.component';
import { AllPatInCountriesComponent } from './all-pat-in-countries/all-pat-in-countries.component';
import { ReturnTicketsBookingComponent } from './return-tickets-booking/return-tickets-booking.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddHousingLettersComponent } from './add-housing-letters/add-housing-letters.component';
import { ViewHousingLettersComponent } from './view-housing-letters/view-housing-letters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { TravelingProceduresByUserIdComponent } from './traveling-procedures-by-user-id/traveling-procedures-by-user-id.component';

@NgModule({
  declarations: [ ReplyInsideComponent, TreatmentMovmentComponent, AllPatientsMainDataComponent, LettersOutsideIncomingComponent, LettersAcceptedByCountriesComponent, TravelingProceduresComponent, RepliesLettersOutsideComponent, LettersInsideIncomingComponent, TrvelingProceduresBackComponent, PatientsInHospitalsComponent, TravelersUnderProcedureComponent, AllPatInCountriesComponent, ReturnTicketsBookingComponent, AddHousingLettersComponent, ViewHousingLettersComponent, TravelingProceduresByUserIdComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule,
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
    MainEntryModule,
    ManageUsersModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSelectFilterModule,
    MatCheckboxModule,
    MatDatepickerModule
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
export class ManagementModule { }
