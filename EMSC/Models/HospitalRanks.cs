using System;

namespace EMSC.Models
{
    public class HospitalRanks
    {
        public int Id { get; set; }
        public string RankName { get; set; }
        public string RankPer { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
