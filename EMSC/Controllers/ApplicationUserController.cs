using EMSC.Helpers;
using EMSC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EMSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ApplicationUserController : ControllerBase
    {
        private UserManager<IdentityUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;
        private SignInManager<IdentityUser> _singInManager;
        private readonly AppSettings _appSettings;
        public IdentityResult result;
        private readonly EMSCDBContext _db;
       //private readonly PatientsController PC;


        public ApplicationUserController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, EMSCDBContext db ,SignInManager<IdentityUser> signInManager, IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
            _db = db;
        }

        //============================ Create Pharmacy Account ======================================
        [HttpPost]
       // [Authorize(Policy = "RequireManagementRole")]
        [Route("[action]")]
        public async Task<Object> CreatePharmacyAccount([FromBody] ViewModel model)
        {
            List<string> ErrorList = new List<string>();


            var applicationUser = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.UserName + "@gmail.com",
                AccessFailedCount = 1,
                PhoneNumber = model.PhoneNumber,

            };

            bool x = await _roleManager.RoleExistsAsync(model.Role);

            if (!x)
            {
                // first we create Admin rool    
                var role = new IdentityRole();
                role.Name = model.Role;
                await _roleManager.CreateAsync(role);
            }

            IdentityResult result = await _userManager.CreateAsync(applicationUser, model.Password);

            if (result.Succeeded)
            {
                var result1 = await _userManager.AddToRoleAsync(applicationUser, model.Role);

                await _db.SaveChangesAsync();
                return result;
            }


            else
            {
                foreach (var er in result.Errors)
                {
                    ModelState.AddModelError("", er.Description);
                    ErrorList.Add(er.Description);
                }
            }

            return BadRequest(new JsonResult(ErrorList));
        }


        //============================ Create Supervisor Account in Country ======================================
        [HttpPost]
      //  [Authorize(Policy = "RequireManagementRole")]    
        [Route("Register")]
        public async Task<Object> PostApplicationUser([FromBody] RegisterModel model)
        {
            List<string> ErrorList = new List<string>();


            var applicationUser = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.UserName + "@gmail.com",
                AccessFailedCount = 1,
                PhoneNumber = model.PhoneNumber,

            };

     
                bool x = await _roleManager.RoleExistsAsync(model.Role);
             
            if (!x)
            {
                // first we create Admin rool    
                var role = new IdentityRole();
                role.Name = model.Role;
                await _roleManager.CreateAsync(role);        
            }
                IdentityResult result = await _userManager.CreateAsync(applicationUser, model.Password);

            if (result.Succeeded)
            {
                var result1 = await _userManager.AddToRoleAsync(applicationUser, model.Role);


                _db.SupervisorCountries.Add(new SupervisorCountries
                {
                    UserId = applicationUser.Id,
                    CountryId = model.CountryId,
                });

                await _db.SaveChangesAsync();
                return Ok(result);
            }


            else
            {
                foreach (var er in result.Errors)
                {
                   //ModelState.AddModelError(model.UserName, "هذا الاسم تم استخدامه من قبل");
                   // ModelState.AddModelError(model.Email, "هذا البريد الالكتروني تم استخدامه من قبل");
                    ModelState.AddModelError("", er.Description);
                    ErrorList.Add(er.Description);
                }
            }

            return BadRequest(new JsonResult(ErrorList));

        }


        //============================ Create Branche Account ======================================
        [HttpPost]
        [Authorize(Policy = "RequireManagementRole")]
        [Route("[action]")]
        public async Task<Object> CreateBrancheAccount([FromBody] ViewModel model)
        {
            List<string> ErrorList = new List<string>();


            var applicationUser = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.UserName + "@gmail.com",
                AccessFailedCount = 1,
                PhoneNumber =model.PhoneNumber,

            };

            bool x = await _roleManager.RoleExistsAsync(model.Role);

            if (!x)
            {
                // first we create Admin rool    
                var role = new IdentityRole();
                role.Name = model.Role;
                await _roleManager.CreateAsync(role);
            }
            IdentityResult result = await _userManager.CreateAsync(applicationUser, model.Password);

            if (result.Succeeded)
            {
                var result1 = await _userManager.AddToRoleAsync(applicationUser, model.Role);


                if (model.Role == "مندوب المصحة")
                {
                    _db.BranchesUsers.Add(new BranchesUsers
                    {
                        UserId = applicationUser.Id,
                        BranchId = model.BranchId,
                        HospitalId = model.HospitalId,
                    }
                    );

                    await _db.SaveChangesAsync();
                }
                else
                {
                    _db.BranchesUsers.Add(new BranchesUsers
                    {
                        UserId = applicationUser.Id,
                        BranchId = model.BranchId,
                        HospitalId = 0,

                    }
               );
                    await _db.SaveChangesAsync();

                }


                await _db.SaveChangesAsync();
                return result;
            }


            else
            {
                foreach (var er in result.Errors)
                {
                    //ModelState.AddModelError(model.UserName, "هذا الاسم تم استخدامه من قبل");
                    // ModelState.AddModelError(model.Email, "هذا البريد الالكتروني تم استخدامه من قبل");
                    ModelState.AddModelError("", er.Description);
                    ErrorList.Add(er.Description);
                }
            }

            return BadRequest(new JsonResult(ErrorList));
        }


       //============================ Create Hospital Account ======================================     
        [HttpPost]
        [Authorize(Policy = "RequireManagementRole")]
        [Route("[action]")]
        public async Task<Object> CreateHospitalUserAccount([FromBody] ViewModel model)
        {
            List<string> ErrorList = new List<string>();


            var applicationUser = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.UserName + "@gmail.com",
                AccessFailedCount = 1,
                PhoneNumber = model.PhoneNumber,

            };

            bool x = await _roleManager.RoleExistsAsync(model.Role);

            if (!x)
            {
                // first we create Admin rool    
                var role = new IdentityRole();
                role.Name = model.Role;
                await _roleManager.CreateAsync(role);
            }
            IdentityResult result = await _userManager.CreateAsync(applicationUser, model.Password);

            if (result.Succeeded)
            {
                var result1 = await _userManager.AddToRoleAsync(applicationUser, model.Role);


                _db.BranchesUsers.Add(new BranchesUsers
                {
                    UserId = applicationUser.Id,
                    BranchId = model.BranchId,
                }
                );

                await _db.SaveChangesAsync(); 
                
                _db.HospitalsUsers.Add(new HospitalsUsers
                {
                    UserId = applicationUser.Id,
                    HospitalId = model.HospitalId,
                }
                );

                await _db.SaveChangesAsync();
                return Ok(result);
            }


            else
            {
                foreach (var er in result.Errors)
                {
                    //ModelState.AddModelError(model.UserName, "هذا الاسم تم استخدامه من قبل");
                    // ModelState.AddModelError(model.Email, "هذا البريد الالكتروني تم استخدامه من قبل");
                    ModelState.AddModelError("", er.Description);
                    ErrorList.Add(er.Description);
                }
            }

            return BadRequest(new JsonResult(ErrorList));
        }

        //============================ Create Hospital Account ======================================     
        [HttpPost]
        [Authorize(Policy = "RequireManagementRole")]
        [Route("[action]")]
        public async Task<Object> CreatePharmacyUserAccount([FromBody] ViewModel model)
        {
            List<string> ErrorList = new List<string>();


            var applicationUser = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.UserName + "@gmail.com",
                AccessFailedCount = 1,
                PhoneNumber = model.PhoneNumber,

            };

            bool x = await _roleManager.RoleExistsAsync(model.Role);

            if (!x)
            {
                // first we create Admin rool    
                var role = new IdentityRole();
                role.Name = model.Role;
                await _roleManager.CreateAsync(role);
            }
            IdentityResult result = await _userManager.CreateAsync(applicationUser, model.Password);

            if (result.Succeeded)
            {
                var result1 = await _userManager.AddToRoleAsync(applicationUser, model.Role);


                _db.PharmaciesUsers.Add(new PharmaciesUsers
                {
                    UserId = applicationUser.Id,
                    PharmacyId = model.PharmacyId,
                }
                );

                await _db.SaveChangesAsync();
                return Ok(result);
            }


            else
            {
                foreach (var er in result.Errors)
                {
                    //ModelState.AddModelError(model.UserName, "هذا الاسم تم استخدامه من قبل");
                    // ModelState.AddModelError(model.Email, "هذا البريد الالكتروني تم استخدامه من قبل");
                    ModelState.AddModelError("", er.Description);
                    ErrorList.Add(er.Description);
                }
            }

            return BadRequest(new JsonResult(ErrorList));
        }

        //============================ Login ======================================
        [HttpPost]
        [AllowAnonymous]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginModel model)
        {

            var user = await _userManager.FindByNameAsync(model.UserName);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));

            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password) )
            {
                if (user != null && user.AccessFailedCount == 1)
                {

                    // get user Role
                    var roles = await _userManager.GetRolesAsync(user);
                    
                    // get user Role
                    var roleId =  GetRoleIdByUserId(user.Id);

                    //get branch id
                    var brId = GetBranchIdByUserId(user.Id);

                    //get country name
                    var cId = GetCountryIdByUserId(user.Id);

                    //get country name
                    var cName = GetCountryNameByUserId(user.Id);
                    //get hospital name
                    var hId = GetHospitalIdByUserId(user.Id);

                    //get hospital name
                    var hName = GetHospitalNameByUserId(user.Id);

                    //get branch name
                    var brName = GetBranchNameByUserId(user.Id);

                    //get pharmacy id
                    var pharmacyId = GetPharmacyIdByUserId(user.Id);
                 
                    //get pharmacy name
                    var pharmacyName = GetPharmacyNameByUserId(user.Id);

                    //get Active state for current user
                    var active = GetActiveStateForCurrentUser(user.Id);

                    //get fullName  for current user
                    var fullName = GetFullNameForCurrentUser(user.Id);


                    var tokenHandler = new JwtSecurityTokenHandler();

                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                        new Claim(JwtRegisteredClaimNames.Sub, model.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim(ClaimTypes.Country, brId.ToString()),
                        new Claim(ClaimTypes.Country, cId.ToString()),
                        new Claim(ClaimTypes.Country, brName.ToString()),
                        new Claim(ClaimTypes.Country, cName.ToString()),
                        new Claim(ClaimTypes.Country, hName.ToString()),
                        new Claim(ClaimTypes.Country, hId.ToString()),
                        new Claim(ClaimTypes.Country, active.ToString()),
                        new Claim(ClaimTypes.Country, fullName.ToString()),
                        new Claim(ClaimTypes.Country, roleId.ToString()),
                        new Claim(ClaimTypes.Country, pharmacyId.ToString()),
                        new Claim(ClaimTypes.Country, pharmacyName.ToString()),
                        new Claim("LoggedOn", DateTime.Now.ToString()),

                        }),


                        SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                        Issuer = _appSettings.Site,
                        Audience = _appSettings.Audience,
                        Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                    };

                    //await UserManager.UpdateSecurityStampAsync(user.Id);
                    // Generate Token
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                   
                    return Ok(new
                    {
                        token = tokenHandler.WriteToken(token),
                        expiration = token.ValidTo,
                        username = user.UserName,
                        userid = user.Id,
                        userRole = roles.FirstOrDefault(),
                        branchId = brId,
                        brName = brName,
                        country = cName,
                        countryId = cId,
                        hospital = hName,
                        hospitalId = hId,
                        active = active,
                        fullName = fullName,
                        roleId = roleId,
                        pharmacyId = pharmacyId,
                        pharmacyName = pharmacyName,
                    });
                }

                else if (user != null && user.AccessFailedCount == 0)
                {
                    var active = GetActiveStateForCurrentUser(user.Id);                  
                    return Ok(new
                    {
                        active = active
                    });
                }

                //else  // return error
                //    return BadRequest("Block user");
            }

            // return error
            ModelState.AddModelError("", "Username/Password was not Found");
            return Unauthorized();

        }


        //============================ Get Branch Name By UserId======================================
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetFullNameForCurrentUser([FromRoute] string id)
        {
            var output = (
                          from us in _db.Users
                          where us.Id == id

                          select

                             us.PhoneNumber
                         );


            return Ok(output);

        }
        
        
        //============================ Get Branch Id By UserId======================================       
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetBranchNameByUserId([FromRoute] string id)
        {
            var output = (from br in _db.Branches
                          from am in _db.BranchesUsers
                          where am.UserId == id && am.BranchId == br.Id
                          select   br.BranchName
                          );
            return Ok(output);

        }
        
        
        //============================ Get Branch Id By UserId======================================
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetBranchIdByUserId([FromRoute] string id)
        {
            var output = (from br in _db.Branches
                          from am in _db.BranchesUsers
                          where am.UserId == id && am.BranchId == br.Id
                          select  am.BranchId                         
                            );
            return Ok(output);

        } 
        
        [HttpGet("[action]/{id}")]
        public IActionResult GetRoleIdByUserId([FromRoute] string id)
        {
            var output = (from br in _db.Roles
                          from am in _db.UserRoles
                          where am.UserId == id && am.RoleId == br.Id
                          select  am.RoleId                         
                            );
            return Ok(output);

        }
        
        //============================ Get Counrty Name By UserId======================================
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetCountryNameByUserId([FromRoute] string id)
        {
            var output = (from c in _db.Countries
                          from sc in _db.SupervisorCountries
                          where sc.UserId == id && sc.CountryId == c.Id
                          select   c.Country
                          );
            return Ok(output);

        }
       
        
        //============================ Get Counrty Id By UserId======================================
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetCountryIdByUserId([FromRoute] string id)
        {
            var output = (from c in _db.Countries
                          from sc in _db.SupervisorCountries
                          where sc.UserId == id && sc.CountryId == c.Id
                          select 

                              sc.CountryId

                            );
            return Ok(output);

        }
        
        //============================ Get Hospital Name By UserId======================================
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetHospitalNameByUserId([FromRoute] string id)
        {
            var output = (from h in _db.Hospitals
                          from sc in _db.HospitalsUsers
                          where sc.UserId == id && sc.HospitalId == h.Id
                          select   h.HospName
                          );
            return Ok(output);

        }


        //============================ Get Hospital Id By UserId======================================        
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetHospitalIdByUserId([FromRoute] string id)
        {
            var output = (from h in _db.Hospitals
                          from sc in _db.HospitalsUsers
                          where sc.UserId == id && sc.HospitalId == h.Id
                          select 

                              sc.HospitalId

                            );
            return Ok(output);

        }

        //================================Get users outside=============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetUsersOutside()
        {
            var output = (
                          from us in _db.Users
                          from br in _db.UserRoles 
                          from co in _db.SupervisorCountries 
                          join r in _db.Roles on br.RoleId equals r.Id
                          join c in _db.Countries on co.CountryId equals c.Id
                          where br.UserId == us.Id && br.RoleId==r.Id && co.UserId == us.Id && co.CountryId==c.Id

                          select new
                          {

                              us.Id,
                              us.UserName,
                              us.PhoneNumber,
                              r.Name,
                              c.Country,
                              us.AccessFailedCount,
                          }
                              ).ToList();

            return Ok(output);

        

        }
      
        //================================Get users inside=============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetUsersInside()
        {
            var output = (
                          from us in _db.Users
                          from br in _db.UserRoles 
                          from bra in _db.BranchesUsers 
                          join r in _db.Roles on br.RoleId equals r.Id
                          join b in _db.Branches on bra.BranchId equals b.Id
                          where b.BranchName!= "الفرع الرئيسي للمركز" && br.UserId == us.Id && br.RoleId==r.Id && bra.UserId == us.Id && bra.BranchId==b.Id

                          select new
                          {

                              us.Id,
                              us.UserName,
                              us.PhoneNumber,
                              r.Name,
                              b.BranchName,
                              us.AccessFailedCount,
                          }
                              ).ToList();

            return Ok(output);

        

        }

        //================================Get users inside Management=============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetUsersInsideManagement()
        {
            var output = (
                          from us in _db.Users
                          from br in _db.UserRoles
                          from bra in _db.BranchesUsers
                        //  from h in _db.Hospitals
                          join r in _db.Roles on br.RoleId equals r.Id
                          join b in _db.Branches on bra.BranchId equals b.Id
                          where b.BranchName == "الفرع الرئيسي للمركز" &&
                          br.UserId == us.Id && br.RoleId == r.Id &&
                          bra.UserId == us.Id && bra.BranchId == b.Id //&&
                      //    (bra.HospitalId == h.Id || bra.HospitalId == 0)
                          select new
                          {
                              us.Id,
                              us.UserName,
                              us.PhoneNumber,
                              r.Name,
                              b.BranchName,
                              us.AccessFailedCount,
                            //  h.HospName
                          }
                              ).ToList();

            return Ok(output);

        }
       
        //================================Get users inside hospital=============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetUsersInsideHospital()
        {
            var output = (
                          from us in _db.Users
                          from br in _db.UserRoles 
                          from bra in _db.HospitalsUsers 
                          join r in _db.Roles on br.RoleId equals r.Id
                          join b in _db.Hospitals on bra.HospitalId equals b.Id
                          where br.UserId == us.Id && br.RoleId==r.Id && bra.UserId == us.Id && bra.HospitalId==b.Id

                          select new
                          {

                              us.Id,
                              us.UserName,
                              us.PhoneNumber,
                              r.Name,
                              b.HospName,
                              us.AccessFailedCount,

                          }
                              ).ToList();

            return Ok(output);

        

        }

        //================================Get users pharmacies=============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetUsersPharmacies()
        {
            var output = (
                          from us in _db.Users
                          from br in _db.UserRoles
                          from bra in _db.PharmaciesUsers
                          join r in _db.Roles on br.RoleId equals r.Id
                          join b in _db.Pharmacies on bra.PharmacyId equals b.Id
                          where br.UserId == us.Id && br.RoleId == r.Id && bra.UserId == us.Id && bra.PharmacyId == b.Id

                          select new
                          {

                              us.Id,
                              us.UserName,
                              us.PhoneNumber,
                              r.Name,
                              b.PharmacyName,
                              us.AccessFailedCount,

                          }
                              ).ToList();

            return Ok(output);



        }

        //================================Block user============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> BlockedUser([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findUser = _db.Users.FirstOrDefault(c => c.Id == id);

            if (findUser == null)
            {
                return NotFound();
            }

            if (findUser.AccessFailedCount != 0)
            findUser.AccessFailedCount = 0;
            else findUser.AccessFailedCount = 1;


            _db.Entry(findUser).State = EntityState.Modified;
            await _db.SaveChangesAsync();

         
            return Ok(new JsonResult("The User with id " + id + " is Blocked."));

        }

       
        //================================Get ActiveState For CurrentUser================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetActiveStateForCurrentUser([FromRoute] string id)
        {
            var output = (
                          from us in _db.Users
                          where us.Id == id

                          select

                             us.AccessFailedCount
                         );
                            

            return Ok(output);



        }

        //================================Delete User=============================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

        
           // find the Patient
           var findUser = await _db.Users.FindAsync(id);

            if (findUser == null)
            {
                return NotFound();
            }
        

            bool findUser1 = _db.PatientsData.Any(p => p.UserId == id);



            bool findUserId2 = _db.BranchesUsers.Any(x => x.UserId == id);
            //var findUserBr = await _db.BranchesUsers.FindAsync(mod2.Id);


            bool findUserId3 = _db.SupervisorCountries.Any(y => y.UserId == id);
            //var findUserCo = await _db.SupervisorCountries.FindAsync(mod.Id);


            if (findUser1)
                return BadRequest(new JsonResult("لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"));

            bool findUser2 = _db.PatientsTransactions.Any(p => p.UserId == id);
            if (findUser2)
                return BadRequest(new JsonResult("لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"));


            bool findUser3 = _db.PatientsTransactionsInside.Any(p => p.UserId == id);
            if (findUser3)
                return BadRequest(new JsonResult("لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"));


             bool findUser4 = _db.RepliesManagement.Any(p => p.UserId == id);
            if (findUser4)
                return BadRequest(new JsonResult("لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"));


            bool findUser5 = _db.TreatmentMovements.Any(p => p.UserId == id);
            if (findUser5)
                return BadRequest(new JsonResult("لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"));

             bool findUser6 = _db.TravelingProcedures.Any(p => p.UserId == id);
            if (findUser6)
                return BadRequest(new JsonResult("لا يمكن حذف المستخدم لارتباطه ببيانات أخرى"));

            else
            {
                _db.Users.Remove(findUser);
                await _db.SaveChangesAsync();

                //if (findUserId2)
                //{
                //    _db.BranchesUsers.Remove(findUserBr);
                //    await _db.SaveChangesAsync();
                //}
                
                //if (findUserId3)
                //{
                //    _db.SupervisorCountries.Remove(findUserCo);
                //    await _db.SaveChangesAsync();
                //}

                return Ok(new JsonResult("The branch with id " + id + " is Deleted."));

            }
        }


        //===========================================================================================
        [Authorize(Policy = "RequireManagementRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteUserCo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

   
           // find the Patient
           var findUser = await _db.SupervisorCountries.FindAsync(id);

            if (findUser == null)
            {
                return NotFound();
            }
        

        
         _db.SupervisorCountries.Remove(findUser);
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The branch with id " + id + " is Deleted."));

        }
        //===========================================================================================

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<Object> ResetPassword([FromBody] RegisterModel model)
        {
            List<string> ErrorList = new List<string>();

            var newData = new IdentityUser()
            {
                UserName = model.UserName,

            };
            var user = await _userManager.FindByNameAsync(newData.UserName);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Attempt To Reset The Password To newPassword
            IdentityResult resetPassword = await _userManager.ResetPasswordAsync(user, token, model.Password);

            if (resetPassword.Succeeded)
            {
                await _db.SaveChangesAsync();
                return Ok(resetPassword);

            }
            else
            {
                foreach (var er in result.Errors)
                {
                    ModelState.AddModelError("", er.Description);
                    ErrorList.Add(er.Description);
                }
            }

            return BadRequest(new JsonResult(ErrorList));

        }


        //============================ Get Branch Id By UserId======================================       
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPharmacyNameByUserId([FromRoute] string id)
        {
            var output = (from br in _db.Pharmacies
                          from am in _db.PharmaciesUsers
                          where am.UserId == id && am.PharmacyId == br.Id
                          select br.PharmacyName
                          );
            return Ok(output);

        }


        //============================ Get Branch Id By UserId======================================
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPharmacyIdByUserId([FromRoute] string id)
        {
            var output = (from br in _db.Pharmacies
                          from am in _db.PharmaciesUsers
                          where am.UserId == id && am.PharmacyId == br.Id
                          select am.PharmacyId
                          );
            return Ok(output);


        }

    }
}
