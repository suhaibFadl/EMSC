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

    public class PatientsLettersInsideController : ControllerBase
    {
        private readonly EMSCDBContext _db;
        private UserManager<IdentityUser> _userManager;

        public PatientsLettersInsideController(EMSCDBContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }



        //=======================================================================
        // get patient transactions need aprrove from the doctor in branch
        //=======================================================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsTransactionsInsideNeedApprovedByBranchId([FromRoute] int id)
        {

            var output = (
                              from pd in _db.PatientsData
                              from n in _db.Users
                              join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                              join c in _db.Hospitals on pt.HospitalId equals c.Id
                              where pt.LetterDest == id && pt.Approved == 0 && pd.Id == pt.PatientId && c.Id == pt.HospitalId
                              && n.Id == pt.UserId
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
                                 // pt.Attach,
                                  pt.LetterIndexNO,
                                  pt.HospitalId,
                                  pt.UserId,
                                  c.HospName,
                                  n.PhoneNumber,
                                  pt.MedicalDiagnosis,
                                  pt.UserDate

                              }).ToList();

            return Ok(output);
        }

        //=====================================================================
        //================Approve transaction from the doctor=============================
        //=====================================================================


        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ApprovePatientTransactionInside([FromRoute] int id, [FromBody] PatientsTransactionsInside formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactionsInside.FirstOrDefault(p => p.Id == id);


            if (findPatient == null)
            {
                return NotFound();
            }


            findPatient.Approved = formdata.Approved;
            findPatient.HospitalId = formdata.HospitalId;
            findPatient.UserApproved = formdata.UserId;
            findPatient.ApproveDate = DateTime.UtcNow;

            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Patient with id " + id + " is updated"));

        }


        //=====================================================================
        //================Add Hospital Entry=============================
        //=====================================================================







        //==========================================================================================================
        //==========================================================================================================
        //==========================================================================================================
        //==========================================================================================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetReplyStateForAllTransInside([FromRoute] string id)
        {
            var output = (from br in _db.PatientsTransactionsInside
                          from am in _db.PatientsData
                          where am.UserId == id && am.BranchId == br.Id
                          select br.ReplyState
                            );
            return Ok(output);

        }



        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdatePatientTransactionInside([FromRoute] int id, [FromBody] PatientModel formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findPatient = _db.PatientsTransactionsInside.FirstOrDefault(p => p.Id == id);
            var findHospId = _db.PatientHosps.FirstOrDefault(h => h.PatientId == id);

            if (findPatient == null)
            {
                return NotFound();
            }


           // findPatient.Attach = formdata.Attach;
            findPatient.LetterDest = formdata.LetterDest;
            findPatient.LetterIndexNO = formdata.LetterIndexNO;
            findPatient.LetterDate = formdata.LetterDate;
            findPatient.HospitalId = formdata.HospitalId;
            findPatient.UserId = formdata.UserId;
            findPatient.UserDate = DateTime.UtcNow;
            findPatient.MedicalDiagnosis = formdata.MedicalDiagnosis;


            bool IndexNoExistsIn = _db.PatientsTransactionsInside.Any(x => x.LetterIndexNO == findPatient.LetterIndexNO && x.Id != id && x.LetterDest == findPatient.LetterDest);
            bool IndexNoExistsOut = _db.PatientsTransactions.Any(x => x.LetterIndexNO == findPatient.LetterIndexNO && x.Id != id && x.LetterDest == findPatient.LetterDest);

            if (IndexNoExistsIn || IndexNoExistsOut)
            {
                return BadRequest(new JsonResult("الرقم الإشاري موجود مسبقاً"));

            }
            else
            {
                _db.Entry(findPatient).State = EntityState.Modified;
                await _db.SaveChangesAsync();


                return Ok(new JsonResult("The Patient with id " + id + " is updated"));
            }
        }


        [HttpPut("[action]/{id}/{status}")]
        public async Task<IActionResult> UpdatePatientTransactionInsideStatus([FromRoute] int id, [FromRoute] int status)
        {
            var findPatient = _db.PatientsTransactionsInside.FirstOrDefault(p => p.Id == id);
            //var findHospId = _db.PatientHosps.FirstOrDefault(h => h.PatientId == id);

            if (findPatient == null)
            {
                return NotFound();
            }


           // findPatient.Attach = formdata.Attach;
            findPatient.FileStatus = status;
            _db.Entry(findPatient).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The Patient with id " + id + " is updated"));
        }



        //=======================================================================

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsTransactionsInsideByBranchId([FromRoute] int id)
        {

            var output = (
                              from pd in _db.PatientsData
                              from n in _db.Users
                              from r in _db.RepliesHospitals
                              join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                              join c in _db.Hospitals on pt.HospitalId equals c.Id
                              where pt.LetterDest == id && pd.Id == pt.PatientId && pt.HospitalId == c.Id
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
                               //   pt.Attach,
                                  pt.LetterIndexNO,
                                  pt.HospitalId,
                                  pt.UserId,
                                  c.HospName,
                                  n.PhoneNumber,
                                  pt.MedicalDiagnosis,
                                  r.Reply,
                                  pt.UserDate,
                                  //pt.Approved,
                                  //pt.ApproveDate

                              }).ToList();

            return Ok(output);
        }
        //=======================================================================  
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPInsideFilesOpenByBranchId([FromRoute] int id)
        {

            var output = (
                              from pd in _db.PatientsData
                              from n in _db.Users
                              from r in _db.RepliesHospitals
                              join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                              join c in _db.Hospitals on pt.HospitalId equals c.Id
                              where pt.LetterDest == id && pt.FileStatus == 0 &&
                              pd.Id == pt.PatientId && pt.HospitalId == c.Id
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
                                 // pt.Attach,
                                  pt.LetterIndexNO,
                                  pt.HospitalId,
                                  pt.UserId,
                                  c.HospName,
                                  n.PhoneNumber,
                                  pt.MedicalDiagnosis,
                                  r.Reply,
                                  pt.UserDate

                              }).ToList();

            return Ok(output);
        }
        //=======================================================================  
        [HttpGet("[action]")]
        public IActionResult GetAllPInsideFilesOpenForManag([FromRoute] int id)
        {

            var output = (
                              from pd in _db.PatientsData
                              from n in _db.Users
                              from r in _db.RepliesHospitals
                              from br in _db.Branches
                              join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                              join c in _db.Hospitals on pt.HospitalId equals c.Id
                              where pt.FileStatus == 0 && pt.LetterDest ==  br.Id &&
                              pd.Id == pt.PatientId && pt.HospitalId == c.Id
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
                                //  pt.Attach,
                                  pt.LetterIndexNO,
                                  pt.HospitalId,
                                  pt.UserId,
                                  c.HospName,
                                  n.PhoneNumber,
                                  pt.MedicalDiagnosis,
                                  r.Reply,
                                  pt.UserDate

                              }).ToList();

            return Ok(output);
        }
        //=======================================================================  

        //=======================================================================

        [HttpGet("[action]/{id}")]
        //[Authorize(Policy = "RequireBranchManagerRole")]
        public IActionResult GetPatientsTransactionsInsideByUserId([FromRoute] string id)
        {

            var output = (
                         from pd in _db.PatientsData
                         from br in _db.BranchesUsers
                         from u in _db.Users
                         join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                         join h in _db.Hospitals on pt.HospitalId equals h.Id
                         join b in _db.Branches on br.BranchId equals b.Id
                         where pt.UserId == id && pd.Id == pt.PatientId && br.UserId == pt.UserId && pt.UserId == u.Id
                         && pt.HospitalId == h.Id && br.BranchId == b.Id
                         orderby pt.UserDate descending
                         select new
                         {
                             pt.Id,
                             pt.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDate,
                             pt.HospitalId,
                             pt.LetterDest,
                             //pt.Attach,
                             pt.LetterIndexNO,
                             h.HospName,
                             b.BranchName,
                             br.BranchId,
                             pt.ReplyState,
                             u.PhoneNumber,
                             pt.UserDate

                         }
                             ).ToList();
            return Ok(output);

        }
        //=============================================================================

        [AllowAnonymous]
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

            // Finally return the result to client
            return Ok(new JsonResult("The mail with id " + id + " is Deleted."));
        }

        //=======================DELETE  Delete Patient Transactions Inside==================================

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeletePatientTransactionsInside([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            var findPatient = await _db.PatientsTransactionsInside.FindAsync(id);

            if (findPatient == null)
            {
                return NotFound();
            }

            _db.PatientsTransactionsInside.Remove(findPatient);

            await _db.SaveChangesAsync();

            // Finally return the result to client
            return Ok(new JsonResult("The Patient with id " + id + " is Deleted."));
        }
        //=============================================================================

        [HttpGet("[action]")]
        public IActionResult GetAllP_TransactionsInsideForManagement()
        {
            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from re in _db.RepliesHospitals
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join br in _db.Branches on pt.LetterDest equals br.Id
                          join h in _db.Hospitals on pt.HospitalId equals h.Id
                          where pt.Id == re.TRId && pd.Id == pt.PatientId && pt.HospitalId == h.Id
                          && re.ReplyState == 1 && pt.LetterDest != 13 && u.Id == re.UserId
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
                              //pt.Attach,
                              pt.LetterIndexNO,
                              pt.HospitalId,
                              h.HospName,
                              br.BranchName,
                              pt.ReplyState,
                              u.PhoneNumber,
                              pt.MedicalDiagnosis,
                              re.Reply,
                              re.EntryDate,
                              pt.UserDate

                          }
                              ).ToList();


            return Ok(output);
        }
        //==============================================================================

        //=======================================================================      
        [HttpGet("[action]/{id}")]
        public IActionResult CheckPatientIdIfHaveTransInside([FromRoute] int id)
        {
            var output = (
                          from pt in _db.PatientsTransactionsInside
                          from br in _db.BranchesUsers
                          from b in _db.Branches
                          where pt.PatientId == id && pt.UserId == br.UserId &&
                          b.Id == br.BranchId
                          select
                          pt.PatientId
                              );

            return Ok(output);
        }
        [HttpGet("[action]/{id}")]
        public IActionResult CheckReplyStateTransInside([FromRoute] int id)
        {
            var output = (
                          from pt in _db.PatientsTransactionsInside
                          from br in _db.BranchesUsers
                          from b in _db.Branches
                          where pt.PatientId == id && (pt.ReplyState == 0 || pt.ReplyState == 2 || pt.ReplyState == 3) && pt.UserId == br.UserId &&
                          b.Id == br.BranchId
                          select
                          pt.ReplyState
                              );

            return Ok(output);
        }
        //=======================================================================

        [HttpGet("[action]/{id}")]
        //[Authorize(Policy = "RequireBranchManagerRole")]
        public IActionResult GetPatientsTransactionsInsideByPatientId([FromRoute] int id)
        {

            var output = (
                         from pd in _db.PatientsData
                         from br in _db.BranchesUsers
                         from u in _db.Users
                         join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                         join h in _db.Hospitals on pt.HospitalId equals h.Id
                         join b in _db.Branches on br.BranchId equals b.Id
                         where pd.Id == id && pd.Id == pt.PatientId && br.UserId == pt.UserId && pt.UserId == u.Id
                         && pt.HospitalId == h.Id && br.BranchId == b.Id
                         orderby pt.UserDate descending
                         select new
                         {
                             pt.Id,
                             pt.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             pt.LetterDate,
                             pt.HospitalId,
                             pt.LetterDest,
                             //pt.Attach,
                             pt.LetterIndexNO,
                             pt.MedicalDiagnosis,
                             h.HospName,
                             b.BranchName,
                             br.BranchId,
                             pt.ReplyState,
                             u.PhoneNumber,
                             pt.UserDate

                         }
                             ).ToList();
            return Ok(output);

        }


        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsTransInsideByToAddTreatment([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from b in _db.Branches
                          from rh in _db.RepliesHospitals
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join h in _db.Hospitals on pt.HospitalId equals h.Id
                          where pt.HospitalId == id && pd.Id == pt.PatientId &&
                          pt.HospitalId == h.Id && pt.UserId == u.Id && rh.TRId ==  pt.Id &&
                          pt.LetterDest == b.Id && pt.ReplyState == 1
                          orderby rh.EntryDate descending
                          select new
                          {
                              pt.Id,
                              pt.LetterIndexNO,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.HospitalId,
                              pt.ReplyState,
                              //pt.Attach,
                              u.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.FileStatus,
                              pt.UserDate,
                              rh.EntryDate,
                              rh.ReplyDate
                          }
                              ).ToList();


            return Ok(output);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsTransInsideByBranchToAddTreatment([FromRoute] string id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from b in _db.Branches
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join h in _db.Branches on pt.LetterDest equals h.Id
                          where pt.UserId == id && pd.Id == pt.PatientId &&
                          pt.LetterDest == b.Id && pt.UserId == u.Id &&
                          pt.ReplyState == 1
                          orderby pt.UserDate descending
                          select new
                          {

                              pt.Id,
                              pt.LetterIndexNO,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.HospitalId,
                              pt.ReplyState,
                              //pt.Attach,
                              u.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.FileStatus,
                              pt.UserDate

                          }
                              ).ToList();


            return Ok(output);
        }

        //=======================================================================
        //============================ ADD Treatment Movement ========================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddTreatmentMovementInside([FromBody] TreatmentMovementsInside formdata)
        {

            List<string> ErrorList = new List<string>();

            var newTreatmentMov = new TreatmentMovementsInside
            {
                PatientId = formdata.PatientId,
                TRId = formdata.TRId,
                Medical_Diagnosis = formdata.Medical_Diagnosis,
                Date_Diagnosis = formdata.Date_Diagnosis,
                HospitalId = formdata.HospitalId,
                Attach = formdata.Attach,
                UserId = formdata.UserId,
                UserDate = DateTime.UtcNow,
              
            };

            await _db.TreatmentMovementsInside.AddAsync(newTreatmentMov);
            await _db.SaveChangesAsync();


            var findLetter = _db.PatientsTransactionsInside.FirstOrDefault(x => x.Id == formdata.TRId);


            //تم إضافة أول إجراء طبي للجريح وفتح ملف له
            if (findLetter.FileStatus == 0)
            {
                findLetter.FileStatus = 1;

                _db.Entry(findLetter).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }


            var input = new MedicalFilesInside
            {
                PatientId = formdata.PatientId,
                TRID = formdata.TRId,
            };
            await _db.MedicalFilesInside.AddAsync(input);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Treatment Movement was Added Successfully"));

        }

        //============================ Update Treatment Movement ==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateTreatmentMovementInside([FromRoute] int id, [FromBody] TreatmentMovementsInside formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findTreatmentMov = _db.TreatmentMovementsInside.FirstOrDefault(h => h.Id == id);

            if (findTreatmentMov == null)
            {
                return NotFound();
            }

            // If the Patient was found
            findTreatmentMov.PatientId = formdata.PatientId;
            findTreatmentMov.TRId = formdata.TRId;
            findTreatmentMov.Medical_Diagnosis = formdata.Medical_Diagnosis;
            findTreatmentMov.Date_Diagnosis = formdata.Date_Diagnosis;
            findTreatmentMov.Attach = formdata.Attach;
            findTreatmentMov.UserId = formdata.UserId;
            findTreatmentMov.UserDate = DateTime.UtcNow;

            _db.Entry(findTreatmentMov).State = EntityState.Modified;
            await _db.SaveChangesAsync();


            return Ok(new JsonResult("The Patient with id " + id + " is updated his Treatment Movement"));

        }
        //[AllowAnonymous]
        [HttpDelete("[action]/{id}/{trid}")]
        public async Task<IActionResult> DeleteTreatmentMovement([FromRoute] int id, [FromRoute] int trid)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient

            //  var findTreatmentMove = await _db.TreatmentMovements.FindAsync(id);
            var findTreat = _db.TreatmentMovementsInside.FirstOrDefault(x => x.Id == id);

            if (findTreat == null)
            {
                return NotFound();
            }

            _db.TreatmentMovementsInside.Remove(findTreat);
            await _db.SaveChangesAsync();


            bool TRIDExistsInTreatment = _db.TreatmentMovementsInside.Any(x => x.TRId == trid);

            if (TRIDExistsInTreatment)
            {
                var findLetter = _db.PatientsTransactionsInside.FirstOrDefault(h => h.Id == trid);
                findLetter.FileStatus = 1;

                _db.Entry(findLetter).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            else if (!TRIDExistsInTreatment)

            {
                var findLetter = _db.PatientsTransactionsInside.FirstOrDefault(h => h.Id == trid);
                findLetter.FileStatus = 0;

                _db.Entry(findLetter).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }

            return Ok(new JsonResult("The Patient with id " + id + " is Deleted his Treatment Movement."));
        }


        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByHospId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.TreatmentMovementsInside
                          from n in _db.Users
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join c in _db.Hospitals on pt.HospitalId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id

                          where pt.HospitalId == id && pd.Id == pt.PatientId
                          && pt.HospitalId == c.Id && pt.LetterDest == b.Id
                          && p.UserId == n.Id && pt.Id == p.TRId 
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.LetterIndexNO,
                              pt.HospitalId,
                              p.UserId,
                              p.Date_Diagnosis,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.Medical_Diagnosis,
                              p.UserDate,
                              c.HospName,
                              n.UserName,
                              b.BranchName,
                              n.PhoneNumber,
                              pt.FileStatus,

                          }
                       ).ToList();
            return Ok(output);

        }//======================================Get Traveling Procedures For Branch


        [HttpGet("[action]/{id}")]
        public IActionResult GetPatientTransactionTreatmentByBranchId([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.TreatmentMovementsInside
                          from n in _db.Users
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join c in _db.Hospitals on pt.HospitalId equals c.Id
                          join b in _db.Branches on pt.LetterDest equals b.Id

                          where pt.LetterDest == id && pd.Id == pt.PatientId
                          && pt.LetterDest == b.Id && pt.HospitalId == c.Id
                          && p.UserId == n.Id && pt.Id == p.TRId
                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.LetterIndexNO,
                              pt.HospitalId,
                              p.UserId,
                              p.Date_Diagnosis,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.Medical_Diagnosis,
                              p.UserDate,
                              c.HospName,
                              n.UserName,
                              b.BranchName,
                              n.PhoneNumber,
                              pt.FileStatus
                          }
                       ).ToList();
            return Ok(output);

        }//======================================Get Traveling Procedures For Branch


        [HttpPut("[action]")]
        public async Task<IActionResult> CloseMedicalFileInside([FromBody] MedicalFilesInside formdata)
        {

            List<string> ErrorList = new List<string>();

            var findFile = _db.MedicalFilesInside.FirstOrDefault(r => r.TRID == formdata.TRID);

            if (findFile == null)
            {
                return NotFound();
            }

            findFile.FileState = formdata.FileState;
            findFile.Notes = formdata.Notes;
            findFile.ClosingDate = formdata.ClosingDate;
            findFile.UserId = formdata.UserId;
            findFile.Attach = formdata.Attach;

            _db.Entry(findFile).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            //تم إغلاق الملف الطبي 
            var findLetter = _db.PatientsTransactionsInside.FirstOrDefault(h => h.Id == formdata.TRID);
            findLetter.FileStatus = 2;
            _db.Entry(findLetter).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Medical File was Closed Successfully"));

        }



        [HttpGet("[action]/{id}")]
        public IActionResult GetPatsFilesInsideByHospId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactionsInside
                          from c in _db.Hospitals
                          from b in _db.Branches
                          from mf in _db.MedicalFilesInside
                          from rh in _db.RepliesHospitals

                          where pt.HospitalId == id && pt.HospitalId == c.Id && pt.LetterDest == b.Id &&
                          pt.ReplyState ==  1 && (pt.FileStatus == 1 || pt.FileStatus == 2) && pd.Id == pt.PatientId 
                          && mf.TRID == pt.Id && rh.TRId == pt.Id
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
                              pt.LetterIndexNO,
                              pt.FileStatus,
                              b.BranchName,
                              mf.Attach,
                              mf.ClosingDate,
                              mf.Notes,
                              rh.EntryDate
                          }
                       ).ToList();

            return Ok(output);

        }
        [HttpGet("[action]/{id}")]
        public IActionResult GetPatsFilesInsideByBranchId([FromRoute] int id)
        {
            var output = (
                          from pd in _db.PatientsData
                          from pt in _db.PatientsTransactionsInside
                          from c in _db.Hospitals
                          from b in _db.Branches

                          where pt.LetterDest == id  && pt.LetterDest == b.Id && pt.HospitalId == c.Id &&
                           pt.ReplyState == 1 &&
                          (pt.FileStatus == 1 || pt.FileStatus == 2) && pd.Id == pt.PatientId
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
                              pt.LetterIndexNO,
                              pt.FileStatus,
                              b.BranchName,
                              c.HospName
                          }
                       ).ToList();

            return Ok(output);

        }


        [HttpGet("[action]/{id}")]
        public IActionResult GetTreatmentsMovByTrid([FromRoute] int id)
        {
            var output = (from pd in _db.PatientsData
                          from p in _db.TreatmentMovementsInside
                          from n in _db.Users
                          from b in _db.Branches
                          from h in _db.Hospitals
                          from pt in _db.PatientsTransactionsInside
                         
                          where pt.Id == id && pt.Id == p.TRId && pd.Id == pt.PatientId && pd.Id == p.PatientId
                          && pt.HospitalId == h.Id && pt.LetterDest == b.Id && p.UserId == n.Id 

                          select new
                          {
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.ReplyState,
                              pt.LetterIndexNO,
                              p.Date_Diagnosis,
                              p.Attach,
                              p.Id,
                              p.TRId,
                              p.Medical_Diagnosis,
                              p.UserDate,
                              b.BranchName,
                              n.PhoneNumber,
                              pt.FileStatus,
                              p.UserId
                              
                          }
                       ).ToList();
            return Ok(output);

        }//======================================Get Traveling Procedures For Branch




        //=============================COde Abdo



        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsTransactionsInsideByHospitalId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from b in _db.Branches
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join h in _db.Hospitals on pt.HospitalId equals h.Id
                          where pt.HospitalId == id && pd.Id == pt.PatientId &&
                          pt.HospitalId == h.Id && pt.UserId == u.Id &&
                          pt.LetterDest == b.Id && pt.FileStatus == 0
                          orderby pt.UserDate descending
                          select new
                          {

                              pt.Id,
                              pt.LetterIndexNO,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.HospitalId,
                              pt.ReplyState,
                              //pt.Attach,
                              u.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.UserDate


                          }
                              ).ToList();


            return Ok(output);
        }




        //Get Open files
        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsOpenFilesByHospitalId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from b in _db.Branches
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                          join h in _db.Hospitals on pt.HospitalId equals h.Id
                          where pt.HospitalId == id && pd.Id == pt.PatientId &&
                          pt.HospitalId == h.Id && pt.UserId == u.Id &&
                          pt.LetterDest == b.Id && pt.FileStatus == 1
                          orderby pt.UserDate descending
                          select new
                          {

                              pt.Id,
                              pt.LetterIndexNO,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.HospitalId,
                              pt.ReplyState,
                            //  pt.Attach,
                              u.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.UserDate


                          }
                              ).ToList();


            return Ok(output);
        }




        //Get Open files
        //[AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public IActionResult GetAllPatientsOpenFilesByTraId([FromRoute] int id)
        {

            var output = (
                          from pd in _db.PatientsData
                          from u in _db.Users
                          from b in _db.Branches
                          from ph in _db.PatientHosps
                          join pt in _db.PatientsTransactionsInside on pd.Id equals pt.PatientId
                        
                          where pt.Id == id && pd.Id == pt.PatientId &&
                          pt.UserId == u.Id &&
                          pt.LetterDest == b.Id 
                          && ph.PatientId == pd.Id
                          orderby pt.UserDate descending
                          select new
                          {

                              pt.Id,
                              pt.LetterIndexNO,
                              pt.PatientId,
                              pd.PatientName,
                              pd.PassportNo,
                              pd.NationalNo,
                              pt.LetterDate,
                              pt.LetterDest,
                              pt.HospitalId,
                              pt.ReplyState,
                              //pt.Attach,
                              u.PhoneNumber,
                              pt.MedicalDiagnosis,
                              b.BranchName,
                              pt.UserDate,
                              ph.FileNo,


                          }
                              ).ToList();


            return Ok(output);
        }
    }
}
