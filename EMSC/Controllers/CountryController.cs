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

    public class CountryController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public CountryController(EMSCDBContext db)
        {
            _db = db;

        }

        //============================ ADD Country ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddCountry([FromBody] Countries formdata)
        {
            List<string> ErrorList = new List<string>();

            var newCountry = new Countries
            {
                Country = formdata.Country

            };
            bool CountryExists = _db.Countries.Any(x => x.Country == newCountry.Country);

            if (!CountryExists)
            {
                await _db.Countries.AddAsync(newCountry);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Country was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Country is already exist"));
            }

        }
        //===========================================================================

        //================================Get Countryies=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetCountries()
        {
            var output = (
                         from c in _db.Countries
                        
                         orderby c.Country ascending
                         select new
                         {
                             c.Country,
                             c.Id

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }

        //================================Get Countryies=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetCountriesBraches()
        {
            var output = (
                         from c in _db.Countries
                         orderby c.Country ascending
                         where c.active == "1"
                         select new
                         {
                             c.Country,
                             c.Id

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }
        //=================================UPDATE Country===============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateCountry([FromRoute] int id, [FromBody] Countries fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newCountry = new Countries
            {
                Country = fromdata.Country

            };

            var findCountry = _db.Countries.FirstOrDefault(c => c.Id == id);

            if (findCountry == null)
            {
                return NotFound();
            }

        
            findCountry.Country = fromdata.Country;

            // If the country was found
            bool CountryExists = _db.Countries.Any(x => x.Country == findCountry.Country && x.Id != id);
            if (!CountryExists)
            {
                _db.Entry(findCountry).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The country with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The country is Exist."));
            }
            

        }
        //=============================================================================

        //=======================DELETE country==========================================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteCountry([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findCountry = await _db.Countries.FindAsync(id);

            if (findCountry == null)
            {
                return NotFound();
            }

            bool findSupervisor = _db.SupervisorCountries.Any(SC => SC.CountryId == id);

            if (findSupervisor)
                return BadRequest(new JsonResult("لا يمكن حذف الدولة لارتباطها ببيانات أخرى"));


            bool findPatient =  _db.PatientsTransactions.Any(PT => PT.CountryId == id);

            if (findPatient)
                return BadRequest(new JsonResult("لا يمكن حذف الدولة لارتباطها ببيانات أخرى"));

                  bool findHospitalCountry =  _db.HospsCountr.Any(PT => PT.CountryId == id);

            if (findHospitalCountry)
                return BadRequest(new JsonResult("لا يمكن حذف الدولة لارتباطها ببيانات أخرى"));
                 


            _db.Countries.Remove(findCountry);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The country with id " + id + " is Deleted."));

            //=============================================================================



        }
    }
}
