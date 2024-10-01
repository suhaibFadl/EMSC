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
 
    public class PricesListsController : Controller
    {
        private readonly EMSCDBContext _db;

        public PricesListsController(EMSCDBContext db)
        {
            _db = db;

        }
        //====================================================================================
        //====================================================================================
        //====================================================================================
        //=============================  Prices Lists            =============================
        //====================================================================================
        //====================================================================================
        //====================================================================================
        //============================ ADD List ==============================
        [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddList([FromBody] PricesLists formdata)
        {
            List<string> ErrorList = new List<string>();

            var NewList = new PricesLists
            {
                ListName = formdata.ListName,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };
            bool ListExists = _db.PricesLists.Any(x => x.ListName == NewList.ListName);

            if (!ListExists)
            {
                await _db.PricesLists.AddAsync(NewList);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The List was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The List is already exist"));
            }

        }
        //===========================================================================

        //================================Get Lists=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetPricesLists()
        {
            var output = (
                         from c in _db.PricesLists
                         join u in _db.Users on c.UserId equals u.Id
                         orderby c.ListName ascending
                         select new
                         {
                             c.ListName,
                             c.Id,
                            u.PhoneNumber,
                             c.UserDate
                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        } 
        
        //================================Get List By Id=============================

        //[AllowAnonymous]
        //[HttpGet("[action]")]

        //public IActionResult GetPricesListById([FromRoute] int id)
        //{
        //    var findPriceList = _db.PricesLists.FirstOrDefault(c => c.Id == fromdata.Id);

        //    if (findPriceList == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(findPriceList);

        //}



        //=================================UPDATE List===============================
        //   [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdatePricesList([FromRoute] int id, [FromBody] PricesLists fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var NewList = new PricesLists
            {
                ListName = fromdata.ListName,
                UserId = fromdata.UserId

            };

            var findList = _db.PricesLists.FirstOrDefault(c => c.Id == id);

            if (findList == null)
            {
                return NotFound();
            }


            findList.ListName = fromdata.ListName;

            // If the country was found
            bool ListExists = _db.PricesLists.Any(x => x.ListName == findList.ListName && x.Id != id);
            if (!ListExists)
            {
                _db.Entry(findList).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The List with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The List is Exist."));
            }


        }
        //=============================================================================

        //=======================DELETE country==========================================
       // [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeletePricesList([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findList = await _db.PricesLists.FindAsync(id);

            if (findList == null)
            {
                return NotFound();
            }

            bool findServices = _db.ServicesLists.Any(SC => SC.ListId == id)
                                || _db.Hospitals.Any(h => h.ListId == id);

            if (findServices)
                return BadRequest(new JsonResult("لا يمكن حذف كراسة الأسعار لارتباطها ببيانات أخرى"));



            _db.PricesLists.Remove(findList);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The list with id " + id + " is Deleted."));

            //=============================================================================



        }



        //====================================================================================
        //====================================================================================
        //====================================================================================
        //=============================  Medical Services        =============================
        //====================================================================================
        //====================================================================================
        //====================================================================================



        //============================ ADD Medical Services ==============================
      //  [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddMedicalServices([FromBody] MedicalServices formdata)
        {
            List<string> ErrorList = new List<string>();

            var Newserv = new MedicalServices
            {
                ServArName = formdata.ServArName,
                ServEnName = formdata.ServEnName,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };
            bool servExists = _db.MedicalServices.Any(x => x.ServArName == Newserv.ServArName || x.ServEnName == Newserv.ServEnName);

            if (!servExists)
            {
                await _db.MedicalServices.AddAsync(Newserv);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Service was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The service is already exist"));
            }

        }

        //============================ ADD Medical Services To Lists ==============================
      //  [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddMedicalServicesToLists([FromBody] ServicesLists formdata)
        {
            List<string> ErrorList = new List<string>();

            var Newserv = new ServicesLists
            {
                ServId = formdata.ServId,
                ListId = formdata.ListId,
                ServPrice = formdata.ServPrice,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,

            };
            bool servExists = _db.ServicesLists.Any(x => x.ServId == Newserv.ServId && x.ListId == Newserv.ListId);

            if (!servExists)
            {
                await _db.ServicesLists.AddAsync(Newserv);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Service was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The service is already exist"));
            }

        }
        //===========================================================================

        //================================Get Lists=============================

        [AllowAnonymous]
        [HttpGet("[action]")]

        public IActionResult GetMedicalServices()
        {
            var output = (
                         from c in _db.MedicalServices
                         join u in _db.Users on c.UserId equals u.Id
                         orderby c.ServArName ascending
                         select new
                         {
                             c.ServArName,
                             c.ServEnName,
                             c.Id,
                            u.PhoneNumber,
                             c.UserDate

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }


        //================================Get Medical Services By List Id=============================

        [AllowAnonymous]
        [HttpGet("[action]/{ListId}")]

        public IActionResult GetMedicalServicesByListId([FromRoute] int ListId)
        {

            var output = (
                         from ms in _db.ServicesLists
                         join c in _db.MedicalServices on ms.ServId equals c.Id
                         join l in _db.PricesLists on ms.ListId equals l.Id
                         join u in _db.Users on ms.UserId equals u.Id
                         where ms.ListId == ListId

                         orderby c.ServArName ascending
                         select new
                         {
                             l.ListName,
                             c.ServArName,
                             c.ServEnName,
                             ms.ServPrice,
                             ms.Id,
                             u.PhoneNumber,
                             ms.UserDate

                         }
                             ).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }


        //================================Get Medical Services With Costs=============================

        [AllowAnonymous]
        [HttpGet("[action]/{ListId}/{RankId}")]

        public IActionResult GetMedicalServicesCosts([FromRoute] int ListId, [FromRoute] int RankId)
        {

            var output = (
                        
                         from ms in _db.ServicesLists
                         join c in _db.MedicalServices on ms.ServId equals c.Id
                         join l in _db.PricesLists on ms.ListId equals l.Id
                         join u in _db.Users on ms.UserId equals u.Id
                         where ms.ListId == ListId

                         let rank = (from r in _db.HospitalRanks
                                     where r.Id == RankId
                                     select r).First()
                        
                         select new
                         {
                            id = ms.Id,
                            listName = l.ListName,
                            servArName = c.ServArName,
                            servEnName = c.ServEnName,
                            servPrice = Convert.ToString(
                                Convert.ToDouble(ms.ServPrice) * (1 - Convert.ToDouble(rank.RankPer) / 100.0)
                            ), 
                           // Assign null if rank is missing
                            phoneNumber = u.PhoneNumber,
                            userDate = ms.UserDate
                         }
                             ).OrderBy(x => x.servArName).ToList();


            return Ok(output);

            //  return Ok(_db.Countries.ToList());

        }




        //=================================UPDATE Medical Services===============================
        // [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateMedicalServicesData( [FromBody] MedicalServices fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var NewServ = new MedicalServices
            {
                ServArName = fromdata.ServArName,
                ServEnName = fromdata.ServEnName

            };

            var findServ = _db.MedicalServices.FirstOrDefault(c => c.Id == fromdata.Id);

            if (findServ == null)
            {
                return NotFound();
            }


            findServ.ServArName = fromdata.ServArName;
            findServ.ServEnName = fromdata.ServEnName;

            // If the country was found
            bool servExists = _db.MedicalServices.Any(x => (x.ServArName == findServ.ServArName || x.ServEnName == findServ.ServEnName) && x.Id != fromdata.Id);
            if (!servExists)
            {
                _db.Entry(findServ).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Services with id " + fromdata.Id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The Services is Exist."));
            }


        }
        // =============================================================================
        //=================================UPDATE Medical Services Prices In List===============================
       // [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateMedicalServicesPriceInList( [FromBody] ServicesLists fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var NewList = new ServicesLists
            {
                ServPrice = fromdata.ServPrice

            };

            var findServ = _db.ServicesLists.FirstOrDefault(c => c.Id == fromdata.Id);

            if (findServ == null)
            {
                return NotFound();
            }


            findServ.ServPrice = fromdata.ServPrice;

            // If the country was found

            _db.Entry(findServ).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The List with id " + fromdata.Id + " is updated."));



        }
        //=============================================================================

        //=======================DELETE country==========================================
        // [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteMedicalServicesData([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findServ = await _db.MedicalServices.FindAsync(id);

            if (findServ == null)
            {
                return NotFound();
            }

            bool findServices = _db.ClaimsServices.Any(SC => SC.ServId == id);

            if (findServices)
                return BadRequest(new JsonResult("لا يمكن حذف الخدمة لارتباطها ببيانات أخرى"));

            var findServInList = _db.ServicesLists.FirstOrDefault(x => x.ServId == id);

            _db.MedicalServices.Remove(findServ);

            _db.ServicesLists.Remove(findServInList);

            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The Medical Service with id " + id + " is Deleted."));

            //=============================================================================



        }

        //=======================DELETE country==========================================
        // [Authorize(Policy = "RequireEmployeeManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteMedicalServicesFromList([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Country

            var findServ = await _db.MedicalServices.FindAsync(id);

            if (findServ == null)
            {
                return NotFound();
            }

            bool findServices = _db.ClaimsServices.Any(SC => SC.ServId == id);

            if (findServices)
                return BadRequest(new JsonResult("لا يمكن حذف الخدمة لارتباطها ببيانات أخرى"));

            var findServInList = _db.ServicesLists.FirstOrDefault(x => x.ServId == id);

            _db.MedicalServices.Remove(findServ);

           
            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The Medical Service with id " + id + " is Deleted."));

            //=============================================================================



        }



    }
}
