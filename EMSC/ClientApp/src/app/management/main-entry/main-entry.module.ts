import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainEntryRoutingModule } from './main-entry-routing.module';
import { BranchesComponent } from './branches/branches.component';
import { CountriesComponent } from './countries/countries.component';
import { ClinicsInsideComponent } from './clinics-inside/clinics-inside.component';
import { ClinicsOutsideComponent } from './clinics-outside/clinics-outside.component';
import { HotelsOutsideComponent } from './hotels-outside/hotels-outside.component';

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
import { getDutchPaginatorIntl } from '../../../app/dutch-paginator-intl';
import { MatTableModule } from '@angular/material/table';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotificationService } from '../../notification.service';
import { ToastrModule } from 'ngx-toastr';
import { DependencyComponent } from './dependency/dependency.component';
import { InjuryEventsComponent } from './injury-events/injury-events.component';
@NgModule({
  declarations: [BranchesComponent, CountriesComponent, ClinicsInsideComponent, ClinicsOutsideComponent, HotelsOutsideComponent, DependencyComponent, InjuryEventsComponent],
  imports: [
    CommonModule,
    MainEntryRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatSortModule,
      ToastrModule.forRoot(),

  ]
})
export class MainEntryModule { }
