import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    [
    { path: "home", component: HomeComponent },
    { path: "navbar", component: NavbarComponent, canActivate: [AuthGuardService] },
    { path: 'patients', loadChildren: './patients/patients.module#PatientsModule' },
    { path: 'management', loadChildren: './management/management.module#ManagementModule' },
    { path: 'branches', loadChildren: './branches/branches.module#BranchesModule' },
    { path: 'management/main-entry', loadChildren: './management/main-entry/main-entry.module#MainEntryModule' },
    { path: 'management/manage-users', loadChildren: './management/manage-users/manage-users.module#ManageUsersModule' },
    { path: 'countries', loadChildren: './countries/countries.module#CountriesModule' },
    { path: 'hospitals', loadChildren: './hospitals/hospitals.module#HospitalsModule' },
    { path: 'follow-up-committee', loadChildren: './follow-up-committee/follow-up-committee.module#FollowUpCommitteeModule' },
    { path: 'pharmacy', loadChildren: './pharmacy/pharmacy.module#PharmacyModule' },
    { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
    { path: 'priceslists', loadChildren: './priceslists/priceslists.module#PriceslistsModule' },
    { path: "login", component: LoginComponent, canActivate: [AuthGuardService] },
    { path: "access-denied", component: AccessDeniedComponent },
  
    {
      path: 'patients',
      loadChildren: () => import('./patients/patients.module').then(p => p.PatientsModule)
    },
    {
      path: 'management',
      loadChildren: () => import('./management/management.module').then(g => g.ManagementModule)
      },
     
    {
      path: 'priceslists',
      loadChildren: () => import('./priceslists/priceslists.module').then(g => g.PriceslistsModule)
      },
     
   
     {
       path: 'countries',
       loadChildren: () => import('./countries/countries.module').then(c => c.CountriesModule)
      },
    {
       path: 'hospitals',
       loadChildren: () => import('./hospitals/hospitals.module').then(h => h.HospitalsModule)
      },
      {
        path: 'follow-up-committee',
        loadChildren: () => import('./follow-up-committee/follow-up-committee.module').then(h => h.FollowUpCommitteeModule)
      },
       
      { path: '**', redirectTo: '/login', pathMatch: 'full' },

      {
        path: 'pharmacy',
        loadChildren: () => import('./pharmacy/pharmacy.module').then(g => g.PharmacyModule)
      },
     

  ]
  )],

  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class AppRoutingModule { }
