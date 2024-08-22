using System;

namespace EMSC.Models
{
    public class TreatmentMovementsInside
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRId { get; set; }
        public string Medical_Diagnosis { get; set; }
        public DateTime? Date_Diagnosis { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public int HospitalId { get; set; }
        public int Treatment { get; set; }
       
    }
}
