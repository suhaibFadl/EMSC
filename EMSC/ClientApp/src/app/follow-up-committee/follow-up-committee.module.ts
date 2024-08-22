import { NgModule, ɵINJECTOR_IMPL__POST_R3__ } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectFilterModule } from 'mat-select-filter';

import { FollowUpCommitteeRoutingModule } from './follow-up-committee-routing.module';
import { RepliesMainBranchAndCountriesComponent } from './replies-main-branch-and-countries/replies-main-branch-and-countries.component';
import { AllLettersOutsideComponent } from './all-letters-outside/all-letters-outside.component';
import { AllEntryProceduresComponent } from './all-entry-procedures/all-entry-procedures.component';
import { AllClosingFilesComponent } from './all-closing-files/all-closing-files.component';
import { AllTravelTicketsComponent } from './all-travel-tickets/all-travel-tickets.component';
import { AllBackTicketsComponent } from './all-back-tickets/all-back-tickets.component';
import { AllTreatmentProceduresComponent } from './all-treatment-procedures/all-treatment-procedures.component';
import { AllPendingTravelTicketsComponent } from './all-pending-travel-tickets/all-pending-travel-tickets.component';
import { AllPendingBackTicketsComponent } from './all-pending-back-tickets/all-pending-back-tickets.component';
import { AllPendingEntryProceduresComponent } from './all-pending-entry-procedures/all-pending-entry-procedures.component';


@NgModule({
  declarations: [RepliesMainBranchAndCountriesComponent, AllLettersOutsideComponent, AllEntryProceduresComponent, AllClosingFilesComponent, AllTravelTicketsComponent, AllBackTicketsComponent, AllTreatmentProceduresComponent, AllPendingTravelTicketsComponent, AllPendingBackTicketsComponent, AllPendingEntryProceduresComponent],
  imports: [
    CommonModule,
    FollowUpCommitteeRoutingModule,
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
export class FollowUpCommitteeModule { }
