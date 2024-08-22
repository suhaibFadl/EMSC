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
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class HospitalController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public HospitalController(EMSCDBContext db)
        {
            _db = db;

        }

        //===========================================================================
        [AllowAnonymous]
        [HttpGet("[action]")]
        public IActionResult GetHospitals()
        {
            return Ok(_db.Hospitals.ToList());

        }

        //============================ ADD Hospital ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHospital([FromBody] Hospitals formdata)
        {
            List<string> ErrorList = new List<string>();

            var newHospital = new Hospitals
            {
                HospName = formdata.HospName

            };
            bool HospitalExists = _db.Hospitals.Any(x => x.HospName == newHospital.HospName);

            if (!HospitalExists)
            {
                await _db.Hospitals.AddAsync(newHospital);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Hospital was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Hospital is already exist"));
            }

        }
       
        //=================================UPDATE Hospital===============================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHospital([FromRoute] int id, [FromBody] Hospitals fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findHospital = _db.Hospitals.FirstOrDefault(h => h.Id == id);

            if (findHospital == null)
            {
                return NotFound();
            }

            // If the mail was found
            findHospital.HospName = fromdata.HospName;
            _db.Entry(findHospital).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Hospital with id " + id + " is updated."));

        }
        
        //=============================================================================
        //=======================DELETE Hospitals======================================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHospital([FromRoute] int id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // find the Hospital

        var findHospital = await _db.Hospitals.FindAsync(id);

        if (findHospital == null)
        {
            return NotFound();
        }


            bool findHospitalUser = _db.HospitalsUsers.Any(SC => SC.HospitalId == id);

            if (findHospitalUser)
                return BadRequest(new JsonResult("لا يمكن حذف المصحة لارتباطها ببيانات أخرى"));


            bool findPatientTransactionInside = _db.PatientsTransactionsInside.Any(PT => PT.HospitalId == id);

            if (findPatientTransactionInside)
                return BadRequest(new JsonResult("لا يمكن حذف المصحة لارتباطها ببيانات أخرى"));

            
            


       _db.Hospitals.Remove(findHospital);

        await _db.SaveChangesAsync();

        return Ok(new JsonResult("The Hospital with id " + id + " is Deleted."));

        //=============================================================================

    }
        
        //===========================================================================
        
        [AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetHospitalsByCountryId([FromRoute] int id)
        {

            var output = (
                          from hc in _db.HospsCountr

                          from c in _db.Countries

                          where hc.CountryId == id && hc.CountryId == c.Id
                          select new
                          {
                              c.Country,
                              hc.HospitalName,
                              hc.Id
                          }
                              ).ToList();


            return Ok(output);

        }
       
        //===========================================================================
       
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetHospitalsCountriesByManagemet()
        {


            var output = (
                          from hc in _db.HospsCountr

                          join c in _db.Countries on hc.CountryId equals c.Id

                          where hc.CountryId == c.Id 
                          select new
                          {
                              c.Country,
                              hc.HospitalName,
                              hc.CountryId,
                              hc.Id

                          }
                              ).ToList();


            return Ok(output);
        }

        //============================ ADD Hospital ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHospitalCountry([FromBody] HospsCountr formdata)
        {
            List<string> ErrorList = new List<string>();

            var newHospital = new HospsCountr
            {
                HospitalName = formdata.HospitalName,
                CountryId = formdata.CountryId,
                UserId = formdata.UserId,

            };
            bool HospitalExists = _db.HospsCountr.Any(x => x.HospitalName == newHospital.HospitalName && x.CountryId == newHospital.CountryId);

            if (!HospitalExists)
            {
                await _db.HospsCountr.AddAsync(newHospital);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Hospital was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Hospital is already exist"));
            }

        }

        //===========================================================================
        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetHospitalCountry()
        {
            return Ok(_db.HospsCountr.ToList());

        }
        //=================================UPDATE Hospital===============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHospitalCountry([FromRoute] int id, [FromBody] HospsCountr fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findHospital = _db.HospsCountr.FirstOrDefault(h => h.Id == id);

            if (findHospital == null)
            {
                return NotFound();
            }

            findHospital.HospitalName = fromdata.HospitalName;
            findHospital.CountryId = fromdata.CountryId;

            bool HospitalExists = _db.HospsCountr.Any(x => x.HospitalName == findHospital.HospitalName && x.CountryId == fromdata.CountryId && x.Id != id);

            if (!HospitalExists)
            {
                _db.Entry(findHospital).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The HospitalName with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The HospitalName Name is Exist In this country."));
            }


        }
        //=============================================================================
        //=======================DELETE Hospitals======================================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHospitalCountry([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findHospital = await _db.HospsCountr.FindAsync(id);

            if (findHospital == null)
            {
                return NotFound();
            }

           


            bool findPatient = _db.TreatmentMovements.Any(PT => PT.HospitalCountryId == id);

            if (findPatient)
                return BadRequest(new JsonResult("لا يمكن حذف الدولة لارتباطها ببيانات أخرى"));

            //=========================================================


            _db.HospsCountr.Remove(findHospital);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The hospital with id " + id + " is Deleted."));

            //=============================================================================


        }

        //=================================UPDATE Hospital===============================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHospitalsCountriesManagemet([FromRoute] int id, [FromBody] HospsCountr fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findHospital = _db.HospsCountr.FirstOrDefault(h => h.Id == id);

            if (findHospital == null)
            {
                return NotFound();
            }

            findHospital.HospitalName = fromdata.HospitalName;
            findHospital.CountryId = fromdata.CountryId;

            bool HospitalExists = _db.HospsCountr.Any(x => x.HospitalName == findHospital.HospitalName && x.CountryId == fromdata.CountryId && x.Id != id);

            if (!HospitalExists)
            {
                _db.Entry(findHospital).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The HospitalName with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The HospitalName Name is Exist In this country."));
            }

            //// If the mail was found
            //findHospital.HospitalName = fromdata.HospitalName;
            //findHospital.CountryId = fromdata.CountryId;
            //findHospital.UserId = fromdata.UserId;

            //_db.Entry(findHospital).State = EntityState.Modified;

            //await _db.SaveChangesAsync();

            //return Ok(new JsonResult("The Hospital with id " + id + " is updated."));

        }
        //=============================================================================

        //=======================DELETE country==========================================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHospitalCountryByManagement([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findHospital = await _db.HospsCountr.FindAsync(id);

            if (findHospital == null)
            {
                return NotFound();
            }

           


            bool findPatient = _db.TreatmentMovements.Any(PT => PT.HospitalCountryId == id);

            if (findPatient)
                return BadRequest(new JsonResult("لا يمكن حذف الدولة لارتباطها ببيانات أخرى"));

            //=========================================================


            _db.HospsCountr.Remove(findHospital);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The hospital with id " + id + " is Deleted."));

            //=============================================================================



        }



        //=======================Abdo

        [AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetHospitalById([FromRoute]int id)
        {
            var output = (
                         from hc in _db.Hospitals
                          

                         where hc.Id == id
                         select new
                         { 
                             hc.HospName,
                             hc.Id,
                             hc.ListId,
                             hc.Rank
                         }
                             ).ToList();


            return Ok(output);

        }


    }
}
    
    
