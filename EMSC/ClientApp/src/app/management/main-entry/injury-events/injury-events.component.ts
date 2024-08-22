import { ChangeDetectorRef, Component, Directive, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { InjuryEvents } from '../../../interfaces/injury-events';
import { InjuryEventsService } from './../../../services/injury-events.service';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { AppComponent } from '../../../app.component';


//new country
@Directive({
  selector: '[errorStateMatcherDirective]'
})
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-injury-events',
  templateUrl: './injury-events.component.html',
  styleUrls: ['./injury-events.component.css']
})
export class InjuryEventsComponent implements OnInit {

  dataSource!: MatTableDataSource<InjuryEvents>;


  displayedColumns: string[] = ['index', 'name', 'edit', 'delete'];

  addForm!: FormGroup;
  Event!: FormControl;



  updateForm!: FormGroup;
  _id!: FormControl;
  _Event!: FormControl;


  deleteForm!: FormGroup;
  Did!: FormControl;



  UserId!: string;
  UserRole!: string;
  id!: number;
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  // add Modal
  @ViewChild('addTemplate') addmodal!: TemplateRef<any>;
  @ViewChild('template') modal!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update Modal
  @ViewChild('editTemplate') editmodal!: TemplateRef<any>;
  // delete Modal
  @ViewChild('deleteTemplate') deletemodal!: TemplateRef<any>;
  @ViewChild('filter', { static: false }) filter!: ElementRef;



  constructor(private formbulider: FormBuilder, private es: InjuryEventsService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private rout: ActivatedRoute,
    private acct: AccountService,
    private app: AppComponent,

  ) {
  }
  modalRef!: BsModalRef;
  modalMessage!: string;
  modalMessage1!: string;
  modalMessage2!: string;


  ngOnInit(): void {

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    //=======================  add form
    this.Event = new FormControl('', [Validators.required, Validators.minLength(3)]);

    this.addForm = this.fb.group({
      'Event': this.Event,
    });


    //======================= update form
    this._id = new FormControl('', [Validators.required]);
    this._Event = new FormControl('', [Validators.required, Validators.minLength(3)]);


    this.updateForm = this.fb.group({
      'id': this._id,
      'Event': this._Event,
    });

    //=======================  delete form
    this.Did = new FormControl();
    this.deleteForm = this.fb.group(
      {
        'id': this.Did,
      });

    this.matcher = new MyErrorStateMatcher();


    this.loadAllInjuryEvents();

  }

  loadAllInjuryEvents() {
    this.es.GetInjuryEvents().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  //add modal injuryEvent
  onAddInjuryEvent() {
    this.modalMessage1 = "الرجاء إدخال اسم حدث الإصابة ";

    this.modalRef = this.modalService.show(this.modal);
  }
  onSubmit() {
    let newCountry = this.addForm.value;

    this.es.AddInjuryEvents(newCountry).subscribe(
      result => {
        this.es.clearCache();
        this.loadAllInjuryEvents();
        this.modalRef.hide();
        this.addForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage1 = "تم إضافة هذا الحدث من قبل"
    )

  }

  //country update modal
  onUpdateModal(editevent: InjuryEvents): void {
    this.modalMessage = "الرجاء ادخال اسم الحدث الجديد ";
    this._id.setValue(editevent.id);
    this._Event.setValue(editevent.event);
    this.updateForm.setValue({
      'id': this._id.value,
      'Event': this._Event.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  onUpdate() {
    let editEvent = this.updateForm.value;
    this.es.updateInjuryEvents(editEvent.id, editEvent).subscribe(
      result => {
        this.es.clearCache();
        this.loadAllInjuryEvents();
        this.modalRef.hide();
        this.updateForm.reset();
        this.app.showToasterSuccess();
      },
      error => this.modalMessage = "اسم حدث الإصابة موجود من قبل"

    )

  }

  // delete modal country
  onDeleteModal(deleteevent: InjuryEvents) {

    this.modalMessage2 = "هل أنت متأكد من عملية الحذف ؟";
    this.Did.setValue(deleteevent.id);
    this.deleteForm.setValue({
      'id': this.Did.value
    });

    this.modalRef = this.modalService.show(this.deletemodal);
  }

  onDelete(): void {
    let deletedep = this.deleteForm.value;
    this.es.DeleteInjuryEvents(deletedep.id).subscribe(result => {
      this.es.clearCache();
      this.loadAllInjuryEvents();
      this.modalRef.hide();
      this.deleteForm.reset();
      this.app.showToasterSuccess();
    },
      error => this.modalMessage2 = "لا يمكن حذف حدث الإصابة لإرتباطها ببيانات أخرى"

    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
