import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { MedicalservicesComponent } from './medicalservices/medicalservices.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { ServiceslistsComponent } from './serviceslists/serviceslists.component';

const routes: Routes = [

  { path: 'pricelist', component: PricelistComponent, canActivate: [AuthGuardService] },
  { path: 'medicalservices', component: MedicalservicesComponent, canActivate: [AuthGuardService] },
  { path: 'serviceslists', component: ServiceslistsComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class PriceslistsRoutingModule { }
