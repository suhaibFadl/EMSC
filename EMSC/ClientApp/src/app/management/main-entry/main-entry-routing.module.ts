import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './branches/branches.component';
import { CountriesComponent } from './countries/countries.component';
import { ClinicsInsideComponent } from './clinics-inside/clinics-inside.component';
import { ClinicsOutsideComponent } from './clinics-outside/clinics-outside.component';
import { HotelsOutsideComponent } from './hotels-outside/hotels-outside.component';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { DependencyComponent } from './dependency/dependency.component';
import { InjuryEventsComponent } from './injury-events/injury-events.component';
import { HospitalRanksComponent } from './hospital-ranks/hospital-ranks.component';

const routes: Routes = [
  { path: 'branches', component: BranchesComponent, canActivate: [AuthGuardService] },
  { path: 'countries', component: CountriesComponent, canActivate: [AuthGuardService] },
  { path: 'clinics-inside', component: ClinicsInsideComponent, canActivate: [AuthGuardService] },
  { path: 'clinics-outside', component: ClinicsOutsideComponent, canActivate: [AuthGuardService] },
  { path: 'hotels-outside', component: HotelsOutsideComponent, canActivate: [AuthGuardService] },
  { path: 'dependency', component: DependencyComponent, canActivate: [AuthGuardService] },
  { path: 'hospital-ranks', component: HospitalRanksComponent, canActivate: [AuthGuardService] },
  { path: 'injury-events', component: InjuryEventsComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainEntryRoutingModule { }
