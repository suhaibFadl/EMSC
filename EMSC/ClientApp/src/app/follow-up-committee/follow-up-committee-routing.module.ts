import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
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

const routes: Routes = [
  { path: 'replies-main-branch-and-countries', component: RepliesMainBranchAndCountriesComponent,canActivate: [AuthGuardService] },
  { path: 'all-letters-outside', component: AllLettersOutsideComponent,canActivate: [AuthGuardService] },
  { path: 'all-entry-procedures', component: AllEntryProceduresComponent,canActivate: [AuthGuardService] },
  { path: 'all-closing-files', component: AllClosingFilesComponent,canActivate: [AuthGuardService] },
  { path: 'all-travel-tickets', component: AllTravelTicketsComponent,canActivate: [AuthGuardService] },
  { path: 'all-back-tickets', component: AllBackTicketsComponent,canActivate: [AuthGuardService] },
  { path: 'all-treatment-procedures', component: AllTreatmentProceduresComponent, canActivate: [AuthGuardService] },

  { path: 'all-pending-travel-tickets', component: AllPendingTravelTicketsComponent,canActivate: [AuthGuardService] },
  { path: 'all-pending-back-tickets', component: AllPendingBackTicketsComponent,canActivate: [AuthGuardService] },
  { path: 'all-pending-entry-procedures', component: AllPendingEntryProceduresComponent,canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})

export class FollowUpCommitteeRoutingModule { }
