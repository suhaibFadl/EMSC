import { NgModule } from '@angular/core';
import { AuthGuardService } from '../guards/auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { LettersInsideIncomingComponent } from './letters-inside-incoming/letters-inside-incoming.component';
import { RepliesOnBranchesComponent } from './replies-on-branches/replies-on-branches.component';
import { AddTreatmentInsideComponent } from './add-treatment-inside/add-treatment-inside.component';
import { TreatmentMoveInsideComponent } from './treatment-move-inside/treatment-move-inside.component';
import { FilesPatsInsideComponent } from './files-pats-inside/files-pats-inside.component';
import { IncommingPatientsComponent } from './incomming-patients/incomming-patients.component';
import { PatientsFilesComponent } from './patients-files/patients-files.component';
import { AddClaimComponent } from './add-claim/add-claim.component';


const routes: Routes = [
  { path: 'letters-inside-incoming', component: LettersInsideIncomingComponent, canActivate: [AuthGuardService] },
  { path: 'replies-on-branches', component: RepliesOnBranchesComponent, canActivate: [AuthGuardService] },
  { path: 'add-treatment', component: AddTreatmentInsideComponent, canActivate: [AuthGuardService] },

  { path: 'files-pats-inside', component: FilesPatsInsideComponent, canActivate: [AuthGuardService] },

  { path: 'treatment-move-inside', component: TreatmentMoveInsideComponent, canActivate: [AuthGuardService] },
  { path: 'treatment-move-inside/:id', component: TreatmentMoveInsideComponent, canActivate: [AuthGuardService] },


  { path: 'incomming-patients', component: IncommingPatientsComponent, canActivate: [AuthGuardService] },
  { path: 'patients-files', component: PatientsFilesComponent, canActivate: [AuthGuardService] },
  { path: 'add-claim', component: AddClaimComponent, canActivate: [AuthGuardService] },
  { path: 'add-claim/:id', component: AddClaimComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]

})
export class HospitalsRoutingModule { }
