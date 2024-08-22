using System;

namespace EMSC.Models
{
    public class Hotels_Leaving_Procedures
    {
        public int Id { get; set; }
        public int? TRID { get; set; }
        public int? HouLetterId { get; set; }
        public int HotelEntryId { get; set; }
        public DateTime? LeavingDate { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }

    }
}
