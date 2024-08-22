using System;
using System.Collections.Generic;

namespace EMSC.Models
{
    public partial class SupervisorCountries
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int CountryId { get; set; }
    }
}
