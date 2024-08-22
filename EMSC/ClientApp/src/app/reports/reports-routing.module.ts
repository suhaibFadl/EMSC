import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';

import { AllReportsComponent } from './all-reports/all-reports.component';
import { PatReportComponent } from './pat-report/pat-report.component';
import { MedicineReportComponent } from './medicine-report/medicine-report.component';
import { MedicineDispensedReportComponent } from './medicine-dispensed-report/medicine-dispensed-report.component';
import { MedicinesDisMangReportComponent } from './medicines-dis-mang-report/medicines-dis-mang-report.component';
import { PharmacyReportsComponent } from './pharmacy-reports/pharmacy-reports.component';

const routes: Routes = [
  { path: 'all-reports', component: AllReportsComponent, canActivate: [AuthGuardService] },
  { path: 'pat-report', component: PatReportComponent, canActivate: [AuthGuardService] },
  { path: 'medicine-report', component: MedicineReportComponent, canActivate: [AuthGuardService] },
  { path: 'medicine-dispensed-report', component: MedicineDispensedReportComponent, canActivate: [AuthGuardService] },
  { path: 'medicine-dis-mang-report', component: MedicinesDisMangReportComponent, canActivate: [AuthGuardService] },
  { path: 'pharmacy-reports', component: PharmacyReportsComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]

})
export class ReportsRoutingModule { }
