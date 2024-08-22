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
    public class HousingController : ControllerBase
    {

        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public HousingController(EMSCDBContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        //=========================================عرض الجرحى والمرافقين الذين تم قبولهم في دولة تونس ليتم إضافة رسائل التسكين
        [HttpGet("[action]")]
        public IActionResult GetPatsAcceptedByCountryForManagement()
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

        //public IActionResult GetPatsAcceptedByCountryForManagement()
        //{
        //    var output = (
        //                  from pd in _db.PatientsData
        //                  from n in _db.Users
        //                  from uc in _db.RepliesManagement
        //                  join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
        //                  join br in _db.Branches on pt.LetterDest equals br.Id
        //                  join c in _db.Countries on pt.CountryId equals c.Id
        //                  join rr in _db.Users on pt.UserId equals rr.Id

        //                  join detail in _db.Housing_Letters on pt.Id equals detail.TRID into ab
        //                  from a in ab.DefaultIfEmpty()

        //                  where /*pt.ReplyState == 3 &&*/ pd.Id == pt.PatientId && pd.Id == uc.PatientId &&
        //                  pt.Id == uc.TRId && pt.CountryId == c.Id /*&& pt.CountryId == 2099*/ && uc.UserId == n.Id && a.TRID == null
        //                  orderby uc.ReplyDate descending
        //                  select new
        //                  {
        //                      pd.PatientName,
        //                      pd.PassportNo,
        //                      pd.NationalNo,
        //                      pt.LetterDate,
        //                      pt.LetterDest,
        //                      pt.Travel,
        //                      pt.Attach,
        //                      pt.LetterIndexNO,
        //                      c.Country,
        //                      br.BranchName,
        //                      n.PhoneNumber,
        //                      uc.Reply,
        //                      uc.ReplyState,
        //                      uc.ReplyDate,
        //                      //  uc.Id,
        //                      pt.Id,
        //                      pt.MedicalDiagnosis,
        //                      pt.PersonType,
        //                  }
        //                      ).ToList();


        //    return Ok(output);
        //}
        //========================================================= 

        //=========================================================إضافة رسالة التسكين للجريح أو المرافق عن طريق الفرع الرئيسي 
        //   [Authorize(Policy = "RequireAddTravelingRole")]
      
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHousingLetter([FromBody] Housing_Letters formdata)
        {

            List<string> ErrorList = new List<string>();

            var newData = new Housing_Letters
            {
                PId = formdata.PId,
                LetterIndex = formdata.LetterIndex,
                LetterDate = formdata.LetterDate,
                Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                HousingDone = 0,
                CountryId = formdata.CountryId,

            };

            await _db.Housing_Letters.AddAsync(newData);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("Added"));

        }

        //=====================================عرض رسائل التسكين التي نم إدخالها من قبل الفرع الرئيسي 

        [HttpGet("[action]")]
        public IActionResult GetAllHousingLetters()
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from h in _db.Housing_Letters
                         from b in _db.Branches
                         from c in _db.Countries
                         where pd.Id == h.PId 
                         && pd.BranchId == b.Id
                         && n.Id == h.UserId
                         && h.CountryId == c.Id
                         orderby h.UserDate descending
                         select new
                         {
                             h.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             c.Country,
                             b.BranchName,
                             h.LetterIndex,
                             LetterDateHouse = h.LetterDate,
                             n.PhoneNumber,
                             h.Attach,
                             h.UserDate,
                             h.PId,
                             pd.PersonType

                         }
                             ).ToList();

            return Ok(output);


        }

        //===================================== عرض رسائل التسكين التي نم إدخالها من قبل الفرع الرئيسي للدولة وشركة التسكين حسب الدولة 
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllHousingLettersByCountryId([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from h in _db.Housing_Letters
                         from b in _db.Branches
                         from c in _db.Countries
                         where h.CountryId == id && pd.Id == h.PId 
                         && pd.BranchId == b.Id && n.Id == h.UserId
                         && h.CountryId == c.Id
                         orderby h.UserDate descending
                         select new
                         {
                             h.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             c.Country,
                             b.BranchName,
                             h.LetterIndex,
                             LetterDateHouse = h.LetterDate,
                             n.PhoneNumber,
                             h.Attach,
                             h.UserDate,
                             h.HousingDone,
                             pd.PersonType
                         }
                             ).ToList();

            return Ok(output);

        }

        //===================================== عرض رسائل التسكين التي نم إدخالها من قبل الفرع الرئيسي للدولة وشركة التسكين حسب الفرع 

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllHousingLettersByBranchId([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from h in _db.Housing_Letters
                         from b in _db.Branches
                         from c in _db.Countries
                         where pd.BranchId == id && pd.Id == h.PId && 
                         h.CountryId == c.Id && n.Id == h.UserId

                         orderby h.UserDate descending
                         select new
                         {
                             pd.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             c.Country,
                             b.BranchName,
                             h.LetterIndex,
                             LetterDateHouse = h.LetterDate,
                             n.PhoneNumber,
                             h.Attach,
                             h.UserDate,
                         }
                             ).ToList();

            return Ok(output);


        }

        //===================================== تعديل رسالة التسكين
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHousingLetter([FromRoute] int id, [FromBody] Housing_Letters formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findRow = _db.Housing_Letters.FirstOrDefault(p => p.Id == id);

            if (findRow == null)
            {
                return NotFound();
            }

            // set new data
            findRow.LetterDate = formdata.LetterDate;
            findRow.LetterIndex = formdata.LetterIndex;
            findRow.Attach = formdata.Attach;
            findRow.UserId = formdata.UserId;
            findRow.UserDate = DateTime.UtcNow;
            findRow.CountryId = formdata.CountryId;

            _db.Entry(findRow).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Updated"));

        }

        //===================================== حذف رسالة التسكين
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHousingLetter([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find row
            var findLetter = await _db.Housing_Letters.FindAsync(id);

            _db.Housing_Letters.Remove(findLetter);
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Deleted"));
        }

        //===================================== عرض رسائل التسكين التي تم إدخالها من قبل الفرع الرئيسي  لشركة التسكين حسب الدولة 
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllHousingLettersIncomingByCountryId([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from pt in _db.PatientsTransactions
                         from h in _db.Housing_Letters
                         from b in _db.Branches
                         from c in _db.Countries
                         where pt.CountryId == id && h.HousingDone == 0 
                         && pt.Id == h.TRID && pt.PatientId == pd.Id &&
                         pt.CountryId == c.Id && pt.LetterDest == b.Id
                         && n.Id == h.UserId

                         orderby h.UserDate descending
                         select new
                         {
                             h.Id,
                             h.TRID,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDate,
                             pt.LetterIndexNO,
                             c.Country,
                             pt.MedicalDiagnosis,
                             pt.Hotel,
                             b.BranchName,
                             pt.PersonType,
                             h.LetterIndex,
                             LetterDateHouse = h.LetterDate,
                             n.PhoneNumber,
                             h.Attach,
                             h.UserDate,
                             h.HousingDone
                         }
                             ).ToList();

            return Ok(output);


        }

        //============================ إضافة إجراء الدخول للفندق ========================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHotelEntryProcedure([FromBody] Hotels_Entry_Procedures formdata)
        {

            List<string> ErrorList = new List<string>();

            var findHousLetter = _db.Housing_Letters.FirstOrDefault(c => c.Id == formdata.HouLetterId);

            var newHotelMov = new Hotels_Entry_Procedures
            {
                TRID = formdata.TRID,
                HouLetterId = formdata.HouLetterId,
                EntryDate = formdata.EntryDate,
                StartDate = formdata.EntryDate,
                EndDate = formdata.EntryDate.Value.AddDays(10),
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Attach = formdata.Attach,
                HotelId = formdata.HotelId,
                CountRenewals = 0,
            };

      
            await _db.Hotels_Entry_Procedures.AddAsync(newHotelMov);
            await _db.SaveChangesAsync();

            ////تعديل تاريخ البدء وتاريخ الانتهاء عند تجديد الحجز
            //var findHotelPro = _db.Hotels_Entry_Procedures.FirstOrDefault(h => h.Id == newHotelMov.Id);


            //findHotelPro.StartDate = newHotelMov.EntryDate.Value.AddDays(10);
            //findHotelPro.EndDate = findHotelPro.StartDate.Value.AddDays(10);

            //_db.Entry(findHotelPro).State = EntityState.Modified;
            //await _db.SaveChangesAsync();

            var newHotelLeav = new Hotels_Leaving_Procedures
            {
                TRID = formdata.TRID,
                HouLetterId = formdata.HouLetterId,             
                HotelEntryId = newHotelMov.Id,             
            };
            await _db.Hotels_Leaving_Procedures.AddAsync(newHotelLeav);
            await _db.SaveChangesAsync();


            if (findHousLetter.HousingDone == 0)
            {
                findHousLetter.HousingDone = 1;

            }


            _db.Entry(findHousLetter).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Added Successfully"));

        }

        //============================ عرض إجراءات الدخول في الفنادق حسب الدولة ========================

        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelEntryProcedures([FromRoute] int id)
        {
            //int Count;
            var output = (from hep in _db.Hotels_Entry_Procedures
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from hl in _db.Housing_Letters
                          from h in _db.HotelsOutside
                          from b in _db.Branches
                          from u in _db.Users
                          from c in _db.Countries
                          where pt.CountryId == id && pt.CountryId == c.Id && pt.LetterDest == b.Id 
                          &&  pd.Id == pt.PatientId && pt.Id == hep.TRID && pt.Id == hl.TRID 
                          && hep.TRID == hl.TRID && hl.Id == hep.HouLetterId
                          && hep.HotelId == h.Id && hep.UserId == u.Id
                          orderby hep.UserDate descending
                          select new
                          {
                              hep.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterIndexNO,
                              hl.LetterIndex,
                              hep.EntryDate,
                              hl.Attach,
                              h.HotelName,
                              c.Country,
                              b.BranchName,
                              u.PhoneNumber,
                              pt.PersonType,
                              hep.UserDate,
                              hep.HotelId,
                              hl.HousingDone,
                              hep.TRID,
                              HouLetterId=hl.Id,
                              hep.StartDate,
                              hep.EndDate,
                              hep.CountRenewals,
                              RenewalDateEnd = hep.EndDate.Value.AddDays(10)
                          }
                       ).ToList();         

            return Ok(output);

        }

        //============================ تعديل إجراء الدخول للفندق ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHotelEntryProcedure([FromRoute] int id, [FromBody] Hotels_Entry_Procedures formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findHotelPro = _db.Hotels_Entry_Procedures.FirstOrDefault(h => h.Id == id);

            if (findHotelPro == null)
            {
                return NotFound();
            }

            findHotelPro.HotelId = formdata.HotelId;
            findHotelPro.EntryDate = formdata.EntryDate;
            findHotelPro.UserId = formdata.UserId;
            findHotelPro.UserDate = DateTime.UtcNow;
            findHotelPro.Attach = formdata.Attach;

            _db.Entry(findHotelPro).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Updated"));

        }
        //=============================================================================

        //============================ حذف إجراء الدخول للفندق ==============================
        //[AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHotelEntryProcedure([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findHotelPro = await _db.Hotels_Entry_Procedures.FindAsync(id);

            var findHotelLeave = _db.Hotels_Leaving_Procedures.FirstOrDefault(c => c.HotelEntryId == id);

            if (findHotelPro == null)
            {
                return NotFound();
            }

            _db.Hotels_Entry_Procedures.Remove(findHotelPro);
            await _db.SaveChangesAsync();
            
            _db.Hotels_Leaving_Procedures.Remove(findHotelLeave);
            await _db.SaveChangesAsync();

            var findLetter = _db.Housing_Letters.FirstOrDefault(c => c.Id == findHotelPro.HouLetterId);

            if (findLetter == null)
            {
                return NotFound();
            }


            if (findLetter.HousingDone == 1)
            {
                findLetter.HousingDone = 0;

            }

            _db.Entry(findLetter).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Deleted"));
        }


        //============================ إضافة إجراء  الخروج من الفندق ========================
        [HttpPut("[action]")]
        public async Task<IActionResult> AddHotelLeavingProcedure([FromBody] Hotels_Leaving_Procedures formdata)
        {

            List<string> ErrorList = new List<string>();

            var findHousLetter = _db.Housing_Letters.FirstOrDefault(c => c.Id == formdata.HouLetterId);

            var findHotelEntryIdPro = _db.Hotels_Leaving_Procedures.FirstOrDefault(h => h.HotelEntryId == formdata.HotelEntryId);


            findHotelEntryIdPro.LeavingDate = formdata.LeavingDate;
            findHotelEntryIdPro.UserId = formdata.UserId;
            findHotelEntryIdPro.UserDate = DateTime.UtcNow;
            findHotelEntryIdPro.Attach = formdata.Attach;


            _db.Entry(findHotelEntryIdPro).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            if (findHousLetter.HousingDone == 1)
            {
                findHousLetter.HousingDone = 2;

            }

            _db.Entry(findHousLetter).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Added Successfully"));

        }


        //============================ عرض إجراءات الخروج من الفنادق ========================

        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelLeavingProcedures([FromRoute] int id)
        {
            var output = (
                          from hlv in _db.Hotels_Leaving_Procedures
                          from hep in _db.Hotels_Entry_Procedures
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from hl in _db.Housing_Letters
                          from h in _db.HotelsOutside
                          from b in _db.Branches
                          from u in _db.Users
                          from c in _db.Countries
                          where pt.CountryId==id && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pd.Id == pt.PatientId && pt.Id == hep.TRID && pt.Id == hlv.TRID && pt.Id == hl.TRID
                          && hlv.UserId == u.Id && h.Id == hep.HotelId
                          && hlv.HotelEntryId == hep.Id 
                          orderby hlv.LeavingDate descending
                          select new
                          {
                              hlv.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterIndexNO,
                              hlv.LeavingDate,
                              hlv.Attach,
                              h.HotelName,
                              c.Country,
                              b.BranchName,
                              u.PhoneNumber,
                              pt.PersonType,
                              hlv.UserDate,
                              hl.LetterIndex
                          }
                       ).ToList();
            return Ok(output);

        }

        //============================ تعديل إجراء  الخروج من الفندق ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHotelLeavingProcedure([FromRoute] int id, [FromBody] Hotels_Leaving_Procedures formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findHotelPro = _db.Hotels_Leaving_Procedures.FirstOrDefault(h => h.Id == id);

            if (findHotelPro == null)
            {
                return NotFound();
            }

           // findHotelPro.HotelId = formdata.HotelId;
            findHotelPro.LeavingDate = formdata.LeavingDate;
            findHotelPro.UserId = formdata.UserId;
            findHotelPro.UserDate = DateTime.UtcNow;
            findHotelPro.Attach = formdata.Attach;

            _db.Entry(findHotelPro).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Updated"));

        }
        //=============================================================================

        //============================ حذف إجراء  الخروج من الفندق ==============================
        //[AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHotelLeavingProcedure([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findHotelPro = await _db.Hotels_Leaving_Procedures.FindAsync(id);

            if (findHotelPro == null)
            {
                return NotFound();
            }

            _db.Hotels_Leaving_Procedures.Remove(findHotelPro);
            await _db.SaveChangesAsync();

            var findLetter = _db.Housing_Letters.FirstOrDefault(c => c.Id == findHotelPro.HouLetterId);

            if (findLetter == null)
            {
                return NotFound();
            }

            if (findLetter.HousingDone == 2)
            {
                findLetter.HousingDone = 1;

            }

            _db.Entry(findLetter).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Deleted"));
        }

        //============================ تجديد إجراء الحجز في الفندق ========================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHotelRenewalProcedure([FromBody] Hotels_Renewal_Precedures formdata)
        {

            List<string> ErrorList = new List<string>();

            var findHousLetter = _db.Hotels_Renewal_Precedures.FirstOrDefault(c => c.Id == formdata.HouLetterId);

            var newHotelMov = new Hotels_Renewal_Precedures
            {
                TRID = formdata.TRID,
                HouLetterId = formdata.HouLetterId,
                HotelEntryId = formdata.HotelEntryId,
                RenewalDateStart = formdata.RenewalDateStart,
                RenewalDateEnd = formdata.RenewalDateStart.Value.AddDays(10),
                Notes = formdata.Notes,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Attach = formdata.Attach,
            };


            //تعديل تاريخ البدء وتاريخ الانتهاء عند تجديد الحجز
            var findHotelPro = _db.Hotels_Entry_Procedures.FirstOrDefault(h => h.Id == formdata.HotelEntryId);

            if (findHotelPro == null)
            {
                return NotFound();
            }

            findHotelPro.CountRenewals = findHotelPro.CountRenewals + 1;
            findHotelPro.StartDate = formdata.RenewalDateStart;
            findHotelPro.EndDate = findHotelPro.StartDate.Value.AddDays(10);

            _db.Entry(findHotelPro).State = EntityState.Modified;
            await _db.SaveChangesAsync();



            await _db.Hotels_Renewal_Precedures.AddAsync(newHotelMov);
            await _db.SaveChangesAsync();



            return Ok(new JsonResult("The Hotel Movement was Added Successfully"));

        }

        //============================ عرض إجراءات تجديد حجز الفنادق ========================

        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelRenewalProceduresByHotelEntryId([FromRoute] int id)
        {
            var output = (
                          from hrp in _db.Hotels_Renewal_Precedures
                          from hep in _db.Hotels_Entry_Procedures
                          from u in _db.Users
                          where hep.Id == id && hep.Id == hrp.HotelEntryId 
                          && hrp.HotelEntryId == id
                          && hrp.UserId == u.Id
                          orderby hrp.RenewalDateStart descending
                          select new
                          {
                              hrp.Id,
                              hrp.RenewalDateStart,
                              hrp.RenewalDateEnd,
                              hrp.Attach,
                              u.PhoneNumber,
                              hrp.UserDate,
                              hrp.Notes,
                              EntryAttach=hep.Attach,
                          }
                       ).ToList();
            return Ok(output);

        }
        [HttpGet("[action]/{id}")]
        public IActionResult GetEntryAndLeavingProceduresByHotelEntryId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from hep in _db.Hotels_Entry_Procedures
                          from hlp in _db.Hotels_Leaving_Procedures
                          from hl in _db.Housing_Letters
                          from c in _db.Countries
                          from h in _db.HotelsOutside
                          from b in _db.Branches
                          where hep.Id == id && hep.Id == hlp.HotelEntryId && hlp.HotelEntryId == id
                          && hl.Id == hep.HouLetterId && hl.Id == hlp.HouLetterId
                          && pd.Id == pt.PatientId && pt.Id == hep.TRID && pt.Id == hlp.TRID && pt.Id == hl.TRID
                          && pt.CountryId == c.Id && hep.HotelId == h.Id && pt.LetterDest == b.Id
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,pd.NationalNo,
                              pd.PatType,
                              pt.PersonType,
                              c.Country,
                              b.BranchName,
                              h.HotelName,
                              hep.EntryDate,
                              hlp.LeavingDate,
                              EntryAttach = hep.Attach,
                              LeavingAttach = hlp.Attach,
                              HousingAttach= hl.Attach,
                              hl.LetterIndex
                          }
                       ).ToList();
            return Ok(output);

        }

        //============================ تعديل إجراء تجديد الحجز في الفندق ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHoteRenewalProcedure([FromRoute] int id, [FromBody] Hotels_Renewal_Precedures formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findHotelPro = _db.Hotels_Renewal_Precedures.FirstOrDefault(h => h.Id == id);

            if (findHotelPro == null)
            {
                return NotFound();
            }

            // findHotelPro.HotelId = formdata.HotelId;
            findHotelPro.RenewalDateStart = formdata.RenewalDateStart;
            findHotelPro.RenewalDateEnd = formdata.RenewalDateStart.Value.AddDays(10);
            findHotelPro.Notes = formdata.Notes;
            findHotelPro.UserId = formdata.UserId;
            findHotelPro.UserDate = DateTime.UtcNow;
            findHotelPro.Attach = formdata.Attach;

            _db.Entry(findHotelPro).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("Updated"));

        }
        //=============================================================================

        //============================ حذف إجراء  تجديد الحجز في الفندق ==============================
        //[AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHotelRenewalProcedure([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findHotelRenew = await _db.Hotels_Renewal_Precedures.FindAsync(id);
            var findHotelPro = _db.Hotels_Entry_Procedures.FirstOrDefault(h => h.Id == findHotelRenew.HotelEntryId);

            if (findHotelRenew == null)
            {
                return NotFound();
            }

            _db.Hotels_Renewal_Precedures.Remove(findHotelRenew);
            await _db.SaveChangesAsync();

            //تعديل عدد التجديدات عند حذف تجديد

            if (findHotelPro == null)
            {
                return NotFound();
            }

            findHotelPro.CountRenewals = findHotelPro.CountRenewals - 1;

            _db.Entry(findHotelPro).State = EntityState.Modified;
            await _db.SaveChangesAsync();



            return Ok(new JsonResult("Deleted"));
        }

        //============================ عرض إجراءات الدخول والخروج للفنادق ========================

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllHotelProcedures([FromRoute] int id)
        {
            var output = (
                          from hlv in _db.Hotels_Leaving_Procedures
                          from hep in _db.Hotels_Entry_Procedures
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from h in _db.HotelsOutside
                          from b in _db.Branches
                          from c in _db.Countries
                          from hl in _db.Housing_Letters
                          where pt.CountryId == id  && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pd.Id == pt.PatientId && pt.Id == hep.TRID && pt.Id == hlv.TRID 
                          && hep.Id == hlv.HotelEntryId && h.Id == hep.HotelId   
                          && hl.Id == hep.HouLetterId && hl.Id == hlv.HouLetterId
                          && hl.TRID == pt.Id
                          select new
                          {
                              hep.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterIndexNO,
                              h.HotelName,
                              c.Country,
                              b.BranchName,
                              pt.PersonType,
                              hlv.LeavingDate,
                              hep.EntryDate,
                              hep.HotelId,
                              LeavingAttach = hlv.Attach,
                              EntryAttach = hep.Attach,
                              HousingAttach = hl.Attach,
                              hl.LetterIndex
                          }
                       ).ToList();
            return Ok(output);

        }

    }
}
