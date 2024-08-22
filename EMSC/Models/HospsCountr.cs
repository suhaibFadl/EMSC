using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class HospsCountr
    {
        public int Id { get; set; }
        public string HospitalName { get; set; }
        public int? CountryId { get; set; }
        public string UserId { get; set; }
    }
}
