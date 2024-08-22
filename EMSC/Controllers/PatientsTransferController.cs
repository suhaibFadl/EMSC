using EMSC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace EMSC.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class PatientsTransferController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public PatientsTransferController(EMSCDBContext db)
        {
            _db = db;

        }

        [Authorize(Policy = "RequireHousingSupervisorRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsClosedFilesToTransferByCountryId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from mf in _db.MedicalFileStatus
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.CountryId == id && pd.Id == pt.PatientId
                          && pd.Id == mf.PatientId && pt.Id == mf.TRID
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && mf.UserId == n.Id 
                          orderby mf.Id descending
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              mf.UserId,
                              mf.Id,
                              mf.TRID,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              mf.Notes,
                              mf.FileStatus
                          }
                       ).ToList();
            return Ok(output);

        }

    }
}
