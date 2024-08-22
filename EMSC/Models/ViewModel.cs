using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class ViewModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        //   public string JobDescription { get; set; }
        public string Role { get; set; }
        public string PhoneNumber { get; set; }
        public int BranchId { get; set; }
        public int HospitalId { get; set; }
        public int PharmacyId { get; set; }
    }
}
