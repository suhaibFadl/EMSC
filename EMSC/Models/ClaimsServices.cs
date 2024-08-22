using System;

namespace EMSC.Models
{
    public class ClaimsServices
    {

        public int Id { get; set; }

        public int ClaimId { get; set; }
        public int ServId { get; set; }
        public string Price { get; set; }   
        public int Quantity { get; set; }
        public int AAllowed { get; set; }   
        public int Allowed { get; set; }   
        public string HospUserId { get; set; }   
        public DateTime? HospUserDate { get; set; }

        public string AgentUserId { get; set; }
        public DateTime? AgentUserDate { get; set; }

        public string AgentNotes { get; set; }

        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
        public DateTime? ServDate { get; set; }

        public string UserNotes { get; set; }

    }
}
