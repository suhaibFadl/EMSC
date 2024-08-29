//===============صلاحيات المستخدين====================
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {


  constructor(private acct: AccountService, private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.acct.isloggesin.pipe(take(1), map((LoginStatus: boolean) => {
      const destination: string = state.url;
      // const patiantId = route.params.id;
      const id = route.params.id;
      const patiantId = route.params.id;

      //console.log(loginStatus);
      // To check if user is not logged in
      if (!LoginStatus) {
        if (destination == '/login' || destination == '/')
          return true;
        else {
          this.router.navigate(['/login']);
          return false;
        }
      }


      switch (destination) {

     
          //====================================

        case '/management/manage-users':
        case '/management/manage-users/branches-users':
        case '/management/manage-users/pharmacies-users':
        case '/management/manage-users/countries-users':
        case '/management/manage-users/clinics-users':
        case '/management/manage-users/main-branch-users':
       
          {
            if (localStorage.getItem("userRole") === "Admin" || "الإدارة") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }


          //====================================
        case '/management/main-entry':
        case '/management/main-entry/countries':
        case '/management/main-entry/clinics-inside':
        case '/management/main-entry/branches':
        case '/management/main-entry/clinics-outside':
        case '/management/main-entry/hotels-outside':
        case '/management/main-entry/dependency':
        case '/management/main-entry/injury-events':
        case '/management/main-entry/hospital-ranks':
          {
            if (localStorage.getItem("userRole") === "Admin" || "الإدارة") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }

//===============================================
        case '/branches':
        case '/branches/p-main-data':
        case '/branches/p-letters-inside':
        case '/branches/p-letters-outside':
        case '/branches/replies-letters-outside':
        case '/branches/traveling-procedures-br':
        case '/branches/p-details':
        case '/branches/p-details/' + patiantId:
        case '/branches/travelers-under-procedure':
        case '/branches/p-letters-outside-by-main-branch':
        case '/branches/add-pats-visiting-doctors':

          {
            if (localStorage.getItem("userRole") === "موظف إدخال الفرع" || "مدير الفرع" || "الإدارة" || "الشؤون الطبية بالمركز") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }
  //====================================
        case '/countries':
        case '/countries/add-treatment':
        case '/countries/treatment-movement':
        case '/countries/patients-in-countries':

          {
            if (localStorage.getItem("userRole") === "Admin" ||"مشرف طبي" || "مشرف إداري") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }
        //====================================

        case '/countries':
        case '/countries/patients-housing':
        case '/countries/hotel-movements':
        case '/countries/patients-transfer':
        case '/countries/travelers-back':

          {
            if (localStorage.getItem("userRole") === "Admin" ||"مشرف تسكين" || "مشرف إداري") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }
          //====================================

        case '/patients':
        case '/patients/Treatment-Branch':
      
          {
            if (localStorage.getItem("userRole") === "مشرف إداري" || "موظف إدخال الفرع" || "الإدارة"|| "مسؤول التسفير"||"مدير الفرع") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }
        case '/countries':
        case '/countries/patients-list-accepted':
        case '/countries/pats-in-waiting-list':
        case '/countries/hotel-movements':
        case '/countries/treatment-movement':
        case '/countries/treatment-movement/' + id:
        case '/countries/files-patients':
          {
            if (localStorage.getItem("userRole") === "Admin" || "مشرف إداري " || "مشرف طبي" || "الإدارة" || "المصحات بالخارج" ) {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }
        case '/countries':
        case '/countries/reply-countries':
        case '/countries/append-p-main-data':
        case '/countries/append-letters-outside':
       
          {
            if (localStorage.getItem("userRole") === "Admin" || "مشرف إداري" || "الإدارة") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }

         
        case '/hospitals':
        case '/hospitals/letters-inside-incoming':
        case '/hospitals/replies-on-branches':
        case '/hospitals/add-treatment':
        case '/hospitals/treatment-move-inside':
        case '/hospitals/treatment-move-inside/' + id:
        case '/hospitals/files-pats-inside':

          {
            if (localStorage.getItem("userRole") === "Admin" || "مدير المصحة" || "موظف إدخال المصحة") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }


        case '/management':
        case '/management/p-transactions-inside':
        case '/management/p-reply-inside':
        //case '/management/treatment-movment':
        case '/management/patient-data':
        case '/management/patient-data/' +id:
        case '/management/all-patients-main-data':
        case '/management/all-p-main-data-inside':
        case '/management/letters-outside-incoming':
        case '/management/letters-inside-incoming':
        case '/management/letters-accepted-by-countries':
        case '/management/traveling-procedures':
        case '/countries/travelers-back':
        case '/management/return-tickets-booking':
        case '/management/traveling-procedures-back':
        case '/management/replies-letters-outside':
        case '/management/travelers-under-procedure':
        case '/management/all-pat-in-countries':
        case '/management/add-housing-letters':
        case '/management/view-housing-letters':
        case '/management/traveling-procedures-by-user-id':

          {
            if (localStorage.getItem("userRole") === "Admin" || "الإدارة" || "مسؤول التسفير" || "مشرف إداري" || "شركة التسكين" || "موظف إدخال الفرع" || "مدير الفرع" || "الشؤون الطبية بالمركز") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }



        case '/follow-up-committee':
        case '/follow-up-committee/all-letters-outside':
        case '/follow-up-committee/replies-main-branch-and-countries':
        case '/follow-up-committee/all-travel-tickets':
        case '/follow-up-committee/all-entry-procedures':
        case '/follow-up-committee/all-treatment-procedures':
        case '/follow-up-committee/all-closing-files':
        case '/follow-up-committee/all-back-tickets':
        case '/follow-up-committee/all-pending-travel-tickets':
        case '/follow-up-committee/all-pending-back-tickets':
        case '/follow-up-committee/all-pending-entry-procedures':

          {
            if (localStorage.getItem("userRole") === "Admin" || "لجنة المتابعة" ) {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }
  //=================================

        case '/countries':
        case '/countries/housing-letters':
        case '/countries/hotels-entry-procedures':
        case '/countries/hotels-leaving-procedures':
        case '/countries/all-hotels-procedures':
        case '/countries/all-renewals-by-hotel-entry-id':
        case '/countries/all-renewals-by-hotel-entry-id/'+ id:

          {
            if (localStorage.getItem("userRole") === "Admin" || "شركة التسكين") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }

            //=================================

        case '/pharmacy':
        case '/pharmacy/add-medication':
        case '/pharmacy/add-pharmacy':
        case '/pharmacy/request-letter':
        case '/pharmacy/initial-offers':
        case '/pharmacy/prepared-medications':
        case '/pharmacy/final-requests':
        case '/pharmacy/dispensing-med-to-the-representative':
        case '/pharmacy/request-letter/' + id:
        case '/pharmacy/patients-medications':
        case '/pharmacy/dispense-medication':
        case '/pharmacy/request-medication':
        case '/pharmacy/incomming-requests':
        case '/pharmacy/answered-requests':
        case '/pharmacy/waiting-requests':
        case '/pharmacy/all-requests':
        case '/pharmacy/pats-files':
        case '/pharmacy/medications-provided-pats':
        case '/pharmacy/pat-med-details/' :
        case '/pharmacy/pat-med-details/' + patiantId:
          {
            if (localStorage.getItem("userRole") === "Admin" || "موظف الصيدلية" || "موظف المركز_الصيدلية") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }


        case '/reports':
        case '/reports/all-reports':
        case '/reports/pat-report':
        case '/reports/medicine-report':
        case '/reports/medicine-dispensed-report':
        case '/reports/medicine-dis-mang-report':
        case '/reports/pharmacy-reports':
          {
            if (localStorage.getItem("userRole") === "Admin" || "موظف الصيدلية" || "موظف المركز_الصيدلية") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }


        case '/priceslists/pricelist':
        case '/priceslists/medicalservices':
        case '/priceslists/serviceslists':

          {
            if (localStorage.getItem("userRole") === "Admin" || "الإدارة") {
              return true;
            }
            else {
              this.router.navigate(['/access-denied'])

              return false;
            }
          }

        //case '/home':

        //  {
        //    return true;
        //  }

        //case '/':

        //  {
        //    this.router.navigate(['/home'])

        //    return false;
        //  }


        default:
          {
            this.router.navigate(['/home'])

            return false;
          }
      }

    }));
  }
}
