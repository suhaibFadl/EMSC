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

    public class HotelsOutsideController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public HotelsOutsideController(EMSCDBContext db)
        {
            _db = db;

        }


        //============================ ADD New Hotel Name ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHotelOutside([FromBody] HotelsOutside formdata)
        {
            List<string> ErrorList = new List<string>();

            var newHotelName = new HotelsOutside
            {
                HotelName = formdata.HotelName,
                CountryId = formdata.CountryId

            };
            bool HotelNameExists = _db.HotelsOutside.Any(x => x.HotelName == newHotelName.HotelName &&  x.CountryId == formdata.CountryId);

            if (!HotelNameExists)
            {
                await _db.HotelsOutside.AddAsync(newHotelName);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Hotel Name was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Hotel Name is already exist In this country"));
            }

        }
       


        //==================================Get Hotels Outside=========================================
        
        [AllowAnonymous]
        [HttpGet("[action]")]
        public IActionResult GetAllHotelsOutside()
        {
            var output = (
                          from hc in _db.HotelsOutside

                          join c in _db.Countries on hc.CountryId equals c.Id

                          where hc.CountryId == c.Id
                          select new
                          {
                              c.Country,
                              hc.HotelName,
                              hc.CountryId,
                              hc.Id

                          }
                              ).ToList();


            return Ok(output);
        }

        //==================================Update Hotels Outside=========================================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHotelOutside([FromRoute] int id, [FromBody] HotelsOutside fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findHotel = _db.HotelsOutside.FirstOrDefault(c => c.Id == id);

            if (findHotel == null)
            {
                return NotFound();
            }

            findHotel.HotelName = fromdata.HotelName;
            findHotel.CountryId = fromdata.CountryId;

            bool HotelExists = _db.HotelsOutside.Any(x => x.HotelName == findHotel.HotelName && x.CountryId == fromdata.CountryId &&  x.Id != id);

            if (!HotelExists)
            {
                _db.Entry(findHotel).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Hotel with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The Hotel Name is Exist In this country."));
            }

        }
        //=============================================================================

        //=======================DELETE Branches==========================================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHotelOutside([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the HotelName
            var findHotelName = await _db.HotelsOutside.FindAsync(id);

            if (findHotelName == null)
            {
                return NotFound();
            }

            bool findHotelId = _db.HotelMovements.Any(SC => SC.HotelId == id);

            if (findHotelId)
                return BadRequest(new JsonResult("لا يمكن حذف الفندق لارتباطه ببيانات أخرى"));


            _db.HotelsOutside.Remove(findHotelName);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Hotel with id " + id + " is Deleted."));


        }


        [AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetHotelsOutsideByCountryId([FromRoute] int id)
        {

            var output = (
                          from hc in _db.HotelsOutside

                          from c in _db.Countries

                          where hc.CountryId == id && hc.CountryId == c.Id
                          select new
                          {
                              c.Country,
                              hc.HotelName,
                              hc.Id
                          }
                              ).ToList();


            return Ok(output);

        }

    }
}
