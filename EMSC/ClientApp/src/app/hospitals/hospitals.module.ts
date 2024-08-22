import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HospitalsRoutingModule } from './hospitals-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '.././_Helper/jwt.interceptor';
import { AuthGuardService } from '../guards/auth-guard.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LettersInsideIncomingComponent } from './letters-inside-incoming/letters-inside-incoming.component';
import { RepliesOnBranchesComponent } from './replies-on-branches/replies-on-branches.component';
import { MatRadioModule } from '@angular/material/radio';
import { AddTreatmentInsideComponent } from './add-treatment-inside/add-treatment-inside.component';
import { TreatmentMoveInsideComponent } from './treatment-move-inside/treatment-move-inside.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilesPatsInsideComponent } from './files-pats-inside/files-pats-inside.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { IncommingPatientsComponent } from './incomming-patients/incomming-patients.component';
import { PatientsFilesComponent } from './patients-files/patients-files.component';
import { AddClaimComponent } from './add-claim/add-claim.component';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [LettersInsideIncomingComponent, RepliesOnBranchesComponent, AddTreatmentInsideComponent, TreatmentMoveInsideComponent, FilesPatsInsideComponent, IncommingPatientsComponent, PatientsFilesComponent, AddClaimComponent],
  imports: [
    CommonModule,
    HospitalsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule,
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
    MatRadioModule,
    MatDatepickerModule,
    MatDividerModule

  ],
  providers: [

    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },


    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }

  ],


})
export class HospitalsModule { }
