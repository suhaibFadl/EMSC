using System;

namespace EMSC.Models
{
    public class TravelingModel
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRId { get; set; }
        public string FlightNom { get; set; }
        public DateTime? FlightDate { get; set; }
        public string AirlineName { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public string UserRole { get; set; }
        public DateTime? UserDate { get; set; }

    }
}
