using System;

namespace EMSC.Models
{
    public class Claims
    {
        public int Id { get; set; }
        public int BatchId { get; set; }
        public string BillNo { get; set; }

        public DateTime? BillDate { get; set; }
        public DateTime? EntryDate { get; set; }
        public DateTime? ExitDate { get; set; }
        public int ClaimType { get; set; }  //1 inpatient 2 outpatient
        public string ClaimTotal { get; set; }
        public string Allowed { get; set; }
        public string Rejected { get; set; }
        public int TRId { get; set; }
        public string Diagnosis { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }


    }
}
