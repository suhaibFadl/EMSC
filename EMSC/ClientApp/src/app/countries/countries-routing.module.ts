import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { PatientsListAcceptedComponent } from './patients-list-accepted/patients-list-accepted.component';
import { HotelMovementsComponent } from './hotel-movements/hotel-movements.component';
import { TreatmentMovementsComponent } from './treatment-movements/treatment-movements.component';
import { ReplyCountriesComponent } from './reply-countries/reply-countries.component';
import { PatientsHousingComponent } from './patients-housing/patients-housing.component';
import { AppendPMainDataComponent } from './append-p-main-data/append-p-main-data.component';
import { AppendLettersOutsideComponent } from './append-letters-outside/append-letters-outside.component';
import { AddTreatmentComponent } from './add-treatment/add-treatment.component';
import { PatientsTransferComponent } from './patients-transfer/patients-transfer.component';
import { TravelersBackComponent } from './travelers-back/travelers-back.component';
import { PatientsInCountriesComponent } from './patients-in-countries/patients-in-countries.component';
import { CheckPatExistComponent } from './check-pat-exist/check-pat-exist.component';
import { FilesPatientsComponent } from './files-patients/files-patients.component';
import { PatsInWaitingListComponent } from './pats-in-waiting-list/pats-in-waiting-list.component';

import { HousingLettersComponent } from './housing-letters/housing-letters.component';
import { HotelsEntryProceduresComponent } from './hotels-entry-procedures/hotels-entry-procedures.component';
import { AllHotelsProceduresComponent } from './all-hotels-procedures/all-hotels-procedures.component';
import { AllRenewalsByHotelEntryIdComponent } from './all-renewals-by-hotel-entry-id/all-renewals-by-hotel-entry-id.component';
import { HotelsLeavingProceduresComponent } from './hotels-leaving-procedures/hotels-leaving-procedures.component';

const routes: Routes = [
  { path: 'patients-list-accepted', component: PatientsListAcceptedComponent, canActivate: [AuthGuardService] },
  { path: 'hotel-movements', component: HotelMovementsComponent, canActivate: [AuthGuardService] },
  { path: 'reply-countries', component: ReplyCountriesComponent, canActivate: [AuthGuardService] },
  { path: 'patients-housing', component: PatientsHousingComponent, canActivate: [AuthGuardService] },
  { path: 'append-p-main-data', component: AppendPMainDataComponent, canActivate: [AuthGuardService] },
  { path: 'append-letters-outside', component: AppendLettersOutsideComponent, canActivate: [AuthGuardService] },
  { path: 'add-treatment', component: AddTreatmentComponent, canActivate: [AuthGuardService] },
  { path: 'patients-transfer', component: PatientsTransferComponent, canActivate: [AuthGuardService] },
  { path: 'travelers-back', component: TravelersBackComponent, canActivate: [AuthGuardService] },
  { path: 'patients-in-countries', component: PatientsInCountriesComponent, canActivate: [AuthGuardService] },
  { path: 'check-pat-exist', component: CheckPatExistComponent, canActivate: [AuthGuardService] },
  { path: 'files-patients', component: FilesPatientsComponent, canActivate: [AuthGuardService] },
  { path: 'treatment-movement', component: TreatmentMovementsComponent, canActivate: [AuthGuardService] },
  { path: 'treatment-movement/:id', component: TreatmentMovementsComponent, canActivate: [AuthGuardService] },

  { path: 'pats-in-waiting-list', component: PatsInWaitingListComponent, canActivate: [AuthGuardService] },

  { path: 'housing-letters', component: HousingLettersComponent, canActivate: [AuthGuardService] },
  { path: 'hotels-entry-procedures', component: HotelsEntryProceduresComponent, canActivate: [AuthGuardService] },
  { path: 'all-hotels-procedures', component: AllHotelsProceduresComponent, canActivate: [AuthGuardService] },
  { path: 'all-renewals-by-hotel-entry-id', component: AllRenewalsByHotelEntryIdComponent, canActivate: [AuthGuardService] },
  { path: 'all-renewals-by-hotel-entry-id/:id', component: AllRenewalsByHotelEntryIdComponent, canActivate: [AuthGuardService] },
  { path: 'hotels-leaving-procedures', component: HotelsLeavingProceduresComponent, canActivate: [AuthGuardService] },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class CountriesRoutingModule { }
