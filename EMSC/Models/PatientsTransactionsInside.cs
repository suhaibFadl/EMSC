using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class PatientsTransactionsInside
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Attach { get; set; }
        public int LetterDest { get; set; }
        public string LetterIndexNO { get; set; }
        public DateTime? LetterDate { get; set; }
        public string UserId { get; set; }
        public int ReplyState { get; set; }
        public int? HospitalId { get; set; }
        public DateTime? UserDate { get; set; }
        public string MedicalDiagnosis { get; set; }
        public int FileStatus { get; set; }
        public int Approved { get; set; }

        public string UserApproved { get; set; }

        public DateTime? ApproveDate { get; set; }
    }
}
