using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class RepliesManagement
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int TRId { get; set; }
        public int PlcTreatment { get; set; }
        public string Reply { get; set; }
        public DateTime? ReplyDate { get; set; }
        public string UserId { get; set; }
        public string CUserId { get; set; }
        public int ReplyState { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
