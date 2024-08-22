using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class PatientsTransactionsModel
    {
        public int Id { get; set; }
        public int TRID { get; set; }
        public int PatientId { get; set; }
        public string Attach { get; set; }
        public int LetterDest { get; set; }
        public int PersonType { get; set; }
        public string LetterIndexNO { get; set; }
        public DateTime? LetterDate { get; set; }
        public int PlcTreatment { get; set; }
        public string UserId { get; set; }
        public int ReplyState { get; set; }
        public int? CountryId { get; set; }
        public int? HospitalId { get; set; }
        public DateTime? UserDate { get; set; }
        public string MedicalDiagnosis { get; set; }
        public int Select { get; set; }

        public string PatientName { get; set; }
        public string PassportNo { get; set; }
        public string NationalNo { get; set; }
        public int BranchId { get; set; }
        public int EventId { get; set; }
        public int DepenId { get; set; }
        public int PatType { get; set; }
        public DateTime EntryDate { get; set; }
        public string EntryAttach { get; set; }
        public int HotelId { get; set; }
    }
}
