import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesRoutingModule } from './branches-routing.module';
import { PMainDataComponent } from './p-main-data/p-main-data.component';
import { PLettersInsideComponent } from './p-letters-inside/p-letters-inside.component';
import { PLettersOutsideComponent } from './p-letters-outside/p-letters-outside.component';
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
import { ErrorStateMatcher, MatOptionModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSelectModule } from '@angular/material/select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthGuardService } from '../guards/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../_Helper/jwt.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { RepliesLettersOutsideComponent } from './replies-letters-outside/replies-letters-outside.component';
import { TravelingProceduresBrComponent } from './traveling-procedures-br/traveling-procedures-br.component';
import { RepliesLettersInsideComponent } from './replies-letters-inside/replies-letters-inside.component';
import { PDetailsComponent } from './p-details/p-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PLettersOutsideByMainBranchComponent } from './p-letters-outside-by-main-branch/p-letters-outside-by-main-branch.component';
import { AddPatsVisitingDoctorsComponent } from './add-pats-visiting-doctors/add-pats-visiting-doctors.component';
import { NgSelectFilteringModule } from 'ng-select-filtering';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [PMainDataComponent, PLettersInsideComponent, PLettersOutsideComponent, RepliesLettersOutsideComponent, TravelingProceduresBrComponent, RepliesLettersInsideComponent, PDetailsComponent, PLettersOutsideByMainBranchComponent, AddPatsVisitingDoctorsComponent],
  imports: [
    CommonModule,
    BranchesRoutingModule,
    DataTablesModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    NgxMatFileInputModule,
    MatSelectModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTooltipModule,
    NgxMatFileInputModule,
    NgxDropzoneModule,
    MatDatepickerModule,
    MatRadioModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSelectFilterModule,
    MatAutocompleteModule,
    NgSelectFilteringModule,
    NgSelectModule
  ]
  ,
  providers: [


    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },


    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

  ],
})
export class BranchesModule { }
