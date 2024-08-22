import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { BranchesUsersComponent } from './branches-users/branches-users.component';
import { CountriesUsersComponent } from './countries-users/countries-users.component';
import { ClinicsUsersComponent } from './clinics-users/clinics-users.component';
import { MainBranchUsersComponent } from './main-branch-users/main-branch-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSelectModule } from '@angular/material/select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../_Helper/jwt.interceptor';
import { PharmaciesUsersComponent } from './pharmacies-users/pharmacies-users.component';

@NgModule({
  declarations: [BranchesUsersComponent, CountriesUsersComponent, ClinicsUsersComponent, MainBranchUsersComponent, PharmaciesUsersComponent],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatFileInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule
  ]
  ,
  providers: [
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }


  ],
})
export class ManageUsersModule { }
