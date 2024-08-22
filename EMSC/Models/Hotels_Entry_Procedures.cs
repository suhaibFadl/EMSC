using System;

namespace EMSC.Models
{
    public class Hotels_Entry_Procedures
    {
        public int Id { get; set; }
        public int? TRID { get; set; }
        public int? HouLetterId { get; set; }
        public int? HotelId { get; set; }
        public int CountRenewals { get; set; }
        public DateTime? EntryDate { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
}
