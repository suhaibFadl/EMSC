using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class HotelMovements
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRId { get; set; }
        public int TPId { get; set; }
        public string HotelName { get; set; }
        public DateTime? EntryDate { get; set; }
        public DateTime? LeavingDate { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public string Attach { get; set; }
        public int Treatment { get; set; }
        public int HotelId { get; set; }
    }
}
