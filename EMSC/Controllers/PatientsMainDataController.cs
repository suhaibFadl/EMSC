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
    public class PatientsMainDataController : ControllerBase
    {
        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public PatientsMainDataController(EMSCDBContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }


        private bool iswork = false;
        //============================ ADD Patient ==============================
        // [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddPatient([FromBody] PatientModel formdata)
        {
            // var newPatient = new PatientsData();

            List<string> ErrorList = new List<string>();

            if (formdata.PersonType == 1)
            {
                var newPatient = new PatientsData
                {
                    PatientName = formdata.PatientName,
                    PassportNo = formdata.PassportNo,
                    NationalNo = formdata.NationalNo,
                    UserId = formdata.UserId,
                    UserDate = DateTime.UtcNow,
                    BranchId = formdata.BranchId,
                    PatType = formdata.PatType,
                    DepenId = formdata.DepenId,
                    EventId = formdata.EventId,
                    PersonType = formdata.PersonType,
                };
                bool clientPassportNoExists = _db.PatientsData.Any(x => x.PassportNo == newPatient.PassportNo);
                bool clientNationalNoExists = _db.PatientsData.Any(x => x.NationalNo == newPatient.NationalNo && newPatient.NationalNo != "000000000000");


                if (!clientPassportNoExists && !clientNationalNoExists)
                {
                    await _db.PatientsData.AddAsync(newPatient);
                    await _db.SaveChangesAsync();

                    return Ok(new JsonResult("The Patient was Added Successfully"));
                }
                else
                {
                    return BadRequest(new JsonResult("The Passport Number or National Number is already exist"));

                }
            }

            if (formdata.PersonType == 2 || formdata.PersonType == 3)
            {
                var newPatient = new PatientsData
                {
                    PatientName = formdata.PatientName,
                    PassportNo = formdata.PassportNo,
                    NationalNo = formdata.NationalNo,
                    UserId = formdata.UserId,
                    UserDate = DateTime.UtcNow,
                    BranchId = formdata.BranchId,
                    PatType = 0,
                    DepenId = 99,
                    EventId = 12,
                    PersonType = formdata.PersonType,
                };

                bool clientPassportNoExists = _db.PatientsData.Any(x => x.PassportNo == newPatient.PassportNo);
                bool clientNationalNoExists = _db.PatientsData.Any(x => x.NationalNo == newPatient.NationalNo && newPatient.NationalNo != "000000000000");


                if (!clientPassportNoExists && !clientNationalNoExists)
                {
                    await _db.PatientsData.AddAsync(newPatient);
                    await _db.SaveChangesAsync();

                    return Ok(new JsonResult("The Patient was Added Successfully"));
                }
                else
                {
                    return BadRequest(new JsonResult("The Passport Number or National Number is already exist"));

                }
            }

            else
            {
                return BadRequest(new JsonResult("The Passport Number or National Number is already exist"));
            }

        }


        //============================ Update Patient ==============================
     //   [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdatePatientData([FromRoute] int id, [FromBody] PatientModel formdata)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsData.FirstOrDefault(p => p.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            List<string> ErrorList = new List<string>();

            findPatient.PatientName = formdata.PatientName;
            findPatient.PassportNo = formdata.PassportNo;
            findPatient.NationalNo = formdata.NationalNo;
            findPatient.UserId = findPatient.UserId;
            findPatient.UserDate = DateTime.UtcNow;
            findPatient.BranchId = formdata.BranchId;
            findPatient.PatType = formdata.PatType;
            findPatient.DepenId = formdata.DepenId;
            findPatient.EventId = formdata.EventId;

            bool clientPassportNoExists = _db.PatientsData.Any(x => x.PassportNo == findPatient.PassportNo && x.Id != id);
            bool clientNationalNoExists = _db.PatientsData.Any(x => x.NationalNo == findPatient.NationalNo && findPatient.NationalNo != "000000000000" && x.Id != id);

            if (clientPassportNoExists || clientNationalNoExists)

            {
                return BadRequest(new JsonResult("The Passport Number or National Number is already exist"));
            }

            else
            {
                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Patient was Updated Successfully"));
            }
        }


        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateAppendPatientData([FromRoute] int id, [FromBody] PatientModel formdata)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsData.FirstOrDefault(p => p.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            List<string> ErrorList = new List<string>();

            findPatient.PatientName = formdata.PatientName;
            findPatient.PassportNo = formdata.PassportNo;
            findPatient.NationalNo = formdata.NationalNo;
            findPatient.UserId = findPatient.UserId;
            findPatient.UserDate = DateTime.UtcNow;
            findPatient.BranchId = formdata.BranchId;
            findPatient.PatType = formdata.PatType;
            findPatient.DepenId = formdata.DepenId;
            findPatient.EventId = formdata.EventId;



            bool clientPassportNoExists = _db.PatientsData.Any(x => x.PassportNo == findPatient.PassportNo && x.Id != id);
            bool clientNationalNoExists = _db.PatientsData.Any(x => x.NationalNo == findPatient.NationalNo && x.Id != id && findPatient.NationalNo != "000000000000");

            if (clientPassportNoExists || clientNationalNoExists)

            {
                return BadRequest(new JsonResult("The Passport Number or National Number is already exist"));
            }

            else
            {
                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Patient was Updated Successfully"));
            }
        }

        //=======================Delete Patient Data==================================

        //  [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeletePatientData([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findPatient = await _db.PatientsData.FindAsync(id);

            bool findPatientTransactionInside = _db.PatientsTransactionsInside.Any(SC => SC.PatientId == id);

            if (findPatientTransactionInside)
                return BadRequest(new JsonResult("لا يمكن الجريح لارتباطها ببيانات أخرى"));


            bool findPatientTransactionOutside = _db.PatientsTransactions.Any(PT => PT.PatientId == id);

            if (findPatientTransactionOutside)
                return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));


            bool findPatientDispensingMedication = _db.DispensingMedication.Any(PT => PT.PatientId == id);

            if (findPatientDispensingMedication)
                return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));

            //bool findReplyPatientTransactionOutside = _db.RepliesManagement.Any(PT => PT.PatientId == id);

            //if (findReplyPatientTransactionOutside)
            //    return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));

            //bool findTravelPatientTransactionOutside = _db.TravelingProcedures.Any(PT => PT.PatientId == id);

            //if (findTravelPatientTransactionOutside)
            //    return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));

            //bool findTreatmentPatientTransactionOutside = _db.TreatmentMovements.Any(PT => PT.PatientId == id);

            //if (findTreatmentPatientTransactionOutside)
            //    return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));

            //=========================================================

            else
            {
                _db.PatientsData.Remove(findPatient);

                await _db.SaveChangesAsync();
                return Ok(new JsonResult("The patient with id " + id + " is Deleted."));

            }
        }


        //=======================Get All Patients Main Data For Management==================================
      //  [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]")]
        public IActionResult GetAllPatientsMainData()
        {

            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          from u in _db.Users
                          from dep in _db.Dependency
                          from inj in _db.InjuryEvents
                          where pd.BranchId == b.Id
                          && pd.UserId == u.Id && pd.DepenId == dep.Id && pd.EventId == inj.Id
                          orderby pd.UserDate descending
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              b.BranchName,
                              u.PhoneNumber,
                              pd.PatType,
                              dep.DependencyType,
                              inj.Event,
                              pd.EventId,
                              pd.DepenId,
                              pd.PersonType,
                              pd.BranchId,
                              pd.UserDate,
                              pd.UserId

                          }
                              ).ToList();


            return Ok(output);
        }


        //=======================Get All Patients Main Data For Tripoli Branch==================================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]")]
        public IActionResult GetAllPatientsMainDataTripoliBranch()
        {

            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          from u in _db.Users
                          from dep in _db.Dependency
                          from inj in _db.InjuryEvents
                          where pd.BranchId == b.Id
                          && pd.UserId == u.Id && pd.DepenId == dep.Id && pd.EventId == inj.Id && pd.PersonType == 1
                          orderby pd.UserDate descending
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              b.BranchName,
                              u.PhoneNumber,
                              pd.PatType,
                              dep.DependencyType,
                              inj.Event,
                              pd.EventId,
                              pd.DepenId,
                              pd.PersonType,
                              pd.BranchId,
                              pd.UserDate

                          }
                              ).ToList();


            return Ok(output);
        }


        //=======================Get Patients Main Data By UserId===============================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsMainDataByUserId([FromRoute] string id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          from u in _db.Users
                          from dep in _db.Dependency
                          from inj in _db.InjuryEvents
                          where pd.UserId == id && pd.UserId == u.Id &&
                          pd.BranchId == b.Id && pd.DepenId == dep.Id && pd.EventId == inj.Id
                          orderby pd.UserDate descending
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              b.BranchName,
                              pd.BranchId,
                              pd.PatType,
                              dep.DependencyType,
                              inj.Event,
                              pd.EventId,
                              pd.DepenId,
                              pd.PersonType,
                              pd.UserDate
                          }
                              ).ToList();


            return Ok(output);
        }

        //=======================Get All Paitents By BranchId===============================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsMainDataByBranchId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from dep in _db.Dependency
                          from inj in _db.InjuryEvents
                          where pd.BranchId == id && b.Id == pd.BranchId &&
                          pd.UserId == n.Id && pd.EventId == inj.Id && pd.DepenId == dep.Id
                          orderby pd.UserDate descending
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              n.PhoneNumber,
                              pd.UserId,
                              pd.PatType,
                              dep.DependencyType,
                              inj.Event,
                              pd.EventId,
                              pd.DepenId,
                              pd.PersonType,
                              pd.UserDate

                          }
                              ).ToList();

            return Ok(output);
        }
        //=========================================================================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllReplyStateForPID([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from br in _db.BranchesUsers
                          from pt in _db.PatientsTransactions
                          from n in _db.Users
                          from b in _db.Branches
                          where pt.PatientId == id && pt.PatientId == pd.Id &&
                          br.UserId == pd.UserId && b.Id == br.BranchId
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              br.BranchId,
                              n.PhoneNumber,
                              pd.UserId,
                              pd.UserDate
                          }
                              ).ToList();

            return Ok(output);
        }

        //=======================Get All Paitents By BranchId===============================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsMainDataByCountryId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from br in _db.BranchesUsers
                          from n in _db.Users
                          from b in _db.Branches
                          from dep in _db.Dependency
                          from inj in _db.InjuryEvents
                          where pd.BranchId == id && br.UserId == pd.UserId && b.Id == br.BranchId &&
                          pd.UserId == n.Id && br.UserId == n.Id &&
                          pd.DepenId == dep.Id && pd.EventId == inj.Id
                          orderby pd.UserDate descending
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              br.BranchId,
                              n.PhoneNumber,
                              pd.UserId,
                              pd.PatType,
                              dep.DependencyType,
                              inj.Event,
                              pd.EventId,
                              pd.DepenId,
                              pd.PersonType,
                              pd.UserDate
                          }
                              ).ToList();

            return Ok(output);
        }
      
        //=======================Get Patients Main Data By patient id===============================
       // [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsMainDataByPatientId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          from u in _db.Users
                          from dep in _db.Dependency
                          from inj in _db.InjuryEvents
                          where pd.Id == id && pd.UserId == u.Id &&
                          pd.BranchId == b.Id && pd.DepenId == dep.Id && pd.EventId == inj.Id
                          orderby pd.UserDate descending
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              b.BranchName,
                              pd.BranchId,
                              pd.PatType,
                              dep.DependencyType,
                              inj.Event,
                              pd.EventId,
                              pd.DepenId,
                              pd.PersonType,
                              pd.UserDate

                          }
                              ).ToList();


            return Ok(output);
        }


        //=======================Get All Paitents By BranchId===============================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllAttendByBranchId([FromRoute] int id)
        {

            var output = (
             from pd in _db.PatientsData
             join b in _db.Branches on pd.BranchId equals b.Id
             join detail in _db.PatientsTransactions on pd.Id equals detail.PatientId into ab
             from a in ab.DefaultIfEmpty()

             where pd.BranchId == id && b.Id == pd.BranchId && pd.PersonType == 2 && (a.PatientId == null || a.ReplyState == 1 || a.ReplyState == 4 || a.ReplyState == 5)    
             select new
             {
                 pd.PatientName,
                 pd.PassportNo,
                 pd.NationalNo,
                 pd.PersonType,
                 a.PatientId
             }).ToList();

            return Ok(output);
        }


        [HttpGet("[action]")]
        public IActionResult GetAllAttends()
        {

            var output = (
             from pd in _db.PatientsData
             join b in _db.Branches on pd.BranchId equals b.Id
             join detail in _db.PatientsTransactions on pd.Id equals detail.PatientId into ab
             from a in ab.DefaultIfEmpty()

             where  b.Id == pd.BranchId && pd.PersonType == 2 && (a.PatientId == null || a.ReplyState == 1 || a.ReplyState == 4 || a.ReplyState == 5)
             select new
             {
                 pd.PatientName,
                 pd.PassportNo,
                 pd.NationalNo,
                 pd.PersonType,
                 a.PatientId
             }).ToList();

            return Ok(output);
        }

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatByBranchId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from b in _db.Branches
                          where pd.BranchId == id && pt.PatientId == pd.Id && pt.LetterDest == id &&
                          b.Id == pd.BranchId && pd.PersonType == 1
                          orderby pd.PatientName
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pd.PersonType
                          }
                              ).ToList();

            return Ok(output);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllAttendByUserId([FromRoute] string id)
        {

            var output = (
             from pd in _db.PatientsData
             join b in _db.Branches on pd.BranchId equals b.Id
             join detail in _db.PatientsTransactions on pd.Id equals detail.PatientId into ab
             from a in ab.DefaultIfEmpty()

             where pd.UserId == id && b.Id == pd.BranchId && pd.PersonType == 2 && (a.PatientId == null || a.ReplyState == 1 || a.ReplyState == 4 || a.ReplyState == 5)
             select new
             {
                 pd.PatientName,
                 pd.PassportNo,
                 pd.NationalNo,
                 pd.PersonType,
                 a.PatientId
             }).ToList();

            return Ok(output);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatByUserId([FromRoute] string id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from b in _db.Branches
                          where pd.UserId == id && pt.PatientId == pd.Id  &&
                          b.Id == pd.BranchId && pd.PersonType == 1
                          orderby pd.PatientName
                          select new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pd.PersonType
                          }
                              ).ToList();

            return Ok(output);
        }

        //عرض كافة الجرحى  للفرع الرئيسي والذين لديهم رسائل

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllPats()
        {

            var output = await (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from d in _db.Dependency
                          from inj in _db.InjuryEvents
                          from b in _db.Branches
                          where  pt.PatientId == pd.Id && 
                          b.Id == pd.BranchId && pd.PersonType == 1
                          && d.Id == pd.DepenId && inj.Id == pd.EventId
                          orderby pd.PatientName
                          select  new
                          {
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pd.PersonType,
                              pd.DepenId,pd.EventId,pd.PatType,
                              d.DependencyType,inj.Event,
                              b.BranchName
                          }
                              ).ToListAsync();

           //  await output.ToList();


            return Ok(output);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetDataByName([FromRoute] string id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          where pd.PatientName == id && b.Id == pd.BranchId && pd.PersonType == 2
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pd.PersonType
                          }
                              ).ToList();

            return Ok(output);

        }


        [HttpGet("[action]/{id}")]
        public IActionResult GetDataByPassport([FromRoute] string id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          where pd.PassportNo == id && b.Id == pd.BranchId && pd.PersonType == 2
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pd.PersonType
                          }
                              ).ToList();

            return Ok(output);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetDataByNational([FromRoute] string id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from b in _db.Branches
                          where pd.NationalNo == id && b.Id == pd.BranchId && pd.PersonType == 2
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pd.PersonType
                          }
                              ).ToList();

            return Ok(output);
        }



    }
}
