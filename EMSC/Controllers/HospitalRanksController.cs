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

    public class HospitalRanksController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public HospitalRanksController(EMSCDBContext db)
        {
            _db = db;

        }

        //============================ ADD Hospital Rank ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddHospitalRank([FromBody] HospitalRanks formdata)
        {
            List<string> ErrorList = new List<string>();

            var newHospitalRank = new HospitalRanks
            {
                RankName = formdata.RankName,
                RankPer = formdata.RankPer,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };
            bool isHospitalRankExists = _db.HospitalRanks.Any(x => x.RankName == newHospitalRank.RankName);

            if (!isHospitalRankExists)
            {
                await _db.HospitalRanks.AddAsync(newHospitalRank);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Hospital Rank was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Hospital Rank is already exist"));
            }

        }
        //===========================================================================

        //================================Get Hospital Ranks=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetHospitalRanks()
        {
            var output = (
                         from hr in _db.HospitalRanks

                         orderby hr.RankName ascending
                         select new
                         {
                             hr.RankName,
                             hr.Id

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }


        //=================================UPDATE Hospital Rank===============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateHospitalRank([FromRoute] int id, [FromBody] HospitalRanks fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findHospitalRank = _db.HospitalRanks.FirstOrDefault(hr => hr.Id == id);

            if (findHospitalRank == null)
            {
                return NotFound();
            }


            findHospitalRank.RankName = fromdata.RankName;

            // If the country was found
            bool isHospitalRankExists = _db.HospitalRanks.Any(hr => hr.RankName == findHospitalRank.RankName && hr.Id != id);
            if (!isHospitalRankExists)
            {
                _db.Entry(findHospitalRank).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Hospital Rank with ID " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The Hospital Rank is Exist."));
            }


        }
        //=============================================================================

        //=======================DELETE Hospital Rank==========================================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteHospitalRank([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findHospitalRank = await _db.HospitalRanks.FindAsync(id);

            if (findHospitalRank == null)
            {
                return NotFound();
            }

            bool hasHospitals = _db.Hospitals.Any(h => h.Rank == id);

            if (hasHospitals)
                return BadRequest(new JsonResult("لا يمكن حذف المدينة لارتباطها ببيانات أخرى"));




            _db.HospitalRanks.Remove(findHospitalRank);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The Hospital Rank with ID " + id + " is Deleted."));

            //=============================================================================



        }
    }
}
