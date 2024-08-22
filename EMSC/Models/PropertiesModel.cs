using System;

namespace EMSC.Models
{
    public class PropertiesModel
    {
        public int Id { get; set; }

        public string PatientName { get; set; }
        public string PassportNo { get; set; }
        public string NationalNo { get; set; }

        public string MedArName { get; set; }
        public string MedEnName { get; set; }


        public int PatientId { get; set; }
        public int MedId { get; set; }
        public int RequestedQuantity { get; set; }
        public int OrderState { get; set; }
        public int DispensedQuantity { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? DispensDate { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }

    }
}
