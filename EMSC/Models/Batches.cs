using System;

namespace EMSC.Models
{
    public class Batches
    {
        public int Id { get; set; }
        public int HospId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string IndexNo { get; set; }
        public int HospRank { get; set; }
        public int ClaimCounter { get; set; }
        public string TotalAmount { get; set; }
        public string Rejects { get; set; }
        public string Allowed { get; set; }
        public int UserId { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
