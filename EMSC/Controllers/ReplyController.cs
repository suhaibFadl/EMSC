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
    public class ReplyController : ControllerBase
    {
        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public ReplyController(EMSCDBContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        //============================ Reply  ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ReplyOnBranchByManagement([FromBody] ReplyModel fromdata, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);
            var findReply = _db.RepliesManagement.FirstOrDefault(r => r.TRId == id);

            if (fromdata.ReplyState == 2 && fromdata.AttendState == 0)
            {
                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;   
                findReply.UserId = fromdata.UserId;  //مستخدم الفرع الرئيسي الذي قام بالرد على الرسالة 
                findReply.CUserId = fromdata.UserId; //مستخدم الفرع الرئيسي الذي قام بالرد على الرسالة
                findReply.UserDate = DateTime.UtcNow;  //تاريخ رد الفرع الرئيسي على رسالة العلاج


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            if (fromdata.ReplyState == 1 && fromdata.AttendState == 0)
            {
                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = fromdata.ReplyDate; //تاريخ رد الساحة على رسالة العلاج
                findReply.UserId = fromdata.UserId; //مستخدم الفرع الرئيسي الذي قام بالرد على الرسالة
                findReply.CUserId = fromdata.UserId; //مستخدم الفرع الرئيسي الذي قام بالرد على الرسالة
                findReply.UserDate = DateTime.UtcNow; //تاريخ رد الفرع الرئيسي على رسالة العلاج

                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }


            //تم قبول الجريح ورفض المرافق من قبل الادارة
            if (fromdata.ReplyState == 2 && fromdata.AttendState == 1)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = fromdata.ReplyDate; //تاريخ رد الساحة على رسالة العلاج
                findReply.UserDate = DateTime.UtcNow; //تاريخ رد الفرع الرئيسي على رسالة العلاج
                findReply.CUserId = fromdata.UserId; //مستخدم الفرع الرئيسي الذي قام بالرد على الرسالة
                findReply.UserId = fromdata.UserId; //مستخدم الفرع الرئيسي الذي قام بالرد على الرسالة


                // If the reply was found
                findReply2.ReplyState = 1;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = fromdata.ReplyDate;
                findReply2.UserDate = DateTime.UtcNow;
                findReply2.CUserId = fromdata.UserId;
                findReply2.UserId = fromdata.UserId;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            //تم قبول أو رفض الجريح و المرافق من قبل الادارة

            if (fromdata.ReplyState == 2 && fromdata.AttendState == 2)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = fromdata.ReplyDate;
                findReply.UserId = fromdata.UserId;
                findReply.UserDate = DateTime.UtcNow;
                findReply.CUserId = fromdata.UserId;

                // If the reply was found
                findReply2.ReplyState = fromdata.ReplyState;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = fromdata.ReplyDate;
                findReply2.UserId = fromdata.UserId;
                findReply2.UserDate = DateTime.UtcNow;               
                findReply2.CUserId = fromdata.UserId;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            if (fromdata.ReplyState == 1 && fromdata.AttendState == 1)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = fromdata.ReplyDate;
                findReply.UserId = fromdata.UserId;
                findReply.UserDate = DateTime.UtcNow;
               
                
                findReply.CUserId = fromdata.UserId;

                // If the reply was found
                findReply2.ReplyState = fromdata.ReplyState;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = fromdata.ReplyDate;
                findReply2.UserId = fromdata.UserId;
                findReply2.UserDate = DateTime.UtcNow;
                findReply2.CUserId = fromdata.UserId;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();


            }



            //==============================================تعديل حقل حالة الرسالة في جدول رسائل الضم
            //تم قبول الجريح و المرافق من قبل الادارة

            if (fromdata.ReplyState == 2 && fromdata.AttendState == 2)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                findPatient.ReplyState = 2;
                findAtten.ReplyState = 2;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            //تم قبول الجريح و رفض المرافق من قبل الادارة

            if (fromdata.ReplyState == 2 && fromdata.AttendState == 1)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);

                findPatient.ReplyState = 2;
                findAtten.ReplyState = 1;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            //تم رفض الجريح و المرافق من قبل الادارة
            if (fromdata.ReplyState == 1 && fromdata.AttendState == 1)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);

                findPatient.ReplyState = 1;
                findAtten.ReplyState = 1;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            //لا يوجد مرافق
            if ( fromdata.AttendState == 0)
            {
                findPatient.ReplyState = fromdata.ReplyState;
              //  findAtten.ReplyState = 1;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            return Ok(new JsonResult("The Reply with id " + id + " is updated ."));
        }

        //==============================================================================
        //============================ Reply  ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ReplyOnBranchByCountry([FromBody] ReplyModel fromdata, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);
            var findReply = _db.RepliesManagement.FirstOrDefault(r => r.TRId == id);



            //لا يوجد مرافق
            if (fromdata.AttendState == 0)
            {
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = DateTime.UtcNow;
                findReply.UserId = fromdata.UserId; // يتم استبدال قيمة الحقل من مستخدم الفرع الرئيسي إلى مشرف الساحة الذي قام بالرد على الرسالة
               // findReply.UserDate = DateTime.UtcNow;

                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                //==============================================تعديل حقل حالة الرسالة في جدول رسائل الضم
                findPatient.ReplyState = fromdata.ReplyState;
                    _db.Entry(findPatient).State = EntityState.Modified;
                    await _db.SaveChangesAsync();

            }


            //تم قبول الجريح ورفض المرافق من قبل الدولة
            if (fromdata.ReplyState == 3 && fromdata.AttendState == 4)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = "لا مانع";
                findReply.ReplyDate = DateTime.UtcNow;
                findReply.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                    
                //  findReply.UserDate = DateTime.UtcNow;

                // If the reply was found
                findReply2.ReplyState = 4;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = DateTime.UtcNow;
                findReply2.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                     
                // findReply2.UserDate = DateTime.UtcNow;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                //==============================================تعديل حقل حالة الرسالة في جدول رسائل الضم

                findPatient.ReplyState = 3;
                    findAtten.ReplyState = 4;

                    _db.Entry(findPatient).State = EntityState.Modified;
                    await _db.SaveChangesAsync();

                _db.Entry(findAtten).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            //تم قبول الجريح و المرافق من قبل الدولة

            if (fromdata.ReplyState == 3 && fromdata.AttendState == 3)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = DateTime.UtcNow;
                findReply.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                    
                // findReply.UserDate = DateTime.UtcNow;

                // If the reply was found
                findReply2.ReplyState = fromdata.ReplyState;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = DateTime.UtcNow;
                findReply2.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                     
                //  findReply2.UserDate = DateTime.UtcNow;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                //==============================================تعديل حقل حالة الرسالة في جدول رسائل الضم

                findPatient.ReplyState = 3;
                    findAtten.ReplyState = 3;

                    _db.Entry(findPatient).State = EntityState.Modified;
                    await _db.SaveChangesAsync();

                _db.Entry(findAtten).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            //تم رفض الجريح و المرافق من قبل الدولة

            if (fromdata.ReplyState == 4 && fromdata.AttendState == 4)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = DateTime.UtcNow;
                findReply.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                    
                // findReply.UserDate = DateTime.UtcNow;

                // If the reply was found
                findReply2.ReplyState = fromdata.ReplyState;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = DateTime.UtcNow;
                findReply2.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                     
                // findReply2.UserDate = DateTime.UtcNow;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                //==============================================تعديل حقل حالة الرسالة في جدول رسائل الضم

                findPatient.ReplyState = 4;
                findAtten.ReplyState = 4;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();  
                
                _db.Entry(findAtten).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            //تم وضع الجريح والمرافق في قائمة الانتظار من قبل الدولة

            if (fromdata.ReplyState == 6 && fromdata.AttendState == 6)
            {
                var findAtten = _db.PatientsTransactions.FirstOrDefault(r => r.Treatment == id);
                var findReply2 = _db.RepliesManagement.FirstOrDefault(r => r.TRId == findAtten.Id);

                // If the reply was found
                findReply.ReplyState = fromdata.ReplyState;
                findReply.Reply = fromdata.Reply;
                findReply.ReplyDate = DateTime.UtcNow;
                findReply.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                    
                //  findReply.UserDate = DateTime.UtcNow;

                // If the reply was found
                findReply2.ReplyState = fromdata.ReplyState;
                findReply2.Reply = fromdata.Reply;
                findReply2.ReplyDate = DateTime.UtcNow;
                findReply2.UserId = fromdata.UserId; //مشرف الساحةالذي قام بالرد على الرسالة
                                                     
                //   findReply2.UserDate = DateTime.UtcNow;


                _db.Entry(findReply).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                _db.Entry(findReply2).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                //==============================================تعديل حقل حالة الرسالة في جدول رسائل الضم

                findPatient.ReplyState = 6;
                findAtten.ReplyState = 6;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                 _db.Entry(findAtten).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }


            return Ok(new JsonResult("The Reply with id " + id + " is updated ."));


        }


        //===========================================================================
        //================================UpdateReplyState By Management==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateReplyStateOutside([FromRoute] int id, [FromBody] PatientsTransactions fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);
            
            if (findPatient == null)
            {
                return NotFound();
            }

            // If the Patient was accepted by management
            if(fromdata.ReplyState == 2)
            {
                findPatient.ReplyState = 2;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

            // If the Patient was rejected by management
            if (fromdata.ReplyState == 1)
            {
                findPatient.ReplyState = 1;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }


            return Ok(new JsonResult("The ReplyState with id " + id + " is updated."));

        }
        //================================UpdateReplyState==============================


        //==============================================================================

        //================================Update Reply State Country==============================

         [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateReplyStateCountry([FromRoute] int id, [FromBody] PatientsTransactions fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactions.FirstOrDefault(c => c.Id == id);

            if (findPatient == null)
            {
                return NotFound();
            }

            // If the Patient was rejected by country
            if (fromdata.ReplyState == 4)
            {
                findPatient.ReplyState = 4;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            } 
            
            // If the Patient was accepted by country
            if (fromdata.ReplyState == 3)
            {
                findPatient.ReplyState = 3;

                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();

            }

           
            return Ok(new JsonResult("The ReplyState with id " + id + " is updated."));

        }
        //================================Update Reply State Hospital==============================

        [AllowAnonymous]
        //==============================================================================
        //======================================Get Replies Where Reply State is Accept
        [HttpGet("[action]/{id}")]
        public IActionResult GetRepliesAcceptedByCountry()
        {
            var output = (from uc in _db.RepliesManagement
                          from pt in _db.PatientsTransactions
                          from u in _db.Users
                          join am in _db.PatientsData on uc.PatientId equals am.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          //join pt in _db.PatientsTransactions on uc.PatientId equals pt.PatientId
                          where am.Id == uc.PatientId && uc.TRId == pt.Id && uc.UserId == u.Id &&
                          pt.ReplyState == 3 && pt.CountryId == c.Id orderby uc.UserDate descending
                          select new
                          {
                              uc.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.LetterDate,
                              pt.Travel,
                              c.Country,
                              uc.Reply,
                              uc.ReplyDate,
                              uc.ReplyState,
                              uc.TRId,
                              uc.PatientId,
                              u.PhoneNumber,
                              uc.UserDate,
                              uc.UserId
                          }
                       ).ToList();
            return Ok(output);

        }
        //======================================Get Replies Where Reply State is Accept
        [HttpGet("[action]/{id}")]
        public IActionResult GetRepliesAcceptedByCountryforBranch([FromRoute] int id)
        {
            var output = (from uc in _db.RepliesManagement
                          from pt in _db.PatientsTransactions
                          from u in _db.Users
                          join am in _db.PatientsData on uc.PatientId equals am.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          //join pt in _db.PatientsTransactions on uc.PatientId equals pt.PatientId
                          where pt.LetterDest == id && am.Id == uc.PatientId && uc.UserId == u.Id &&
                          uc.TRId == pt.Id && uc.PatientId == pt.PatientId
                          && ( pt.ReplyState == 3 && uc.ReplyState == 3) && pt.LetterDest == b.Id  && pt.Travel==0
                          orderby uc.ReplyDate descending
                          select new
                          {
                              uc.Id,
                              am.PatientName,
                              am.PassportNo,
                              am.NationalNo,
                              pt.Travel,
                              pt.LetterDate,
                              c.Country,
                              uc.Reply,
                              uc.ReplyDate,
                              uc.ReplyState,
                              uc.TRId,
                              uc.PatientId,
                              u.PhoneNumber,
                              uc.UserDate
                          }
                       ).ToList();
            return Ok(output);

        }
        //=================================UPDATE Reply===============================
        [AllowAnonymous]
        [HttpPut("[action]/{id}")]
        // [HttpPut(("[action]"))]
        public async Task<IActionResult> UpdateReply([FromRoute] int id, [FromBody] RepliesBr fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findReply = _db.RepliesBr.FirstOrDefault(c => c.Id == id);

            if (findReply == null)
            {
                return NotFound();
            }

            // If the  was found
            findReply.ReplyState = fromdata.ReplyState;
            findReply.Reply = fromdata.Reply;
            findReply.ReplyDate = fromdata.ReplyDate;


            _db.Entry(findReply).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply with id " + id + " is updated ."));

        }
        //=============================================================================
        //============================ Update Patient ==============================
        [HttpPut("[action]/{id}/{trid}")]
        public async Task<IActionResult> UpdateReplyManagementOutside([FromRoute] int id, [FromRoute] int trid, [FromBody] RepliesManagement formdata)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.RepliesManagement.FirstOrDefault(p => p.Id == id);

            var findTransaction = _db.PatientsTransactions.FirstOrDefault(t => t.Id == trid);

            if (findPatient == null)
            {
                return NotFound();
            }

            List<string> ErrorList = new List<string>();

            findPatient.ReplyState = formdata.ReplyState;
            findPatient.ReplyDate = formdata.ReplyDate;
            findPatient.Reply = formdata.Reply;
            findPatient.UserId = formdata.UserId;
        
            if(formdata.ReplyState == 1)
            {
                findTransaction.ReplyState = 1;

            }
            
            if(formdata.ReplyState == 2)
            {
                findTransaction.ReplyState = 2;

            }

          
            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findTransaction).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply was Updated Successfully " + id ));
              
        }
        //=======================================================================
        //============================ Update Patient ==============================
        [HttpPut("[action]/{id}/{trid}")]
        public async Task<IActionResult> UpdateReplyCountryOutside([FromRoute] int id, [FromRoute] int trid, [FromBody] RepliesManagement formdata)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.RepliesManagement.FirstOrDefault(p => p.Id == id);

            var findTransaction = _db.PatientsTransactions.FirstOrDefault(t => t.Id == trid);

            if (findPatient == null)
            {
                return NotFound();
            }

            List<string> ErrorList = new List<string>();

            findPatient.ReplyState = formdata.ReplyState;
            findPatient.ReplyDate = formdata.ReplyDate;
            findPatient.Reply = formdata.Reply;
            findPatient.UserId = formdata.UserId;
        
            if(formdata.ReplyState == 4)
            {
                findTransaction.ReplyState = 4;

            }
            
            if(formdata.ReplyState == 3)
            {
                findTransaction.ReplyState = 3;

            }

          
            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findTransaction).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply was Updated Successfully " + id ));
              
        }
        //=======================================================================  
           //============================ Update Patient ==============================
        [HttpPut("[action]/{id}/{trid}")]
        public async Task<IActionResult> UpdateReplyManagementInside([FromRoute] int id, [FromRoute] int trid, [FromBody] RepliesManagement formdata)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.RepliesManagement.FirstOrDefault(p => p.Id == id);

            var findTransaction = _db.PatientsTransactionsInside.FirstOrDefault(t => t.Id == trid);

            if (findPatient == null)
            {
                return NotFound();
            }

            List<string> ErrorList = new List<string>();

            findPatient.ReplyState = formdata.ReplyState;
            findPatient.ReplyDate = formdata.ReplyDate;
            findPatient.Reply = formdata.Reply;
            findPatient.UserId = formdata.UserId;
        
            if(formdata.ReplyState == 1)
            {
                findTransaction.ReplyState = 1;

            }
            
            if(formdata.ReplyState == 2)
            {
                findTransaction.ReplyState = 2;

            }

          
            _db.Entry(findPatient).State = EntityState.Modified;
            _db.Entry(findTransaction).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Reply was Updated Successfully " + id ));
              
        }
        //=======================================================================  

        //=========================================GetRepliesManagementTransactionsOutside for Management
        [HttpGet("[action]")]
        public IActionResult GetRepliesManagementTransactionsOutside()
        {
            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from rm in _db.RepliesManagement
                          from pt in _db.PatientsTransactions
                          from br in _db.Branches
                          from c in _db.Countries

                          where pt.ReplyState != 0 && pd.Id == pt.PatientId && pd.Id == rm.PatientId && pt.Id == rm.TRId 
                          && pt.CountryId == c.Id && pt.LetterDest == br.Id && rm.CUserId == u.Id 
                          orderby rm.UserDate descending
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Travel,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              br.BranchName,
                              u.PhoneNumber,
                              rm.Reply,
                              rm.ReplyState,
                              rm.ReplyDate,
                              rm.Id,
                              rm.TRId,                             
                              pt.MedicalDiagnosis,                              
                              pt.PersonType,
                              pt.CountryId,
                              rm.UserDate,
                              rm.UserId,
                              rm.CUserId


                          }
                              ).ToList();


            return Ok(output);
        }
        //========================================================= 
     
        //=========================================================

        [HttpGet("[action]")]
        public IActionResult GetRepliesManagementTransactionsInside()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from uc in _db.RepliesManagement
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Hospitals on pt.HospitalId equals c.Id
                          join rr in _db.Users on pt.UserId equals rr.Id
                          where pd.Id == pt.PatientId && pd.Id == uc.PatientId && pt.Id == uc.TRId && pt.HospitalId == c.Id && uc.UserId == n.Id &&
                          (pt.ReplyState == 1 && uc.ReplyState == 1 || pt.ReplyState == 2 && uc.ReplyState == 2)
                          select new
                          {

                              //pt.Id,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                             // pt.Attach,
                              pt.LetterIndexNO,
                              c.HospName,
                              br.BranchName,
                              n.PhoneNumber,
                              uc.Reply,
                              uc.ReplyState,
                              uc.Id,
                              uc.TRId,
                          }
                              ).ToList();


            return Ok(output);
        }
        //=========================================================


        //=========================================================

        [HttpGet("[action]")]
        public IActionResult GetRepliesCountryTransactionsOutside()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from uc in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join rr in _db.Users on pt.UserId equals rr.Id
                          where pd.Id == pt.PatientId && pd.Id == uc.PatientId && pt.Id == uc.TRId && pt.CountryId == c.Id && uc.UserId == n.Id &&
                          (pt.ReplyState == 3 && uc.ReplyState == 3 || pt.ReplyState == 4 && uc.ReplyState == 4)
                          select new
                          {

                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Travel,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              br.BranchName,
                              n.PhoneNumber,
                              uc.Reply,
                              uc.ReplyState,
                              uc.ReplyDate,
                              uc.Id,
                              uc.TRId,
                              uc.UserDate
                          }
                              ).ToList();


            return Ok(output);
        }
        //=========================================================

        //=========================================================

        [HttpGet("[action]")]
        public IActionResult GetRepliesHospitalsTransactionsInside()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from uc in _db.RepliesManagement
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Hospitals on pt.HospitalId equals c.Id
                          join rr in _db.Users on pt.UserId equals rr.Id
                          where pd.Id == pt.PatientId && pd.Id == uc.PatientId && pt.Id == uc.TRId && pt.HospitalId == c.Id && uc.UserId == n.Id &&
                          (pt.ReplyState == 3 && uc.ReplyState == 3 || pt.ReplyState == 4 && uc.ReplyState == 4)
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                            //  pt.Attach,
                              pt.LetterIndexNO,
                              c.HospName,
                              br.BranchName,
                              n.PhoneNumber,
                              uc.Reply,
                              uc.ReplyState,
                              uc.Id,
                              uc.TRId,
                          }
                              ).ToList();

            
            return Ok(output);
        }
        //=========================================================
        //=======================Get All Paitents===============================
        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetRepliesCountryTransactionsOutsideByCountryId([FromRoute] int id)
        {
            var output = (
                 from pd in _db.PatientsData
                 from n in _db.Users
                 from uc in _db.RepliesManagement
                 join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                 join br in _db.Branches on pt.LetterDest equals br.Id
                 join c in _db.Countries on pt.CountryId equals c.Id
                 join rr in _db.Users on pt.UserId equals rr.Id
                 where pt.CountryId == id && pd.Id == pt.PatientId && pd.Id == uc.PatientId &&
                 pt.Id == uc.TRId && pt.CountryId == c.Id && uc.UserId == n.Id 
                 && (pt.ReplyState == 3 || pt.ReplyState == 4 || pt.ReplyState == 5 || pt.ReplyState == 6)
                orderby uc.ReplyDate descending
                 select new
                          {                          
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Travel,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              br.BranchName,
                              n.PhoneNumber,
                              uc.Reply,
                              uc.ReplyState,
                              uc.ReplyDate,
                              uc.Id,
                              uc.TRId,
                              pt.PersonType,
                              uc.UserDate

                          }
                              ).ToList();

            return Ok(output);

        }

        //====================================================================== 
        //=======================Get All Paitents===============================
        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetRepliesCountryTransactionsOutsideByCountryIdTreatment([FromRoute] int id)
        {
            var output = (
                 from pd in _db.PatientsData
                 from n in _db.Users
                 from uc in _db.RepliesManagement
                 join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                 join br in _db.Branches on pt.LetterDest equals br.Id
                 join c in _db.Countries on pt.CountryId equals c.Id
                 join rr in _db.Users on pt.UserId equals rr.Id
                 where pt.CountryId == id && pd.Id == pt.PatientId && pd.Id == uc.PatientId &&
                 pt.Id == uc.TRId && pt.CountryId == c.Id && uc.UserId == n.Id &&
                 (pt.ReplyState == 3 && uc.ReplyState == 3 )
         
                          select new
                          {                          
                              pd.Id,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Travel,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              br.BranchName,
                              n.PhoneNumber,
                              uc.Reply,
                              uc.ReplyState,
                              uc.ReplyDate,
                              //uc.Id,
                              uc.TRId,

                          }
                              ).ToList();

            return Ok(output);

        }

        //=========================================================

        [HttpGet("[action]")]
        public IActionResult GetRepliesAcceptCountryTransactionsToTravel()
        {

            var output = (
                          from pd in _db.PatientsData
                          from n in _db.Users
                          from uc in _db.RepliesManagement
                          join pt in _db.PatientsTransactions on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join c in _db.Countries on pt.CountryId equals c.Id
                          join rr in _db.Users on pt.UserId equals rr.Id
                          where pd.Id == pt.PatientId && pd.Id == uc.PatientId && pt.Id == uc.TRId && pt.CountryId == c.Id && uc.UserId == n.Id &&
                          (pt.ReplyState == 3 && uc.ReplyState == 3 )
                          select new
                          {
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.Travel,
                              pt.Attach,
                              pt.LetterIndexNO,
                              c.Country,
                              br.BranchName,
                              n.PhoneNumber,
                              uc.Reply,
                              uc.ReplyState,
                              uc.ReplyDate,
                              uc.Id,
                              uc.TRId,
                              uc.UserDate
                          }
                              ).ToList();


            return Ok(output);
        }
        //========================================================= 

    }
}
