using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class Medications
    {
        public int Id { get; set; }
        public string MedArName { get; set; }
        public string MedEnName { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
