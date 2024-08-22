using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class RepliesHospitals
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRId { get; set; }
        public string Reply { get; set; }
        public DateTime? ReplyDate { get; set; }
        public string UserId { get; set; }
        public int ReplyState { get; set; }
        public DateTime? UserDate { get; set; }
        public DateTime? EntryDate { get; set; }
        public string FileNo { get; set; }
    }
}
