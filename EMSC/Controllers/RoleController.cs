using EMSC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {


        private RoleManager<IdentityRole> _roleManager;
        private readonly EMSCDBContext _db;


        public RoleController(RoleManager<IdentityRole> roleManager, EMSCDBContext db)
        {
          
            _roleManager = roleManager;
            _db = db;
        }

        //============================ ADD Role ==============================
        [AllowAnonymous]

        [HttpPost("[action]")]
        public async Task<IActionResult> AddRole([FromBody] RoleModel formdata)
        {
            List<string> ErrorList = new List<string>();



            bool CurrencyExists = _db.Roles.Any(x => x.Name == formdata.Role);

            if (!CurrencyExists)
            {
                var newRole = new IdentityRole();
                {
                    newRole.Name = formdata.Role;
                    await _roleManager.CreateAsync(newRole);

                };
                return Ok(newRole);
            }

            else
            {
                return BadRequest(new JsonResult("The Role is already exist"));
            }

        }

        //========================================================

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetRolesForBranches()
        {
            var output = (from r in _db.Roles
                          where r.Name == "مدير الفرع" || r.Name == "موظف إدخال الفرع" 
                          select new
                          {
                              r.Id, r.Name

                          }
                            ).ToList();
            return Ok(output);
        }
        //========================================================

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetRolesForManagement()
        {
            var output = (from r in _db.Roles
                          where r.Name == "موظف إدخال البيانات الرئيسية" || r.Name == "موظف إدخال بيانات جرحى ورسائل إحالة" 
                          || r.Name == "مسؤول التسفير" || r.Name == "مندوب المصحة" || r.Name == "لجنة المتابعة"
                          || r.Name == "موظف المركز_الصيدلية" || r.Name== "الشؤون الطبية بالمركز"
                          select new
                          {
                              r.Id, r.Name

                          }
                            ).ToList();
            return Ok(output);
        }
        //========================================================

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetRolesForSupervisors()
        {
            var output = (from r in _db.Roles
                          where r.Name == "مشرف إداري" || r.Name == "مشرف طبي" 
                          || r.Name == "مشرف عام"|| r.Name == "مشرف تسكين" 
                          || r.Name == "المصحات بالخارج" || r.Name == "شركة التسكين"
                          || r.Name == "لجنة الحصر" 
                          select new
                          {
                              r.Id, r.Name

                          }
                            ).ToList();
            return Ok(output);

        }
        //========================================================

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetRolesForHospitalsInside()
        {
            var output = (from r in _db.Roles
                          where r.Name == "مدير المصحة" || r.Name == "موظف إدخال المصحة"
                          select new
                          {
                              r.Id, r.Name

                          }
                            ).ToList();
            return Ok(output);

        }

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetRolesForPharmacies()
        {
            var output = (from r in _db.Roles
                          where r.Name == "موظف الصيدلية"
                          select new
                          {
                              r.Id,
                              r.Name

                          }
                            ).ToList();
            return Ok(output);

        }

    }

}
