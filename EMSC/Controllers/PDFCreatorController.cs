using DinkToPdf;
using DinkToPdf.Contracts;
using EMSC.ReportsCreator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PDFCreatorController : ControllerBase
    {
        private IConverter _converter;
        private TemplateGeneratorMedicationsReports _templateGenerator;
        IWebHostEnvironment webHostEnvironment;

        private const string FontName = "Arimo, Arial, Helvetica, sans-serif";
        private const string CenterFooterText = "Page [page] of [toPage]";
        private const string RightFooterTextFormat = "تاريخ: {0}";
        private const int FontSize = 6;
        private const double Spacing = 10;

        public PDFCreatorController(IConverter converter, TemplateGeneratorMedicationsReports templateGenerator, IWebHostEnvironment environment)
        {
            _converter = converter;
            _templateGenerator = templateGenerator;
            webHostEnvironment = environment;
        }



        //=======تقرير كافة طلبات الأدوية ========
        [HttpPost("[action]")]
        public async Task<IActionResult> ReportAllReportsMedications([FromBody] ReportProperties re)
        {
            string fileName = Guid.NewGuid().ToString() + ".pdf";
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "ReportCreatedAt - " + DateTime.Now.ToString("yyyy-MM-dd"),
                Out = @".\wwwroot\PDFCreator\" + fileName
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,

                HtmlContent = await _templateGenerator.GetHTMLStringAllReportsMedications(re.MedId, re.PHId,
                re.OrderState,re.fromDate,re.toDate,re.fromDateD,re.toDateD, re.medEnMedicineCol, re.medArMedicineCol, re.pharmacyCol, re.patNameCol,
                re.natNomCol, re.passNomCol, re.requestQuantCol, re.requestDateCol,re.prePriceCol,re.preDaysCol,
                re.preDateCol,re.provideDateCol,re.dispensedQuantityCol, re.dispensedDateCol),
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "styles.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 7, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = {
                            FontSize = 8,
                            FontName = FontName,
                            Right = string.Format(RightFooterTextFormat, DateTime.UtcNow.ToString()),
                            Center = "مركز طب الطوارئ والدعم",
                          //  Spacing = Spacing,
                            Line=true
                        }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            _converter.Convert(pdf);

            // string filename = Guid.NewGuid().ToString() + ".pdf";

            var p = new Process();
            p.StartInfo = new ProcessStartInfo(globalSettings.Out)
            {
                UseShellExecute = true
            };

            //   return Ok(p.Start());

            return Ok(new JsonResult(fileName));
        }


        //=======تقرير كافة الأدوية التي تم استلامها من قبل الصيدلية او تم تسليمها للمستفيد========
        [HttpPost("[action]")]
        public async Task<IActionResult> ReportAllMedicationsDispensedByPharmacy([FromBody]  ReportProperties re)
        {
            string fileName = Guid.NewGuid().ToString() + ".pdf";
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "ReportCreatedAt - " + DateTime.Now.ToString("yyyy-MM-dd"),
                Out = @".\wwwroot\PDFCreator\" + fileName
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,

                HtmlContent = await _templateGenerator.GetHTMLStringAllMedicationsDispensedByPharmacyAndMang(re.medids,re.PHId,re.reportType),
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "styles.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 7, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = {
                            FontSize = 8,
                            FontName = FontName,
                            Right = string.Format(RightFooterTextFormat, DateTime.UtcNow.ToString()),
                            Center = "مركز طب الطوارئ والدعم",
                          //  Spacing = Spacing,
                            Line=true
                        }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            _converter.Convert(pdf);

            // string filename = Guid.NewGuid().ToString() + ".pdf";

            var p = new Process();
            p.StartInfo = new ProcessStartInfo(globalSettings.Out)
            {
                UseShellExecute = true
            };

           // return Ok (p.Start());

            return Ok(new JsonResult(fileName));
        }


        //=======تقرير الدواء الذي تم صرفه من قبل الصيدلية او المركز ولمن تم صرفه========
        [HttpPost("[action]")]
        public async Task<IActionResult> ReportAllPatsMedicationByPharmacy([FromBody] ReportProperties re)
        {
            string fileName = Guid.NewGuid().ToString() + ".pdf";
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "ReportCreatedAt - " + DateTime.Now.ToString("yyyy-MM-dd"),
                Out = @".\wwwroot\PDFCreator\" + fileName
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,

                HtmlContent = await _templateGenerator.GetHTMLStringAllPatsMedicationByPharmacy(re.PHId, re.MedId,
                re.OrderState,re.patNameCol,re.natNomCol,re.passNomCol,re.pharmacyCol, re.requestQuantCol,
                re.requestDateCol, re.dispensedQuantityCol, re.dispensedDateCol,re.notesCol),
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "styles.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 7, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = {
                            FontSize = 8,
                            FontName = FontName,
                            Right = string.Format(RightFooterTextFormat, DateTime.UtcNow.ToString()),
                            Center = "مركز طب الطوارئ والدعم",
                          //  Spacing = Spacing,
                            Line=true
                        }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            _converter.Convert(pdf);

            // string filename = Guid.NewGuid().ToString() + ".pdf";

            var p = new Process();
            p.StartInfo = new ProcessStartInfo(globalSettings.Out)
            {
                UseShellExecute = true
            };

           // return Ok(p.Start());

            return Ok(new JsonResult(fileName));
        }



        //=======تقرير الأدوية التي تم صرفها للمريض========
        [HttpPost("[action]")]
        public async Task<IActionResult> ReportAllMedicationsDispensingForPatient([FromBody] ReportProperties re)
        {
            string fileName = Guid.NewGuid().ToString() + ".pdf";
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "ReportCreatedAt - " + DateTime.Now.ToString("yyyy-MM-dd"),
                Out = @".\wwwroot\PDFCreator\" + fileName
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,

                HtmlContent = await _templateGenerator.GetHTMLStringAllMedicationsDispensingForPatient(re.PHId,
                re.OrderState, re.PatientId,re.medEnMedicineCol, re.medArMedicineCol,
                re.pharmacyCol, re.requestQuantCol, re.requestDateCol,re.dispensedQuantityCol, re.dispensedDateCol,re.notesCol),
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "styles.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 7, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = {
                            FontSize = 8,
                            FontName = FontName,
                            Right = string.Format(RightFooterTextFormat, DateTime.UtcNow.ToString()),
                            Center = "مركز طب الطوارئ والدعم",
                          //  Spacing = Spacing,
                            Line=true
                        }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            _converter.Convert(pdf);

            // string filename = Guid.NewGuid().ToString() + ".pdf";

            var p = new Process();
            p.StartInfo = new ProcessStartInfo(globalSettings.Out)
            {
                UseShellExecute = true
            };

            //   return Ok(p.Start());

            return Ok(new JsonResult(fileName));
        }

        //=======تقرير الأدوية المصروفة من قبل الصيدلية أو المركز========
        [HttpPost("[action]")]
        public async Task<IActionResult> ReportAllTotalMedicationsDispensesByPharmacy([FromBody] ReportProperties re)
        {
            string fileName = Guid.NewGuid().ToString() + ".pdf";
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "ReportCreatedAt - " + DateTime.Now.ToString("yyyy-MM-dd"),
                Out = @".\wwwroot\PDFCreator\" + fileName
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,

                HtmlContent = await _templateGenerator.GetHTMLStringAllTotalMedicationsDispensedByPharmacy(re.medids, re.PHId, re.fromDateD, re.toDateD),
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "styles.css") },
                HeaderSettings = { FontName = "Arial", FontSize = 7, Right = "Page [page] of [toPage]", Line = true },
                FooterSettings = {
                            FontSize = 8,
                            FontName = FontName,
                            Right = string.Format(RightFooterTextFormat, DateTime.UtcNow.ToString()),
                            Center = "مركز طب الطوارئ والدعم",
                          //  Spacing = Spacing,
                            Line=true
                        }
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            _converter.Convert(pdf);

            // string filename = Guid.NewGuid().ToString() + ".pdf";

            var p = new Process();
            p.StartInfo = new ProcessStartInfo(globalSettings.Out)
            {
                UseShellExecute = true
            };

            //   return Ok(p.Start());

            return Ok(new JsonResult(fileName));
        }

    }
}
