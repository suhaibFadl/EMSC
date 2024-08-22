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

    public class FollowUpCommitteeController : ControllerBase
    {

        private readonly EMSCDBContext _db;

        public FollowUpCommitteeController(EMSCDBContext db)
        {
            _db = db;

        }

        //================عرض كافة رسائل العلاج بالخارج التابعة لجميع الفروع
        [HttpGet("[action]")]
        public IActionResult GetAllPatTransactionsOutside()
        {
            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from pt in _db.PatientsTransactions
                          from r in _db.RepliesManagement
                          from c in _db.Countries
                          from b in _db.Branches
                          where pt.LetterDest == b.Id && pt.CountryId == c.Id &&
                          pd.Id == pt.PatientId  && pt.UserId == n.Id && pt.Id == r.TRId
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
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.UserId,
                              c.Country,
                              pt.CountryId,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              r.Reply,
                              pt.PersonType,
                              pt.UserDate,
                              b.BranchName,
                              r.ReplyDate,
                              MainUserDate=r.UserDate
                          }
                              ).ToList();

            return Ok(output);

        }

        //================عرض كافة الردود على رسائل العلاج بالخارج
        [HttpGet("[action]")]
        public IActionResult GetAllRepliesforPatTransactionsOutside()
        {
            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from pt in _db.PatientsTransactions
                          from r in _db.RepliesManagement
                          from c in _db.Countries
                          from b in _db.Branches
                          where pt.LetterDest == b.Id && pt.CountryId == c.Id &&
                          pd.Id == pt.PatientId && r.UserId == n.Id && pt.Id == r.TRId
                          orderby r.UserDate descending
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
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              r.UserId,
                              c.Country,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              r.Reply,
                              pt.PersonType,
                            //  pt.UserDate,
                              r.ReplyDate,
                              r.UserDate,
                              CUserId = r.CUserId,
                              b.BranchName
                          }
                              ).ToList();

            return Ok(output);

        }

        //================عرض كافة تذاكر السفر
        [HttpGet("[action]")]
        public IActionResult GetAllTravelTickets()
        {
            var output = (
                
                          from tp in _db.TravelingProcedures
                          from u in _db.Users
                          from b in _db.Branches
                          join am in _db.PatientsData on tp.PatientId equals am.Id
                          join pt in _db.PatientsTransactions on tp.TRId equals pt.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where am.Id == tp.PatientId && tp.TRId == pt.Id
                          && pt.LetterDest == b.Id &&
                          pt.CountryId == c.Id && tp.UserId == u.Id
                          orderby tp.UserDate descending
                          select new
                          {
                              tp.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              pt.LetterDest,
                              c.Country,
                              u.PhoneNumber,
                              b.BranchName,
                              pt.PersonType,
                              tp.UserDate,
                              pt.CountryId
                          }
                       ).ToList();
            return Ok(output);

        }

        //================عرض كافة إجراءات الدخول
        [HttpGet("[action]")]
        public IActionResult GetAllEntryProcedures()
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
                              pt.CountryId
                          }
                       ).ToList();
            return Ok(output);

        }

        //================عرض كافة إجراءات الدخول
        [HttpGet("[action]")]
        public IActionResult GetAllTreatmentProcedures()
        {
            var output = (
                         from pd in _db.PatientsData
                         from tm in _db.TreatmentMovements
                          from pt in _db.PatientsTransactions
                          from b in _db.Branches
                          from u in _db.Users
                          from c in _db.Countries
                          from hout in _db.HospsCountr
                          where pt.PersonType == 1 && pt.PatientId == pd.Id && tm.PatientId == pd.Id
                          && pt.Id == tm.TRId && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && tm.HospitalCountryId == hout.Id && hout.CountryId == c.Id
                          && tm.UserId == u.Id
                          orderby tm.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterIndexNO,
                              tm.Attach,
                              c.Country,
                              b.BranchName,
                              u.PhoneNumber,
                              tm.UserDate,
                              tm.Medical_Diagnosis,
                              tm.Date_Diagnosis,
                              hout.HospitalName,
                              pt.CountryId
                          }
                       ).ToList();
            return Ok(output);

        }

        //================عرض كافة الملفات المغلقة
        [HttpGet("[action]")]
        public IActionResult GetAllClosingFiles()
        {

            var output = (
                          from pd in _db.PatientsData
                          from mf in _db.MedicalFileStatus
                          from n in _db.Users
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          from b in _db.Branches
                     
                          where pt.PersonType == 1 && pt.ReplyState == 5 
                          && pd.Id == pt.PatientId && mf.PatientId == pd.Id && pt.Id == mf.TRID
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && mf.UserId == n.Id orderby mf.ClosingDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              mf.Notes,
                              mf.FileStatus,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              mf.ClosingDate,
                              pt.CountryId,
                          }
                       ).ToList();
            return Ok(output);

        }

        //================عرض كافة تذاكر العودة
        [HttpGet("[action]")]
        public IActionResult GetAllBackTickets()
        {
            var output = (
                          from tp in _db.TravelersBack
                          from u in _db.Users
                          from b in _db.Branches
                          join am in _db.PatientsData on tp.PatientId equals am.Id
                          join pt in _db.PatientsTransactions on tp.TRId equals pt.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where am.Id == tp.PatientId && tp.TRId == pt.Id
                          && pt.LetterDest == b.Id &&
                          pt.CountryId == c.Id && tp.UserId == u.Id
                          orderby tp.UserDate descending
                          select new
                          {
                              tp.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterDate,
                              pt.LetterIndexNO,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              pt.LetterDest,
                              c.Country,
                              u.PhoneNumber,
                              b.BranchName,
                              pt.PersonType,
                              tp.UserDate,
                              pt.CountryId
                          }
                       ).ToList();
            return Ok(output);

        }
      
        //================عرض كافة إجراءات حجز تذاكر السفر المعلقة
        [HttpGet("[action]")]
        public IActionResult GetAllPendingTravelTickets()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from re in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          re.UserId == n.Id && re.TRId == pt.Id
                          && pt.LetterDest == b.Id && pt.ReplyState == 3 && pt.Travel == 0
                          orderby re.ReplyDate descending
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
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.PersonType,
                              re.ReplyDate

                          }
                              ).ToList();

            return Ok(output);

        }

        //================عرض كافة إجراءات الدخول المعلقة
        [HttpGet("[action]")]
        public IActionResult GetAllPendingEntryProcedures()
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.TravelingProcedures
                          from n in _db.Users
                          from re in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where  pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId && re.TRId == pt.Id
                          && pt.ReplyState == 3 && pt.Travel == 1 && pt.Hotel == 0
                          orderby p.UserDate descending
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
                              p.UserId,
                              p.FlightDate,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.FlightNom,
                              p.AirlineName,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              pt.PersonType,
                              re.ReplyDate,
                              p.UserDate
                          }
                       ).ToList();
            return Ok(output);

        }

        //================عرض كافة حجز تذاكر العودة المعلقة
        [HttpGet("[action]")]
        public IActionResult GetAllPendingBackTickets()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          from mfs in _db.MedicalFileStatus
                         // from pf in _db.Pats_Referred
                          where pd.Id == pt.PatientId && pt.CountryId == c.Id 
                          && pt.LetterDest == b.Id && pt.ReplyState == 5 && (pt.Travel == 2 || pt.Travel == 1) 
                          && mfs.UserId == n.Id && mfs.TRID == pt.Id && mfs.PatientId == pd.Id 
                          orderby mfs.ClosingDate descending
                          /*&& pf.Rejected == 0*/
                         // && pf.PatientId == pd.Id && pf.TRId == pt.Id && pf.PatientId == pt.PatientId && pf.CountryId == c.Id
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.Travel,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              c.Country,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.PersonType,
                              mfs.ClosingDate,
                          }
                              ).ToList();

            return Ok(output);

        }

    }
}
