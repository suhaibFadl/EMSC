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
    public class InjuryEventsController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public InjuryEventsController(EMSCDBContext db)
        {
            _db = db;

        }

        //============================ ADD Dependency ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddEvent([FromBody] InjuryEvents formdata)
        {
            List<string> ErrorList = new List<string>();

            var newEvent = new InjuryEvents
            {
                Event = formdata.Event

            };
            bool EventExists = _db.InjuryEvents.Any(x => x.Event == newEvent.Event);

            if (!EventExists)
            {
                await _db.InjuryEvents.AddAsync(newEvent);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Event was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Event is already exist"));
            }

        }


        //==================================Get Branch=========================================

        //  [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetInjuryEvents()
        {
            var output = (
                       from c in _db.InjuryEvents
                       where c.Event != "_"
                       orderby c.Event ascending
                       select new
                       {
                           c.Event,
                           c.Id

                       }
                           ).ToList();


            return Ok(output);
            // return Ok(_db.InjuryEvents.ToList());

        }

        //=================================UPDATE Branch===============================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateEvent([FromRoute] int id, [FromBody] InjuryEvents fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findEvent = _db.InjuryEvents.FirstOrDefault(c => c.Id == id);

            if (findEvent == null)
            {
                return NotFound();
            }

            findEvent.Event = fromdata.Event;
            bool EventExists = _db.InjuryEvents.Any(x => x.Event == findEvent.Event && x.Id != id);
            if (!EventExists)
            {
                _db.Entry(findEvent).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The event with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The event is Exist."));
            }

        }

        //=======================DELETE Branches==========================================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteEvent([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient
            var findEvent = await _db.InjuryEvents.FindAsync(id);

            if (findEvent == null)
            {
                return NotFound();
            }

            bool findEventId = _db.PatientsData.Any(PT => PT.EventId == id);

            if (findEventId)
                return BadRequest(new JsonResult("لا يمكن حذف حدث الإصابة لارتباطها ببيانات أخرى"));

            else
            {
                _db.InjuryEvents.Remove(findEvent);
                await _db.SaveChangesAsync();

            }


            return Ok(new JsonResult("The Dependency with id " + id + " is Deleted."));



        }

    }
}
