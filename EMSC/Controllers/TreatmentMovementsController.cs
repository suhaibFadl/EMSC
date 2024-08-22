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

    public class TreatmentMovementsController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public TreatmentMovementsController(EMSCDBContext db)
        {
            _db = db;
        }

        //============================ ADD Treatment Movement ========================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddTreatmentMovement([FromBody] TreatmentMovements formdata)
        {

            List<string> ErrorList = new List<string>();

            var newTreatmentMov = new TreatmentMovements
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                Medical_Diagnosis = formdata.Medical_Diagnosis,
                Date_Diagnosis = formdata.Date_Diagnosis,
                HospitalCountryId = formdata.HospitalCountryId,
                Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Treatment = 1
            };

            await _db.TreatmentMovements.AddAsync(newTreatmentMov);

            await _db.SaveChangesAsync();

            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId);
            var findPatient2 = _db.HotelMovements.FirstOrDefault(c => c.TRId == formdata.TRId);

            if (findPatient.Treatment == 0)
            {
                findPatient.FileStatus = 0;

                findPatient.Treatment = 1;

                findPatient2.Treatment = 1;
            }

            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            //bool attanExist = _db.PatientsTransactions.Any(a => a.Treatment == formdata.TRId);

            //if (attanExist)
            //{
            //    var findAttan = _db.PatientsTransactions.FirstOrDefault(c => c.Treatment == formdata.TRId);
            //    var findAttan2 = _db.HotelMovements.FirstOrDefault(c => c.TRId == findAttan.Id);

            //        findAttan.FileStatus = 0;
            //        findAttan2.Treatment = 1;

            //    _db.Entry(findAttan).State = EntityState.Modified;
            //    _db.Entry(findAttan2).State = EntityState.Modified;
            //    await _db.SaveChangesAsync();

            //}

            return Ok(new JsonResult("The Treatment Movement was Added Successfully"));

        }
        //============================================================================

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateTreatmentFieldWhenDelete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);
            var findPatient2 = _db.HotelMovements.FirstOrDefault(c => c.TRId == id);

            bool TRIDExistsInTreatment = _db.TreatmentMovements.Any(x => x.TRId == id);
            bool TRIDExistsInHotelMov = _db.HotelMovements.Any(y => y.TRId == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            if(!TRIDExistsInTreatment )
            {
                findPatient.Treatment = 0;
                findPatient2.Treatment = 0;
                findPatient.FileStatus = null;
            }

            else
            {
                findPatient.Treatment = 1;
                findPatient2.Treatment = 1;
                findPatient.FileStatus = 0;
            }
         
            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The Travle Field with id " + id + " is updated."));


        }

        //======================================Get Treatment Movement====================
        [HttpGet("[action]")]
        public IActionResult GetAllTreatmentMovements()
        {
            var output = (from tm in _db.TreatmentMovements
                         from h in _db.HospsCountr
                          join am in _db.PatientsData on tm.PatientId equals am.Id
                          from pt in _db.PatientsTransactions
                        //  from tp in _db.TravelingProcedures
                              //  join pt in _db.PatientsTransactions on hm.TRId equals pt.Id
                              //  join tp in _db.TravelingProcedures on hm.TRId equals tp.Id
                          where am.Id == tm.PatientId && am.Id == pt.PatientId && pt.Id == tm.TRId && tm.HospitalCountryId==h.Id
                          orderby tm.UserDate descending
                          select new
                          {
                              tm.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterIndexNO,
                              tm.Medical_Diagnosis,
                              tm.Date_Diagnosis,
                              tm.Attach,
                              tm.HospitalCountryId,
                              tm.PatientId,
                              tm.TRId,
                              tm.Treatment,
                              tm.UserDate,
                              tm.UserId,
                              h.HospitalName,
                              am.PersonType,
                              //tm.TPId,
                          }
                       ).ToList();
            return Ok(output);

        }
        
        //======================================Get Treatment Movement====================
        [HttpGet("[action]/{id}")]
        public IActionResult GetTreatmentMovementsByUserId([FromRoute] string id)
        {
            var output = (from tm in _db.TreatmentMovements
                          from h in _db.HospsCountr
                          join am in _db.PatientsData on tm.PatientId equals am.Id
                          from pt in _db.PatientsTransactions
                          where tm.UserId == id && am.Id == tm.PatientId && am.Id == pt.PatientId && pt.Id == tm.TRId && tm.HospitalCountryId == h.Id
                          select new
                          {
                              tm.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterIndexNO,
                              tm.Medical_Diagnosis,
                              tm.Date_Diagnosis,
                              tm.Attach,
                              tm.HospitalCountryId,
                              tm.PatientId,
                              tm.TRId,
                              tm.Treatment,
                              tm.UserDate,
                              tm.UserId,
                              h.HospitalName,
                              am.PersonType,
                          }
                       ).ToList();
            return Ok(output);

        }

        //============================ Update Treatment Movement ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateTreatmentMovement([FromRoute] int id, [FromBody] TreatmentMovements formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findTreatmentMov = _db.TreatmentMovements.FirstOrDefault(h => h.Id == id);

            if (findTreatmentMov == null)
            {
                return NotFound();
            }

            // If the Patient was found
            findTreatmentMov.PatientId = formdata.PatientId;
            findTreatmentMov.TRId = formdata.TRId;
            findTreatmentMov.Medical_Diagnosis = formdata.Medical_Diagnosis;
            findTreatmentMov.Date_Diagnosis = formdata.Date_Diagnosis;
            findTreatmentMov.Attach = formdata.Attach;
            findTreatmentMov.HospitalCountryId = formdata.HospitalCountryId;
            findTreatmentMov.UserId = formdata.UserId;
            findTreatmentMov.UserDate = DateTime.UtcNow;

            _db.Entry(findTreatmentMov).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The Patient with id " + id + " is updated his Treatment Movement"));

        }
        //=============================================================================

        //============================ Delete Hotel Movement ==============================
        //[AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteTreatmentMovement([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findTreat = _db.TreatmentMovements.FirstOrDefault(x => x.Id == id);


            _db.TreatmentMovements.Remove(findTreat);
            await _db.SaveChangesAsync();


            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == findTreat.TRId);
            var findPatient2 = _db.HotelMovements.FirstOrDefault(c => c.TRId == findTreat.TRId);

            bool TRIDExistsInTreatment = _db.TreatmentMovements.Any(x => x.TRId == findTreat.TRId);
            bool TRIDExistsInHotelMov = _db.HotelMovements.Any(y => y.TRId == findTreat.TRId);

            if (!TRIDExistsInTreatment)
            {
                findPatient.Treatment = 0;
                findPatient2.Treatment = 0;
                findPatient.FileStatus = null;
            }

            else
            {
                findPatient.Treatment = 1;
                findPatient2.Treatment = 1;
                findPatient.FileStatus = 0;
            }

            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Patient with id " + id + " is Deleted his Treatment Movement."));
        }

        //================================UpdateReplyState By Management==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateTreatmentFeild([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

             findPatient.Treatment = 0;

            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The ReplyState with id " + id + " is updated."));

        }

        //=============================================================================
        //=======================Get All Paitents===============================
        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionToTreatmentByCountryId([FromRoute] int id)
        {
            var output = (
                 from pd in _db.PatientsData
                 from n in _db.Users
                 from ho in _db.HotelMovements
                 join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                 join br in _db.Branches on pt.LetterDest equals br.Id
                 join c in _db.Countries on pt.CountryId equals c.Id
                 join rr in _db.Users on pt.UserId equals rr.Id
                 where pd.PersonType == 1 && pt.CountryId == id && pd.Id == pt.PatientId && pt.Id == ho.TRId &&
                 pt.CountryId == c.Id && pt.LetterDest == br.Id && pt.UserId == n.Id && 
                 pt.Hotel == 1 orderby ho.UserDate descending

                 select new
                 {
                     pt.PatientId,
                     pd.PatientName,
                     pd.PassportNo,
                     pd.NationalNo,
                     pt.LetterDate,
                     pt.LetterDest,
                     pt.Id,
                     pt.Travel,
                     pt.Treatment,
                     pt.LetterIndexNO,
                     pt.CountryId,
                     ho.UserId,
                     c.Country,
                     br.BranchName,
                     pt.MedicalDiagnosis,
                     pt.Attach,
                     n.PhoneNumber,
                     pt.FileStatus,
                     pd.PersonType

                 }
                              ).ToList();

            return Ok(output);

        }

        //=========================================================
        //======================================عرض الملفات الطبية للجرحى بالخارج
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByCountryId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          from b in _db.Branches                         
                          where pt.CountryId == id && pt.CountryId == c.Id && pd.PersonType ==1 &&
                          pt.LetterDest == b.Id && (pt.FileStatus == 0 || pt.FileStatus == 1 ||
                          pt.FileStatus == 2 || pt.FileStatus == 3 || pt.FileStatus == 4) && pd.Id == pt.PatientId 
                          orderby pt.UserDate descending
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
                              pt.Travel,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              pt.FileStatus,
                              b.BranchName,
                              pd.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }
        //======================================عرض الملفات الطبية للجرحى بالخارج الذين تم ادخالهم عن طريق لجنة الحصر
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByRoleId([FromRoute] string id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          from b in _db.Branches
                          from n in _db.Users
                          from ur in _db.UserRoles
                          from urs in _db.Roles
                          where ur.RoleId == id && ur.RoleId == urs.Id && ur.UserId == pt.UserId && pt.UserId == n.Id
                          && pt.CountryId == c.Id && pd.PersonType == 1 &&
                          pd.BranchId == b.Id && (pt.FileStatus == 0 || pt.FileStatus == 1 ||
                          pt.FileStatus == 2 || pt.FileStatus == 3 || pt.FileStatus == 4) && pd.Id == pt.PatientId
                          orderby pt.UserDate descending
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
                              pt.Travel,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              pt.FileStatus,
                              b.BranchName,
                              pd.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }
         //======================================Get Traveling Procedures For Branch
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByTrid([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.TreatmentMovements
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          join h in _db.HospsCountr on p.HospitalCountryId equals h.Id

                          where pt.Id == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId && p.HospitalCountryId == h.Id
                          && pt.Treatment == 1 orderby p.UserDate descending
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Travel,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              p.UserId,
                              p.Date_Diagnosis,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.HospitalCountryId,
                              p.Medical_Diagnosis,
                              p.UserDate,
                              c.Country,
                              h.HospitalName,
                              n.UserName,
                              b.BranchName,
                              n.PhoneNumber,
                              pt.FileStatus,
                              pt.PersonType,
                          }
                       ).ToList();
            return Ok(output);

        }//======================================Get Traveling Procedures For Branch

        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByBranchId([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from pt in _db.PatientsTransactions
                         from c in _db.Countries

                         where pt.LetterDest == id && pd.PersonType ==1 && pt.CountryId == c.Id && (pt.FileStatus == 0 || pt.FileStatus == 1 || pt.FileStatus == 2 || pt.FileStatus == 3 || pt.FileStatus == 4) && pd.Id == pt.PatientId
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
                             pt.Travel,
                             pt.Treatment,
                             pt.LetterIndexNO,
                             pt.FileStatus,
                             c.Country,
                             pd.PersonType
                         }
                      ).ToList();
            return Ok(output);
        }

        //======================================Get Traveling Procedures For Branch
           //=========================================================
        
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByUserId([FromRoute] string id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from p in _db.TreatmentMovements
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join h in _db.HospsCountr on p.HospitalCountryId equals h.Id
                          join rr in _db.Users on pt.UserId equals rr.Id
                          where pt.UserId == id && pd.Id == pt.PatientId && pt.CountryId == c.Id 
                          && p.HospitalCountryId == h.Id && p.TRId == pt.Id&& pt.LetterDest == br.Id
                          && p.UserId == n.Id &&
                          pt.Travel == 1 && pt.Treatment == 1
                          select new
                          {

                           //   pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                             // pt.PlcTreatment,
                              pt.ReplyState,
                              pt.Travel,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              p.UserId,
                              p.Date_Diagnosis,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.HospitalCountryId,
                              p.Medical_Diagnosis,
                              c.Country,
                              h.HospitalName,
                              n.UserName,
                              pt.FileStatus,
                              pt.PersonType,
                              p.UserDate

                          }
                              ).ToList();

            return Ok(output);

        }
        //======================================Get Traveling Procedures For Branch       

        //============================================================================== 

        [HttpGet("[action]")]
        public IActionResult GetAllTreatmentsProceduresManagement()
        {
            var output = (
                        from pd in _db.PatientsData
                        from pt in _db.PatientsTransactions
                        from c in _db.Countries
                        from b in _db.Branches

                        where pt.CountryId == c.Id && pt.LetterDest == b.Id && pd.PersonType ==1 &&
                        (pt.FileStatus == 0 || pt.FileStatus == 1 || pt.FileStatus == 2 || pt.FileStatus == 3 || pt.FileStatus == 4) && pd.Id == pt.PatientId
                       orderby pt.UserDate descending
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
                            pt.Travel,
                            pt.Treatment,
                            pt.LetterIndexNO,
                            pt.FileStatus,
                            c.Country,
                            b.BranchName,
                            pd.PersonType
                        }
                     ).ToList();
            return Ok(output);

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CloseMedicalFile([FromBody] MedicalFileStatus formdata)
        {

            List<string> ErrorList = new List<string>();

            var input = new MedicalFileStatus
            {
                PatientId = formdata.PatientId,
                TRID = formdata.TRID,
                FileStatus = formdata.FileStatus,
                Notes = formdata.Notes,
                ClosingDate = formdata.ClosingDate,
                UserId = formdata.UserId,
               
            };

            await _db.MedicalFileStatus.AddAsync(input);
            await _db.SaveChangesAsync();

            //الجريح
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRID);
            var findPatient2 = _db.RepliesManagement.FirstOrDefault(c => c.TRId == formdata.TRID);

            findPatient.FileStatus = formdata.FileStatus;
            findPatient.ReplyState = 5;
            findPatient2.ReplyState = 5;

            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            //المرافق

            //bool attanExist = _db.PatientsTransactions.Any(a => a.Treatment == formdata.TRID);

            //if (attanExist)
            //{
            //    var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == formdata.TRID);
            //    var findAtten2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

            //    findAtten.FileStatus = formdata.FileStatus;
            //    findAtten.ReplyState = 5;
            //    findAtten2.ReplyState = 5;
            //    _db.Entry(findAtten).State = EntityState.Modified;
            //    _db.Entry(findAtten2).State = EntityState.Modified;
            //    await _db.SaveChangesAsync();


            //    var input2 = new MedicalFileStatus
            //    {
            //        PatientId = (int)findAtten.PatientId,
            //        TRID = findAtten.Id,
            //        FileStatus = formdata.FileStatus,
            //        Notes = formdata.Notes,
            //        ClosingDate = formdata.ClosingDate,
            //        UserId = formdata.UserId,

            //    };

            //    await _db.MedicalFileStatus.AddAsync(input2);
            //    await _db.SaveChangesAsync();

            //}

            return Ok(new JsonResult("The Medical File was Closed Successfully"));

        }
        //============================================================================

        [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateReplyStatefile([FromRoute] int id, [FromBody] PatientsTransactions fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            // If the Patient was rejected by country
            if (fromdata.ReplyState == 4)
            {
                findPatient.ReplyState = 4;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            // If the Patient was accepted by country
            if (fromdata.ReplyState == 3)
            {
                findPatient.ReplyState = 3;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            return Ok(new JsonResult("The ReplyState with id " + id + " is updated."));

        }

        //============================================================================

        //[Authorize(Policy = "RequireHousingSupervisorRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsClosedFilesToTransferByCountryId([FromRoute] int id)
        {

            var output = (from pd in _db.PatientsData
                          from mf in _db.MedicalFileStatus
                          from n in _db.Users
                        
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          join detail in _db.Pats_Tickets_Rejected on pt.Id equals detail.TRId into ab
                          from a in ab.DefaultIfEmpty()
                        
                          where  pt.CountryId == id && pd.Id == pt.PatientId
                          && pd.Id == mf.PatientId && pt.Id == mf.TRID
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && mf.UserId == n.Id && pt.Travel == 1 && a.TRId == null
                          orderby mf.ClosingDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              mf.UserId,
                              mf.Notes,
                              mf.FileStatus,
                              mf.TRID,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              mf.ClosingDate,
                              pd.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }

        //===========================================عرض المعاملات التي تم رفضها من قبل مسؤول التسفير=================================

        //[Authorize(Policy = "RequireHousingSupervisorRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatsRejected([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from n in _db.Users
                          from mf in _db.MedicalFileStatus
                       //   from a in _db.Pats_Tickets_Rejected
                          from pf in _db.Pats_Referred
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          join detail in _db.Pats_Tickets_Rejected on pt.Id equals detail.TRId into ab
                          from a in ab.DefaultIfEmpty()

                          where pt.CountryId == id && pd.Id == pt.PatientId
                          && pd.Id == mf.PatientId && pt.Id == mf.TRID
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id && pt.Travel == 1
                           && pt.Id == pf.TRId && pd.Id == pf.PatientId && mf.UserId == n.Id
                          && pf.Rejected == 1  && pf.Id == a.RefferId
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              c.Country,
                              b.BranchName,
                              pt.PersonType,
                              a.Notes,
                              mf.UserId,
                              mf.FileStatus,
                              mf.TRID,
                              mf.ClosingDate,
                              n.PhoneNumber,

                          }
                       ).ToList();
            return Ok(output);

        }

        [HttpGet("[action]")]
        public IActionResult GetAllPatsRejected()
        {
            var output = (from pd in _db.PatientsData
                          from n in _db.Users
                          from mf in _db.MedicalFileStatus
                          from a in _db.Pats_Tickets_Rejected
                          from pf in _db.Pats_Referred
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pd.Id == pt.PatientId
                          && pd.Id == mf.PatientId && pt.Id == mf.TRID
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id && pt.Travel == 1
                          && pt.Id == a.TRId && pt.Id == pf.TRId && pf.Id == a.RefferId && pd.Id == pf.PatientId && mf.UserId == n.Id
                          && pf.TRId == a.TRId
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              c.Country,
                              b.BranchName,
                              pt.PersonType,
                              a.Notes,
                              mf.UserId,
                              mf.FileStatus,
                              mf.TRID,
                              mf.ClosingDate,
                              n.PhoneNumber

                          }
                       ).ToList();
            return Ok(output);

        }

        //============================================================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetTreatmentMovementsByPatientId([FromRoute] int id)
        {
            var output = (from tm in _db.TreatmentMovements
                          from h in _db.HospsCountr
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          join am in _db.PatientsData on tm.PatientId equals am.Id
                          where tm.PatientId == id && am.Id == tm.PatientId &&
                          am.Id == pt.PatientId && pt.Id == tm.TRId && tm.HospitalCountryId == h.Id 
                          && pt.CountryId == c.Id
                          select new
                          {
                              tm.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterIndexNO,
                              tm.Medical_Diagnosis,
                              tm.Date_Diagnosis,
                              tm.Attach,
                              tm.HospitalCountryId,
                              tm.PatientId,
                              tm.TRId,
                              tm.Treatment,
                              tm.UserDate,
                              tm.UserId,
                              h.HospitalName,
                              c.Country,
                              am.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }
        //============================================================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetPatOpenFilesByBranchId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from n in _db.Users
                          from hm in _db.HotelMovements
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pt.UserId == n.Id && hm.TRId == pt.Id
                          && pt.ReplyState == 3 && (pt.Travel == 1 || pt.Travel == 2 ) && pt.Hotel == 1 /*&& pt.FileStatus == 0*/
                          
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              c.Country,
                              n.PhoneNumber,
                              hm.EntryDate,
                              pt.Attach,
                              pt.PersonType,
                              pt.Travel
                          }
                       ).ToList();
            return Ok(output);

        }


  
        [HttpGet("[action]")]
        public IActionResult GetPatOpenFilesforManagement()
        {
            var output = (from pd in _db.PatientsData
                          from n in _db.Users
                          from hm in _db.HotelMovements
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pt.UserId == n.Id && hm.TRId == pt.Id
                          && pt.ReplyState == 3 && (pt.Travel == 1 || pt.Travel == 2 ) && pt.Hotel == 1 /*&& pt.FileStatus == 0*/
                          
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              hm.EntryDate,
                              pt.Attach,
                              pt.PersonType,
                              pt.Travel
                          }
                       ).ToList();
            return Ok(output);

        }
        //============================================================================

        //[Authorize(Policy = "RequireHousingSupervisorRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsInCountryByCountryId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.CountryId == id && pt.Travel != 0 && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pt.UserId == n.Id && (pt.ReplyState == 3 || pt.ReplyState == 5)
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.Treatment,
                              pt.LetterIndexNO,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              pt.FileStatus,
                              pt.Travel,
                              pt.ReplyState,
                              pt.Attach,
                              pt.Hotel,
                              pd.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> CloseMedicalFileByCommittees([FromBody] MedicalFileStatus formdata)
        {

            List<string> ErrorList = new List<string>();

            var input = new MedicalFileStatus
            {
                PatientId = formdata.PatientId,
                TRID = formdata.TRID,
                FileStatus = formdata.FileStatus,
                Notes = formdata.Notes,
                ClosingDate = formdata.ClosingDate,
                UserId = formdata.UserId,

            };

            await _db.MedicalFileStatus.AddAsync(input);
            await _db.SaveChangesAsync();

            //الجريح
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRID);
            var findPatient2 = _db.RepliesManagement.FirstOrDefault(c => c.TRId == formdata.TRID);

            findPatient.FileStatus = formdata.FileStatus;
            findPatient.ReplyState = 5;
            findPatient2.ReplyState = 5;

            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            var newTraveling = new TravelersBack
            {
                PatientId = formdata.PatientId,
                TRId = (int)formdata.TRID,
                FlightNom = "UTC187",
                FlightDate = formdata.ClosingDate,
                AirlineName = "الأجنحة الليبية",
              //  Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };

            await _db.TravelersBack.AddAsync(newTraveling);
            await _db.SaveChangesAsync();


                if (findPatient.Travel == 1)
                {
                    findPatient.Travel = 4;

                }

                else if (findPatient.Travel == 4)
                {
                    findPatient.Travel = 1;

                }

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Medical File was Closed Successfully"));

        }


        [HttpGet("[action]/{id}")]
        public IActionResult GetFileClosedDataByPatientId([FromRoute] int id)
        {
            var output = (
                            from mf in _db.MedicalFileStatus
                            where mf.TRID == id
                          select new
                          {
                              mf.FileStatus,
                              mf.ClosingDate,
                              mf.Notes,
                              mf.PatientId
                          }
                       ).ToList();
            return Ok(output);

        }


    }
}
