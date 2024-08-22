using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class Patients
    {
        public int Id { get; set; }
        public string PatientName { get; set; }
        public string PassportNo { get; set; }
        public string NationalNo { get; set; }
        public string Attach { get; set; }
        public int LetterDest { get; set; }
        public string LetterIndexNO { get; set; }
        public DateTime? LetterDate { get; set; }
        public int PlcTreatment { get; set; }
        public string UserId { get; set; }
        public int ReplyState { get; set; }
    }
}
