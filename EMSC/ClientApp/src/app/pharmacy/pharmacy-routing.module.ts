import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMedicationComponent } from './add-medication/add-medication.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { PatientsMedicationsComponent } from './patients-medications/patients-medications.component';
import { IncommingRequestsComponent } from './incomming-requests/incomming-requests.component';
import { AnsweredRequestsComponent } from './answered-requests/answered-requests.component';
import { WaitingRequestsComponent } from './waiting-requests/waiting-requests.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { PatMedDetailsComponent } from './pat-med-details/pat-med-details.component';
import { DispenseMedicationComponent } from './dispense-medication/dispense-medication.component';
import { RequestMedicationComponent } from './request-medication/request-medication.component';
import { PatsFilesComponent } from './pats-files/pats-files.component';
import { MedicationsProvidedPatsComponent } from './medications-provided-pats/medications-provided-pats.component';
import { RequestLetterComponent } from './request-letter/request-letter.component';
import { AddPharmacyComponent } from './add-pharmacy/add-pharmacy.component';
import { InitialOffersComponent } from './initial-offers/initial-offers.component';
import { PreparedMedicationsComponent } from './prepared-medications/prepared-medications.component';
import { FinalRequestsComponent } from './final-requests/final-requests.component';
import { DispensingMedToTheRepresentativeComponent } from './dispensing-med-to-the-representative/dispensing-med-to-the-representative.component';

const routes: Routes = [
  { path: 'add-medication', component:   AddMedicationComponent, canActivate: [AuthGuardService] },
  { path: 'add-pharmacy', component: AddPharmacyComponent, canActivate: [AuthGuardService] },
  { path: 'patients-medications', component: PatientsMedicationsComponent, canActivate: [AuthGuardService] },
  { path: 'request-medication', component: RequestMedicationComponent, canActivate: [AuthGuardService] },
  { path: 'dispense-medication', component: DispenseMedicationComponent, canActivate: [AuthGuardService] },
  { path: 'incomming-requests', component: IncommingRequestsComponent, canActivate: [AuthGuardService] },
  { path: 'answered-requests', component: AnsweredRequestsComponent, canActivate: [AuthGuardService] },
  { path: 'waiting-requests', component: WaitingRequestsComponent, canActivate: [AuthGuardService] },
  { path: 'all-requests', component: AllRequestsComponent, canActivate: [AuthGuardService] },
  { path: 'pat-med-details', component: PatMedDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'pat-med-details/:id', component: PatMedDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'pats-files', component: PatsFilesComponent, canActivate: [AuthGuardService] },
  { path: 'medications-provided-pats', component: MedicationsProvidedPatsComponent, canActivate: [AuthGuardService] },
  { path: 'request-letter', component: RequestLetterComponent, canActivate: [AuthGuardService] },
  { path: 'request-letter/:id', component: RequestLetterComponent, canActivate: [AuthGuardService] },
  { path: 'initial-offers', component: InitialOffersComponent, canActivate: [AuthGuardService] },
  { path: 'prepared-medications', component: PreparedMedicationsComponent, canActivate: [AuthGuardService] },
  { path: 'final-requests', component: FinalRequestsComponent, canActivate: [AuthGuardService] },
  { path: 'dispensing-med-to-the-representative', component: DispensingMedToTheRepresentativeComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class PharmacyRoutingModule { }
