using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Helpers
{
    public class AppSettings
    {
        public string Site { get; set; } //useually is the same with Audience
        public string Audience { get; set; }  //our website
        public string ExpireTime { get; set; }  // when the token expired
        public string Secret { get; set; }  //secrete key to token
    }
}
