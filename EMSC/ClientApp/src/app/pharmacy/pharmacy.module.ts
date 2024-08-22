import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyRoutingModule } from './pharmacy-routing.module'; 
import { DispenseMedicationComponent } from './dispense-medication/dispense-medication.component';
import { AddMedicationComponent } from './add-medication/add-medication.component';
import { PatientsMedicationsComponent } from './patients-medications/patients-medications.component';
import { IncommingRequestsComponent } from './incomming-requests/incomming-requests.component';
import { WaitingRequestsComponent } from './waiting-requests/waiting-requests.component';
import { AnsweredRequestsComponent } from './answered-requests/answered-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
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
import { AuthGuardService } from '../guards/auth-guard.service';
import { JwtInterceptor } from '../_Helper/jwt.interceptor';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DateAdapter, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { PatMedDetailsComponent } from './pat-med-details/pat-med-details.component';
import { RequestMedicationComponent } from './request-medication/request-medication.component';
import { PatsFilesComponent } from './pats-files/pats-files.component';
import { MedicationsProvidedPatsComponent } from './medications-provided-pats/medications-provided-pats.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequestLetterComponent } from './request-letter/request-letter.component';
import { AddPharmacyComponent } from './add-pharmacy/add-pharmacy.component';
import { InitialOffersComponent } from './initial-offers/initial-offers.component';
import { PreparedMedicationsComponent } from './prepared-medications/prepared-medications.component';
import { FinalRequestsComponent } from './final-requests/final-requests.component';
import { DispensingMedToTheRepresentativeComponent } from './dispensing-med-to-the-representative/dispensing-med-to-the-representative.component';


@NgModule({
  declarations: [ DispenseMedicationComponent, AddMedicationComponent, PatientsMedicationsComponent, IncommingRequestsComponent, WaitingRequestsComponent, AnsweredRequestsComponent, AllRequestsComponent, PatMedDetailsComponent, RequestMedicationComponent, PatsFilesComponent, MedicationsProvidedPatsComponent, RequestLetterComponent, AddPharmacyComponent, InitialOffersComponent, PreparedMedicationsComponent, FinalRequestsComponent, DispensingMedToTheRepresentativeComponent],
  imports: [
    CommonModule,
    PharmacyRoutingModule,
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
    NgSelectModule
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

export class PharmacyModule { }
