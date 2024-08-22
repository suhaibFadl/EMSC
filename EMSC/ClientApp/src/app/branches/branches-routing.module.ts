import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { PLettersInsideComponent } from './p-letters-inside/p-letters-inside.component';
import { PLettersOutsideComponent } from './p-letters-outside/p-letters-outside.component';
import { PMainDataComponent } from './p-main-data/p-main-data.component';
import { RepliesLettersOutsideComponent } from './replies-letters-outside/replies-letters-outside.component';
import { TravelingProceduresBrComponent } from './traveling-procedures-br/traveling-procedures-br.component';
import { RepliesLettersInsideComponent } from './replies-letters-inside/replies-letters-inside.component';
import { PDetailsComponent } from './p-details/p-details.component';
import { PLettersOutsideByMainBranchComponent } from './p-letters-outside-by-main-branch/p-letters-outside-by-main-branch.component';
import { AddPatsVisitingDoctorsComponent } from './add-pats-visiting-doctors/add-pats-visiting-doctors.component';

const routes: Routes = [
  { path: 'p-main-data', component: PMainDataComponent, canActivate: [AuthGuardService] },
  { path: 'p-letters-inside', component: PLettersInsideComponent, canActivate: [AuthGuardService] },
  { path: 'p-letters-outside', component: PLettersOutsideComponent, canActivate: [AuthGuardService] },
  { path: 'replies-letters-outside', component: RepliesLettersOutsideComponent, canActivate: [AuthGuardService] },
  { path: 'traveling-procedures-br', component: TravelingProceduresBrComponent, canActivate: [AuthGuardService] },
  { path: 'replies-letters-inside', component: RepliesLettersInsideComponent, canActivate: [AuthGuardService] },
  { path: 'p-details', component: PDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'p-details/:id', component: PDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'p-letters-outside-by-main-branch', component: PLettersOutsideByMainBranchComponent, canActivate: [AuthGuardService] },
  { path: 'add-pats-visiting-doctors', component: AddPatsVisitingDoctorsComponent, canActivate: [AuthGuardService] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class BranchesRoutingModule { }
