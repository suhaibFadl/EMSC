using System;

namespace EMSC.ReportsCreator
{
    public class ReportProperties
    {
        public int Id { get; set; }
        public string PatientName { get; set; }
        public string PassportNo { get; set; }
        public string NationalNo { get; set; }
        public int PatientId { get; set; }


        public string MedArName { get; set; }
        public string MedEnName { get; set; }

        public int MedId { get; set; }
        public int RequestedQuantity { get; set; }
        public int OrderState { get; set; }
        public int DispensedQuantity { get; set; }
        public string RequestDate { get; set; }
        public string DispensDate { get; set; }
        public string Notes { get; set; }

        public string MangDispensDate { get; set; }
        public string MangDispensedAttach { get; set; }

        public string PrePrice { get; set; }
        public string PreDays { get; set; }
        public string PreDate { get; set; }
        public string ProvideDate { get; set; }
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public DateTime fromDateD { get; set; }
        public DateTime toDateD { get; set; }


        public string BranchName { get; set; }
        public string PharmacyName { get; set; }
        public int PHId { get; set; }
        public int pharmacyCol { get; set; }


        public int [] medids { get; set; }
        public int TotalMedids { get; set; }


        public int patNameCol { get; set; }
        public int passNomCol { get; set; }
        public int natNomCol { get; set; }
        public int dispensedDateCol { get; set; }
        public int dispensedQuantityCol { get; set; }
        public int requestDateCol { get; set; }
        public int requestQuantCol { get; set; }
        public int notesCol { get; set; }
        public int medEnMedicineCol { get; set; }
        public int medArMedicineCol { get; set; }
        public int prePriceCol { get; set; }
        public int preDaysCol { get; set; }
        public int preDateCol { get; set; }
        public int provideDateCol { get; set; }


        public int ReqId { get; set; }
        public int TotalPats { get; set; }
        public int reportType { get; set; }

    }
}
