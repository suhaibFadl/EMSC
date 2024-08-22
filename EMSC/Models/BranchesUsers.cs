using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class BranchesUsers
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int BranchId { get; set; }
        public int HospitalId { get; set; }
    }
}
