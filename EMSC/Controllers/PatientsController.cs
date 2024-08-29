using EMSC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace EMSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public PatientsController(EMSCDBContext db,  UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        //============================ ADD Patient Trans==============================


        [HttpPost("[action]")]
        public async Task<IActionResult> AddPatientTransManagement([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();



            bool PatExist = _db.PatientsTransactions.Any(x => x.PatientId == formdata.PatientId &&
            x.LetterIndexNO == formdata.LetterIndexNO && x.LetterDate == formdata.LetterDate && x.ReplyState == 0);

            if (formdata.PlcTreatment == 1)
            {
                var PatTranInside = new PatientsTransactionsInside
                {
                    PatientId = formdata.PatientId,
                  //  Attach = formdata.Attach,
                    LetterDest = formdata.LetterDest,
                    LetterIndexNO = formdata.LetterIndexNO,
                    LetterDate = formdata.LetterDate,
                    UserId = formdata.UserId,
                    ReplyState = 0,
                    HospitalId = formdata.HospitalId,
                    UserDate = DateTime.UtcNow,
                    MedicalDiagnosis = formdata.MedicalDiagnosis,
                    Approved = 0
                };

                await _db.PatientsTransactionsInside.AddAsync(PatTranInside);
                await _db.SaveChangesAsync();


                var re = new RepliesHospitals
                {
                    TRId = PatTranInside.Id,
                    PatientId = PatTranInside.PatientId,
                };

                await _db.RepliesHospitals.AddAsync(re);
                await _db.SaveChangesAsync();
                return Ok(new JsonResult("The Patient was Added Successfully"));

            }

            if (formdata.PlcTreatment == 2)
            {
                if (!PatExist)
                {
                    var PatTranOutside = new PatientsTransactions
                    {
                        PatientId = formdata.PatientId,
                        Attach = formdata.Attach,
                        LetterDest = formdata.LetterDest,
                        LetterIndexNO = formdata.LetterIndexNO,
                        LetterDate = formdata.LetterDate,
                        UserId = formdata.UserId,
                        ReplyState = 2,
                        Travel = 0,
                        Treatment = 0,
                        Hotel = 0,
                        CountryId = formdata.CountryId,
                        UserDate = DateTime.UtcNow,
                        MedicalDiagnosis = formdata.MedicalDiagnosis,
                        PersonType = formdata.PersonType,
                    };

                    if (formdata.Select == 1)
                    {
                        await _db.PatientsTransactions.AddAsync(PatTranOutside);
                        await _db.SaveChangesAsync();

                        var re = new RepliesManagement
                        {
                            TRId = PatTranOutside.Id,
                            PatientId = (int)PatTranOutside.PatientId,
                            ReplyState = 2,
                            UserId = formdata.UserId,
                            CUserId = formdata.UserId,
                            UserDate = DateTime.UtcNow,
                        };
                        await _db.RepliesManagement.AddAsync(re);
                        await _db.SaveChangesAsync();

                        var newPatient = new PatientsData
                        {
                            PatientName = formdata.PatientName,
                            PassportNo = formdata.PassportNo,
                            NationalNo = formdata.NationalNo,
                            UserId = formdata.UserId,
                            UserDate = DateTime.UtcNow,
                            BranchId = formdata.LetterDest,
                            PatType = 0,
                            DepenId = 99,
                            EventId = 12,
                            PersonType = 2,
                        };

                        bool clientPassportNoExists = _db.PatientsData.Any(x => x.PassportNo == newPatient.PassportNo);
                        bool clientNationalNoExists = _db.PatientsData.Any(x => x.NationalNo == newPatient.NationalNo && newPatient.NationalNo != "000000000000");

                        //  var findPat = _db.PatientsData.FirstOrDefault(a => a.PassportNo == newPatient.PassportNo);

                        if (!clientPassportNoExists && !clientNationalNoExists)
                        {
                            await _db.PatientsData.AddAsync(newPatient);
                            await _db.SaveChangesAsync();

                            var findPat = _db.PatientsData.FirstOrDefault(a => a.Id == formdata.PatientId);

                            var PatTranOutside2 = new PatientsTransactions
                            {
                                PatientId = newPatient.Id,
                                Attach = formdata.Attach,
                                LetterDest = formdata.LetterDest,
                                LetterIndexNO = formdata.LetterIndexNO,
                                LetterDate = formdata.LetterDate,
                                UserId = formdata.UserId,
                                ReplyState = 2,
                                Travel = 0,
                                Treatment = PatTranOutside.Id,
                                Hotel = 0,
                                CountryId = formdata.CountryId,
                                UserDate = DateTime.UtcNow,
                                MedicalDiagnosis = "مرافق للمريض " + findPat.PatientName,
                                PersonType = formdata.PersonType,

                            };


                            await _db.PatientsTransactions.AddAsync(PatTranOutside2);
                            await _db.SaveChangesAsync();

                            var re2 = new RepliesManagement
                            {
                                TRId = PatTranOutside2.Id,
                                PatientId = (int)PatTranOutside2.PatientId,
                                ReplyState = 2,
                                UserId = formdata.UserId,
                                CUserId = formdata.UserId,
                                UserDate = DateTime.UtcNow,
                            };
                            await _db.RepliesManagement.AddAsync(re2);
                            await _db.SaveChangesAsync();

                            return Ok(new JsonResult("The Patient was Added Successfully"));
                        }

                        else if (clientPassportNoExists || clientNationalNoExists)
                        {
                            var findPat = _db.PatientsData.FirstOrDefault(a => a.PassportNo == formdata.PassportNo);
                            var findPat2 = _db.PatientsData.FirstOrDefault(a => a.Id == formdata.PatientId);

                            var PatTranOutside2 = new PatientsTransactions
                            {
                                PatientId = findPat.Id,
                                Attach = formdata.Attach,
                                LetterDest = formdata.LetterDest,
                                LetterIndexNO = formdata.LetterIndexNO,
                                LetterDate = formdata.LetterDate,
                                UserId = formdata.UserId,
                                ReplyState = 2,
                                Travel = 0,
                                Treatment = PatTranOutside.Id,
                                Hotel = 0,
                                CountryId = formdata.CountryId,
                                UserDate = DateTime.UtcNow,
                                MedicalDiagnosis = "مرافق للمريض " + findPat2.PatientName,
                                PersonType = formdata.PersonType,

                            };


                            await _db.PatientsTransactions.AddAsync(PatTranOutside2);
                            await _db.SaveChangesAsync();

                            var re2 = new RepliesManagement
                            {
                                TRId = PatTranOutside2.Id,
                                PatientId = (int)PatTranOutside2.PatientId,
                                ReplyState = 2,
                                UserId = formdata.UserId,
                                CUserId = formdata.UserId,
                                UserDate = DateTime.UtcNow,
                            };
                            await _db.RepliesManagement.AddAsync(re2);
                            await _db.SaveChangesAsync();

                            return Ok(new JsonResult("The Patient was Added Successfully"));
                        }

                    }

                    else
                    {
                        await _db.PatientsTransactions.AddAsync(PatTranOutside);
                        await _db.SaveChangesAsync();
                        var re = new RepliesManagement
                        {
                            TRId = PatTranOutside.Id,
                            PatientId = (int)PatTranOutside.PatientId,
                            ReplyState = 2,
                            UserId = formdata.UserId,
                            CUserId = formdata.UserId,
                            UserDate = DateTime.UtcNow,
                        };
                        await _db.RepliesManagement.AddAsync(re);
                        await _db.SaveChangesAsync();
                        return Ok(new JsonResult("The Patient was Added Successfully"));

                    }

                    return Ok(new JsonResult("The Patient was Added Successfully"));

                }

                else if (PatExist)

                {
                    return BadRequest(new JsonResult("The Patient was Already Added !!"));

                }

                // return Ok(new JsonResult("PlcTreatment == 2"));


            }
            return null;
        }


        //=========================================add transaction inside


        [HttpPost("[action]")]
        public async Task<IActionResult> AddPatientTransManagementInside([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();



            //bool PatExist = _db.PatientsTransactions.Any(x => x.PatientId == formdata.PatientId &&
            //x.LetterIndexNO == formdata.LetterIndexNO && x.LetterDate == formdata.LetterDate && x.ReplyState == 0);

                var PatTranInside = new PatientsTransactionsInside
                {
                    PatientId = formdata.PatientId,
                   // Attach = formdata.Attach,
                    LetterDest = formdata.LetterDest,
                    LetterIndexNO = formdata.LetterIndexNO,
                    LetterDate = formdata.LetterDate,
                    UserId = formdata.UserId,
                    ReplyState = 0,
                    HospitalId = formdata.HospitalId,
                    UserDate = DateTime.UtcNow,
                    MedicalDiagnosis = formdata.MedicalDiagnosis,
                    Approved = 0,
                    UserApproved = "0"
                };

                await _db.PatientsTransactionsInside.AddAsync(PatTranInside);
                await _db.SaveChangesAsync();

                //var re = new RepliesHospitals
                //{
                //    TRId = PatTranInside.Id,
                //    PatientId = PatTranInside.PatientId,
                //};

                //await _db.RepliesHospitals.AddAsync(re);
                //await _db.SaveChangesAsync();
                return Ok(new JsonResult("The Patient was Added Successfully"));

            
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddAttendantTransByManag([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();


            bool PatExist = _db.PatientsTransactions.Any(x => x.PatientId == formdata.PatientId &&
            x.LetterIndexNO == formdata.LetterIndexNO && x.LetterDate == formdata.LetterDate && x.ReplyState == 0 );

            if (!PatExist)
            {

                            
                    // var findPat = _db.PatientsData.FirstOrDefault(a => a.PassportNo == formdata.PassportNo);
                    var findPatByName = _db.PatientsData.FirstOrDefault(a => a.PatientName == formdata.PatientName);
                    var findLetter = _db.PatientsTransactions.OrderByDescending(a => a.Id).FirstOrDefault(a => a.PatientId == findPatByName.Id);

                var PatTranOutside = new PatientsTransactions
                {
                    PatientId = formdata.PatientId,
                    Attach = formdata.Attach,
                    LetterDest = formdata.LetterDest,
                    LetterIndexNO = formdata.LetterIndexNO,
                    LetterDate = formdata.LetterDate,
                    UserId = formdata.UserId,
                    ReplyState = 2,
                    Travel = 0,
                    Treatment = findLetter.Id,
                    Hotel = 0,
                    CountryId = formdata.CountryId,
                    UserDate = DateTime.UtcNow,
                    MedicalDiagnosis = "مرافق للمريض " + findPatByName.PatientName,
                    FileStatus = 5,    
                    PersonType = formdata.PersonType,
                    };


                    await _db.PatientsTransactions.AddAsync(PatTranOutside);
                    await _db.SaveChangesAsync();

                    var re = new RepliesManagement
                    {
                        TRId = PatTranOutside.Id,
                        PatientId = (int)PatTranOutside.PatientId,
                        ReplyState = 2
                    };
                    await _db.RepliesManagement.AddAsync(re);
                    await _db.SaveChangesAsync();

                    return Ok(new JsonResult("The Patient was Added Successfully"));
                }

            else if (PatExist)

            {
                return BadRequest(new JsonResult("The Patient was Already Added !!"));

            }

            return null;

        }

        //=======================================================================
        //=================================Get Branch Id ===================
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsByBranchId([FromRoute] int id)
        {

            var output = (
                         from pd in _db.PatientsData
                         from br in _db.BranchesUsers
                         from u in _db.Users
                         join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                         join c in _db.Countries on pt.CountryId equals c.Id
                         join b in _db.Branches on br.BranchId equals b.Id
                         where br.BranchId == id && br.BranchId == pt.LetterDest 
                         && br.UserId == pt.UserId && pt.UserId == u.Id && pd.Id == pt.PatientId
                         && pt.CountryId == c.Id && br.BranchId == b.Id
                         select new
                         {
                             pt.Id,
                             pt.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDest,
                             c.Country,
                             b.BranchName,
                             br.BranchId,
                             pt.ReplyState,
                             pt.Travel,
                             u.PhoneNumber

                         }
                             ).ToList();
            return Ok(output);

        }

       //عرض الجرحى الذين تم قبولهم من قبل الإدارة
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsIsAcceptedByManagment([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.CountryId == id && pd.Id == pt.PatientId && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pt.UserId == u.Id && pt.ReplyState == 2 && (pt.PersonType == 1 || (pt.PersonType == 2 && pt.FileStatus == 5))
                          orderby pt.Id descending, pt.LetterDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              b.BranchName,
                              pt.ReplyState,
                              pt.Travel,
                              pt.MedicalDiagnosis,
                              u.PhoneNumber,
                              pt.PersonType
                          }
                              ).ToList();

            return Ok(output);
        }

        //عرض بيانات مرافق الجريح في حالة قبول الإدارة
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatAttendantByTRIDAccepted([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.Treatment == id && pt.ReplyState == 2 && pd.Id == pt.PatientId && pd.PersonType == 2 && pt.CountryId == c.Id
                          && pt.Travel == 0 && u.Id == pt.UserId
                          orderby pt.Id descending, pt.LetterDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              c.Country,
                              br.BranchName,
                              pt.ReplyState,
                              pt.MedicalDiagnosis,
                              u.PhoneNumber,
                              pt.PersonType,
                          }
                              ).ToList();


            return Ok(output);
        }

        //عرض بيانات مرافق الجريح في حالة تم وضعهم في قائمة الانتظار
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatAttendantByTRIDInWaitingList([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.Treatment == id && pt.ReplyState == 6 && pd.Id == pt.PatientId && pd.PersonType == 2 && pt.CountryId == c.Id
                          && pt.Travel == 0 && u.Id == pt.UserId
                          orderby pt.Id descending, pt.LetterDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              c.Country,
                              br.BranchName,
                              pt.ReplyState,
                              pt.MedicalDiagnosis,
                              u.PhoneNumber,
                              pt.PersonType,
                          }
                              ).ToList();


            return Ok(output);
        }

        //عرض الجرحى والمرافقين في قائمة الانتظار
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsInWaitingListByCountry([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          where pt.CountryId == id && pd.Id == pt.PatientId && pt.CountryId == c.Id && pt.LetterDest == b.Id
                          && pt.UserId == u.Id && pt.ReplyState == 6 && pt.PersonType == 1
                          orderby pt.Id descending, pt.LetterDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              b.BranchName,
                              pt.ReplyState,
                              pt.Travel,
                              pt.MedicalDiagnosis,
                              u.PhoneNumber
                          }
                              ).ToList();

            return Ok(output);
        }


    }
}