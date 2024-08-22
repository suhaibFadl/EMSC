import { NgModule, ɵINJECTOR_IMPL__POST_R3__, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { DataTablesModule } from 'angular-datatables';
import { PatientsModule } from './patients/patients.module';
import { ManagementModule } from './management/management.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { CountriesModule } from './countries/countries.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
import { JwtInterceptor } from './_Helper/jwt.interceptor';
import { AuthGuardService } from './guards/auth-guard.service';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from '../app/dutch-paginator-intl';
import { SearchPipe } from '../app/search.pipe';
import { MatTableModule } from '@angular/material/table';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/Badge';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainEntryModule } from './management/main-entry/main-entry.module';
import { ManageUsersModule } from './management/manage-users/manage-users.module';
import { BranchesModule } from './branches/branches.module';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from './notification.service';
import { ToastrModule } from 'ngx-toastr';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { PriceslistsModule } from './priceslists/priceslists.module';
import { ReportsModule } from './reports/reports.module';

import { MatButtonModule } from '@angular/material/button';
import { AddPharmacyComponent } from './add-pharmacy/add-pharmacy.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    AccessDeniedComponent,
    SearchPipe,
    AddPharmacyComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    PatientsModule,
    MatDividerModule,
    ManagementModule,
    HospitalsModule,
    MainEntryModule,
    CountriesModule,
    DataTablesModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTabsModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    NgxMatFileInputModule,
    MatProgressBarModule,
    NgxDropzoneModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSnackBarModule,
    BranchesModule,
    ManageUsersModule,
    MatBadgeModule,
    PharmacyModule,
    ReportsModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    PriceslistsModule
  ],
  exports:[],
  providers: [/*AccountService, CountryService,RoleService,PatientsService,ReplyService*/
    NotificationService,
    DatePipe,
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
