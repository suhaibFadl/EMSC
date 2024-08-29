using EMSC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace EMSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ReplyHospitalController : ControllerBase
    {
        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public ReplyHospitalController(EMSCDBContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ReplyOnBranchByManagementInside([FromBody] RepliesHospitals fromdata, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findReply = _db.RepliesHospitals.FirstOrDefault(r => r.TRId == id);

            if (findReply == null)
            {
                return NotFound();
            }

            // If the reply was found
            findReply.ReplyState = fromdata.ReplyState;
            findReply.Reply = fromdata.Reply;
            findReply.ReplyDate = DateTime.UtcNow;
            findReply.UserId = fromdata.UserId;
            findReply.UserDate = DateTime.UtcNow;


            _db.Entry(findReply).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            var findPatient = _db.PatientsTransactionsInside.FirstOrDefault(c => c.Id == id);
            findPatient.FileStatus = 1;
            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply with id " + id + " is updated ."));
        }

        //==============================================================================

        [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateReplyStateInside([FromRoute] int id, [FromBody] PatientsTransactionsInside fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactionsInside.FirstOrDefault(c => c.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            // If the Patient was accepted by management
            if (fromdata.ReplyState == 2)
            {
                findPatient.ReplyState = 2;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            // If the Patient was rejected by management

            if (fromdata.ReplyState == 1)
            {
                findPatient.ReplyState = 1;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }


            return Ok(new JsonResult("The ReplyState with id " + id + " is updated."));

        }

        //======================================================================================

        [AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteReplyInside([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the reply

            var findReply = _db.RepliesHospitals.FirstOrDefault(r => r.TRId == id);

            if (findReply == null)
            {
                return NotFound();
            }

            _db.RepliesHospitals.Remove(findReply);

            await _db.SaveChangesAsync();

            // Finally return the result to client
            return Ok(new JsonResult("The mail with id " + id + " is Deleted."));
        }

        //======================================================================================


        [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ReplyOnBranchByHospitalInside([FromBody] RepliesHospitals fromdata, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findReply = _db.RepliesHospitals.FirstOrDefault(r => r.TRId == id);

            if (findReply == null)
            {
                return NotFound();
            }

            // If the reply was found
            findReply.ReplyState = 1;
            findReply.Reply = fromdata.Reply;
            findReply.ReplyDate = DateTime.UtcNow;
            findReply.UserId = fromdata.UserId;
            findReply.UserDate = DateTime.UtcNow;
            findReply.EntryDate = fromdata.EntryDate;
            findReply.FileNo = fromdata.FileNo;


            _db.Entry(findReply).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            var findLetter = _db.PatientsTransactionsInside.FirstOrDefault(h => h.Id == id);
            findLetter.FileStatus = 0;
            findLetter.ReplyState = 1;

            _db.Entry(findLetter).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply with id " + id + " is updated ."));
        }


        //======================================================================================
        [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateReplyStateByHospital([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactionsInside.FirstOrDefault(h => h.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }
          
            // If the Patient was accepted by hospital          
                findPatient.ReplyState = 1;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            return Ok(new JsonResult("The ReplyState with id " + id + " is updated."));

        }

        //======================================================================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetRepliesAcceptedByHospitalforBranch([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from r in _db.RepliesHospitals
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join h in _db.Hospitals on pt.HospitalId equals h.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId && pt.HospitalId == h.Id
                          && pt.UserId == n.Id && pt.Id == r.TRId
                          orderby pt.Id descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                             // pt.Attach,
                              pt.LetterIndexNO,
                              pt.HospitalId,
                              pt.UserId,
                              h.HospName,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              r.Reply,
                              r.EntryDate,
                              r.ReplyDate
                          }
                              ).ToList();

            return Ok(output);

        }

        //======================================================================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetRepliesByHospitalId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from r in _db.RepliesHospitals
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join h in _db.Hospitals on pt.HospitalId equals h.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.HospitalId == id && pt.ReplyState == 1 && r.ReplyState == 1
                          && pd.Id == pt.PatientId && pt.HospitalId == h.Id
                          && pt.UserId == n.Id && pt.Id == r.TRId 
                          orderby r.ReplyDate descending
                          select new
                          {
                              r.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              //pt.Attach,
                              pt.LetterIndexNO,
                              pt.HospitalId,
                              pt.UserId,
                              b.BranchName,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              r.Reply,
                              r.EntryDate,
                              r.ReplyDate,
                              r.TRId
                          }
                              ).ToList();

            return Ok(output);

        }


        [AllowAnonymous]
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateReplyByHospitalInside([FromBody] RepliesHospitals fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.RepliesHospitals.FirstOrDefault(c => c.Id == fromdata.Id);

            if (findPatient == null)
            {
                return NotFound();
            }

            findPatient.Reply = fromdata.Reply;
            findPatient.EntryDate = fromdata.EntryDate;
            findPatient.UserId = fromdata.UserId;
            findPatient.UserDate = DateTime.UtcNow;
                  
            _db.Entry(findPatient).State = EntityState.Modified;              
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply with id  is updated."));

        }
    }
}
