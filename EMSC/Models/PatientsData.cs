using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class PatientsData
    {
        public int Id { get; set; }
        public string PatientName { get; set; }
        public string PassportNo { get; set; }
        public string NationalNo { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public int BranchId { get; set; }
        public int EventId { get; set; }
        public int DepenId { get; set; }
        public int PatType { get; set; }
        public int PersonType { get; set; }

    }
}
