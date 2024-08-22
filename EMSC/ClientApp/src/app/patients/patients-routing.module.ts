import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { TreatmentBranchComponent } from './treatment-branch/treatment-branch.component';

const routes: Routes = [
  { path: 'Treatment-Branch', component: TreatmentBranchComponent, canActivate: [AuthGuardService] },
   

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class PatientsRoutingModule { }
