using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class PatientsTransactions
    {
        public int Id { get; set; }
        public int? PatientId { get; set; }
        public string Attach { get; set; }
        public int LetterDest { get; set; }
        public int PersonType { get; set; }
        public string LetterIndexNO { get; set; }
        public DateTime? LetterDate { get; set; }
       // public int PlcTreatment { get; set; }
        public string UserId { get; set; }
        public int ReplyState { get; set; }
        public int? CountryId { get; set; }
        public int? Travel { get; set; }
        public int? Hotel { get; set; }
        public int? Treatment { get; set; }
        public int? FileStatus { get; set; }
        public DateTime? UserDate { get; set; }
        public string MedicalDiagnosis { get; set; }


    }
}
