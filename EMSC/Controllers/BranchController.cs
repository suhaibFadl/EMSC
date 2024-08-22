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
    public class BranchController : ControllerBase
    {
        private readonly EMSCDBContext _db;

        public BranchController(EMSCDBContext db)
        {
            _db = db;
         
        }
        //============================ ADD Branch ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]            
        public async Task<IActionResult> AddBranch([FromBody] Branches formdata)
        {
            List<string> ErrorList = new List<string>();

            var newBranch = new Branches
            {
                BranchName = formdata.BranchName

            };
            bool BranchExists = _db.Branches.Any(x => x.BranchName == newBranch.BranchName);

            if (!BranchExists)
            {
                await _db.Branches.AddAsync(newBranch);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Branch was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Branch is already exist"));
            }

        }
       
        
        //==================================Get Branch=========================================

      //  [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetBranches()
        {
            return Ok(_db.Branches.ToList());

        }

        //=================================UPDATE Branch===============================

        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateBranch([FromRoute] int id, [FromBody] Branches fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findBranch = _db.Branches.FirstOrDefault(c => c.Id == id);

            if (findBranch == null)
            {
                return NotFound();
            }

            findBranch.BranchName = fromdata.BranchName;
            bool BranchExists = _db.Branches.Any(x => x.BranchName == findBranch.BranchName && x.Id != id);
            if (!BranchExists)
            {
                _db.Entry(findBranch).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Branch with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The country is Exist."));
            }

        }
      
        //=======================DELETE Branches==========================================
        
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteBranch([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient
            var findBranch = await _db.Branches.FindAsync(id);

            if (findBranch == null)
            {
                return NotFound();
            }

            bool findSupervisor = _db.BranchesUsers.Any(SC => SC.BranchId == id);

            if (findSupervisor)
                return BadRequest(new JsonResult("لا يمكن حذف الفرع لارتباطها ببيانات أخرى"));


            bool findPatient = _db.PatientsData.Any(PT => PT.BranchId == id);

            if (findPatient)
                return BadRequest(new JsonResult("لا يمكن حذف الفرع لارتباطها ببيانات أخرى"));
            
            bool findPatientTransactionOutside = _db.PatientsTransactions.Any(PT => PT.LetterDest == id);

            if (findPatientTransactionOutside)
                return BadRequest(new JsonResult("لا يمكن حذف الفرع لارتباطها ببيانات أخرى"));

            bool findPatientTransactionInside = _db.PatientsTransactionsInside.Any(PT => PT.LetterDest == id);

            if (findPatientTransactionInside)
                return BadRequest(new JsonResult("لا يمكن حذف الفرع لارتباطها ببيانات أخرى"));
            
         

            _db.Branches.Remove(findBranch);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The branch with id " + id + " is Deleted."));



        }

      
    }

}
