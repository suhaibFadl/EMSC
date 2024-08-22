using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class PatientModel
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int PHId { get; set; }
        public string PatientName { get; set; }
        public string PassportNo { get; set; }
        public string NationalNo { get; set; }
        public string Attach { get; set; }
        public int LetterDest { get; set; }
        public string LetterIndexNO { get; set; }
        public string MedicalDiagnosis { get; set; }
        public DateTime? LetterDate { get; set; }
        public int PlcTreatment { get; set; }
        public string UserId { get; set; }
        public int? HospitalId { get; set; }
        public int? CountryId { get; set; }
        public int? ReplyState { get; set; }
        public DateTime? UserDate { get; set; }
        public int BranchId { get; set; }
        public int EventId { get; set; }
        public int DepenId { get; set; }
        public int PatType { get; set; }
        public int PersonType { get; set; }


        public int MedId { get; set; }
        public int RequestedQuantity { get; set; }
        public int OrderState { get; set; }
        public int DispensedQuantity { get; set; }
        public string Notes { get; set; }
        public string PersonAttach { get; set; }
        public string DispensedAttach { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? DispensDate { get; set; }
        public DateTime? MangDispensDate { get; set; }
        public string MangDispensedAttach { get; set; }
        public string LetterIndex { get; set; }
        public int FirstOpened { get; set; }
        public int CountRows { get; set; }

    }
}
