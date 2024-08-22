import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef, ElementRef, Input, Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators, NgForm, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';


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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() input!: MatInput;
  @Input() matcher!: ErrorStateMatcher;

  @ViewChild('template') resetmodal!: TemplateRef<any>;

  MustMatch(passwordControl: AbstractControl): ValidatorFn {

    return (cpasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      if (!passwordControl && !cpasswordControl) {
        return null;
      }

      if (cpasswordControl.hasError && !passwordControl.hasError) {
        return null;
      }
      if (passwordControl.value !== cpasswordControl.value) {
        return { 'mustMatch': true };
      }
      else {
        return null;
      }

    }
  }

  insertForm!: FormGroup;
  Username!: FormControl;
  Password!: FormControl;
  returnUrl!: string;
  ErrorMessage!: string;
  modalMessage!: string;

  invalidLogin!: boolean;


  resetPassForm!: FormGroup;
  username!: FormControl;
  password!: FormControl;
  cpassword!: FormControl;


  modalRef!: BsModalRef;
  modalMessage2!: string;
  modalMessage3!: string;

  constructor(private acct: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
  ) { }

  UserId!: string;
  UserRole!: string;
  BranchId!: string;
  BranchName!: string;
  CountryId!: string;
  CountryName!: string;
  ActiveState!: string;
  FullName!: string;
  RoleId!: string;

 

 
  ngOnInit(): void {
    this.modalMessage = "الرجاء تعبئة الحقول المطلوبة";
    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });
    this.acct.currentUserBranchId.subscribe(result => { this.BranchId = result });
    this.acct.currentUserBranchName.subscribe(result => { this.BranchName = result });
    this.acct.currentUserCountryId.subscribe(result => { this.CountryId = result });
    this.acct.currentUserCountryName.subscribe(result => { this.CountryName = result });
    this.acct.currentUserActiveState.subscribe(result => { this.ActiveState = result });
    this.acct.currentUserFullName.subscribe(result => { this.FullName = result });
    this.acct.currentUserRoleId.subscribe(result => { this.RoleId = result });


    this.Username = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);

    this.username = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(6)]);
    this.cpassword = new FormControl('', [Validators.required, this.MustMatch(this.password)]);


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


    this.insertForm = this.fb.group({
      "Username": this.Username,
      "Password": this.Password
    })

    this.resetPassForm = this.fb.group({
      "username": this.username,
      "password": this.password,
      "cpassword": this.cpassword,

    })


    this.matcher = new MyErrorStateMatcher();


  }

  onResetModal() {
    this.resetPassForm.setValue({
      "username": '',
      "password": '',
      "cpassword": '',
    });
    this.modalRef = this.modalService.show(this.resetmodal);
    this.modalRef.hide();

  }


  onSubmitSave() {
    let newpPassword = this.resetPassForm.value;
    this.acct.clearCache();
    this.acct.ResetPassword(newpPassword).subscribe(
      result => {
        this.acct.clearCache();
        this.resetPassForm.reset();
        this.modalRef.hide();
      }, error => {       
        this.modalMessage = "لم يتم انشاء الحساب";
    
      });


  }

  onSubmitt() {
   
     let userlogin = this.insertForm.value;
      this.acct.login(userlogin.Username, userlogin.Password).subscribe(
        result => {      
            let token = (<any>result).token;
          let userRole = (<any>result).userRole;
          if (this.ActiveState == "1") {
            this.invalidLogin = false;
            this.router.navigateByUrl(this.returnUrl);
            if (result.userRole == "المصحات بالخارج") {
              this.router.navigate(['/countries/check-pat-exist']);

            }
            else {
              this.router.navigate(['/home']);

            }
            this.acct.clearCache();
            this.insertForm.reset();
            this.modalMessage = "تمت تسجيل الدخول";
            this.acct.clearCache();
          }
          else {
            this.modalMessage = "تم إيقاف حساب المستخدم";
            this.acct.clearCache();
            this.insertForm.reset();


          }
                    },
        error => {

          this.invalidLogin = true;
          this.insertForm.reset();

          this.modalMessage = "لم يتم تسجيل الدخول ";
        }
    
    )

  }

}
