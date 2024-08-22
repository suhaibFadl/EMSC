using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class PatientHosp
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? HospitalId { get; set; }
        public string FileNo { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public DateTime? OpenDate { get; set; }
    }
}
