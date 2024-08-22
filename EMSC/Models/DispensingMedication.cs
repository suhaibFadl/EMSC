using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class DispensingMedication
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int PHId { get; set; }
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
        public int FirstOpened  { get; set; }
        public string PrePrice  { get; set; }
        public string PreDays  { get; set; }
        public DateTime? PreDate { get; set; }
        public DateTime? ProvideDate { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
