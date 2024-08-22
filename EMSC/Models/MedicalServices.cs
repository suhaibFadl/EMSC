using System;

namespace EMSC.Models
{
    public class MedicalServices
    {
        public int Id { get; set; }
        public string ServArName { get; set; }
        public string ServEnName { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }
    }
}
