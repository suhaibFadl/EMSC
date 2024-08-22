using System;

namespace EMSC.Models
{
    public class ServicesLists
    {
        public int Id { get; set; }
        public int ServId { get; set; }
        public int ListId { get; set; }
        public string ServPrice { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate { get; set; }

    }
}
