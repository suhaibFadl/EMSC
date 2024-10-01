import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Priceslists } from '../interfaces/priceslists';
import { shareReplay, flatMap, first } from 'rxjs/operators';
import { Medicalservices } from '../interfaces/medicalservices';

@Injectable({
  providedIn: 'root'
})
export class PriceslistsService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlGet: string = "/api/Priceslists/GetPricesLists";
  private baseUrlGetById: string = "/api/Priceslists/GetPricesListById";
  private baseUrlAdd: string = "/api/Priceslists/AddList";
  private baseUrlUpdate: string = "/api/Priceslists/UpdatePricesList/";
  private baseUrlDelete: string = "/api/Priceslists/DeletePricesList/";

  private medbaseUrlGet: string = "/api/Priceslists/GetMedicalServices";
  private medByListbaseUrlGet: string = "/api/Priceslists/GetMedicalServicesByListId/";
  private medCostByListbaseUrlGet: string = "/api/Priceslists/GetMedicalServicesCosts/";
  private medbaseUrlAdd: string = "/api/Priceslists/AddMedicalServices";
  private medbaseUrlUpdate: string = "/api/Priceslists/UpdateMedicalServicesData";
  private medbaseUrlDelete: string = "/api/Priceslists/DeleteMedicalServicesData/";
//  private medByServIdbaseUrlGet: string = "/api/Priceslists/GetMedicalServicesByServId/";



  private pricelist$!: Observable<Priceslists[]>;
  private medicalservice$!: Observable<Medicalservices[]>;
 


  GetPricesLists(): Observable<Priceslists[]> {
    this.clearCache();


    if (!this.pricelist$) {
      this.pricelist$ = this.http.get<Priceslists[]>(this.baseUrlGet).pipe(shareReplay());
    }

    console.log(this.pricelist$);
    return this.pricelist$;

  }


  //// Insert the country
  AddPriceList(newCountry: Priceslists): Observable<Priceslists> {

    return this.http.post<Priceslists>(this.baseUrlAdd, newCountry);


  }

  //// Get PricesList
  //GetPicesListById(listId: number): Observable<Priceslists> {
  //  this.clearCache();

   

  //  return this.http.get<Priceslists[]>(listId).pipe(shareReplay());;

  //}
  updatePriceList(id: number, editpricelist: Priceslists): Observable<Priceslists> {
    return this.http.put<Priceslists>(this.baseUrlUpdate + id, editpricelist);
  }

  // Delete country
  DeletePriceList(id: number): Observable<any> {
    return this.http.delete(this.baseUrlDelete + id);

  }


  // Clear Cache
  clearCache() {
    this.pricelist$ = null as any;
    this.medicalservice$ = null as any;

  }


  //====================Medical services

  GetMeedicalServices(): Observable<Medicalservices[]> {
    this.clearCache();


    if (!this.medicalservice$) {
      this.medicalservice$ = this.http.get<Medicalservices[]>(this.medbaseUrlGet).pipe(shareReplay());
    }

    //console.log(this.medicalservice$);
    return this.medicalservice$;

  }

  //====================Medical services By List ID

  //GetMeedicalServicesByListID(listid: number): Observable<Medicalservices[]> {
  //  this.clearCache();

  //  console.log(listid);
  //  if (!this.medicalservice$) {
  //    this.medicalservice$ = this.http.get<Medicalservices[]>(this.medByListbaseUrlGet + listid).pipe(shareReplay());
  //  }

  //  //console.log(this.medicalservice$);
  //  return this.medicalservice$;

  //}

  GetMeedicalServicesCostsByListID(listid: number, hospitalRankId: number): Observable<Medicalservices[]> {
    this.clearCache();

    console.log(listid);
    if (!this.medicalservice$) {
      this.medicalservice$ = this.http.get<Medicalservices[]>(this.medCostByListbaseUrlGet + listid + '/' + hospitalRankId).pipe(shareReplay());
    }

    //console.log(this.medicalservice$);
    return this.medicalservice$;

  }


  //// Insert the country
  AddMedicalService(newmeds: Medicalservices): Observable<Medicalservices> {

    return this.http.post<Medicalservices>(this.medbaseUrlAdd, newmeds);


  }

  updateMedicalService(id: number, editmedserv: Medicalservices): Observable<Medicalservices> {
    return this.http.put<Medicalservices>(this.medbaseUrlUpdate, editmedserv);
  }

//  GetMedicalServiceByServId(id: number): Observable<Medicalservices[]> {
//    this.medicalservice$ = this.http.get<Medicalservices[]>(this.medByServIdbaseUrlGet + id).pipe(shareReplay());
//    return this.medicalservice$;
//}

  // Delete country
  DeleteMedicalService(id: number): Observable<any> {
    return this.http.delete(this.medbaseUrlDelete + id);

  }
}
