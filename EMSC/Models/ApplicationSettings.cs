using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Models
{
    public class ApplicationSettings
    {
        public string JWT_Secret { get; set; }
        public string Client_URL { get; set; }

        //public string Site { get; set; } //usually is the same with Audience
        //public string Audience { get; set; }  //our website
        //public string ExpireTime { get; set; }  // when the token expired
        //public string Secret { get; set; }  //secret key to token
    }
}
