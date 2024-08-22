using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace EMSC.Models
{
    public class MedicalFileStatus
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? TRID { get; set; }
        public int FileStatus { get; set; }
        public DateTime? ClosingDate { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }

    }
}
