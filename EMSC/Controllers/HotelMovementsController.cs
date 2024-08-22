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

    public class HotelMovementsController : ControllerBase
    {

        private readonly EMSCDBContext _db;

        public HotelMovementsController(EMSCDBContext db)
        {
            _db = db;
        }

        //============================ ADD Hotel Movement ========================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHotelMovement([FromBody] HotelMovesModel formdata)
        {

            List<string> ErrorList = new List<string>();

            var newHotelMov = new HotelMovements
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                TPId = formdata.TPId,
                EntryDate = formdata.EntryDate,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Attach = formdata.Attach,
                Treatment = 0,
                HotelId = formdata.HotelId,

            };

           // bool ExistTrid = _db.HotelMovements.Any(x => x.TRId == formdata.TRId);

            //التحقق من أن إجراءات الدخول لمرافق
           // bool attanExist = _db.PatientsTransactions.Any(a => a.Treatment == newHotelMov.TRId);


            bool findAttend = _db.PatientsTransactions.Any(c => c.Id == formdata.TRId && c.PersonType == 2);


            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId);
            var findPatient2 = _db.TravelingProcedures.FirstOrDefault(x => x.TRId == formdata.TRId);


                    await _db.HotelMovements.AddAsync(newHotelMov);
                    await _db.SaveChangesAsync();

                    if (findPatient.Hotel == 0 || findPatient2.Hotel == 0)
                    {
                        findPatient.Hotel = 1;
                        findPatient2.Hotel = 1;

                    }

                    else if (findPatient.Hotel == 1 || findPatient2.Hotel == 1)
                    {
                        findPatient.Hotel = 0;
                        findPatient2.Hotel = 0;

                    }

                    _db.Entry(findPatient).State = EntityState.Modified;
                    _db.Entry(findPatient2).State = EntityState.Modified;
                    await _db.SaveChangesAsync();


            if (findAttend)
            {
                var findAttendExist = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId && c.PersonType == 2);

                var findAtten = _db.PatientsTransactions
                    .OrderByDescending(a => a.LetterDate).FirstOrDefault(r => r.PatientId == findAttendExist.Id);

                var findAtten2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

             //   var findLetter = _db.PatientsTransactions.OrderByDescending(a => a.Id).FirstOrDefault(a => a.PatientId == findPatByName.Id);

                var findAtten3 = _db.HotelMovements.FirstOrDefault(r => r.TRId == findAtten.Id);

                findAtten.FileStatus = 1;
                findAtten.ReplyState = 5;
                findAtten2.ReplyState = 5;
                findAtten3.Treatment = 1;
                _db.Entry(findAtten).State = EntityState.Modified;
                _db.Entry(findAtten2).State = EntityState.Modified;
                _db.Entry(findAtten3).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                var input2 = new MedicalFileStatus
                {
                    PatientId = (int)findAtten.PatientId,
                    TRID = findAtten.Id,
                    FileStatus = 1,
                    Notes = "مرافق للجريح",
                    ClosingDate = DateTime.UtcNow,
                    UserId = formdata.UserId,
                };

                await _db.MedicalFileStatus.AddAsync(input2);
                await _db.SaveChangesAsync();

            }


            return Ok(new JsonResult("The Hotel Movement was Added Successfully"));

        }

        [HttpGet("[action]")]
        public IActionResult GetHotelMovements()
        {
            var output = (from hm in _db.HotelMovements
                          join am in _db.PatientsData on hm.PatientId equals am.Id
                          from pt in _db.PatientsTransactions
                          from h in _db.HotelsOutside
                          from b in _db.Branches
                          from u in _db.Users
                          from c in _db.Countries
                          where pt.CountryId == c.Id && pt.LetterDest == b.Id &&
                          am.Id == hm.PatientId && am.Id == pt.PatientId &&                         
                          pt.Id == hm.TRId && hm.HotelId == h.Id && hm.UserId == u.Id
                          orderby hm.UserDate descending
                          select new
                          {
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterIndexNO,
                              hm.EntryDate,
                              hm.Attach,
                              hm.PatientId,
                              hm.TRId,
                              h.HotelName,
                              c.Country,
                              b.BranchName,
                              u.PhoneNumber,
                              pt.PersonType,
                              hm.UserDate,
                          }
                       ).ToList();
            return Ok(output);

        }

        //============================ Update Hotel Movement ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHotelMovement([FromRoute] int id, [FromBody] HotelMovements formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findHotelMove = _db.HotelMovements.FirstOrDefault(h => h.Id == id);

            if (findHotelMove == null)
            {
                return NotFound();
            }

            // If the Patient was found
            //findHotelMove.PatientId = formdata.PatientId;
            //findHotelMove.TRId = formdata.TRId;
            //findHotelMove.TPId = formdata.TPId;
            findHotelMove.HotelId = formdata.HotelId;
            findHotelMove.EntryDate = formdata.EntryDate;
            findHotelMove.UserId = formdata.UserId;
            findHotelMove.UserDate = DateTime.UtcNow;
            findHotelMove.Attach = formdata.Attach;

            _db.Entry(findHotelMove).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The Patient with id " + id + " is updated his Hotel Movement"));

        }
        //=============================================================================

        //============================ Delete Hotel Movement ==============================
        //[AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHotelMovement([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findHotelMove = await _db.HotelMovements.FindAsync(id);

            if (findHotelMove == null)
            {
                return NotFound();
            }

            _db.HotelMovements.Remove(findHotelMove);
            await _db.SaveChangesAsync();

            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == findHotelMove.TRId);
            var findPatient2 = _db.TravelingProcedures.FirstOrDefault(x => x.TRId == findHotelMove.TRId);

            if (findPatient == null)
            {
                return NotFound();
            }

            if (findPatient.Hotel == 0 || findPatient2.Hotel == 0)
            {
                findPatient.Hotel = 1;
                findPatient2.Hotel = 1;

            }

            else if (findPatient.Hotel == 1 || findPatient2.Hotel == 1)
            {
                findPatient.Hotel = 0;
                findPatient2.Hotel = 0;

            }

          //  var findAttendExist = _db.PatientsData.FirstOrDefault(c => c.Id == formdata.PatientId && c.PersonType == 2);
            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            bool findAttend = _db.PatientsTransactions.Any(c => c.Id == findHotelMove.PatientId && c.PersonType == 2);
         //   var findAttendExist = _db.PatientsData.FirstOrDefault(c => c.Id == findHotelMove.PatientId && c.PersonType == 2);


            if(findAttend)
            {
                var findAttendfile = _db.MedicalFileStatus.FirstOrDefault(c => c.TRID == findHotelMove.TRId);

                var idDeleted = await _db.MedicalFileStatus.FindAsync(findAttendfile.Id);

                _db.MedicalFileStatus.Remove(idDeleted);
                await _db.SaveChangesAsync();

               
                findPatient.ReplyState = 3;
                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();



            }

            return Ok(new JsonResult("The Patient with id " + id + " is Deleted his Home Movement."));
        }
        //=============================================================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelMovementsByCountryId([FromRoute] int id)
        {
            var output = (
                from pd in _db.PatientsData
                          from hm in _db.HotelMovements
                          from n in _db.Users
                          from h in _db.HotelsOutside
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          from b in _db.Branches
                          where pt.CountryId == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && hm.UserId == n.Id && pt.Id == hm.TRId
                          && hm.HotelId == h.Id orderby hm.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              h.HotelName,
                              hm.EntryDate,
                              hm.Attach,
                              hm.Id,
                              hm.TRId,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              hm.Treatment,
                              hm.HotelId,
                              pt.PersonType,
                              pt.Travel,
                              hm.UserDate,
                          }
                       ).ToList();
            return Ok(output);

        }

        //==============================عرض إجراءات الدخول للساحة للجرحى الذين تم إدخالهم عن طريق لجنة الحصر=====================
        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelMovementsByRoleId([FromRoute] string id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.HotelMovements
                          from n in _db.Users
                          from ur in _db.UserRoles
                          from urs in _db.Roles
                          from h in _db.HotelsOutside
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where ur.RoleId == id && ur.RoleId == urs.Id && ur.UserId == pt.UserId 
                          && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId
                          && p.HotelId == h.Id && p.UserId == n.Id
                          orderby p.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              h.HotelName,
                              p.EntryDate,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              p.Treatment,
                              p.HotelId,
                              pt.PersonType,
                              pt.Travel,
                              p.UserDate,
                          }
                       ).ToList();
            return Ok(output);

        }


        //============================ ADD Hotel Movement ========================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHotelMovementByCountry([FromBody] HotelMovements formdata)
        {

            List<string> ErrorList = new List<string>();

            var tr = new TravelingProcedures
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                FlightDate = DateTime.UtcNow,
                FlightNom = "UT567CBY",
                AirlineName = "الأجنحة الليبية",
                Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Travel = 1,
                Hotel = 1

            };
            await _db.TravelingProcedures.AddAsync(tr);
            await _db.SaveChangesAsync();

            var newHotelMov = new HotelMovements
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                TPId = tr.Id,
                EntryDate = formdata.EntryDate,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Attach = formdata.Attach,
                Treatment = 0,
                HotelId = formdata.HotelId,

            };


            await _db.HotelMovements.AddAsync(newHotelMov);

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Hotel Movement was Added Successfully"));

        }
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateFieldsByCountry([FromRoute] int id)
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
            
            if (findPatient.Travel == 0)
            {
                findPatient.Hotel = 1;
                findPatient.Travel = 1;

            }


            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The Travle Field with id " + id + " is updated."));

        }

        //=============================================================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelMovementsByBranchId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from p in _db.HotelMovements
                          from n in _db.Users
                          from h in _db.HotelsOutside
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId
                          && p.HotelId == h.Id
                          orderby p.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              h.HotelName,
                              p.EntryDate,
                              p.Attach,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              p.Treatment,
                              pt.PersonType,
                              p.UserDate
                          }
                       ).ToList();
            return Ok(output);

        } 
        
     //=============================================================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetPOutsideFilesOpenByBranchId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.HotelMovements
                          from n in _db.Users
                          from h in _db.HotelsOutside
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId
                          && pt.ReplyState == 3 && pt.Travel == 1 && pt.Hotel == 1 && pt.FileStatus == 0
                          && p.HotelId == h.Id orderby p.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              h.HotelName,
                              p.EntryDate,
                              p.Attach,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              p.Treatment,
                              pd.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelMovementsByPatientId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.HotelMovements
                          from n in _db.Users
                          from h in _db.HotelsOutside
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.Id == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId
                          && p.HotelId == h.Id
                          orderby p.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              h.HotelName,
                              p.EntryDate,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              p.Treatment,
                              p.HotelId,
                              pt.PersonType,
                              pt.Travel,
                              p.UserDate,
                          }
                       ).ToList();
            return Ok(output);

        }


    }
}
