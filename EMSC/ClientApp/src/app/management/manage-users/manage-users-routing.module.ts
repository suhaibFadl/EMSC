import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BranchesUsersComponent } from './branches-users/branches-users.component';
import { CountriesUsersComponent } from './countries-users/countries-users.component';
import { ClinicsUsersComponent } from './clinics-users/clinics-users.component';
import { MainBranchUsersComponent } from './main-branch-users/main-branch-users.component';
import { PharmaciesUsersComponent } from './pharmacies-users/pharmacies-users.component';
import { AuthGuardService } from '../../guards/auth-guard.service';

const routes: Routes = [
  { path: 'branches-users', component: BranchesUsersComponent, canActivate: [AuthGuardService] },
  { path: 'countries-users', component: CountriesUsersComponent, canActivate: [AuthGuardService] },
  { path: 'clinics-users', component: ClinicsUsersComponent, canActivate: [AuthGuardService] },
  { path: 'main-branch-users', component: MainBranchUsersComponent, canActivate: [AuthGuardService] },
  { path: 'pharmacies-users', component: PharmaciesUsersComponent, canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
