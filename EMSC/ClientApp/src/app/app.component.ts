import { Component } from '@angular/core';

import { NotificationService } from './notification.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  title = 'ClientApp';




  title1 = 'toaster-not';

  showToasterSuccess() {
    this.notifyService.showSuccess(
      'تمت العملية بنجاح !!',
      ''
    );
  }

  showToasterError() {
    this.notifyService.showError('لم تتم العملية بنجاح', '');
  }

  PatIsExist() {
    this.notifyService.showError('تم إضافة بيانات هذا الجريح من قبل', '');
  }


  CannotDeletePat() {
    this.notifyService.showError('لا يمكن حذف الجريح لارتباطه ببيانات أخرى', '');
  }

  CannotDeletePatLetter() {
    this.notifyService.showError('لا يمكن حذف رسالة الجريح لارتباطها ببيانات أخرى', '');
  }

  FillAllFieldsPlease() {
    this.notifyService.showError('الرجاء تعبئة كافة البيانات المطلوبة', '');
  }
  UploadYourAttachPlease() {
    this.notifyService.showError('الرجاء تحميل نموذج صرف الدواء', '');
  }

  showToasterInfo() {
    this.notifyService.showInfo('This is info', 'codingshiksha.com');
  }

  showToasterWarning() {
    this.notifyService.showWarning('This is warning', 'codingshiksha.com');
  }

  HospitalAlreadyExist() {
    this.notifyService.showError('تم إضافة المصحة في هذه الدولة من قبل', '');
  }

  HotelAlreadyExist() {
    this.notifyService.showError('تم إضافة الفندق في هذه الدولة من قبل', '');
  }

  NoData() {
    this.notifyService.showError('لا يوجد بيانات حسب البنود التي تم اختيارها', '');
  }


  NoDataToShowInReport() {
    this.notifyService.showError('لم يتم صرف أي كميات لهذا الدواء', '');
  }
  NoDataToShowInReport2() {
    this.notifyService.showError('لم يتم صرف أي دواء لهذا المريض', '');
  }

  PleaseSelectTypeViewReport() {
    this.notifyService.showWarning('يرجى اختيار طريقة عرض التقرير حسب حالة الطلب', '');
  }


  constructor(private notifyService: NotificationService) {


}
}
