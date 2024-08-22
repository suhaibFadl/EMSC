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
    public class PatientsLettersOutsideController : ControllerBase
    {
        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public PatientsLettersOutsideController(EMSCDBContext db)
        {
            _db = db;
        }


        //==========ADD PATIENT TRANSACTION INSIDE / OUTSIDE===================================
        //=======================================================================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddPatientTrans([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();

            bool PatExist = _db.PatientsTransactions.Any(x => x.PatientId == formdata.PatientId &&
            x.LetterIndexNO == formdata.LetterIndexNO && x.LetterDate == formdata.LetterDate && x.ReplyState == 0);
           


            if (formdata.PlcTreatment == 1)
            {
                var PatTranInside = new PatientsTransactionsInside
                {
                    PatientId = formdata.PatientId,
                    Attach = formdata.Attach,
                    LetterDest = formdata.LetterDest,
                    LetterIndexNO = formdata.LetterIndexNO,
                    LetterDate = formdata.LetterDate,
                    UserId = formdata.UserId,
                    ReplyState = 0,
                    HospitalId = formdata.HospitalId,
                    UserDate = DateTime.UtcNow,
                    MedicalDiagnosis = formdata.MedicalDiagnosis,
                    FileStatus = 0,
                    Approved = 0
                };
                await _db.PatientsTransactionsInside.AddAsync(PatTranInside);
                await _db.SaveChangesAsync();

                var re = new RepliesHospitals
                {
                    TRId = PatTranInside.Id,
                    PatientId = PatTranInside.PatientId,
                    ReplyState = 0
                };
                await _db.RepliesHospitals.AddAsync(re);
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Patient was Added Successfully"));

            }


            else if (formdata.PlcTreatment == 2)
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
                        ReplyState = 0,
                        Travel = 0,
                        Treatment = 0,
                        Hotel = 0,
                        PersonType = formdata.PersonType,
                        CountryId = formdata.CountryId,
                        UserDate = DateTime.UtcNow,
                        MedicalDiagnosis = formdata.MedicalDiagnosis,
                    };
                    if (formdata.Select == 1)
                    {
                        await _db.PatientsTransactions.AddAsync(PatTranOutside);
                        await _db.SaveChangesAsync();

                        var re = new RepliesManagement
                        {
                            TRId = PatTranOutside.Id,
                            PatientId = (int)PatTranOutside.PatientId,
                            ReplyState = 0
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
                                ReplyState = 0,
                                Travel = 0,
                                Treatment = PatTranOutside.Id,
                                Hotel = 0,
                                CountryId = formdata.CountryId,
                                UserDate = DateTime.UtcNow,
                                MedicalDiagnosis = "مرافق للمريض " + findPat.PatientName,
                            };


                            await _db.PatientsTransactions.AddAsync(PatTranOutside2);
                            await _db.SaveChangesAsync();

                            var re2 = new RepliesManagement
                            {
                                TRId = PatTranOutside2.Id,
                                PatientId = (int)PatTranOutside2.PatientId,
                                ReplyState = 0
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
                                ReplyState = 0,
                                Travel = 0,
                                Treatment = PatTranOutside.Id,
                                Hotel = 0,
                                CountryId = formdata.CountryId,
                                UserDate = DateTime.UtcNow,
                                MedicalDiagnosis = "مرافق للمريض " + findPat2.PatientName,
                            };


                            await _db.PatientsTransactions.AddAsync(PatTranOutside2);
                            await _db.SaveChangesAsync();

                            var re2 = new RepliesManagement
                            {
                                TRId = PatTranOutside2.Id,
                                PatientId = (int)PatTranOutside2.PatientId,
                                ReplyState = 0
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
                            ReplyState = 0
                        };
                        await _db.RepliesManagement.AddAsync(re);
                        await _db.SaveChangesAsync();
                        return Ok(new JsonResult("The Patient was Added Successfully"));

                    }
                }

                else if (PatExist)

                {
                    return BadRequest(new JsonResult("The Patient was Already Added !!"));

                }


            }
            return null;

        }
      
        //===============================إلحاق رسالة ظم للجريح من قبل اللجان الطبية
      //  [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddPatientTransByCommittees([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();
            
            //====رسالة الظم
            var PatTranOutside = new PatientsTransactions
            {
                PatientId = formdata.PatientId,
                Attach = formdata.Attach,
                LetterDest = formdata.LetterDest,
                LetterIndexNO = formdata.LetterIndexNO,
                LetterDate = formdata.LetterDate,
                UserId = formdata.UserId,
                ReplyState = 3,
                Travel = 0,
                Treatment = 0,
                Hotel = 0,
                CountryId = formdata.CountryId,
                UserDate = DateTime.UtcNow,
                MedicalDiagnosis = formdata.MedicalDiagnosis,
                PersonType = 1
            };

                    await _db.PatientsTransactions.AddAsync(PatTranOutside);
                    await _db.SaveChangesAsync();
                  
            //====إنشاء row في جدول الردود لرسالة الظم
            var re = new RepliesManagement                 
            {                      
                TRId = PatTranOutside.Id,                        
                PatientId = (int)PatTranOutside.PatientId,                      
                ReplyState = 3  ,               
                UserId = formdata.UserId,
                Reply="لا مانع",
                ReplyDate = DateTime.UtcNow,
            };
                    await _db.RepliesManagement.AddAsync(re);
                    await _db.SaveChangesAsync();           

            return Ok(PatTranOutside);

        }

        //===============================إلحاق رسالة ظم للجريح من قبل اللجان الطبية
        //  [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> AddTravelAndHotelByCommittees([FromRoute] int id, [FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();


            //====إجراء التسفير
            var tr = new TravelingProcedures
            {
                PatientId = formdata.PatientId,
                TRId = id,
                FlightDate = formdata.EntryDate,
                FlightNom = "UT567CBY",
                AirlineName = "الأجنحة الليبية",
                Attach = formdata.EntryAttach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Travel = 1,
                Hotel = 1
            };
            await _db.TravelingProcedures.AddAsync(tr);
            await _db.SaveChangesAsync();

            //====إجراء التسكين
            var newHotelMov = new HotelMovements
            {
                PatientId = formdata.PatientId,
                TRId = id,
                TPId = tr.Id,
                EntryDate = formdata.EntryDate,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
                Attach = formdata.EntryAttach,
                Treatment = 0,
                HotelId = formdata.HotelId,
            };

            await _db.HotelMovements.AddAsync(newHotelMov);
            await _db.SaveChangesAsync();

            //تعديل حقل التسكين في جدول الرسائل وجدول إجراءات التسفير
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);
            var findPatient2 = _db.TravelingProcedures.FirstOrDefault(x => x.TRId == id);


            if (findPatient.Hotel == 0 || findPatient2.Hotel == 0)
            {
                findPatient.Hotel = 1;
                findPatient2.Hotel = 1;

            }

            else if (findPatient.Hotel == 1 || findPatient2.Hotel == 1)
            {
                findPatient.Hotel = 0;
                findPatient2.Hotel = 0;

            }

            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findPatient2).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            //تعديل حقل التسفير في جدول الرسائل   

            if (findPatient.Travel == 0)
            {
                findPatient.Travel = 1;

            }

            else if (findPatient.Travel == 1)
            {
                findPatient.Travel = 0;

            }

            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Patient was Added Successfully"));

        }


        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddAttendantTrans([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();

            var PatTranInside = new PatientsTransactionsInside
            {
                PatientId = formdata.PatientId,
                Attach = formdata.Attach,
                LetterDest = formdata.LetterDest,
                LetterIndexNO = formdata.LetterIndexNO,
                LetterDate = formdata.LetterDate,
                UserId = formdata.UserId,
                ReplyState = 0,
                HospitalId = formdata.HospitalId,
                UserDate = DateTime.UtcNow,
                MedicalDiagnosis = formdata.MedicalDiagnosis,
                FileStatus = 0
            };


            bool PatExist = _db.PatientsTransactions.Any(x => x.PatientId == formdata.PatientId &&
            x.LetterIndexNO == formdata.LetterIndexNO && x.LetterDate == formdata.LetterDate && x.ReplyState == 0);

            // && (x.ReplyState == 0 || x.ReplyState == 2 || x.ReplyState == 3));

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
                    ReplyState = 0,
                    Travel = 0,
                    Treatment = findLetter.Id,
                    Hotel = 0,
                    CountryId = formdata.CountryId,
                    UserDate = DateTime.UtcNow,
                    MedicalDiagnosis = "مرافق للمريض " + findPatByName.PatientName,
                    FileStatus = 5
                    //  FileStatus = "مرافق للمريض "+ findPatByName.PatientName,
                };


                await _db.PatientsTransactions.AddAsync(PatTranOutside);
                await _db.SaveChangesAsync();

                var re = new RepliesManagement
                {
                    TRId = PatTranOutside.Id,
                    PatientId = (int)PatTranOutside.PatientId,
                    ReplyState = 0
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

        [HttpPost("[action]")]
        public async Task<IActionResult> AddAttendantTransByCountry([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();

            var PatTranInside = new PatientsTransactionsInside
            {
                PatientId = formdata.PatientId,
                Attach = formdata.Attach,
                LetterDest = formdata.LetterDest,
                LetterIndexNO = formdata.LetterIndexNO,
                LetterDate = formdata.LetterDate,
                UserId = formdata.UserId,
                ReplyState = 0,
                HospitalId = formdata.HospitalId,
                UserDate = DateTime.UtcNow,
                MedicalDiagnosis = formdata.MedicalDiagnosis,
                FileStatus = 0
            };


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
                    ReplyState = 3,
                    Travel = 0,
                    Treatment = findLetter.Id,
                    Hotel = 0,
                    CountryId = formdata.CountryId,
                    UserDate = DateTime.UtcNow,
                    MedicalDiagnosis = "مرافق للمريض " + findPatByName.PatientName,
                    FileStatus = 5
                    //  FileStatus = "مرافق للمريض "+ findPatByName.PatientName,
                };


                await _db.PatientsTransactions.AddAsync(PatTranOutside);
                await _db.SaveChangesAsync();

                var re = new RepliesManagement
                {
                    TRId = PatTranOutside.Id,
                    PatientId = (int)PatTranOutside.PatientId,
                    ReplyState = 3,
                    Reply="لا مانع"
                };
                await _db.RepliesManagement.AddAsync(re);
                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Patient was Added Successfully"));

        }

        //=======================================================================

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddPLetterOutByCountry([FromBody] PatientsTransactionsModel formdata)
        {
            List<string> ErrorList = new List<string>();

         
            var PatTranOutside = new PatientsTransactions
            {
                PatientId = formdata.PatientId,
                Attach = formdata.Attach,
                LetterDest = formdata.LetterDest,
                LetterIndexNO = formdata.LetterIndexNO,
                LetterDate = formdata.LetterDate,
                UserId = formdata.UserId,
                ReplyState = 3,
                Travel = 0,
                Treatment = 0,
                Hotel = 0,
                CountryId = formdata.CountryId,
                UserDate = DateTime.UtcNow,
                MedicalDiagnosis = formdata.MedicalDiagnosis,

            };

            if (formdata.Select == 1)
            {
                await _db.PatientsTransactions.AddAsync(PatTranOutside);
                await _db.SaveChangesAsync();

                var re = new RepliesManagement
                {
                    TRId = PatTranOutside.Id,
                    PatientId = (int)PatTranOutside.PatientId,
                    ReplyState = 3,
                    Reply="لا مانع"
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
                        ReplyState = 3,
                        Travel = 0,
                        Treatment = PatTranOutside.Id,
                        Hotel = 0,
                        CountryId = formdata.CountryId,
                        UserDate = DateTime.UtcNow,
                        MedicalDiagnosis = "مرافق للمريض " + findPat.PatientName,
                    };


                    await _db.PatientsTransactions.AddAsync(PatTranOutside2);
                    await _db.SaveChangesAsync();

                    var re2 = new RepliesManagement
                    {
                        TRId = PatTranOutside2.Id,
                        PatientId = (int)PatTranOutside2.PatientId,
                        ReplyState = 3,
                        Reply = "لا مانع",
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
                        ReplyState = 3,
                        Travel = 0,
                        Treatment = PatTranOutside.Id,
                        Hotel = 0,
                        CountryId = formdata.CountryId,
                        UserDate = DateTime.UtcNow,
                        MedicalDiagnosis = "مرافق للمريض " + findPat2.PatientName,
                    };


                    await _db.PatientsTransactions.AddAsync(PatTranOutside2);
                    await _db.SaveChangesAsync();

                    var re2 = new RepliesManagement
                    {
                        TRId = PatTranOutside2.Id,
                        PatientId = (int)PatTranOutside2.PatientId,
                        ReplyState = 3,
                        Reply = "لا مانع",
                    };
                    await _db.RepliesManagement.AddAsync(re2);
                    await _db.SaveChangesAsync();

                    return Ok(new JsonResult("The Patient was Added Successfully"));
                }

                return Ok(new JsonResult("The Patient was Added Successfully"));

            }

            else
            {
                await _db.PatientsTransactions.AddAsync(PatTranOutside);
                await _db.SaveChangesAsync();
                var re = new RepliesManagement
                {
                    TRId = PatTranOutside.Id,
                    PatientId = (int)PatTranOutside.PatientId,
                    ReplyState = 3,
                    Reply = "لا مانع",
                    UserId = formdata.UserId,
                    UserDate = DateTime.UtcNow
                };
                await _db.RepliesManagement.AddAsync(re);
                await _db.SaveChangesAsync();


                return Ok(new JsonResult("The Patient was Added Successfully"));
            }

        }

        //============================ Update Patient Transaction Transaction Outside==============================
        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdatePatientTransactionOutside([FromRoute] int id, [FromBody] PatientModel formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactions.FirstOrDefault(p => p.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            findPatient.Attach = formdata.Attach;
            findPatient.LetterDest = formdata.LetterDest;
            findPatient.LetterIndexNO = formdata.LetterIndexNO;
            findPatient.MedicalDiagnosis = formdata.MedicalDiagnosis;
            findPatient.LetterDate = formdata.LetterDate;
            findPatient.CountryId = formdata.CountryId;
            findPatient.UserId = formdata.UserId;
            findPatient.UserDate = DateTime.UtcNow;

            //bool IndexNoExistsIn = _db.PatientsTransactionsInside.Any(x => x.LetterIndexNO == findPatient.LetterIndexNO && x.Id != id && x.LetterDest == findPatient.LetterDest);
            //bool IndexNoExistsOut = _db.PatientsTransactions.Any(x => x.LetterIndexNO == findPatient.LetterIndexNO && x.Id != id && x.LetterDest == findPatient.LetterDest);

            //if (IndexNoExistsIn || IndexNoExistsOut)
            //{
            //    return BadRequest(new JsonResult("الرقم الإشاري موجود مسبقاً"));

            //}
            //else
            //{
                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();


                return Ok(new JsonResult("The Patient with id " + id + " is updated"));
           // }

        }


        //=======================Get All Paitents===============================
        [Authorize(Policy = "RequireBranchEmployeeRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsTransactionsOutsideByBranchId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from r in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.LetterDest == id && pd.Id == pt.PatientId && pt.CountryId == c.Id
                          && pt.UserId == n.Id && pt.Id == r.TRId
                          orderby pt.UserDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              r.Reply,
                              pt.PersonType,
                              pt.UserDate,
                          }
                              ).ToList();

            return Ok(output);

        }

        //=======================Get All Paitents===============================
        [Authorize(Policy = "RequireBranchEmployeeRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatsTransOutsideByBranchIdOutingFromMainBranch([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from r in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pd.BranchId == id && pt.LetterDest == 13 && pd.Id == pt.PatientId && pt.CountryId == c.Id
                          && pt.UserId == n.Id && pt.Id == r.TRId
                          orderby pt.UserDate descending
                          select new
                          {
                              pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.Attach,
                              pt.LetterIndexNO,
                              pt.CountryId,
                              pt.UserId,
                              c.Country,
                              n.PhoneNumber,
                              pt.MedicalDiagnosis,
                              r.Reply,
                              pt.PersonType,
                              pt.UserDate,

                          }
                              ).ToList();

            return Ok(output);

        }


        //==========================GET Patients BY User ID============================
       // [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsTransactionsOutsideByUserId([FromRoute] string id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from r in _db.RepliesManagement
                         from b in _db.Branches
                         join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                         join c in _db.Countries on pt.CountryId equals c.Id
                         where pt.UserId == id && pd.Id == pt.PatientId && pt.CountryId == c.Id
                         && pt.UserId == n.Id && pt.Id == r.TRId && pt.LetterDest == b.Id
                         orderby pt.UserDate descending
                         select new
                         {
                             pt.Id,
                             pt.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDate,
                             pt.LetterDest,
                             pt.ReplyState,
                             pt.Attach,
                             pt.LetterIndexNO,
                             pt.CountryId,
                             pt.UserId,
                             c.Country,
                             pt.MedicalDiagnosis,
                             r.Reply,
                             pt.Travel,
                             pt.Treatment,
                             pt.Hotel,
                             b.BranchName,
                             pt.PersonType,
                             pt.FileStatus,
                             pt.UserDate

                         }
                             ).ToList();

            return Ok(output);


        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsTransactionsOutsideByUserRole([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from ur in _db.UserRoles
                         from urs in _db.Roles
                         from r in _db.RepliesManagement
                         from hot in _db.HotelMovements
                         from b in _db.Branches
                         join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                         join c in _db.Countries on pt.CountryId equals c.Id
                         where pt.CountryId == id && ur.RoleId == urs.Id && ur.UserId == pt.UserId 
                         && pd.Id == pt.PatientId && pt.CountryId == c.Id
                         && pt.UserId == n.Id && pt.Id == r.TRId && pt.LetterDest == b.Id
                         && pt.Id == hot.TRId
                         orderby pt.UserDate descending
                         select new
                         {
                             pt.Id,
                             pt.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDate,
                             pt.LetterDest,
                             pt.ReplyState,
                             pt.Attach,
                             pt.LetterIndexNO,
                             pt.CountryId,
                             pt.UserId,
                             c.Country,
                             pt.MedicalDiagnosis,
                             r.Reply,
                             pt.Travel,
                             pt.Treatment,
                             pt.Hotel,
                             b.BranchName,
                             pt.PersonType,
                             pt.FileStatus,
                             n.PhoneNumber,
                             pt.UserDate,
                             entryAttach = hot.Attach

                         }
                             ).ToList();

            return Ok(output);


        }

        //==========================Delete Patient Transaction============================

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeletePatientTransactionsOutside([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findPatient = await _db.PatientsTransactions.FindAsync(id);

            if (findPatient == null)
            {
                return NotFound();
            }

            bool findTravelPatientTransactionOutside = _db.TravelingProcedures.Any(PT => PT.TRId == id);

            if (findTravelPatientTransactionOutside)
                return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));

            bool findTreatmentPatientTransactionOutside = _db.TreatmentMovements.Any(PT => PT.TRId == id);

            if (findTreatmentPatientTransactionOutside)
                return BadRequest(new JsonResult("لا يمكن حذف الجريح لارتباطها ببيانات أخرى"));


            _db.PatientsTransactions.Remove(findPatient);
            await _db.SaveChangesAsync();


            // Finally return the result to client
            return Ok(new JsonResult("The Patient with id " + id + " is Deleted."));
        }

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeletePatientTransactionsOutsideByCommit([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var find1 = _db.PatientsTransactions.FirstOrDefault(p => p.Id == id);

            var find2 =  _db.RepliesManagement.FirstOrDefault(p => p.TRId == id);

            var find3 =  _db.TravelingProcedures.FirstOrDefault(p => p.TRId == id);

            var find4 =  _db.HotelMovements.FirstOrDefault(p => p.TRId == id);



            _db.PatientsTransactions.Remove(find1); 
            await _db.SaveChangesAsync();

            _db.RepliesManagement.Remove(find2);
            await _db.SaveChangesAsync();

            _db.TravelingProcedures.Remove(find3); 
            await _db.SaveChangesAsync();

            _db.HotelMovements.Remove(find4); 
            await _db.SaveChangesAsync();


            // Finally return the result to client
            return Ok(new JsonResult("The Patient with id " + id + " is Deleted."));
        }

        //============================================================================= 

        //=================================Get Patients Transactions Outside for management ===================

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]")]
        public IActionResult GetAllP_TransactionsOutsideIsWaiting()
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pd.Id == pt.PatientId && (pt.PersonType == 1 || (pt.PersonType == 2 && pt.FileStatus == 5) ) && pt.CountryId == c.Id
                          && pt.ReplyState == 0 && pt.Travel == 0 && br.BranchName != "الفرع الرئيسي للمركز" &&
                          u.Id == pt.UserId 
                          orderby pt.Id descending, pt.UserDate descending
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
                              pt.UserDate

                          }
                              ).ToList();


            return Ok(output);
        }

        [Authorize(Policy = "RequireManagementRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatAttendantByTRID([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          where pt.Treatment == id && pd.Id == pt.PatientId && pt.PersonType == 2 && pt.CountryId == c.Id
                          && pt.ReplyState == 0 && pt.Travel == 0 && br.BranchName != "الفرع الرئيسي للمركز" &&
                          u.Id == pt.UserId
                          orderby pt.UserDate descending
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
                              pt.UserDate

                          }
                              ).ToList();


            return Ok(output);
        }

        //=================================Check Patient Id If Have Trans Outside ===================

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult CheckPatientIdIfHaveTransOutside([FromRoute] int id)
        {
            var output = (
                          from pt in _db.PatientsTransactions
                          from br in _db.BranchesUsers
                          from b in _db.Branches
                          where pt.PatientId == id && pt.LetterDest == br.BranchId &&
                          b.Id == br.BranchId && pt.UserId == br.UserId
                          select
                          pt.PatientId
                              );

            return Ok(output);
        }

        //===================================Check Reply State Trans Outside==========================================         

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult CheckReplyStateTransOutside([FromRoute] int id)
        {
            var output = (
                          from pt in _db.PatientsTransactions
                          from br in _db.PatientsData
                          from b in _db.Branches
                          from u in _db.Users
                          where pt.PatientId == id && pt.PatientId == br.Id && pt.LetterDest == b.Id &&
                          pt.UserId == u.Id &&
                          (pt.ReplyState == 0 || pt.ReplyState == 2 || pt.ReplyState == 3 || pt.ReplyState == 6)                        
                          && pt.PersonType == 1
                          // pt.UserId == u.Id
                          select
                          pt.ReplyState
                              );

            return Ok(output);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetPersonType([FromRoute] int id)
        {
            var output = (
                          from br in _db.PatientsData
                          where br.Id == id 
                          select
                          br.PersonType
                              );

            return Ok(output);
        }

        //=============================================================================         

        [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteReply([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the reply
            var findReply = _db.RepliesManagement.FirstOrDefault(r => r.TRId == id);

            if (findReply == null)
            {
                return NotFound();
            }

            _db.RepliesManagement.Remove(findReply);

            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The mail with id " + id + " is Deleted."));
        } 
        
        //==========================GET Patients BY Patient ID============================
       // [Authorize(Policy = "RequireAddPMainDataAndLettersRole")]
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientsTransactionsOutsideByPatientId([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from n in _db.Users
                         from r in _db.RepliesManagement
                         from b in _db.Branches
                         join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                         join c in _db.Countries on pt.CountryId equals c.Id
                         where pd.Id == id && pd.Id == pt.PatientId && pd.Id == r.PatientId && pt.CountryId == c.Id
                         && pt.UserId == n.Id && pt.Id == r.TRId && pt.LetterDest == b.Id
                         orderby pt.UserDate descending
                         select new
                         {
                             pt.Id,
                             pt.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDate,
                             pt.LetterDest,
                             pt.ReplyState,
                             pt.Attach,
                             pt.LetterIndexNO,
                             pt.CountryId,
                             pt.UserId,
                             c.Country,
                             pt.MedicalDiagnosis,
                             r.Reply,
                             pt.Travel,
                             pt.Treatment,
                             pt.Hotel,
                             b.BranchName,
                             n.PhoneNumber,
                             pt.PersonType,
                             pt.FileStatus,
                             pt.UserDate,
                             r.ReplyDate,

                         }
                             ).ToList();

            return Ok(output);


        }


    }


}
