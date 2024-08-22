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

    public class CitiesController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public CitiesController(EMSCDBContext db)
        {
            _db = db;

        }

        //============================ ADD city ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddCity([FromBody] Cities formdata)
        {
            List<string> ErrorList = new List<string>();

            var newCity = new Cities
            {
                City = formdata.City,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };
            bool CityExists = _db.Cities.Any(x => x.City == newCity.City);

            if (!CityExists)
            {
                await _db.Cities.AddAsync(newCity);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The City was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The City is already exist"));
            }

        }
        //===========================================================================

        //================================Get cities=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetCities()
        {
            var output = (
                         from c in _db.Cities

                         orderby c.City ascending
                         select new
                         {
                             c.City,
                             c.Id

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }

        
        //=================================UPDATE city===============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateCity([FromRoute] int id, [FromBody] Cities fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
       

            var findCityy = _db.Cities.FirstOrDefault(c => c.Id == id);

            if (findCityy == null)
            {
                return NotFound();
            }


            findCityy.City = fromdata.City;

            // If the country was found
            bool CityyExists = _db.Cities.Any(x => x.City == findCityy.City && x.Id != id);
            if (!CityyExists)
            {
                _db.Entry(findCityy).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The city with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The city is Exist."));
            }


        }
        //=============================================================================

        //=======================DELETE City==========================================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteCity([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findCity = await _db.Cities.FindAsync(id);

            if (findCity == null)
            {
                return NotFound();
            }

            bool findSupervisor = _db.Hospitals.Any(SC => SC.CityId == id);

            if (findSupervisor)
                return BadRequest(new JsonResult("لا يمكن حذف المدينة لارتباطها ببيانات أخرى"));




            _db.Cities.Remove(findCity);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The city with id " + id + " is Deleted."));

            //=============================================================================



        }
    }
}
