using System;

namespace EMSC.Models
{
    public class Pats_Referred
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRId { get; set; }
        public int CountryId { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public int Rejected { get; set; }

    }
}
