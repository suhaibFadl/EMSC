import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { ReplyInsideComponent } from './reply-inside/reply-inside.component';
import { TreatmentMovmentComponent } from './treatment-movment/treatment-movment.component';
import { AllPatientsMainDataComponent } from './all-patients-main-data/all-patients-main-data.component';
import { LettersOutsideIncomingComponent } from './letters-outside-incoming/letters-outside-incoming.component';
import { LettersAcceptedByCountriesComponent } from './letters-accepted-by-countries/letters-accepted-by-countries.component';
import { TravelingProceduresComponent } from './traveling-procedures/traveling-procedures.component';
import { RepliesLettersOutsideComponent } from './replies-letters-outside/replies-letters-outside.component';
import { LettersInsideIncomingComponent } from './letters-inside-incoming/letters-inside-incoming.component';
import { TrvelingProceduresBackComponent } from './trveling-procedures-back/trveling-procedures-back.component';
import { TravelersUnderProcedureComponent } from './travelers-under-procedure/travelers-under-procedure.component';
import { AllPatInCountriesComponent } from './all-pat-in-countries/all-pat-in-countries.component';
import { ReturnTicketsBookingComponent } from './return-tickets-booking/return-tickets-booking.component';
import { AddHousingLettersComponent } from './add-housing-letters/add-housing-letters.component';
import { ViewHousingLettersComponent } from './view-housing-letters/view-housing-letters.component';
import { TravelingProceduresByUserIdComponent } from './traveling-procedures-by-user-id/traveling-procedures-by-user-id.component';
import { AllPMainDataInsideComponent } from './all-p-main-data-inside/all-p-main-data-inside.component';

const routes: Routes = [
  { path: 'main-entry', loadChildren: './main-entry/main-entry.module#MainEntryModule' },
  { path: 'manage-users', loadChildren: './manage-users/manage-users.module#ManageUsersModule' },

  { path: 'p-reply-inside', component: ReplyInsideComponent, canActivate: [AuthGuardService] },
  { path: 'treatment-movment', component: TreatmentMovmentComponent, canActivate: [AuthGuardService] },
  { path: 'all-patients-main-data', component: AllPatientsMainDataComponent, canActivate: [AuthGuardService] },
  { path: 'all-p-main-data-inside', component: AllPMainDataInsideComponent, canActivate: [AuthGuardService] },
  { path: 'letters-outside-incoming', component: LettersOutsideIncomingComponent, canActivate: [AuthGuardService] },
  { path: 'letters-inside-incoming', component: LettersInsideIncomingComponent, canActivate: [AuthGuardService] },
  { path: 'letters-accepted-by-countries', component: LettersAcceptedByCountriesComponent, canActivate: [AuthGuardService] },
  { path: 'traveling-procedures', component: TravelingProceduresComponent, canActivate: [AuthGuardService] },
  { path: 'traveling-procedures-by-user-id', component: TravelingProceduresByUserIdComponent, canActivate: [AuthGuardService] },
  { path: 'replies-letters-outside', component: RepliesLettersOutsideComponent, canActivate: [AuthGuardService] },
  { path: 'travelers-under-procedure', component: TravelersUnderProcedureComponent, canActivate: [AuthGuardService] },
  { path: 'traveling-procedures-back', component: TrvelingProceduresBackComponent, canActivate: [AuthGuardService] },
  { path: 'all-pat-in-countries', component: AllPatInCountriesComponent, canActivate: [AuthGuardService] },
  { path: 'return-tickets-booking', component: ReturnTicketsBookingComponent, canActivate: [AuthGuardService] },

  { path: 'add-housing-letters', component: AddHousingLettersComponent, canActivate: [AuthGuardService] },
  { path: 'view-housing-letters', component: ViewHousingLettersComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
    providers: [
    AuthGuardService
  ]
})
export class ManagementRoutingModule { }
