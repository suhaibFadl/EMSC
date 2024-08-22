using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;
using EMSC.Models;

namespace EMSC.ReportsCreator
{

    public class TemplateGeneratorMedicationsReports
    {
        public readonly EMSCDBContext _db;
        private readonly IHostingEnvironment _env;
        private const string DateTextFormat = "{0}";

        public TemplateGeneratorMedicationsReports(EMSCDBContext db, IHostingEnvironment env)
        {
            _db = db;
            _env = env;
        }
        string header = "", subheader = "",subheader2 = "", table = "", MedArName = "", MedEnName = "", PharmacyName = "";

        string nameC = "", nameH = "", passC = "", passH = "", natC = "", natH = "",
            pharmacyH = "", pharmacyC = "",
            dispensedDateH = "", dispensedDateC = "",
            dispensedQuantityH = "", dispensedQuantityC = "",
            requestQuantityH = "", requestQuantityC = "",
            requestDateH = "", requestDateC = "",
            mangDispensDateH = "", mangDispensDateC = "",
            medEnH = "", medEnC = "", medArH = "", medArC = "",
            prePriceH = "", prePriceC = "", preDaysH = "", preDaysC = "",
            preDateH = "", preDateC = "", provideDateH = "", provideDateC = "",
            phoneNumberC = "", phoneNumberH = "", CityName = "",
            medicalProcedureC = "", medicalProcedureH = "", DestinationName = "",
            fileStateH = "", fileStateC = "", notesH = "", notesC = "",
            docNameH = "", docNameC = "",
            DoctorName = "", Notes = "", detailsH = "", detailsC = "";

        string subheader1 = "", medSpecialtyName = "", DestName = "", SpecialtyName = "",
            ToolName = "", CodeNumber = "",
               content = "", content2 = "", subheader6 = "", content5 = "",
               toolH = "", toolC = "", codeH = "", codeC = "",
               quaH = "", quaC = "", medSpeH = "", medSpeC = "", addedH = "", addedC = "",
               PatientName = "", PassportNom = "", NationalNom = "", BranchName = "";


        //========تقرير كافة طلبات الادوية========
        public async Task<string> GetHTMLStringAllReportsMedications(int medId, int PHId, int OrderState,
            DateTime fromDate, DateTime toDate,
            DateTime fromDateD, DateTime toDateD,
            int medEnMedicineCol, int medArMedicineCol, int pharmacyCol, int patNameCol, int natNomCol,
            int passNomCol, int requestQuantCol, int requestDateCol, int prePriceCol, int preDaysCol,
            int preDateCol, int provideDateCol, int dispensedQuantityCol, int dispensedDateCol)
        {
            int counter = 1;
            var sb = new StringBuilder();

            var path = _env.WebRootPath + "\\img.jpg";//It fetches files under wwwroot

            sb.AppendLine($"<img style='float: left;width: 15 %;padding-top: 35px;' src =\"{path}\" />");

            //تقرير الادوية حسب حالة الطلب
            var pats = await AllReportsMedications(medId, PHId, OrderState, fromDate, toDate, fromDateD, toDateD);

            if (OrderState == 1)
            {
                header = @"<h1>كافة طلبات الأدوية المعلقة التي لم يتم الرد عليها</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + pats.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة طلبات الأدوية المعلقة التي لم يتم الرد عليها من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";


                _ = patNameCol == 0 ? nameH = @"<th style='display:none;'> اسم المريض </th>" : nameH = @"<th> اسم المريض </th>";
                _ = patNameCol == 0 ? nameC = @"<td style='display:none;'>{1}</td>" : nameC = @"<td>{1}</td>";

                _ = passNomCol == 0 ? passH = @"<th style='display:none;'> رقم جواز السفر </th>" : passH = @"<th> رقم جواز السفر </th>";
                _ = passNomCol == 0 ? passC = @"<td style='display:none;'>{2}</td>" : passC = @"<td>{2}</td>";

                _ = natNomCol == 0 ? natH = @"<th style='display:none;'> الرقم الوطني </th>" : natH = @"<th> الرقم الوطني </th>";
                _ = natNomCol == 0 ? natC = @"<td style='display:none;'>{3}</td>" : natC = @"<td>{3}</td>";


                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{4}</td>" : medEnC = @"<td>{4}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{5}</td>" : medArC = @"<td>{5}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{6}</td>" : pharmacyC = @"<td>{6}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{7}</td>" : requestQuantityC = @"<td>{7}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{8}</td>" : requestDateC = @"<td>{8}</td>";


                string RfromDate = "", RtoDate = "";

                if (fromDateD != null && toDateD != null)
                {
                    subheader = @"<h2>:حسب تاريخ الطلب</h2>";

                    RfromDate = @"<p> من تاريخ : " + fromDate.ToString("dd-MM-yyyy") + "</p>";
                    RtoDate = @"<p> إلى تاريخ : " + toDate.ToString("dd-MM-yyyy") + "</p>";
                }


                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>  
                                <div class='lable'>" + subheader2 + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + RfromDate + @"</div>
                                <div class='lable'>" + RtoDate + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + nameH + @"
                                         " + passH + @"
                                         " + natH + @"
                                         " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                    </tr>";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    var totalOp = await GetAllRequestsForPat(pat.PatientId, PHId, OrderState);

                    //=================================================
                    string hr = "";
                    string medarN = "";
                    string medenN = "";
                    string phar = "";
                    string reqQuan = "";
                    string reqDate = "";
                    int co = 0;

                    if (totalOp.Count > 1)
                    {
                        for (int i = 0; i < totalOp.Count; i++)
                        {

                            co++;
                            if ((i + 1) != totalOp.Count)
                            {
                                hr = @"<br> <hr style='width:50%;background-color:black;'>";
                            }
                            else
                            {
                                hr = "";
                            }
                            //===========

                            medarN += (co) + "- " + totalOp.ElementAt(i).MedArName + hr;
                            medenN += (co) + "- " + totalOp.ElementAt(i).MedEnName + hr;
                            phar += (co) + "- " + totalOp.ElementAt(i).PharmacyName + hr;
                            reqQuan += totalOp.ElementAt(i).RequestedQuantity + hr;
                            reqDate += (co) + "- " + totalOp.ElementAt(i).RequestDate + hr;

                        }
                        sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
                                   medenN, medarN, phar, reqQuan, reqDate);
                        counter++;

                    }

                    else
                    {
                        sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
                                  pat.MedEnName, pat.MedArName, pat.PharmacyName, pat.RequestedQuantity,
                                  pat.RequestDate);
                        counter++;

                    }

                }

            }

            if (OrderState == 5)
            {
                header = @"<h1>كافة العروض المبدئية لطلبات الأدوية</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + pats.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة العروض المبدئية لطلبات الأدوية من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";


                _ = patNameCol == 0 ? nameH = @"<th style='display:none;'> اسم المريض </th>" : nameH = @"<th> اسم المريض </th>";
                _ = patNameCol == 0 ? nameC = @"<td style='display:none;'>{1}</td>" : nameC = @"<td>{1}</td>";

                _ = passNomCol == 0 ? passH = @"<th style='display:none;'> رقم جواز السفر </th>" : passH = @"<th> رقم جواز السفر </th>";
                _ = passNomCol == 0 ? passC = @"<td style='display:none;'>{2}</td>" : passC = @"<td>{2}</td>";

                _ = natNomCol == 0 ? natH = @"<th style='display:none;'> الرقم الوطني </th>" : natH = @"<th> الرقم الوطني </th>";
                _ = natNomCol == 0 ? natC = @"<td style='display:none;'>{3}</td>" : natC = @"<td>{3}</td>";


                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{4}</td>" : medEnC = @"<td>{4}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{5}</td>" : medArC = @"<td>{5}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{6}</td>" : pharmacyC = @"<td>{6}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{7}</td>" : requestQuantityC = @"<td>{7}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{8}</td>" : requestDateC = @"<td>{8}</td>";

                _ = prePriceCol == 0 ? prePriceH = @"<th style='display:none;'>سعر الدواء</th>" : prePriceH = @"<th>سعر الدواء</th>";
                _ = prePriceCol == 0 ? prePriceC = @"<td style='display:none;'>{9}</td>" : prePriceC = @"<td>{9}</td>";

                _ = preDaysCol == 0 ? preDaysH = @"<th style='display:none;'>مدة التوفير</th>" : preDaysH = @"<th>مدة التوفير</th>";
                _ = preDaysCol == 0 ? preDaysC = @"<td style='display:none;'>{10}</td>" : preDaysC = @"<td>{10}</td>";

                _ = preDateCol == 0 ? preDateH = @"<th style='display:none;'>تاريخ العرض</th>" : preDateH = @"<th>تاريخ العرض</th>";
                _ = preDateCol == 0 ? preDateC = @"<td style='display:none;'>{11}</td>" : preDateC = @"<td>{11}</td>";

                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + nameH + @"
                                         " + passH + @"
                                         " + natH + @"
                                         " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + prePriceH + @"
                                         " + preDaysH + @"
                                         " + preDateH + @"
                                    </tr>";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    var totalOp = await GetAllRequestsForPat(pat.PatientId, PHId, OrderState);

                    //=================================================
                    string hr = "";
                    string medarN = "";
                    string medenN = "";
                    string phar = "";
                    string reqQuan = "";
                    string reqDate = "";
                    string preprice = "";
                    string predays = "";
                    string preDate = "";

                    int co = 0;

                    if (totalOp.Count > 1)
                    {
                        for (int i = 0; i < totalOp.Count; i++)
                        {

                            co++;
                            if ((i + 1) != totalOp.Count)
                            {
                                hr = @"<br> <hr style='width:50%;background-color:black;'>";
                            }
                            else
                            {
                                hr = "";
                            }
                            //===========

                            medarN += (co) + "- " + totalOp.ElementAt(i).MedArName + hr;
                            medenN += (co) + "- " + totalOp.ElementAt(i).MedEnName + hr;
                            phar += (co) + "- " + totalOp.ElementAt(i).PharmacyName + hr;
                            reqQuan += totalOp.ElementAt(i).RequestedQuantity + hr;
                            reqDate += (co) + "- " + totalOp.ElementAt(i).RequestDate + hr;
                            preprice += (co) + "- " + totalOp.ElementAt(i).PrePrice + hr;
                            predays += (co) + "- " + totalOp.ElementAt(i).PreDays + hr;
                            preDate += (co) + "- " + totalOp.ElementAt(i).PreDate + hr;


                        }
                        sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + prePriceC + @"
                                   " + preDaysC + @"
                                   " + preDateC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
      medenN, medarN, phar, reqQuan,
      reqDate, preprice, predays, preDate);
                        counter++;

                    }

                    else
                    {
                        sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + prePriceC + @"
                                   " + preDaysC + @"
                                   " + preDateC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
                                  pat.MedEnName, pat.MedArName, pat.PharmacyName, pat.RequestedQuantity,
                                  pat.RequestDate, pat.PrePrice, pat.PreDays, pat.PreDate);
                        counter++;

                    }
                }

            }

            if (OrderState == 6)
            {
                header = @"<h1>كافة العروض المبدئية التي تم رفضها لطلبات الأدوية</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + pats.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة العروض المبدئية التي تم رفضها لطلبات الأدوية من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";


                _ = patNameCol == 0 ? nameH = @"<th style='display:none;'> اسم المريض </th>" : nameH = @"<th> اسم المريض </th>";
                _ = patNameCol == 0 ? nameC = @"<td style='display:none;'>{1}</td>" : nameC = @"<td>{1}</td>";

                _ = passNomCol == 0 ? passH = @"<th style='display:none;'> رقم جواز السفر </th>" : passH = @"<th> رقم جواز السفر </th>";
                _ = passNomCol == 0 ? passC = @"<td style='display:none;'>{2}</td>" : passC = @"<td>{2}</td>";

                _ = natNomCol == 0 ? natH = @"<th style='display:none;'> الرقم الوطني </th>" : natH = @"<th> الرقم الوطني </th>";
                _ = natNomCol == 0 ? natC = @"<td style='display:none;'>{3}</td>" : natC = @"<td>{3}</td>";


                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{4}</td>" : medEnC = @"<td>{4}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{5}</td>" : medArC = @"<td>{5}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{6}</td>" : pharmacyC = @"<td>{6}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{7}</td>" : requestQuantityC = @"<td>{7}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{8}</td>" : requestDateC = @"<td>{8}</td>";

                _ = prePriceCol == 0 ? prePriceH = @"<th style='display:none;'>سعر الدواء</th>" : prePriceH = @"<th>سعر الدواء</th>";
                _ = prePriceCol == 0 ? prePriceC = @"<td style='display:none;'>{9}</td>" : prePriceC = @"<td>{9}</td>";

                _ = preDaysCol == 0 ? preDaysH = @"<th style='display:none;'>مدة التوفير</th>" : preDaysH = @"<th>مدة التوفير</th>";
                _ = preDaysCol == 0 ? preDaysC = @"<td style='display:none;'>{10}</td>" : preDaysC = @"<td>{10}</td>";

                _ = preDateCol == 0 ? preDateH = @"<th style='display:none;'>تاريخ العرض</th>" : preDateH = @"<th>تاريخ العرض</th>";
                _ = preDateCol == 0 ? preDateC = @"<td style='display:none;'>{11}</td>" : preDateC = @"<td>{11}</td>";

                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + nameH + @"
                                         " + passH + @"
                                         " + natH + @"
                                         " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + prePriceH + @"
                                         " + preDaysH + @"
                                         " + preDateH + @"
                                    </tr>";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    var totalOp = await GetAllRequestsForPat(pat.PatientId, PHId, OrderState);

                    //=================================================
                    string hr = "";
                    string medarN = "";
                    string medenN = "";
                    string phar = "";
                    string reqQuan = "";
                    string reqDate = "";
                    string preprice = "";
                    string predays = "";
                    string preDate = "";

                    int co = 0;

                    if (totalOp.Count > 1)
                    {
                        for (int i = 0; i < totalOp.Count; i++)
                        {

                            co++;
                            if ((i + 1) != totalOp.Count)
                            {
                                hr = @"<br> <hr style='width:50%;background-color:black;'>";
                            }
                            else
                            {
                                hr = "";
                            }
                            //===========

                            medarN += (co) + "- " + totalOp.ElementAt(i).MedArName + hr;
                            medenN += (co) + "- " + totalOp.ElementAt(i).MedEnName + hr;
                            phar += (co) + "- " + totalOp.ElementAt(i).PharmacyName + hr;
                            reqQuan += totalOp.ElementAt(i).RequestedQuantity + hr;
                            reqDate += (co) + "- " + totalOp.ElementAt(i).RequestDate + hr;
                            preprice += (co) + "- " + totalOp.ElementAt(i).PrePrice + hr;
                            predays += (co) + "- " + totalOp.ElementAt(i).PreDays + hr;
                            preDate += (co) + "- " + totalOp.ElementAt(i).PreDate + hr;


                        }
                        sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + prePriceC + @"
                                   " + preDaysC + @"
                                   " + preDateC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
medenN, medarN, phar, reqQuan,
reqDate, preprice, predays, preDate);
                        counter++;

                    }

                    else
                    {
                        sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + prePriceC + @"
                                   " + preDaysC + @"
                                   " + preDateC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
                                  pat.MedEnName, pat.MedArName, pat.PharmacyName, pat.RequestedQuantity,
                                  pat.RequestDate, pat.PrePrice, pat.PreDays, pat.PreDate);
                        counter++;

                    }
                }

            }

            if (OrderState == 7)
            {
                header = @"<h1>كافة العروض المبدئية التي تم قبولها لطلبات الأدوية</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + pats.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة العروض المبدئية التي تم قبولها لطلبات الأدوية من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";


                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{1}</td>" : medEnC = @"<td>{1}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{2}</td>" : medArC = @"<td>{2}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{4}</td>" : requestQuantityC = @"<td>{4}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{5}</td>" : requestDateC = @"<td>{5}</td>";

                _ = prePriceCol == 0 ? prePriceH = @"<th style='display:none;'>سعر الدواء</th>" : prePriceH = @"<th>سعر الدواء</th>";
                _ = prePriceCol == 0 ? prePriceC = @"<td style='display:none;'>{6}</td>" : prePriceC = @"<td>{6}</td>";

                _ = preDaysCol == 0 ? preDaysH = @"<th style='display:none;'>مدة التوفير</th>" : preDaysH = @"<th>مدة التوفير</th>";
                _ = preDaysCol == 0 ? preDaysC = @"<td style='display:none;'>{7}</td>" : preDaysC = @"<td>{7}</td>";

                _ = preDateCol == 0 ? preDateH = @"<th style='display:none;'>تاريخ العرض</th>" : preDateH = @"<th>تاريخ العرض</th>";
                _ = preDateCol == 0 ? preDateC = @"<td style='display:none;'>{8}</td>" : preDateC = @"<td>{8}</td>";

                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>";
                sb.Append(table);

                foreach (var pat in pats)
                {

                    PatientName = @"<p>اسم المريض : " + pat.PatientName + "</p>";
                    PassportNom = @"<p dir='rtl'>رقم جواز السفر : " + pat.PassportNo + "</p>";
                    NationalNom = @"<p>الرقم الوطني : " + pat.NationalNo + "</p>";

                    int counter2 = 1;

                    var totalOp = await GetAllRequestsForPat(pat.PatientId, PHId, OrderState);

                    //=================================================

                    if (totalOp.Count > 0)
                    {

                        content2 = @"  <br><br>
                                <div class='mainDataComm' style='text-align: center;'>
                                <div class='lableInlie'>" + counter + "-" + @"</div>
                                <div class='lableInlie'>" + PatientName + @"</div>
                                <div class='lableInlie'>" + PassportNom + @"</div>
                                <div class='lableInlie'>" + NationalNom + @"</div>
                                </div>       
                                   <br>
                                    <table align='center'>
                                    <tr>
                                        <th> ت.</th>
                                        " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + prePriceH + @"
                                         " + preDaysH + @"
                                         " + preDateH + @"
                                    </tr>";
                        sb.Append(content2);

                        foreach (var mt in totalOp)
                        {
                            sb.AppendFormat(@" <tr>
                                    <td>{0}</td>
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + prePriceC + @"
                                   " + preDaysC + @"
                                   " + preDateC + @"
                                  </tr>", counter2, mt.MedArName, mt.MedEnName, mt.PharmacyName,
                                  mt.RequestedQuantity, mt.RequestDate, mt.PrePrice, mt.PreDays, mt.PreDate );
                            counter2++;
                        }

                        sb.Append(@"
                                </table> <br><hr style='width: 50%;margin-left: 25% !important;margin-right: 25% !important;'>");

                    }

                    counter++;
                }

            }


            if (OrderState == 8)
            {
                header = @"<h1>كافة طلبات الأدوية التي تم توفيرها من قِبل الصيدليات وجاهزة للاستلام</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + pats.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة طلبات الأدوية التي تم توفيرها وجاهزة للاستلام من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";


                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{1}</td>" : medEnC = @"<td>{1}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{2}</td>" : medArC = @"<td>{2}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{4}</td>" : requestQuantityC = @"<td>{4}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{5}</td>" : requestDateC = @"<td>{5}</td>";

                _ = provideDateCol == 0 ? provideDateH = @"<th style='display:none;'>تاريخ التوفير</th>" : provideDateH = @"<th>تاريخ التوفير</th>";
                _ = provideDateCol == 0 ? provideDateC = @"<td style='display:none;'>{6}</td>" : provideDateC = @"<td>{6}</td>";


                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>";
                sb.Append(table);

                foreach (var pat in pats)
                {

                    PatientName = @"<p>اسم المريض : " + pat.PatientName + "</p>";
                    PassportNom = @"<p dir='rtl'>رقم جواز السفر : " + pat.PassportNo + "</p>";
                    NationalNom = @"<p>الرقم الوطني : " + pat.NationalNo + "</p>";

                    int counter2 = 1;

                    var totalOp = await GetAllRequestsForPat(pat.PatientId, PHId, OrderState);

                    //=================================================

                    if (totalOp.Count > 0)
                    {

                        content2 = @"  <br><br>
                                <div class='mainDataComm' style='text-align: center;'>
                                <div class='lableInlie'>" + counter + "-" + @"</div>
                                <div class='lableInlie'>" + PatientName + @"</div>
                                <div class='lableInlie'>" + PassportNom + @"</div>
                                <div class='lableInlie'>" + NationalNom + @"</div>
                                </div>       
                                   <br>
                                    <table align='center'>
                                    <tr>
                                        <th> ت.</th>
                                        " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + provideDateH + @"
                                    </tr>";
                        sb.Append(content2);

                        foreach (var mt in totalOp)
                        {
                            sb.AppendFormat(@" <tr>
                                    <td>{0}</td>
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + provideDateC + @"
                                  </tr>", counter2, mt.MedArName, mt.MedEnName, mt.PharmacyName,
                                  mt.RequestedQuantity, mt.RequestDate, mt.ProvideDate);
                            counter2++;
                        }

                        sb.Append(@"
                                </table> <br><hr style='width: 50%;margin-left: 25% !important;margin-right: 25% !important;'>");

                    }

                    counter++;
                }

            }

            //تقرير طلبات الادوية التي تم تسليمها للمندوب من قبل الصيدلية
            if (OrderState == 3)
            {
                var data = await AllRequestsMedicationsDispensed(medId, PHId, OrderState, fromDate, toDate, fromDateD, toDateD);

                header = @"<h1>كافة طلبات الأدوية التي تم تسليمها للمندوب</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + data.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + data.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة طلبات الأدوية التي تم تسليمها للمندوب من قِبل " + data.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + data.ElementAt(0).MedEnName + "</p>";

                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{1}</td>" : medEnC = @"<td>{1}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{2}</td>" : medArC = @"<td>{2}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{4}</td>" : requestQuantityC = @"<td>{4}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{5}</td>" : requestDateC = @"<td>{5}</td>";

                _ = dispensedQuantityCol == 0 ? dispensedQuantityH = @"<th style='display:none;'>الكمية المصروفة</th>" : dispensedQuantityH = @"<th>الكمية المصروفة</th>";
                _ = dispensedQuantityCol == 0 ? dispensedQuantityC = @"<td style='display:none;'>{6}</td>" : dispensedQuantityC = @"<td>{6}</td>";

                _ = dispensedDateCol == 0 ? dispensedDateH = @"<th style='display:none;'>تاريخ التسليم</th>" : dispensedDateH = @"<th>تاريخ التسليم</th>";
                _ = dispensedDateCol == 0 ? dispensedDateC = @"<td style='display:none;'>{7}</td>" : dispensedDateC = @"<td>{7}</td>";

                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>";
                sb.Append(table);

                foreach (var pat in pats)
                {

                    PatientName = @"<p>اسم المريض : " + pat.PatientName + "</p>";
                    PassportNom = @"<p dir='rtl'>رقم جواز السفر : " + pat.PassportNo + "</p>";
                    NationalNom = @"<p>الرقم الوطني : " + pat.NationalNo + "</p>";

                    int counter2 = 1;

                    var totalOp = await GetAllRequestsForPat(pat.PatientId, PHId, OrderState);

                    //=================================================

                    if (totalOp.Count > 0)
                    {

                        content2 = @"  <br><br>
                                <div class='mainDataComm' style='text-align: center;'>
                                <div class='lableInlie'>" + counter + "-" + @"</div>
                                <div class='lableInlie'>" + PatientName + @"</div>
                                <div class='lableInlie'>" + PassportNom + @"</div>
                                <div class='lableInlie'>" + NationalNom + @"</div>
                                </div>       
                                   <br>
                                    <table align='center'>
                                    <tr>
                                        <th> ت.</th>
                                        " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + dispensedQuantityH + @"
                                         " + dispensedDateH + @"
                                    </tr>";
                        sb.Append(content2);

                        foreach (var mt in totalOp)
                        {
                            sb.AppendFormat(@" <tr>
                                    <td>{0}</td>
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + dispensedQuantityC + @"
                                   " + dispensedDateC + @"
                                  </tr>", counter2, mt.MedArName, mt.MedEnName, mt.PharmacyName,
                                  mt.RequestedQuantity, mt.RequestDate, mt.DispensedQuantity, mt.DispensDate);
                            counter2++;
                        }

                        sb.Append(@"
                                </table> <br><hr style='width: 50%;margin-left: 25% !important;margin-right: 25% !important;'>");

                    }

                    counter++;
                }

            }


            //كافة حالات الطلب
            if (OrderState == 9)
            {
                var reqs = await AllRequestsMedications(medId, PHId,fromDate,toDate);

                header = @"<h1>كافة طلبات الأدوية</h1>";

                if (medId != 0)
                {
                    subheader = @"<h2>:بيانات الدواء</h2>";
                    MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + reqs.ElementAt(0).MedEnName + "</p>";
                    MedArName = @"<p> إسم الدواء التجاري : " + reqs.ElementAt(0).MedArName + "</p>";

                }
                if (PHId != 0)
                {
                    header = @"<h1> كافة طلبات الأدوية لـ  " + reqs.ElementAt(0).PharmacyName + "</h1>";

                }

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + reqs.ElementAt(0).MedEnName + "</p>";



                _ = medEnMedicineCol == 0 || medId != 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicineCol == 0 || medId != 0 ? medEnC = @"<td style='display:none;'>{1}</td>" : medEnC = @"<td>{1}</td>";

                _ = medArMedicineCol == 0 || medId != 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicineCol == 0 || medId != 0 ? medArC = @"<td style='display:none;'>{2}</td>" : medArC = @"<td>{2}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{4}</td>" : requestQuantityC = @"<td>{4}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{5}</td>" : requestDateC = @"<td>{5}</td>";

                _ = prePriceCol == 0 ? prePriceH = @"<th style='display:none;'>سعر الدواء</th>" : prePriceH = @"<th>سعر الدواء</th>";
                _ = prePriceCol == 0 ? prePriceC = @"<td style='display:none;'>{6}</td>" : prePriceC = @"<td>{6}</td>";

                _ = preDaysCol == 0 ? preDaysH = @"<th style='display:none;'>مدة التوفير</th>" : preDaysH = @"<th>مدة التوفير</th>";
                _ = preDaysCol == 0 ? preDaysC = @"<td style='display:none;'>{7}</td>" : preDaysC = @"<td>{7}</td>";

                _ = dispensedQuantityCol == 0 ? dispensedQuantityH = @"<th style='display:none;'>الكمية المصروفة</th>" : dispensedQuantityH = @"<th>الكمية المصروفة</th>";
                _ = dispensedQuantityCol == 0 ? dispensedQuantityC = @"<td style='display:none;'>{8}</td>" : dispensedQuantityC = @"<td>{8}</td>";

                _ = dispensedDateCol == 0 ? dispensedDateH = @"<th style='display:none;'>تاريخ الاستلام</th>" : dispensedDateH = @"<th>تاريخ الاستلام</th>";
                _ = dispensedDateCol == 0 ? dispensedDateC = @"<td style='display:none;'>{9}</td>" : dispensedDateC = @"<td>{9}</td>";

                string RfromDate = "", RtoDate = "";

                if (fromDateD != null && toDateD != null)
                {
                    subheader = @"<h2>:حسب تاريخ الطلب</h2>";

                    RfromDate = @"<p> من تاريخ : " + fromDate.ToString("dd-MM-yyyy") + "</p>";
                    RtoDate = @"<p> إلى تاريخ : " + toDate.ToString("dd-MM-yyyy") + "</p>";
                }


                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>
                                <div class='lable'>" + subheader2 + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + RfromDate + @"</div>
                                <div class='lable'>" + RtoDate + @"</div>
                                </div>";
                sb.Append(table);

                string HOrderState = "";

                foreach (var req in reqs)
                {

                    PatientName = @"<p>اسم المريض : " + req.PatientName + "</p>";
                    PassportNom = @"<p dir='rtl'>رقم جواز السفر : " + req.PassportNo + "</p>";
                    NationalNom = @"<p>الرقم الوطني : " + req.NationalNo + "</p>";

                    int counter2 = 1;

                    var totalOp = await GetAllRequestsForPatAll(req.PatientId, PHId, OrderState,fromDate,toDate);

                    //=================================================
                    string preprice = "";
                    string predays = "";
                    string dispensDate = "";
                    string dispensedQuantity = "";

                   
                    if (totalOp.Count > 0)
                    {
                   
                        content2 = @"  <br><br>
                                <div class='mainDataComm' style='text-align: center;'>
                                <div class='lableInlie'>" + counter + "-"+ @"</div>
                                <div class='lableInlie'>" + PatientName + @"</div>
                                <div class='lableInlie'>" + PassportNom + @"</div>
                                <div class='lableInlie'>" + NationalNom + @"</div>
                                </div>       
                                   <br>
                                    <table align='center'>
                                    <tr>
                                        <th> ت.</th>
                                        " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + prePriceH + @"
                                         " + preDaysH + @"
                                         " + dispensedQuantityH + @"
                                         " + dispensedDateH + @"
                                          <th>حالة الطلب</th>
                                    </tr>";
                        sb.Append(content2);



                     
                        foreach (var mt in totalOp)
                        {

                            switch (mt.OrderState)
                            {
                                case 1: HOrderState = "لم يتم الرد"; break;
                                case 5: HOrderState = "قيد المراجعة"; break;
                                case 6: HOrderState = "تم رفض العرض المبدئي"; break;
                                case 7: HOrderState = "قيد المراجعة"; break;
                                case 8: HOrderState = "تم التوفير"; break;
                                case 3: HOrderState = "تم التسليم للمندوب"; break;
                                case 4: HOrderState = "تم التسليم للمستفيد"; break;
                            }

                            if(mt.PrePrice != null)
                            {
                                preprice = mt.PrePrice;
                            } 
                            
                            if(mt.PrePrice == null)
                            {
                                preprice = "----";
                            }
                            
                            if(mt.PreDays != null)
                            {
                                predays = mt.PreDays;
                            }  
                            if(mt.PreDays == null)
                            {
                                predays ="----";
                            }
                            
                            if(mt.DispensDate != null)
                            {
                                dispensDate = mt.DispensDate;
                            }  
                            if(mt.DispensDate == null)
                            {
                                dispensDate = "----";
                            }  
                            
                            if(mt.DispensedQuantity != 0)
                            {
                                dispensedQuantity = mt.DispensedQuantity.ToString();
                            }  
                            if(mt.DispensedQuantity == 0)
                            {
                                dispensedQuantity = "----";
                            }
                          
                            sb.AppendFormat(@" <tr>
                                    <td>{0}</td>
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + prePriceC + @"
                                   " + preDaysC + @"
                                   " + dispensedQuantityC + @"
                                   " + dispensedDateC + @"
                                   <td>{10}</td>
                                  </tr>", counter2, mt.MedArName, mt.MedEnName, mt.PharmacyName, mt.RequestedQuantity,
                                      mt.RequestDate, preprice, predays, dispensedQuantity,
                                      dispensDate, HOrderState);
                            counter2++;
                        }

                        sb.Append(@"
                                </table> <br><hr style='width: 50%;margin-left: 25% !important;margin-right: 25% !important;'>");


                                       
                    }

                    counter++;
                }

            }

            sb.Append(@"
                                </table>
                            </body>
                        </html>");

            return sb.ToString();
        }

        //============تقارير كافة طلبات الأدوية
        private async Task<List<ReportProperties>> AllReportsMedications(int medId, int PHId, int OrderState, DateTime fromDate, DateTime toDate, DateTime fromDateD, DateTime toDateD)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from ph in _db.Pharmacies

                  where (dismd.MedId == medId || medId == 0) && (dismd.PHId == PHId || PHId == 0)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId && dismd.PHId == ph.Id
                  && dismd.OrderState == OrderState
                  && (fromDate == null || dismd.RequestDate >= fromDate)
                  && (toDate == null || dismd.RequestDate <= toDate)
                  //&& (fromDateD == null || dismd.DispensDate >= fromDateD)
                  //&& (toDateD == null || dismd.DispensDate <= toDateD)

                  orderby dismd.RequestDate
                  select new ReportProperties
                  {
                      PatientId = dismd.PatientId,
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      PrePrice = dismd.PrePrice,
                      PreDays = dismd.PreDays,
                      PreDate = dismd.PreDate.ToString(),
                      ProvideDate = dismd.ProvideDate.ToString()

                  }

                            ).ToListAsync();
            var dist = output.GroupBy(x => x.PatientId).Select(y => y.FirstOrDefault()).ToList();

            return dist;

        }

        //============تقارير كافة الأدوية التي تم تسليمها للمندوب
        private async Task<List<ReportProperties>> AllRequestsMedicationsDispensed(int medId, int PHId, int OrderState, DateTime fromDate, DateTime toDate, DateTime fromDateD, DateTime toDateD)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from ph in _db.Pharmacies

                  where (dismd.MedId == medId || medId == 0) && (dismd.PHId == PHId || PHId == 0)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId && dismd.PHId == ph.Id
                  && dismd.OrderState == OrderState
                  && (fromDateD == null || dismd.DispensDate >= fromDateD)
                  && (toDateD == null || dismd.DispensDate <= toDateD)

                  orderby dismd.DispensDate
                  select new ReportProperties
                  {
                      PatientId = dismd.PatientId,
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      PrePrice = dismd.PrePrice,
                      PreDays = dismd.PreDays,
                      PreDate = dismd.PreDate.ToString(),
                      ProvideDate = dismd.ProvideDate.ToString()

                  }

                            ).ToListAsync();
            var dist = output.GroupBy(x => x.PatientId).Select(y => y.FirstOrDefault()).ToList();

            return dist;

        }

        //============تقارير كافة حالات طلبات الأدوية
        private async Task<List<ReportProperties>> AllRequestsMedications(int medId, int PHId,DateTime fromDate,DateTime toDate)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from ph in _db.Pharmacies

                  where (dismd.MedId == medId || medId == 0) && (dismd.PHId == PHId || PHId == 0)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId && dismd.PHId == ph.Id
                   && (fromDate == null || dismd.RequestDate >= fromDate)
                  && (toDate == null || dismd.RequestDate <= toDate)

                  // && dismd.OrderState == OrderState
                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {

                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      PrePrice = dismd.PrePrice,
                      PreDays = dismd.PreDays,
                      PreDate = dismd.PreDate.ToString(),
                      ProvideDate = dismd.ProvideDate.ToString(),
                      PatientId = dismd.PatientId

                  }
                            ).ToListAsync();
            var dist = output.GroupBy(x => x.PatientId).Select(y => y.FirstOrDefault()).ToList();

            return dist;

        }

        //===================================================================
        //===================================================================
        //===================================================================
        //===================================================================


        //========تقرير الأدوية التي تم استلامها من قبل الصيدلية او تسليمها من قبل المركز للمستفيد========
        public async Task<string> GetHTMLStringAllMedicationsDispensedByPharmacyAndMang(int[] medids, int PHId, int reportType)
        {
            int counter = 1;
            var sb = new StringBuilder();

            var path = _env.WebRootPath + "\\img.jpg";//It fetches files under wwwroot

            sb.AppendLine($"<img style='float: left;width: 15 %;padding-top: 35px;' src =\"{path}\" />");

            if (reportType == 1)
            {
                var pats = await AllMedicationsDispensedByPharmacy(medids, PHId);

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";

                header = @"<h1>كافة الأدوية التي تم استلامها من قِبل الصيدليات</h1>";

                if (PHId != 0)
                {
                    header = @"<h1> كافة الأدوية التي تم استلامها من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                _ =  PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ =  PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";



                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                        <th>إسم الدواء العلمي</th>
                                        <th>إسم الدواء التجاري</th>
                                        " + pharmacyH + @"
                                        <th>إجمالي الكمية المصروفة</th>
                                    </ tr >";
                sb.Append(table);

                foreach (var pat in pats)
                {

                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                    <td>{1}</td>
                                    <td>{2}</td>
                                   " + pharmacyC + @"
                                    <td>{4}</td>
                                  </tr>", counter, pat.MedEnName, pat.MedArName, pat.PharmacyName,
                                      pat.DispensedQuantity);
                    counter++;
                }

            }

            if (reportType == 2)
            {
                var pats = await AllMedicationsDispensedByManagement(medids, PHId);

                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";

                header = @"<h1>كافة الأدوية التي تم تسليمها للمستفيدين من المركز</h1>";

                if (PHId != 0)
                {
                    header = @"<h1> كافة الأدوية التي تم تسليمها للمركز من " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                        <th>إسم الدواء العلمي</th>
                                        <th>إسم الدواء التجاري</th>
                                        <th>الصيدلية</th>
                                        <th>إجمالي الكمية المصروفة</th>
                                        <th>إجمالي عدد الحالات المستفيدة</th>
                                    </ tr >";
                sb.Append(table);

                foreach (var pat in pats)
                {

                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                    <td>{1}</td>
                                    <td>{2}</td>
                                    <td>{3}</td>
                                    <td>{4}</td>
                                    <td>{5}</td>
                                  </tr>", counter, pat.MedEnName, pat.MedArName, pat.PharmacyName,
                                      pat.DispensedQuantity, pat.TotalPats);
                    counter++;
                }

            }

            sb.Append(@"
                                </table>
                            </body>
                        </html>");

            return sb.ToString();
        }

        //============ تقرير الأدوية التي تم تسليمها للمندوب من قبل الصيدلية
        private async Task<List<ReportProperties>> AllMedicationsDispensedByPharmacy(int[] medids, int PHId)
        {
            var query = from d in _db.Medications
                        from ph in _db.Pharmacies
                        from dismd in _db.DispensingMedication.Where(m => medids.Contains(m.MedId))
                        where (dismd.OrderState == 3 || dismd.OrderState == 4)
                            && ph.Id == dismd.PHId
                            && d.Id == dismd.MedId
                            && (PHId == 0 || dismd.PHId == PHId)
                        group dismd by new { d.MedArName, d.MedEnName, ph.PharmacyName, dismd.Notes, ph.Id, dismd.MedId } into g
                        select new ReportProperties
                        {
                            MedArName = g.Key.MedArName,
                            MedEnName = g.Key.MedEnName,
                            PharmacyName = g.Key.PharmacyName,
                            PHId = g.Key.Id,
                            DispensedQuantity = g.Sum(d => d.DispensedQuantity)
                        };

            var result = query.ToList();

            return await Task.FromResult(result); ;
        }

        //============تقرير الأدوية التي تم تسليمها للمستفيد من قبل المركز
        private async Task<List<ReportProperties>> AllMedicationsDispensedByManagement(int[] medids, int PHId)
        {
            var query = from d in _db.Medications
                        from ph in _db.Pharmacies
                        from dismd in _db.DispensingMedication.Where(m => medids.Contains(m.MedId))
                        where dismd.OrderState == 4
                            && ph.Id == dismd.PHId
                            && d.Id == dismd.MedId
                            && (PHId == 0 || dismd.PHId == PHId)
                        group dismd by new { d.MedArName, d.MedEnName, ph.PharmacyName, dismd.Notes, ph.Id, dismd.MedId } into g
                        select new ReportProperties
                        {
                            MedArName = g.Key.MedArName,
                            MedEnName = g.Key.MedEnName,
                            PharmacyName = g.Key.PharmacyName,
                            PHId = g.Key.Id,
                            DispensedQuantity = g.Sum(d => d.DispensedQuantity),
                            TotalPats = g.Count()
                        };

            var result = query.ToList();

            return await Task.FromResult(result); ;
        }

        //===================================================================
        //===================================================================
        //===================================================================
        //===================================================================



        //========تقرير الدواء الذي تم صرفه من قبل الصيدلية او المركز ولمن تم صرفه========
        public async Task<string> GetHTMLStringAllPatsMedicationByPharmacy(int PHId, int medId,int OrderState, int patNameCol, int natNomCol, int passNomCol, int pharmacyCol, int requestQuantCol, int requestDateCol, int dispensedQuantCol, int dispensedDateCol, int notesCol)
        {
            int counter = 1;
            var sb = new StringBuilder();

            var path = _env.WebRootPath + "\\img.jpg";//It fetches files under wwwroot

            sb.AppendLine($"<img style='float: left;width: 15 %;padding-top: 35px;' src =\"{path}\" />");

            //الدواء المصروف من قبل الصيدلية
            if(OrderState == 9)
            {
                var pats = await AllPatsMedicationDipensedByPharmacy(PHId, medId, OrderState);
                if (PHId != 0)
                {
                    header = @"<h1> الدواء ولمن تم صرفه من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                if (PHId == 0)
                {
                    header = @"<h1>الدواء ولمن تم صرفه من قِبل المركز</h1>";

                }

                subheader = @"<h2>:بيانات الدواء</h2>";
                MedEnName = @"<p dir='rtl'> إسم الدواء العلمي : " + pats.ElementAt(0).MedEnName + "</p>";
                MedArName = @"<p dir='rtl'> إسم الدواء التجاري : " + pats.ElementAt(0).MedArName + "</p>";


                _ = patNameCol == 0 ? nameH = @"<th style='display:none;'> اسم المريض </th>" : nameH = @"<th> اسم المريض </th>";
                _ = patNameCol == 0 ? nameC = @"<td style='display:none;'>{1}</td>" : nameC = @"<td>{1}</td>";

                _ = passNomCol == 0 ? passH = @"<th style='display:none;'> رقم جواز السفر </th>" : passH = @"<th> رقم جواز السفر </th>";
                _ = passNomCol == 0 ? passC = @"<td style='display:none;'>{2}</td>" : passC = @"<td>{2}</td>";

                _ = natNomCol == 0 ? natH = @"<th style='display:none;'> الرقم الوطني </th>" : natH = @"<th> الرقم الوطني </th>";
                _ = natNomCol == 0 ? natC = @"<td style='display:none;'>{3}</td>" : natC = @"<td>{3}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{4}</td>" : pharmacyC = @"<td>{4}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{5}</td>" : requestQuantityC = @"<td>{5}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{6}</td>" : requestDateC = @"<td>{6}</td>";


                _ = dispensedQuantCol == 0 ? dispensedQuantityH = @"<th style='display:none;'>الكمية المصروفة</th>" : dispensedQuantityH = @"<th> الكمية المصروفة </th>";
                _ = dispensedQuantCol == 0 ? dispensedQuantityC = @"<td style='display:none;'>{7}</td>" : dispensedQuantityC = @"<td>{7}</td>";


                _ = dispensedDateCol == 0 ? dispensedDateH = @"<th style='display:none;'>تاريخ الصرف</th>" : dispensedDateH = @"<th>تاريخ الصرف</th>";
                _ = dispensedDateCol == 0 ? dispensedDateC = @"<td style='display:none;'>{8}</td>" : dispensedDateC = @"<td>{8}</td>";


                _ = notesCol == 0 ? notesH = @"<th style='display:none;'>ملاحظات</th>" : notesH = @"<th>ملاحظات</th>";
                _ = notesCol == 0 ? notesC = @"<td style='display:none;'>{9}</td>" : notesC = @"<td>{9}</td>";



                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + nameH + @"
                                         " + passH + @"
                                         " + natH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + dispensedQuantityH + @"
                                         " + dispensedDateH + @"   
                                         " + notesH + @"

                                    </ tr >";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    string Note = "";
                    string Date = "";

                    if (PHId == 0)
                    {
                        Date = pat.MangDispensDate;
                    }

                    if (PHId != 0)
                    {
                        Date = pat.DispensDate;
                    }

                    if (pat.Notes == null)
                    {
                        Note = "لا يوجد";
                    }
                    else
                    {
                        Note = pat.Notes;
                    }
                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + dispensedQuantityC + @"
                                   " + dispensedDateC + @"
                                   " + notesC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
                                      pat.PharmacyName, pat.RequestedQuantity, pat.RequestDate
                                      , pat.DispensedQuantity, Date, Note);
                    counter++;
                }

            }


            //الدواء المصروف من قبل المركز
            if (OrderState == 4)
            {
                var pats = await AllPatsMedicationDipensedByManagement(PHId, medId, OrderState);
                if (PHId != 0)
                {
                    header = @"<h1> الدواء ولمن تم صرفه من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }

                if (PHId == 0)
                {
                    header = @"<h1>الدواء ولمن تم صرفه من قِبل المركز</h1>";

                }

                subheader = @"<h2>:بيانات الدواء</h2>";
                MedEnName = @"<p dir='rtl'> إسم الدواء بالإنجليزي : " + pats.ElementAt(0).MedEnName + "</p>";
                MedArName = @"<p dir='rtl'> إسم الدواء بالعربي : " + pats.ElementAt(0).MedArName + "</p>";


                _ = patNameCol == 0 ? nameH = @"<th style='display:none;'> اسم المريض </th>" : nameH = @"<th> اسم المريض </th>";
                _ = patNameCol == 0 ? nameC = @"<td style='display:none;'>{1}</td>" : nameC = @"<td>{1}</td>";

                _ = passNomCol == 0 ? passH = @"<th style='display:none;'> رقم جواز السفر </th>" : passH = @"<th> رقم جواز السفر </th>";
                _ = passNomCol == 0 ? passC = @"<td style='display:none;'>{2}</td>" : passC = @"<td>{2}</td>";

                _ = natNomCol == 0 ? natH = @"<th style='display:none;'> الرقم الوطني </th>" : natH = @"<th> الرقم الوطني </th>";
                _ = natNomCol == 0 ? natC = @"<td style='display:none;'>{3}</td>" : natC = @"<td>{3}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{4}</td>" : pharmacyC = @"<td>{4}</td>";


                _ = requestQuantCol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantCol == 0 ? requestQuantityC = @"<td style='display:none;'>{5}</td>" : requestQuantityC = @"<td>{5}</td>";

                _ = requestDateCol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDateCol == 0 ? requestDateC = @"<td style='display:none;'>{6}</td>" : requestDateC = @"<td>{6}</td>";


                _ = dispensedQuantCol == 0 ? dispensedQuantityH = @"<th style='display:none;'>الكمية المصروفة</th>" : dispensedQuantityH = @"<th> الكمية المصروفة </th>";
                _ = dispensedQuantCol == 0 ? dispensedQuantityC = @"<td style='display:none;'>{7}</td>" : dispensedQuantityC = @"<td>{7}</td>";


                _ = dispensedDateCol == 0 ? dispensedDateH = @"<th style='display:none;'>تاريخ الصرف</th>" : dispensedDateH = @"<th>تاريخ الصرف</th>";
                _ = dispensedDateCol == 0 ? dispensedDateC = @"<td style='display:none;'>{8}</td>" : dispensedDateC = @"<td>{8}</td>";


                _ = notesCol == 0 ? notesH = @"<th style='display:none;'>ملاحظات</th>" : notesH = @"<th>ملاحظات</th>";
                _ = notesCol == 0 ? notesC = @"<td style='display:none;'>{9}</td>" : notesC = @"<td>{9}</td>";



                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + MedEnName + @"</div>
                                <div class='lable'>" + MedArName + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + nameH + @"
                                         " + passH + @"
                                         " + natH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + dispensedQuantityH + @"
                                         " + dispensedDateH + @"   
                                         " + notesH + @"

                                    </ tr >";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    string Note = "";
                    string Date = "";

                    if (PHId == 0)
                    {
                        Date = pat.MangDispensDate;
                    }

                    if (PHId != 0)
                    {
                        Date = pat.DispensDate;
                    }

                    if (pat.Notes == null)
                    {
                        Note = "لا يوجد";
                    }
                    else
                    {
                        Note = pat.Notes;
                    }
                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + nameC + @"
                                   " + passC + @"
                                   " + natC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + dispensedQuantityC + @"
                                   " + dispensedDateC + @"
                                   " + notesC + @"
                                  </tr>", counter, pat.PatientName, pat.PassportNo, pat.NationalNo,
                                      pat.PharmacyName, pat.RequestedQuantity, pat.RequestDate
                                      , pat.DispensedQuantity, Date, Note);
                    counter++;
                }

            }


            sb.Append(@"
                                </table>
                            </body>
                        </html>");

            return sb.ToString();
        }


        //============تقرير الدواء ولمن تم صرفه من قبل الصيدلية 
        private async Task<List<ReportProperties>> AllPatsMedicationDipensedByPharmacy(int PHId,int medId,int OrderState)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from ph in _db.Pharmacies

                  where dismd.MedId == medId && (PHId == 0 || dismd.PHId == PHId )
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId
                  && (dismd.OrderState == 3 || dismd.OrderState == 4)
                  && ph.Id == dismd.PHId
                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                  }

                            ).ToListAsync();
            return output;

        }

        //============تقرير الدواء ولمن تم صرفه من قبل  المركز
        private async Task<List<ReportProperties>> AllPatsMedicationDipensedByManagement(int PHId, int medId, int OrderState)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from ph in _db.Pharmacies

                  where dismd.MedId == medId && (PHId == 0 || dismd.PHId == PHId)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId
                  &&( dismd.OrderState == 4)
                  && ph.Id == dismd.PHId
                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                  }

                            ).ToListAsync();
            return output;

        }

        //===================================================================
        //===================================================================
        //===================================================================
        //===================================================================


        //========تقرير الأدوية التي تم صرفها للمريض========
        public async Task<string> GetHTMLStringAllMedicationsDispensingForPatient(int PHId,int OrderState, int patientId, int medEnMedicinecol, int medArMedicinecol, int pharmacyCol, int requestQuantcol, int requestDatecol, int dispensedQuantcol, int dispensedDatecol, int notescol)
        {
            int counter = 1;
            var sb = new StringBuilder();

            var path = _env.WebRootPath + "\\img.jpg";//It fetches files under wwwroot

            sb.AppendLine($"<img style='float: left;width: 15 %;padding-top: 35px;' src =\"{path}\" />");

            if(OrderState == 9)
            {
                var pats = await AllMedicationsDispensingForPatientByPharm(PHId, OrderState, patientId);


                if (PHId == 0)
                {
                    header = @"<h1>كافة الأدوية التي تم صرفها للمريض من قِبل الصيدلية</h1>";

                }

                if (PHId != 0)
                {
                    header = @"<h1>كافة الأدوية التي تم صرفها للمريض من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }


                subheader = @"<h2>:بيانات المريض الرئيسية</h2>";

                PatientName = @"<p> إسم المريض : " + pats.ElementAt(0).PatientName + "</p>";
                PassportNom = @"<p dir='rtl'> رقم جواز السفر : " + pats.ElementAt(0).PassportNo + "</p>";
                NationalNom = @"<p> الرقم الوطني : " + pats.ElementAt(0).NationalNo + "</p>";
                BranchName = @"<p> الفرع التابع له : " + pats.ElementAt(0).BranchName + "</p>";


                _ = medEnMedicinecol == 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicinecol == 0 ? medEnC = @"<td style='display:none;'>{1}</td>" : medEnC = @"<td>{1}</td>";

                _ = medArMedicinecol == 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicinecol == 0 ? medArC = @"<td style='display:none;'>{2}</td>" : medArC = @"<td>{2}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";


                _ = requestQuantcol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantcol == 0 ? requestQuantityC = @"<td style='display:none;'>{4}</td>" : requestQuantityC = @"<td>{4}</td>";

                _ = requestDatecol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDatecol == 0 ? requestDateC = @"<td style='display:none;'>{5}</td>" : requestDateC = @"<td>{5}</td>";


                _ = dispensedQuantcol == 0 ? dispensedQuantityH = @"<th style='display:none;'>الكمية المصروفة</th>" : dispensedQuantityH = @"<th> الكمية المصروفة </th>";
                _ = dispensedQuantcol == 0 ? dispensedQuantityC = @"<td style='display:none;'>{6}</td>" : dispensedQuantityC = @"<td>{6}</td>";


                _ = dispensedDatecol == 0 ? dispensedDateH = @"<th style='display:none;'>تاريخ الصرف</th>" : dispensedDateH = @"<th>تاريخ الصرف</th>";
                _ = dispensedDatecol == 0 ? dispensedDateC = @"<td style='display:none;'>{7}</td>" : dispensedDateC = @"<td>{7}</td>";


                _ = notescol == 0 ? notesH = @"<th style='display:none;'>ملاحظات</th>" : notesH = @"<th>ملاحظات</th>";
                _ = notescol == 0 ? notesC = @"<td style='display:none;'>{8}</td>" : notesC = @"<td>{8}</td>";



                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + PatientName + @"</div>
                                <div class='lable'>" + PassportNom + @"</div>
                                <div class='lable'>" + NationalNom + @"</div>
                                <div class='lable'>" + BranchName + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + dispensedQuantityH + @"
                                         " + dispensedDateH + @"
                                         " + notesH + @"

                                    </tr>";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    string Note = "";
                    string Date = "";
                    if (pat.Notes == null)
                    {
                        Note = "لا يوجد";
                    }
                    else
                    {
                        Note = pat.Notes;
                    }

                    if (PHId == 0)
                    {
                        Date = pat.MangDispensDate;
                    }

                    if (PHId != 0)
                    {
                        Date = pat.DispensDate;
                    }

                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + dispensedQuantityC + @"
                                   " + dispensedDateC + @"
                                   " + notesC + @"
                                  </tr>", counter, pat.MedEnName, pat.MedArName, pat.PharmacyName,
                                      pat.RequestedQuantity, pat.RequestDate,
                                      pat.DispensedQuantity, Date, Note);
                    counter++;
                }


            }

            if (OrderState == 4)
            {
                var pats = await AllMedicationsDispensingForPatientByMang(PHId, OrderState, patientId);


                if (PHId == 0)
                {
                    header = @"<h1>كافة الأدوية التي تم صرفها للمريض من قِبل المركز</h1>";

                }

                if (PHId != 0)
                {
                    header = @"<h1>كافة الأدوية التي تم صرفها للمريض من قِبل " + pats.ElementAt(0).PharmacyName + "</h1>";

                }


                subheader = @"<h2>:بيانات المريض الرئيسية</h2>";

                PatientName = @"<p> إسم المريض : " + pats.ElementAt(0).PatientName + "</p>";
                PassportNom = @"<p dir='rtl'> رقم جواز السفر : " + pats.ElementAt(0).PassportNo + "</p>";
                NationalNom = @"<p> الرقم الوطني : " + pats.ElementAt(0).NationalNo + "</p>";
                BranchName = @"<p> الفرع التابع له : " + pats.ElementAt(0).BranchName + "</p>";


                _ = medEnMedicinecol == 0 ? medEnH = @"<th style='display:none;'> اسم الدواء العلمي </th>" : medEnH = @"<th> اسم الدواء العلمي </th>";
                _ = medEnMedicinecol == 0 ? medEnC = @"<td style='display:none;'>{1}</td>" : medEnC = @"<td>{1}</td>";

                _ = medArMedicinecol == 0 ? medArH = @"<th style='display:none;'> إسم الدواء التجاري </th>" : medArH = @"<th> إسم الدواء التجاري </th>";
                _ = medArMedicinecol == 0 ? medArC = @"<td style='display:none;'>{2}</td>" : medArC = @"<td>{2}</td>";

                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyH = @"<th style='display:none;'>الصيدلية</th>" : pharmacyH = @"<th>الصيدلية</th>";
                _ = pharmacyCol == 0 || PHId != 0 ? pharmacyC = @"<td style='display:none;'>{3}</td>" : pharmacyC = @"<td>{3}</td>";


                _ = requestQuantcol == 0 ? requestQuantityH = @"<th style='display:none;'>الكمية المطلوبة</th>" : requestQuantityH = @"<th>الكمية المطلوبة</th>";
                _ = requestQuantcol == 0 ? requestQuantityC = @"<td style='display:none;'>{4}</td>" : requestQuantityC = @"<td>{4}</td>";

                _ = requestDatecol == 0 ? requestDateH = @"<th style='display:none;'>تاريخ الطلب</th>" : requestDateH = @"<th>تاريخ الطلب</th>";
                _ = requestDatecol == 0 ? requestDateC = @"<td style='display:none;'>{5}</td>" : requestDateC = @"<td>{5}</td>";


                _ = dispensedQuantcol == 0 ? dispensedQuantityH = @"<th style='display:none;'>الكمية المصروفة</th>" : dispensedQuantityH = @"<th> الكمية المصروفة </th>";
                _ = dispensedQuantcol == 0 ? dispensedQuantityC = @"<td style='display:none;'>{6}</td>" : dispensedQuantityC = @"<td>{6}</td>";


                _ = dispensedDatecol == 0 ? dispensedDateH = @"<th style='display:none;'>تاريخ الصرف</th>" : dispensedDateH = @"<th>تاريخ الصرف</th>";
                _ = dispensedDatecol == 0 ? dispensedDateC = @"<td style='display:none;'>{7}</td>" : dispensedDateC = @"<td>{7}</td>";


                _ = notescol == 0 ? notesH = @"<th style='display:none;'>ملاحظات</th>" : notesH = @"<th>ملاحظات</th>";
                _ = notescol == 0 ? notesC = @"<td style='display:none;'>{8}</td>" : notesC = @"<td>{8}</td>";



                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + PatientName + @"</div>
                                <div class='lable'>" + PassportNom + @"</div>
                                <div class='lable'>" + NationalNom + @"</div>
                                <div class='lable'>" + BranchName + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                         " + medEnH + @"
                                         " + medArH + @"
                                         " + pharmacyH + @"
                                         " + requestQuantityH + @"
                                         " + requestDateH + @"
                                         " + dispensedQuantityH + @"
                                         " + dispensedDateH + @"
                                         " + notesH + @"

                                    </tr>";
                sb.Append(table);

                foreach (var pat in pats)
                {
                    string Note = "";
                    string Date = "";
                    if (pat.Notes == null)
                    {
                        Note = "لا يوجد";
                    }
                    else
                    {
                        Note = pat.Notes;
                    }

                    if (PHId == 0)
                    {
                        Date = pat.MangDispensDate;
                    }

                    if (PHId != 0)
                    {
                        Date = pat.DispensDate;
                    }

                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                   " + medEnC + @"
                                   " + medArC + @"
                                   " + pharmacyC + @"
                                   " + requestQuantityC + @"
                                   " + requestDateC + @"
                                   " + dispensedQuantityC + @"
                                   " + dispensedDateC + @"
                                   " + notesC + @"
                                  </tr>", counter, pat.MedEnName, pat.MedArName, pat.PharmacyName,
                                      pat.RequestedQuantity, pat.RequestDate,
                                      pat.DispensedQuantity, Date, Note);
                    counter++;
                }


            }


            sb.Append(@"
                                </table>
                            </body>
                        </html>");

            return sb.ToString();
        }


        //============كافة الأدوية التي تم صرفها للمريض من قِبل hgwd]gdm
        private async Task<List<ReportProperties>> AllMedicationsDispensingForPatientByPharm(int PHId,int OrderState,int patientId)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from br in _db.Branches
                  from ph in _db.Pharmacies

                  where dismd.PatientId == patientId && (PHId == 0 || dismd.PHId == PHId)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId
                  && br.Id == pd.BranchId
                  &&( dismd.OrderState == 3 || dismd.OrderState == 4)
                  && dismd.PHId == ph.Id

                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      BranchName = br.BranchName,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName
                  }

                            ).ToListAsync();
            return output;

        }

        //============كافة الأدوية التي تم صرفها للمريض من قِبل المركز
        private async Task<List<ReportProperties>> AllMedicationsDispensingForPatientByMang(int PHId,int OrderState,int patientId)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from br in _db.Branches
                  from ph in _db.Pharmacies

                  where dismd.PatientId == patientId && (PHId == 0 || dismd.PHId == PHId)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId
                  && br.Id == pd.BranchId
                  && dismd.OrderState == 4
                  && dismd.PHId == ph.Id

                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      BranchName = br.BranchName,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName
                  }

                            ).ToListAsync();
            return output;

        }


        //=================================================================================
        //=================================================================================
        //=================================================================================
        //=================================================================================


        //============كافة طلبات الادوية للمريض
        private async Task<List<ReportProperties>> GetAllRequestsForPat(int patientId, int PHId, int OrderState)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from br in _db.Branches
                  from ph in _db.Pharmacies

                  where dismd.PatientId == patientId
                  && (dismd.PHId == PHId || PHId == 0)
                  && (dismd.OrderState == OrderState || OrderState == 0)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId
                  && br.Id == pd.BranchId
                  && dismd.PHId == ph.Id

                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      BranchName = br.BranchName,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      PrePrice = dismd.PrePrice,
                      PreDays = dismd.PreDays,
                      PreDate = dismd.PreDate.ToString(),
                      ProvideDate = dismd.ProvideDate.ToString(),

                  }

                            ).ToListAsync();
            return output;

        }
     
        //============كافة طلبات الادوية للمريض
        private async Task<List<ReportProperties>> GetAllRequestsForPatAll(int patientId, int PHId, int OrderState,DateTime fromDate,DateTime toDate)
        {

            var output = await (
                  from pd in _db.PatientsData
                  from md in _db.Medications
                  from dismd in _db.DispensingMedication
                  from br in _db.Branches
                  from ph in _db.Pharmacies

                  where dismd.PatientId == patientId
                  && (dismd.PHId == PHId || PHId == 0)
                 // && (dismd.OrderState == OrderState || OrderState == 0)
                  && pd.Id == dismd.PatientId && md.Id == dismd.MedId
                  && br.Id == pd.BranchId
                  && dismd.PHId == ph.Id
                  && (fromDate == null || dismd.RequestDate >= fromDate)
                  && (toDate == null || dismd.RequestDate <= toDate)

                  orderby pd.PatientName ascending
                  select new ReportProperties
                  {
                      PatientName = pd.PatientName,
                      NationalNo = pd.NationalNo,
                      PassportNo = pd.PassportNo,
                      BranchName = br.BranchName,
                      MedArName = md.MedArName,
                      MedEnName = md.MedEnName,
                      RequestedQuantity = dismd.RequestedQuantity,
                      RequestDate = dismd.RequestDate.ToString(),
                      DispensedQuantity = dismd.DispensedQuantity,
                      DispensDate = dismd.DispensDate.ToString(),
                      MangDispensDate = dismd.MangDispensDate.ToString(),
                      OrderState = dismd.OrderState,
                      Notes = dismd.Notes,
                      PharmacyName = ph.PharmacyName,
                      PrePrice = dismd.PrePrice,
                      PreDays = dismd.PreDays,
                      PreDate = dismd.PreDate.ToString(),
                      ProvideDate = dismd.ProvideDate.ToString(),

                  }

                            ).ToListAsync();
            return output;

        }



        //=======================================================
        //=======================================================
        //=======================================================  

        //========تقرير إجمالي الأدوية المصروفة من الصيدلية========
        public async Task<string> GetHTMLStringAllTotalMedicationsDispensedByPharmacy(int[] medids, int PHId,
             DateTime fromDateD, DateTime toDateD)
        {
            int counter = 1;
            var sb = new StringBuilder();

            var path = _env.WebRootPath + "\\img.jpg";//It fetches files under wwwroot

            sb.AppendLine($"<img style='float: left;width: 15 %;padding-top: 35px;' src =\"{path}\" />");


            //تقرير طلبات الادوية التي تم تسليمها للمندوب من قبل الصيدلية
                var data = await AllTotalMedicationsDispensedByPharmacy( medids, PHId,fromDateD, toDateD);


                    header = @"<h1> كافة الأدوية المصروفة قِبل " + data.ElementAt(0).PharmacyName + "</h1>";


                string name;
                name = @"<p dir='rtl'> إسم الدواء العلمي : " + data.ElementAt(0).MedEnName + "</p>";


            string fromDate = "", toDate = "";

            if(fromDateD != null && toDateD != null)
            {
                subheader = @"<h2>:حسب تاريخ الصرف</h2>";

                fromDate = @"<p> من تاريخ : " + fromDateD.ToString("dd-MM-yyyy") + "</p>";
                toDate = @"<p> إلى تاريخ : " + toDateD.ToString("dd-MM-yyyy") + "</p>";
            }

                table = @"<html>
                            <head>
                            </head>
                            <body>
                                 <br>
                                 <br>
                                <div class='header'>" + header + @"</div>
                                <hr class='line'>
                                <div class='lable'>" + subheader + @"</div>
                                <div class='mainData'>
                                <div class='lable'>" + fromDate + @"</div>
                                <div class='lable'>" + toDate + @"</div>
                                </div>
                                 <br><br>  
                                   <table align = 'center' >
                                    <tr>
                                        <th> ت.</th>
                                        <th>إسم الدواء العلمي</th>
                                        <th>إسم الدواء التجاري</th>
                                        <th>إجمالي الكمية المصروفة</th>
                                    </ tr >";
                sb.Append(table);

                foreach (var pat in data)
                {

                    sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                    <td>{1}</td>
                                    <td>{2}</td>
                                    <td>{3}</td>
                                  </tr>", counter, pat.MedEnName, pat.MedArName, pat.DispensedQuantity);
                    counter++;
                }



       
            sb.Append(@"
                                </table>
                            </body>
                        </html>");

            return sb.ToString();
        }

        //============تقرير إجمالي الأدوية المصروفة من الصيدلية
        private async Task<List<ReportProperties>> AllTotalMedicationsDispensedByPharmacy(int[] medids, int PHId, DateTime fromDateD, DateTime toDateD)
        {

            var query = from d in _db.Medications
                        from ph in _db.Pharmacies
                        from dismd in _db.DispensingMedication.Where(m => medids.Contains(m.MedId))
                        where (dismd.OrderState == 3 || dismd.OrderState == 4)
                            && ph.Id == dismd.PHId
                            && d.Id == dismd.MedId
                            && dismd.PHId == PHId
                            && (fromDateD == null || dismd.DispensDate >= fromDateD)
                            && (toDateD == null || dismd.DispensDate <= toDateD)

                        group dismd by new { d.MedArName, d.MedEnName, ph.PharmacyName, dismd.Notes,dismd.MedId } into g
                      orderby g.Key.MedEnName ascending
                        select new ReportProperties
                        {
                            MedArName = g.Key.MedArName,
                            MedEnName = g.Key.MedEnName,
                            PharmacyName = g.Key.PharmacyName,
                          //  PHId = g.Key.Id,
                            DispensedQuantity = g.Sum(d => d.DispensedQuantity)
                        };

            var result = query.ToList();

            return await Task.FromResult(result); ;
        }


    }
}

