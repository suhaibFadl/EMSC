using EMSC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class ClaimsController : Controller
    {
        private readonly EMSCDBContext _db;

        public ClaimsController(EMSCDBContext db)
        {
            _db = db;

        }
      


        //============================ Open File In Hospital  ==============================
        //  [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> AddNewFile([FromRoute] int id,[FromBody] PatientHosp formdata)
        {
            List<string> ErrorList = new List<string>();



            //Create New Claim

            var TRData = _db.PatientsTransactionsInside.FirstOrDefault(c => c.Id == id);


            var NewClaim = new Claims
            {
                EntryDate = formdata.OpenDate,
                TRId = TRData.Id,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
            };



            await _db.Claims.AddAsync(NewClaim);

            await _db.SaveChangesAsync();

            var NewFile = new PatientHosp
            {
                FileNo = formdata.FileNo,
                PatientId = formdata.PatientId,
                HospitalId = TRData.HospitalId,
                UserId = formdata.UserId,
                OpenDate = formdata.OpenDate,
                UserDate = DateTime.UtcNow,

            };

            await _db.PatientHosps.AddAsync(NewFile);

            await _db.SaveChangesAsync();




            //Change filestatus to 1 == entried the hospital
            var findTR = _db.PatientsTransactionsInside.FirstOrDefault(c => c.Id == TRData.Id);

            if (findTR == null)
            {
                return NotFound();
            }


            findTR.FileStatus = 1;
          //  findTR.ReplyState = 2;


            _db.Entry(findTR).State = EntityState.Modified;

            await _db.SaveChangesAsync();



            return Ok(new JsonResult("The File was Added Successfully"));


        }


        //================================open new claim In Hospital If file Exist=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public async Task<IActionResult> GetPatientFileInHospital([FromBody] PatientHosp formdata)
        {
            var findFile = _db.PatientHosps.FirstOrDefault(c => c.PatientId == formdata.PatientId && c.HospitalId == formdata.HospitalId);



            //Create New Claim For New Letter
            var TRData = _db.PatientsTransactionsInside.FirstOrDefault(c => c.PatientId == formdata.PatientId && c.FileStatus == 0 && c.HospitalId == formdata.HospitalId);


            var NewClaim = new Claims
            {
                EntryDate = formdata.OpenDate,
                TRId = TRData.Id,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
            };

            await _db.Claims.AddAsync(NewClaim);

            await _db.SaveChangesAsync();



            //Change filestatus to 1 == entried the hospital
            var findTR = _db.PatientsTransactionsInside.FirstOrDefault(c => c.Id == TRData.Id);

            if (findTR == null)
            {
                return NotFound();
            }


            findTR.FileStatus = 1;


            _db.Entry(findTR).State = EntityState.Modified;

            await _db.SaveChangesAsync();


            return Ok(findFile);

            //  return Ok(_db.Countries.ToList());

        }

        
        //================================Get Patient File if exist=============================

        [AllowAnonymous]
        [HttpGet("GetPatientHospitalFileId/{patientId}/{hospitalId}")]

        public async Task<IActionResult> GetPatientHospitalFileId([FromRoute] int patientId, [FromRoute] int hospitalId)
        {
            var findFile = _db.PatientHosps.FirstOrDefault(c => c.PatientId == patientId && c.HospitalId == hospitalId);

            //if(findFile != null)
                 return Ok(findFile);
            //else
            //    return Ok("hello");
            //  return Ok(_db.Countries.ToList());

        }  
        
        [AllowAnonymous]
        [HttpGet("[action]")]

        public  async Task<IActionResult> GetPatientHospitals()
        {
            var findFile = await _db.PatientHosps.ToListAsync();

            //if(findFile != null)
                 return Ok(findFile);
            //else
            //    return Ok("hello");
            //  return Ok(_db.Countries.ToList());

        }

        //============================ Add Claim Services  ==============================
        //  [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> AddServicesToCLaims([FromRoute] int id ,[FromBody] ClaimsServices formdata)
        {
            List<string> ErrorList = new List<string>();

            var claim = _db.Claims.FirstOrDefault(c => c.TRId == id);

            bool CheckServ = _db.ClaimsServices.Any(c => c.ClaimId == claim.Id && c.ServId == formdata.ServId && c.ServDate == formdata.ServDate);

            if(CheckServ)
            {

                var findServ = _db.ClaimsServices.FirstOrDefault(c => c.ClaimId == claim.Id && c.ServId == formdata.ServId);

                findServ.Quantity+= formdata.Quantity;
                _db.Entry(findServ).State = EntityState.Modified;

                await _db.SaveChangesAsync();


                var findclaim = _db.Claims.FirstOrDefault(c => c.Id == claim.Id);


                double claimtotal = Convert.ToDouble(findclaim.ClaimTotal);

                claimtotal += Convert.ToDouble(formdata.Quantity) * Convert.ToDouble(formdata.Price);


                findclaim.ClaimTotal = claimtotal.ToString();
                

                _db.Entry(findclaim).State = EntityState.Modified;

                await _db.SaveChangesAsync();



                return Ok(new JsonResult("The service was Added Successfully"));


            }


            var NewServ = new ClaimsServices
            {
                ClaimId = claim.Id,
                AAllowed = formdata.Quantity,
                Allowed = 0,
                Price = formdata.Price,
                Quantity = formdata.Quantity, 
                HospUserDate = DateTime.UtcNow,
                ServDate = formdata.ServDate,
                HospUserId = formdata.HospUserId ,
                ServId = formdata.ServId,

            };

            await _db.ClaimsServices.AddAsync(NewServ);

            await _db.SaveChangesAsync();



            var findclaim2 = _db.Claims.FirstOrDefault(c => c.Id == claim.Id);

            Console.WriteLine("abdo ahmed xoo " + findclaim2);
            double claimtotal2 = Convert.ToDouble(findclaim2.ClaimTotal);

            claimtotal2 += Convert.ToDouble(formdata.Quantity) * Convert.ToDouble(formdata.Price);


            findclaim2.ClaimTotal = claimtotal2.ToString();


            _db.Entry(findclaim2).State = EntityState.Modified;

            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The service was Added Successfully"));


        }



        //=================================UPDATE Services In Claims===============================
        //   [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateServicesInClaims([FromRoute] int id, [FromBody] ClaimsServices fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //==========================================================

            var findserv = _db.ClaimsServices.FirstOrDefault(c => c.Id == id);

            var findclaim = _db.Claims.FirstOrDefault(c => c.Id == findserv.ClaimId);

            double claimtotal = Convert.ToDouble(findclaim.ClaimTotal);

            claimtotal -= Convert.ToDouble(findserv.Quantity) * Convert.ToDouble(findserv.Price);

            claimtotal += Convert.ToDouble(fromdata.Quantity) * Convert.ToDouble(fromdata.Price);

            findclaim.ClaimTotal = claimtotal.ToString();

            _db.Entry(findclaim).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            //=======================================




            if (findserv == null)
            {
                return NotFound();
            }

            findserv.Quantity = fromdata.Quantity;
            findserv.ServDate = fromdata.ServDate;

            // If the country was found

            _db.Entry(findserv).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The List with id " + id + " is updated."));


        }

        //=======================DELETE Service From Claims==========================================
        // [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteServicesFromClaims([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findserv = _db.ClaimsServices.FirstOrDefault(c => c.Id == id);
            var findclaim = _db.Claims.FirstOrDefault(c => c.Id == findserv.ClaimId);


            double claimtotal = Convert.ToDouble(findclaim.ClaimTotal);

            claimtotal -= Convert.ToDouble(findserv.Quantity) * Convert.ToDouble(findserv.Price);


            findclaim.ClaimTotal = claimtotal.ToString();


            _db.Entry(findclaim).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            // find the Country

            var findItem = await _db.ClaimsServices.FindAsync(id);

            if (findItem == null)
            {
                return NotFound();
            }
              


            _db.ClaimsServices.Remove(findItem);

            await _db.SaveChangesAsync();



            return Ok(new JsonResult("The Services with id " + id + " is Deleted."));

            //=============================================================================



        }

        //=================================Close Claim===============================
        //   [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]")]
        public async Task<IActionResult> CloseCLaims([FromBody] Claims fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //==========================================================
             

            var findclaim = _db.Claims.FirstOrDefault(c => c.Id == fromdata.Id);

            findclaim.ExitDate = fromdata.ExitDate;
            findclaim.BillDate = fromdata.BillDate;
            findclaim.ClaimType = fromdata.ClaimType;
            findclaim.BillNo = fromdata.BillNo;
            findclaim.Diagnosis = fromdata.Diagnosis;
            findclaim.Notes = fromdata.Notes;
             

            _db.Entry(findclaim).State = EntityState.Modified;

            await _db.SaveChangesAsync();


            var findtra = _db.PatientsTransactionsInside.FirstOrDefault(c => c.Id == findclaim.TRId);

            findtra.FileStatus = 2;
            
            _db.Entry(findtra).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Claim Closed is updated."));


        }

        //================================Get Claim Details=============================

        [HttpGet("[action]/{id}")]

        public IActionResult GetClaim([FromRoute] int id)
        {
            var claim = _db.Claims.FirstOrDefault(c => c.Id == id);
            return Ok(claim);
        }

        [AllowAnonymous]
        [HttpGet("[action]/{id}")]

        public IActionResult GetClaimDetails([FromRoute] int id)
        {

            var claim = _db.Claims.FirstOrDefault(c => c.TRId == id);
            var output = (
                        from c in _db.Claims 
                        from tr in _db.PatientsTransactionsInside
                        from p in _db.PatientsData
                        where c.Id == claim.Id
                        && tr.Id == c.TRId
                        && p.Id == tr.PatientId 
                        select new
                        {
                            c.Id,
                            c.BatchId,
                            c.BillNo,
                            c.BillDate,
                            c.EntryDate,
                            c.ExitDate,
                            c.ClaimType,
                            c.ClaimTotal,
                            c.Diagnosis,
                            c.Notes,
                            c.UserId,
                            c.UserDate,
                            c.Allowed,
                            c.Rejected
                            ,p.PatientName,
                            p.PassportNo,
                            p.NationalNo,
                            tr.LetterDate,
                            tr.LetterIndexNO


                        }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }
        //================================Get Claim Services=============================
       
        [AllowAnonymous]
        [HttpGet("[action]/{id}")]

        public IActionResult GetClaimServices([FromRoute] int id)
        {
            var claim = _db.Claims.FirstOrDefault(c => c.TRId == id);
            var output = ( 
                        from cs in _db.ClaimsServices
                        from ms in _db.MedicalServices
                        from u in _db.Users
                        where   cs.ClaimId == claim.Id
                        && ms.Id == cs.ServId
                        && u.Id == cs.HospUserId
                         orderby cs.ServDate ascending
                         select new
                         {
                           ms.ServArName,
                           ms.ServEnName,
                           cs.Price,
                           cs.Quantity,
                           cs.AAllowed
                           ,cs.Allowed
                           ,cs.AgentNotes
                           ,cs.UserNotes
                           ,cs.ServDate
                           ,u.PhoneNumber
                           ,cs.Id,
                           cs.ServId

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }

        //================================Get Batch Details=============================

        [AllowAnonymous]
        [HttpGet("[action]/{id}")]

        public IActionResult GetBatchDetals([FromRoute] int id)
        {
            var output = (
                        from b in _db.Batches
                        from h in _db.Hospitals
                        where b.Id == id
                        && h.Id == b.HospId
                        select new
                        {
                            b.Id,
                            b.IndexNo,
                            b.Year,
                            b.Month,
                            h.HospName,
                            b.HospRank,
                            b.ClaimCounter,
                            b.TotalAmount,
                            b.Rejects,
                            b.Allowed


                        }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }

        //================================Get Batch Claims=============================

        [AllowAnonymous]
        [HttpGet("[action]/{id}")]

        public IActionResult GetBatchClaims([FromRoute] int id)
        {
            var output = (
                        from c in _db.Claims
                        from tr in _db.PatientsTransactionsInside
                        from p in _db.PatientsData
                        where c.BatchId == id
                        && tr.Id == c.TRId
                        && p.Id == tr.PatientId
                        select new
                        {
                            c.Id,
                            c.BatchId,
                            c.BillNo,
                            c.BillDate,
                            c.EntryDate,
                            c.ExitDate,
                            c.ClaimType,
                            c.ClaimTotal,
                            c.Diagnosis,
                            c.Notes,
                            c.UserId,
                            c.UserDate,
                            c.Allowed,
                            c.Rejected
                            ,
                            p.PatientName,
                            p.PassportNo,
                            p.NationalNo,
                            tr.LetterDate,
                            tr.LetterIndexNO


                        }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }

        //================================Get Hospital Batches=============================

        [AllowAnonymous]
        [HttpGet("[action]/{id}")]

        public IActionResult GetHospitalBatches([FromRoute] int id)
        {
            var output = (
                         from b in _db.Batches
                         from h in _db.Hospitals
                         where b.HospId == id
                         && h.Id == b.HospId
                         select new
                         {
                             b.Id,
                             b.IndexNo,
                             b.Year,
                             b.Month,
                             h.HospName,
                             b.HospRank,
                             b.ClaimCounter,
                             b.TotalAmount,
                             b.Rejects,
                             b.Allowed


                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }
    }
}
