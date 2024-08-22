using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class RepliesBr
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Reply { get; set; }
        public DateTime? ReplyDate { get; set; }
        public string UserId { get; set; }
        public int ReplyState { get; set; }
        public int TRId { get; set; }
    }
}
