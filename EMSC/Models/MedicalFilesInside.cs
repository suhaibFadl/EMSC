using System;

namespace EMSC.Models
{
    public class MedicalFilesInside
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRID { get; set; }
        public int FileState { get; set; }
        public DateTime? ClosingDate { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public string Attach { get; set; }

        public DateTime? UserDate { get; set; }
        public int HospId { get; set; }
    }
}
