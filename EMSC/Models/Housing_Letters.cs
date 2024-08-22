using System;

namespace EMSC.Models
{
    public class Housing_Letters
    {
        public int Id { get; set; }
        public int? TRID { get; set; }
        public int? PId { get; set; }
        public string LetterIndex { get; set; }
        public DateTime? LetterDate { get; set; }
        public string Attach { get; set; }
        public string UserId { get; set; }
        public DateTime? UserDate{ get; set; }
        public int HousingDone{ get; set; }
        public int CountryId{ get; set; }


    }
}
