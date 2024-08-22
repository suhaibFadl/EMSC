import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { Pharmacy } from '../../interfaces/pharmacy';
import { PharmacyService } from '../../services/pharmacy.service';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-request-letter',
  templateUrl: './request-letter.component.html',
  styleUrls: ['./request-letter.component.css']
})
export class RequestLetterComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document,
    private route: ActivatedRoute,
    private phar: PharmacyService,
    private acct: AccountService,

) { }

  data: Pharmacy[] = [];
  data$!: Observable<Pharmacy[]>;

  LoginStatus$!: Observable<boolean>;


  UserId!: string;
  UserRole!: string;

  ngOnInit(): void {

    let id = + this.route.snapshot.params['id'];

    this.LoginStatus$ = this.acct.isloggesin;

    this.acct.currentuserid.subscribe(result => { this.UserId = result });
    this.acct.currentUserRole.subscribe(result => { this.UserRole = result });


    this.GetRequestMedicineDetails();
  }

  LetterIndex!: string;
  PatName!: string;
  PassportNo!: string;
  NationalNo!: string;
  BranchName!: string;
  FirstOpened!: number;

  GetRequestMedicineDetails() {
    let id = + this.route.snapshot.params['id'];
    this.phar.clearCache();
    this.phar.GetRequestMedicineDetails(id).subscribe((result: any) => {
      this.data = result;
      this.LetterIndex = result[0].letterIndex;
      this.PatName = result[0].patientName;
      this.PassportNo = result[0].passportNo;
      this.NationalNo = result[0].nationalNo;
      this.BranchName = result[0].branchName;
      this.FirstOpened = result[0].firstOpened;
    });
  }


  FirstOpenedLetter() {
    let id = + this.route.snapshot.params['id'];
    this.phar.clearCache();
    this.phar.FirstOpenedLetter(id).subscribe((result: any) => {
      this.GetRequestMedicineDetails();

      console.log("ok")
    });
  }

  createPdf() {


    if (this.UserRole == "موظف الصيدلية") {
      this.FirstOpenedLetter();

    }

    const data = this.document.getElementById('content');

    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var margins = {
        top: 40,
        bottom: 60,
        left: 40,
        width: 522
      };

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);


      //const fileName = `${Date.now()}.pdf`;


      const pdfBlob = pdf.output('blob');

      const pdfUrl = URL.createObjectURL(pdfBlob);
     // window.open(pdfUrl, '_blank');

      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow?.print()) {
        setTimeout(() => {
          printWindow.close();
        }, 500);

        //printWindow.onload = () => {
        //  setTimeout(() => {
        //    printWindow.close();
        //  }, 1000); // Adjust the delay as needed
        //};
      }   //   window.close();

    });

    window.onbeforeprint = function () {
      // Close the PDF file
      window.close();
    };

  }



}
