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
    public class TravelingController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public TravelingController(EMSCDBContext db)
        {
            _db = db;
        }


        //======================================Get Patients Accepted by Country to Add Travel By مسؤول التسفير
      //  [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpGet("[action]")]
        public IActionResult GetPatientTransactionAcceptedByCountryToTravel()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from re in _db.RepliesManagement
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          where pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          pt.UserId == n.Id && re.TRId == pt.Id
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

        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionToTravelByCountryId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from re in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.CountryId == id && pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          pt.UserId == n.Id && re.TRId == pt.Id
                          && pt.LetterDest == b.Id && pt.ReplyState == 3 && pt.Travel == 0
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

        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionToTravelByBranchId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from re in _db.RepliesManagement
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          where pt.LetterDest == id && pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          re.UserId == n.Id && re.TRId == pt.Id
                          && pt.LetterDest == b.Id && pt.ReplyState == 3 && pt.Travel == 0
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

        //============================ ADD Traveling Procedure ========================

        [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddTravelingProcedure([FromBody] TravelingProcedures formdata)
        {

            List<string> ErrorList = new List<string>();

            var newTraveling = new TravelingProcedures
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                FlightNom = formdata.FlightNom,
                FlightDate = formdata.FlightDate,
                AirlineName = formdata.AirlineName,
                Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Travel = 1,
                Hotel = 0,
              
            };

            bool ExsitTrid = _db.TravelingProcedures.Any(x => x.TRId == formdata.TRId 
                            && x.PatientId == formdata.PatientId && x.FlightDate == formdata.FlightDate);

            var findPatient = _db.PatientsTransactions.FirstOrDefault(x => x.Id == formdata.TRId);

            if(!ExsitTrid)
            {
                await _db.TravelingProcedures.AddAsync(newTraveling);

                await _db.SaveChangesAsync();

                if (findPatient.Travel == 0)
                {
                    findPatient.Travel = 1;

                }

                else if (findPatient.Travel == 1)
                {
                    findPatient.Travel = 0;

                }

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Traveling Procedure was Added Successfully"));


            }
            else
            {
                return BadRequest(new JsonResult("Already Exist"));

            }

        }
       
        //============================ ADD Traveling Procedure ========================

        [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddTravelingBack([FromBody] TravelingModel formdata)
        {

            List<string> ErrorList = new List<string>(); 

            var newTraveling = new TravelersBack
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                FlightNom = formdata.FlightNom,
                FlightDate = formdata.FlightDate,
                AirlineName = formdata.AirlineName,
                Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };

            bool ExsitTrid = _db.TravelersBack.Any(x => x.TRId == formdata.TRId
                && x.PatientId == formdata.PatientId && x.FlightDate == formdata.FlightDate);

            if (!ExsitTrid)
            {
                await _db.TravelersBack.AddAsync(newTraveling);
                await _db.SaveChangesAsync();

                var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId);

                if (formdata.UserRole == "مسؤول التسفير")
                {
                    if (findPatient.Travel == 2)
                    {
                        findPatient.Travel = 3;

                    }

                    else if (findPatient.Travel == 3)
                    {
                        findPatient.Travel = 2;

                    }

                    _db.Entry(findPatient).State = EntityState.Modified;
                    await _db.SaveChangesAsync();
                }
                else
                {
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
                }
                return Ok(new JsonResult("The Traveling Procedure was Added Successfully"));
            }
            else
            {
                return BadRequest(new JsonResult("Already Exist"));
            }
        }

        //======================================Get Traveling Procedures For مسؤول التسفير
      //  [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpGet("[action]")]
        public IActionResult GetTravelingProcedures()
        {
            var output = (from tp in _db.TravelingProcedures
                          from u in _db.Users
                          from b in _db.Branches
                          join am in _db.PatientsData on tp.PatientId equals am.Id
                          join pt in _db.PatientsTransactions on tp.TRId equals pt.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where  am.Id == tp.PatientId && tp.TRId == pt.Id 
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
                              pt.Treatment,
                              pt.Travel,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              pt.LetterDest,
                              pt.CountryId,
                              c.Country,
                              u.PhoneNumber,
                              b.BranchName,
                              tp.Hotel,
                              am.PersonType,
                              tp.UserDate
                          }
                       ).ToList();
            return Ok(output);

        }

        //======================================Get Traveling Procedures For Country
        [HttpGet("[action]")]
        public IActionResult GetTravelingProceduresByDate()
        {
            var output = (from tp in _db.TravelingProcedures
                          from u in _db.Users
                          join am in _db.PatientsData on tp.PatientId equals am.Id
                          join pt in _db.PatientsTransactions on tp.TRId equals pt.Id
                          where am.Id == tp.PatientId && tp.TRId == pt.Id && tp.UserId == u.Id
                          && tp.FlightDate == DateTime.Now.Date 
                          select new
                          {
                              tp.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterDate,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              tp.Travel,
                              u.PhoneNumber
                          }
                       ).ToList();
            return Ok(output);

        }
      
        //============================ Update Traveling Procedure ==============================

        [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateTravelingProcedure([FromRoute] int id, [FromBody] TravelingProcedures formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findTravel = _db.TravelingProcedures.FirstOrDefault(p => p.Id == id);

            if (findTravel == null)
            {
                return NotFound();
            }

            // If the Patient was found
            findTravel.PatientId = formdata.PatientId;
            findTravel.TRId = formdata.TRId;
            findTravel.FlightNom = formdata.FlightNom;
            findTravel.FlightDate = formdata.FlightDate;
            findTravel.AirlineName = formdata.AirlineName;
            findTravel.Attach = formdata.Attach;
            findTravel.UserId = formdata.UserId;
            findTravel.UserDate = DateTime.UtcNow;

            _db.Entry(findTravel).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The Patient with id " + id + " is updated his Traveling"));

        }
      
        //=============================================================================

        //============================ Delete Traveling Procedure ==============================
        [Authorize(Policy = "RequireAddTravelingRole")]
      
        [HttpDelete("[action]/{id}/{trid}")]
        public async Task<IActionResult> DeleteTravelingProcedure([FromRoute] int id, [FromRoute] int trid)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient
            var findTraveling = await _db.TravelingProcedures.FindAsync(id);
            var findPatient = _db.PatientsTransactions.FirstOrDefault(x => x.Id == trid);

            if (findTraveling == null)
            {
                return NotFound();
            }
            bool findTRIDInTreatmentsMov = _db.TreatmentMovements.Any(PT => PT.TRId == trid);
            bool findTRIDInHotelMov = _db.HotelMovements.Any(PT => PT.TRId == trid);

            if (findTRIDInTreatmentsMov)
                return BadRequest(new JsonResult("لا يمكن حذف بيانات تسفير الجريح لارتباطها ببيانات أخرى"));
 
            if (findTRIDInHotelMov)
                return BadRequest(new JsonResult("لا يمكن حذف بيانات تسفير الجريح لارتباطها ببيانات أخرى"));

            else
            {
                _db.TravelingProcedures.Remove(findTraveling);
                await _db.SaveChangesAsync();

                if (findPatient.Travel == 0)
                {
                    findPatient.Travel = 1;

                }

                else if (findPatient.Travel == 1)
                {
                    findPatient.Travel = 0;

                }


                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            return Ok(new JsonResult("The Patient with id " + id + " is Deleted his Traveling."));
        }
      
        //=============================================================================

        //======================================Get Traveling Procedures For Branch

        [Authorize(Policy = "RequireBranchEmployeeRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetTravelingProceduresByBranchId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from tp in _db.TravelingProcedures
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId 
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && tp.UserId == n.Id && pt.Id == tp.TRId
                         // && pt.ReplyState == 3 
                         orderby tp.UserDate descending
                          select new
                          {
                              pt.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Travel,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              b.BranchName,  
                              pt.PersonType,
                              tp.UserDate
                         }
                       ).ToList();
            return Ok(output);

        }


      //  [Authorize(Policy = "RequireBranchEmployeeRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetTravelingProceduresByCountryId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from tp in _db.TravelingProcedures
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.CountryId == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && tp.UserId == n.Id && pt.Id == tp.TRId
                          orderby tp.UserDate descending
                          select new
                          {
                              tp.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Travel,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              tp.UserId,
                              c.Country,
                              n.PhoneNumber,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              b.BranchName,
                              pt.PersonType,
                              tp.Hotel,
                              tp.UserDate
                          }
                       ).ToList();
            return Ok(output);

        }

        //============================================================================== 
        //=========================================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetTravelingProceduresByUserId([FromRoute] string id)
        {
            var output = (from tp in _db.TravelersBack
                          from u in _db.Users
                          from b in _db.Branches
                          from am in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries                        
                          where tp.UserId == id && am.Id == tp.PatientId && tp.TRId == pt.Id
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
                              pt.Treatment,
                              pt.Travel,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              pt.LetterDest,
                              pt.CountryId,
                              c.Country,
                              u.PhoneNumber,
                              b.BranchName,
                              tp.UserId,
                              am.PersonType,
                              tp.UserDate
                          }
                       ).ToList();
            return Ok(output);

        }

   
        [HttpGet("[action]/{id}")]
        public IActionResult GetTravelTicketsByUserId([FromRoute] string id)
        {
            var output = (from tp in _db.TravelingProcedures
                          from u in _db.Users
                          from b in _db.Branches
                          from am in _db.PatientsData
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries                        
                          where tp.UserId == id && am.Id == tp.PatientId && tp.TRId == pt.Id
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
                              pt.Treatment,
                              pt.Travel,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              pt.LetterDest,
                              pt.CountryId,
                              c.Country,
                              u.PhoneNumber,
                              b.BranchName,
                              tp.UserId,
                              am.PersonType,
                              tp.UserDate,
                              pt.Hotel
                          }
                       ).ToList();
            return Ok(output);

        }

        //============================================================================== 

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetAllTravelingProceduresManagement()
        {
            var output = (from pd in _db.PatientsData
                          from n in _db.Users
                          from tp in _db.TravelingProcedures
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pd.Id == pt.PatientId && pt.Id == tp.TRId &&
                          pt.CountryId == c.Id  &&  pt.LetterDest == b.Id && tp.UserId == n.Id
                         // && pt.Travel == 1 
                          orderby tp.UserDate descending
                          select new
                          {

                              pt.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Travel,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              tp.UserId,
                              c.Country,
                              n.PhoneNumber,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.PatientId,
                              tp.TRId,
                              b.BranchName,
                              pt.PersonType,
                              tp.UserDate

                          }
                       ).ToList();
            return Ok(output);

        }


        //==============================================================================
       
        //================================Get Traveling Procedures For Country==============
        [Authorize(Policy = "RequireAdministrativeSupervisorRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTravelingByCountryId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from p in _db.TravelersBack
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.CountryId == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId 
                          orderby p.UserDate descending
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
                              p.UserDate
                          }
                       ).ToList();
            return Ok(output);

        }

        //=====================================================================================
        //======================================Get Traveling Procedures For Housing Supervisor
        //[Authorize(Policy = "RequireHousingSupervisorRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetTravelingProceduresToHousingByCountryId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                         // from n in _db.Users
                          from re in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          join detail in _db.TravelingProcedures on pt.Id equals detail.TRId into ab
                          from a in ab.DefaultIfEmpty()
                          join user in _db.Users on a.UserId equals user.Id into cd
                          from n in cd.DefaultIfEmpty()

                          where pt.CountryId == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                         
                          && ((pt.Id == a.TRId && a.TRId != null) || a.TRId == null )
                          && (( n.Id == a.UserId && a.UserId != null) || a.UserId == null )
                          && re.TRId == pt.Id
                          && pt.ReplyState == 3 && (pt.Travel == 0 || pt.Travel == 1) && pt.Hotel == 0
                           
                          orderby re.ReplyDate descending
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
                              a.UserId,
                              a.FlightDate,
                              a.Attach,
                              a.Id,
                              a.TRId,
                              a.FlightNom,
                              a.AirlineName,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              pt.PersonType,
                              re.ReplyDate,
                              pt.Travel
                          }
                       ).ToList();
            return Ok(output);

        }
        //======================================

       // [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> ReferredPatientFromCountry([FromBody] Pats_Referred formdata)
        {

            List<string> ErrorList = new List<string>();

            bool TRIDExist = _db.Pats_Referred.Any(c => c.TRId == formdata.TRId);

            if(!TRIDExist)
            {
                var newTraveling = new Pats_Referred
                {
                    PatientId = formdata.PatientId,
                    TRId = formdata.TRId,
                    CountryId = formdata.CountryId,
                    Attach = formdata.Attach,
                    UserId = formdata.UserId,
                    UserDate = DateTime.UtcNow,
                    Rejected = 0,

                };

                await _db.Pats_Referred.AddAsync(newTraveling);
                await _db.SaveChangesAsync();

                var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId);

                if (findPatient.Travel == 1)
                {
                    findPatient.Travel = 2;

                }

                else if (findPatient.Travel == 2)
                {
                    findPatient.Travel = 1;

                }


                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }
          
            else if(TRIDExist)
            {
                var findLetter2 = _db.Pats_Referred.FirstOrDefault(c => c.TRId == formdata.TRId);
                if (findLetter2.Rejected == 0)
                {
                    findLetter2.Rejected = 1;

                }

                else if (findLetter2.Rejected == 1)
                {
                    findLetter2.Rejected = 0;
                }

                _db.Entry(findLetter2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId);

                if (findPatient.Travel == 1)
                {
                    findPatient.Travel = 2;

                }

                else if (findPatient.Travel == 2)
                {
                    findPatient.Travel = 1;

                }


                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            return Ok(new JsonResult("The Traveling Procedure was Added Successfully"));

        }

        //======================================================================================

        [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpGet("[action]")]
        public IActionResult GetPatientTransactionToBack()
        {

          //  var findLetter = _db.PatientsTransactions.OrderByDescending(a => a.Id).FirstOrDefault(a => a.PatientId == findPatByName.Id);

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from pf in _db.Pats_Referred
                          from clf in _db.MedicalFileStatus
                          from pt in _db.PatientsTransactions
                          from c in _db.Countries
                          where pd.Id == pt.PatientId && pt.CountryId == c.Id && pf.UserId == n.Id
                          && pt.LetterDest == b.Id && pt.ReplyState == 5 && pt.Travel == 2 && pf.Rejected == 0
                          && pf.PatientId == pd.Id && pf.TRId == pt.Id && pf.PatientId == pt.PatientId && pf.CountryId == c.Id
                          && clf.TRID == pt.Id
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pf.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.PersonType,
                              RefferId = pf.Id ,
                              clf.ClosingDate,
                              pf.UserDate
                          }
                              ).ToList();

            return Ok(output);

        }

        //==========================================رفض معاملة التسفير وإعادتها إلى الساحة من قبل مسؤول التسفير============================================

        [HttpPost("[action]")]
        public async Task<IActionResult> ReturnLettersToCountry([FromBody] Pats_Tickets_Rejected formdata)
        {

            List<string> ErrorList = new List<string>();

            var newData = new Pats_Tickets_Rejected
            {
                TRId = formdata.TRId,
                RefferId = formdata.RefferId,
                Notes = formdata.Notes,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };

            await _db.Pats_Tickets_Rejected.AddAsync(newData);
            await _db.SaveChangesAsync();

            var findLetter = _db.PatientsTransactions.FirstOrDefault(c => c.Id == formdata.TRId);
            var findLetter2 = _db.Pats_Referred.FirstOrDefault(c => c.TRId == formdata.TRId);

            if (findLetter.Travel == 1)
            {
                findLetter.Travel = 2;

            }

            else if (findLetter.Travel == 2)
            {
                findLetter.Travel = 1;
                findLetter2.Rejected = 1;
            }


            _db.Entry(findLetter).State = EntityState.Modified;
            _db.Entry(findLetter2).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Traveling Procedure was Added Successfully"));

        }

        //======================================================================================

        [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateTravelBack([FromRoute] int id, [FromBody] TravelersBack formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findTravel = _db.TravelersBack.FirstOrDefault(p => p.Id == id);

            if (findTravel == null)
            {
                return NotFound();
            }

            // If the Patient was found
            findTravel.PatientId = formdata.PatientId;
            findTravel.TRId = formdata.TRId;
            findTravel.FlightNom = formdata.FlightNom;
            findTravel.FlightDate = formdata.FlightDate;
            findTravel.AirlineName = formdata.AirlineName;
            findTravel.Attach = formdata.Attach;
            findTravel.UserId = formdata.UserId;
            findTravel.UserDate = DateTime.UtcNow;

            _db.Entry(findTravel).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The Patient with id " + id + " is updated his Traveling"));

        }


        //============================ Delete Traveling Procedure ==============================
        [Authorize(Policy = "RequireAddTravelingRole")]
        [HttpDelete("[action]/{id}/{trid}/{role}")]
        public async Task<IActionResult> DeleteTravelingBack([FromRoute] int id, [FromRoute] int trid, [FromRoute] string role)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findTraveling = await _db.TravelersBack.FindAsync(id);
            var findPatient = _db.PatientsTransactions.FirstOrDefault(x => x.Id == trid);

            if (findTraveling == null)
            {
                return NotFound();
            }
          
               _db.TravelersBack.Remove(findTraveling);
               await _db.SaveChangesAsync();

            if (role == "مسؤول التسفير")
            {

                if (findPatient.Travel == 2)
                {
                    findPatient.Travel = 3;

                }

                else if (findPatient.Travel == 3)
                {
                    findPatient.Travel = 2;

                }

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();


            }
            else
            {
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

            }
            return Ok(new JsonResult("The Patient with id " + id + " is Deleted his Traveling."));
        }
      
        //===========================================عرض الجرحى الذين قيد السفر للفروع===========================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetPTraveltoOutsideByBranchId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from tp in _db.TravelingProcedures
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId && pt.CountryId == c.Id 
                          && pt.Id == tp.TRId && tp.UserId == n.Id
                          && pt.LetterDest == b.Id && pt.ReplyState == 3 && pt.Travel == 1 && pt.Hotel == 0
                          orderby tp.UserDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              tp.AirlineName,
                              tp.Attach,
                              tp.FlightNom,
                              tp.FlightDate,
                              pt.PersonType,
                              tp.UserDate
                          }
                              ).ToList();

            return Ok(output);

        }
        //===================================عرض الجرحى الذين قيد السفر للفرع الرئيسي===========================
        [HttpGet("[action]")]
        public IActionResult GetPTraveltoOutsideforManagement()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from tp in _db.TravelingProcedures
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          tp.UserId == n.Id && tp.TRId == pt.Id
                          && pt.LetterDest == b.Id && pt.ReplyState == 3 && pt.Travel == 1 && pt.Hotel == 0
                          orderby tp.UserDate descending
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
                            //  pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.Attach,
                              tp.FlightNom,
                              pt.PersonType,
                              tp.UserDate

                          }
                              ).ToList();

            return Ok(output);

        }
       
        
        //=============================عرض تذاكر العودة للجرحى التابعين للفرع==================================
      
        [HttpGet("[action]/{id}")]
        public IActionResult GetPTravelBacktoInsideByBranchId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from tp in _db.TravelersBack
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          tp.UserId == n.Id && tp.TRId == pt.Id
                          && pt.LetterDest == b.Id 
                          orderby tp.UserDate descending

                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.LetterIndexNO,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              pt.PersonType,
                              tp.UserDate

                          }
                              ).ToList();

            return Ok(output);

        }
   
        //===============================عرض تذاكر العودة للإدارة ومسؤول التسفير=================================
       
        [HttpGet("[action]")]
        public IActionResult GetPTravelBacktoInsideforManagement()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from b in _db.Branches
                          from p in _db.TravelersBack
                          from c in _db.Countries
                          from pt in _db.PatientsTransactions
                          where pd.Id == pt.PatientId && pt.CountryId == c.Id &&
                          pt.LetterDest == b.Id && p.UserId == n.Id && pt.Id == p.TRId 
                          orderby p.UserDate descending
                          //&& (pt.Travel == 3 || pt.Travel == 4)
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.LetterIndexNO,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              pt.Treatment,
                              p.FlightDate,
                              p.FlightNom,
                              p.AirlineName,
                              p.Attach   ,
                              pt.PersonType,
                              p.UserDate
                          }
                              ).ToList();

            return Ok(output);

        }

        //===============================عرض تذاكر الذهاب حسب الشخص=================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetTravelingProceduresByPatientId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from tp in _db.TravelingProcedures
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.Id == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && tp.UserId == n.Id && pt.Id == tp.TRId
                          orderby tp.UserDate descending
                          select new
                          {
                              tp.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Travel,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              tp.UserId,
                              c.Country,
                              n.PhoneNumber,
                              tp.AirlineName,
                              tp.FlightDate,
                              tp.FlightNom,
                              tp.Attach,
                              tp.TRId,
                              b.BranchName,
                              pt.PersonType,
                              tp.Hotel
                          }
                       ).ToList();
            return Ok(output);

        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTravelingBackByPatientId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from p in _db.TravelersBack
                          from n in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.Id == id && pd.Id == pt.PatientId
                          && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId
                          orderby p.UserDate descending
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
                              p.FlightDate,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.FlightNom,
                              p.AirlineName,
                              c.Country,
                              n.PhoneNumber,
                              b.BranchName,
                              pd.PersonType
                          }
                       ).ToList();
            return Ok(output);

        }



    }
}
