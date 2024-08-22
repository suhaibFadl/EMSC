using System;

namespace EMSC.Models
{
    public class Pats_Tickets_Rejected
    {
        public int Id { get; set; }
        public int RefferId { get; set; }
        public int? TRId { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }

    }
}
