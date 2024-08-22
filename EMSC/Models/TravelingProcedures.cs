using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class TravelingProcedures
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? TRId { get; set; }
        public int Travel { get; set; }
        public int Hotel { get; set; }
        public string FlightNom { get; set; }
        public DateTime? FlightDate { get; set; }
        public string AirlineName { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
