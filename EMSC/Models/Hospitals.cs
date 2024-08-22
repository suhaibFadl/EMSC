using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class Hospitals
    {
        public int Id { get; set; }
        public string HospName { get; set; }
        public int CityId { get; set; }
        public int Rank { get; set; }
        public int ListId { get; set; }
    }
}
