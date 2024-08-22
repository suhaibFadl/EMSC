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
    public class DependencyController : ControllerBase
    {

        private readonly EMSCDBContext _db;

        public DependencyController(EMSCDBContext db)
        {
            _db = db;

        }

        //============================ ADD Dependency ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddDependency([FromBody] Dependency formdata)
        {
            List<string> ErrorList = new List<string>();

            var newDepen = new Dependency
            {
               DependencyType  = formdata.DependencyType

            };
            bool DepenExists = _db.Dependency.Any(x => x.DependencyType == newDepen.DependencyType);

            if (!DepenExists)
            {
                await _db.Dependency.AddAsync(newDepen);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Dependency was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Dependency is already exist"));
            }

        }


        //==================================Get Branch=========================================

        //  [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetDependencies()
        {
            var output = (
                       from c in _db.Dependency
                       where c.DependencyType != "_"
                       orderby c.DependencyType ascending
                       select new
                       {
                           c.DependencyType,
                           c.Id

                       }
                           ).ToList();


            return Ok(output);
            // return Ok(_db.Dependency.ToList());

        }

        //=================================UPDATE Branch===============================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateDependency([FromRoute] int id, [FromBody] Dependency fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findDependency = _db.Dependency.FirstOrDefault(c => c.Id == id);

            if (findDependency == null)
            {
                return NotFound();
            }

            findDependency.DependencyType = fromdata.DependencyType;
            bool DepenExists = _db.Dependency.Any(x => x.DependencyType == findDependency.DependencyType && x.Id != id);
            if (!DepenExists)
            {
                _db.Entry(findDependency).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Dependency with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The Dependency is Exist."));
            }

        }

        //=======================DELETE Branches==========================================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteDependency([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient
            var findDependency = await _db.Dependency.FindAsync(id);

            if (findDependency == null)
            {
                return NotFound();
            }

            bool findDepenId = _db.PatientsData.Any(PT => PT.DepenId == id);

            if (findDepenId)
                return BadRequest(new JsonResult("لا يمكن حذف التبعية لارتباطها ببيانات أخرى"));

            else
            {
                _db.Dependency.Remove(findDependency);
                await _db.SaveChangesAsync();

            }


            return Ok(new JsonResult("The Dependency with id " + id + " is Deleted."));



        }

    }
}
