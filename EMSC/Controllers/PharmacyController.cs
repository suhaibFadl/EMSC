using DinkToPdf.Contracts;
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
    [Route("api/[controller]")]
    [ApiController]
    public class PharmacyController : ControllerBase
    {
            
        private readonly EMSCDBContext _db;

            public PharmacyController(EMSCDBContext db)
            {
                _db = db;

            }
            
       
        //=================================Request Medication===============================
        [HttpPost("[action]")]
        public async Task<IActionResult> RequestMedication([FromBody] PatientModel fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int currentYear = DateTime.Now.Year;

            // Extracting the last two digits of the current year
            int lastTwoDigits = currentYear % 100;

            int nextValue = fromdata.CountRows + 1;

            int temp = 1;
            
            double res;


            for(int i = 10; i <= 10000000; i = i*10)
            {
                res = nextValue / i;
                if (res <= 0)
                {
                    break;
                }
                temp++;
            }

            string formatIndex = "";

            for(int x=0; x < 8-temp ;x++)
            {
                formatIndex += "0";
            }


            // Generate the formatted field value
            string fieldValue = lastTwoDigits + formatIndex + nextValue.ToString();

            var NewRequest = new DispensingMedication
            {
                MedId = fromdata.MedId,
                PatientId = fromdata.PatientId,
                RequestedQuantity = fromdata.RequestedQuantity,
                PersonAttach = fromdata.PersonAttach,
                OrderState = 1, // تتغير القيمة إلى 1 عند طلب الدواء للمستفيد
                DispensedQuantity = 0,
                RequestDate = DateTime.UtcNow,
                UserId = fromdata.UserId,
                UserDate = DateTime.UtcNow,
                FirstOpened = 0,
                LetterIndex = fieldValue,
                PHId = fromdata.PHId

            };

            await _db.DispensingMedication.AddAsync(NewRequest);

            await _db.SaveChangesAsync();

            return Ok(NewRequest);
           
        }

        //=================================Update Request Medication========================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateRequestMedication([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            findMed.RequestedQuantity = fromdata.RequestedQuantity;
            findMed.PersonAttach = fromdata.PersonAttach;
            findMed.MedId = fromdata.MedId;
            findMed.PHId = fromdata.PHId;
           
            bool MedExists = _db.DispensingMedication.Any(x => (x.PatientId == findMed.PatientId || x.MedId == findMed.MedId) && x.OrderState ==0 && x.Id != id);
            if (!MedExists)
            {
                _db.Entry(findMed).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Request with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("Can not Update."));
            }

        }

        //=================================DELETE Request Medication========================
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteRequestMedication([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient
            var findMed = await _db.DispensingMedication.FindAsync(id);

            if (findMed == null)
            {
                return NotFound();
            }



            bool findDispensings = _db.DispensingMedication.Any(SC => SC.Id == id && SC.OrderState != 1);

            if (findDispensings)
                return BadRequest(new JsonResult("لا يمكن حذف الطلب لارتباطها بيانات أخرى"));



            _db.DispensingMedication.Remove(findMed);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Request with id " + id + " is Deleted."));

        }

        //=================================Response to Request  رد الصيدلية بالعرض المبدئي / أو صرف الدواء للمندوب / أو تم توفير الدواء===============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ResponseRequestMedication([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //fromdata.PrePrice =====> السعر المبدئي
            //fromdata.PreDays =======> المدة للتوفير
            //fromdata.PreDate =======> تاريخ العرض
            //fromdata.ProvideDate =======> تاريخ العرض
               


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }
            //orderState = 2     تعني أن تم إحالة طلب الدواء إلى قائمة الانتظار
            //orderState = 3     تعني أن تم اختيار تسليم الدواء للمندوب
            //orderState = 4     تعني أن تم اختيار صرف الدواء للمستفيد
            //orderState = 5     رد بالعرض المبدئي
            //orderState = 8     رد توفير الدواء

            switch(fromdata.OrderState)
            {
                case 3:
                    findMed.DispensedQuantity = fromdata.DispensedQuantity;
                    findMed.DispensDate = fromdata.DispensDate;
                    findMed.DispensedAttach = fromdata.DispensedAttach;
                    break;
                case 4:
                    findMed.MangDispensDate = fromdata.MangDispensDate;
                    findMed.MangDispensedAttach = fromdata.MangDispensedAttach;
                    break;

                case 5:
                    findMed.PrePrice = fromdata.PrePrice;
                    findMed.PreDate = DateTime.UtcNow;
                    findMed.PreDays = fromdata.PreDays;
                    break;

                case 8:
                    findMed.ProvideDate = DateTime.UtcNow;
                    break;

            }
        

            findMed.OrderState = fromdata.OrderState;
            findMed.Notes = fromdata.Notes;

            _db.Entry(findMed).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Request with id " + id + " is updated."));

        }

        ////=================================Response to Request  رد الصيدلية على طلب الدواء===============================
        //[HttpPut("[action]/{id}")]
        //public async Task<IActionResult> ResponseRequestMedication([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }


        //    var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

        //    if (findMed == null)
        //    {
        //        return NotFound();
        //    }
        //     //orderState = 2     تعني أن تم إحالة طلب الدواء إلى قائمة الانتظار
        //     //orderState = 3     تعني أن تم اختيار صرف الدواء للمستفيد

        //    if (fromdata.OrderState == 3) //التحقق ماإذا كان تم اختيار صرف الدواء 
        //    {
        //        findMed.DispensedQuantity = fromdata.DispensedQuantity;
        //        findMed.DispensDate = fromdata.DispensDate;
        //       // findMed.Notes = fromdata.Notes;
        //        findMed.DispensedAttach = fromdata.DispensedAttach;
        //    }

        //    findMed.OrderState = fromdata.OrderState;
        //    findMed.Notes = fromdata.Notes;

        //    _db.Entry(findMed).State = EntityState.Modified;

        //    await _db.SaveChangesAsync();

        //    return Ok(new JsonResult("The Request with id " + id + " is updated."));

        //}

        //=================================Response to Request  تعديل رد الصيدلية على طلب الدواء الصرف===============================

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateMedicationDispensedByPharmacy([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            findMed.DispensedAttach = fromdata.DispensedAttach;
            findMed.DispensDate = fromdata.DispensDate;
            findMed.DispensedQuantity = fromdata.DispensedQuantity;

            //bool MedExists = _db.DispensingMedication.Any(x => (x.PatientId == findMed.PatientId || x.MedId == findMed.MedId) && x.OrderState == 0 && x.Id != id);

            //if (!MedExists)
            //{
            _db.Entry(findMed).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Request with id " + id + " is updated."));

            //}
            //else
            //{

            //    return BadRequest(new JsonResult("Can not Update."));
            //}

        }

        //=================================Response to Request  تعديل رد الصيدلية العرض المبدئي===============================

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateMedicationPreOrderByPharmacy([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            findMed.PrePrice = fromdata.PrePrice;
            findMed.PreDays = fromdata.PreDays;
            findMed.PreDate = fromdata.PreDate;

            //bool MedExists = _db.DispensingMedication.Any(x => (x.PatientId == findMed.PatientId || x.MedId == findMed.MedId) && x.OrderState == 0 && x.Id != id);

            //if (!MedExists)
            //{
            _db.Entry(findMed).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Request with id " + id + " is updated."));

            //}
            //else
            //{

            //    return BadRequest(new JsonResult("Can not Update."));
            //}

        }

        //=================================Response to Request  تعديل رد الصيدلية حذف حالة التوفير===============================

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateMedicationProvidingByPharmacy([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            findMed.OrderState = 7;
           
            

            //bool MedExists = _db.DispensingMedication.Any(x => (x.PatientId == findMed.PatientId || x.MedId == findMed.MedId) && x.OrderState == 0 && x.Id != id);

            //if (!MedExists)
            //{
            _db.Entry(findMed).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Request with id " + id + " is updated."));

            //}
            //else
            //{

            //    return BadRequest(new JsonResult("Can not Update."));
            //}

        }
        //================================Get All Patients Files عرض ملفات المرضى الذين تم صرف دواء لهم ==============================
        [HttpGet("[action]")]
        public async Task<IActionResult> GetALlPatsFiles()
        {
            var output = await (
                         from pd in _db.PatientsData
                         from dm in _db.DispensingMedication
                         from br in _db.Branches
                         where pd.Id == dm.PatientId 
                         && br.Id == pd.BranchId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             dm.UserDate,
                             dm.MedId,
                             dm.PatientId,
                             br.BranchName
                         }
                             ).ToListAsync();

                var data = output.GroupBy(x => x.PatientId).Select(y => y.FirstOrDefault()).ToList();


            return Ok(data);

        }

        //================================Get All Patients Files عرض ملفات المرضى الذين تم صرف دواء لهم حسب الصيدلية ==============================
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetALlPatsFilesByPharmacy([FromRoute] int id)
        {
            var output = await (
                         from pd in _db.PatientsData
                         from dm in _db.DispensingMedication
                         from br in _db.Branches
                         where dm.PHId == id && pd.Id == dm.PatientId
                         && br.Id == pd.BranchId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             dm.UserDate,
                             dm.MedId,
                             dm.PatientId,
                             br.BranchName
                         }
                             ).ToListAsync();

            var data = output.GroupBy(x => x.PatientId).Select(y => y.FirstOrDefault()).ToList();


            return Ok(data);

        }

       
        //================================Get  Responsed Requests عرض طلبات الأدوية التي تم صرفها من قبل الصيدلية وفي انتظار صرفها من المركز===============================
        [HttpGet("[action]")]
        public IActionResult GetResponsedRequestForDispensing()
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where dm.OrderState == 3 && pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             dm.DispensedAttach,
                             dm.Notes,
                             ph.PharmacyName,
                             dm.PersonAttach

                         }
                             ).ToList();

            return Ok(output);

        }

        //===============================Get  Waiting Requests عرض طلبات الأدوية التي تم إحالتها إلى قائمة الانتظار من قبل الصيدلية================================
        [HttpGet("[action]/{id}")]
        public IActionResult GetWaitingRequests([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where dm.PHId == id 
                         && dm.OrderState == 2 && pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             dm.Notes,
                             ph.PharmacyName,
                             dm.PersonAttach

                         }
                             ).ToList();

            return Ok(output);
        }

        //==============================Get  All Medicines Dispensing for Patient عرض الأدوية التي تم صرفها للمريض================
        [HttpGet("[action]/{id}")]
        public IActionResult GetMedicinesPatient([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from u in _db.Users
                         from ph in _db.Pharmacies
                         where dm.PatientId == id && pd.Id == dm.PatientId && md.Id == dm.MedId
                         && u.Id == dm.UserId && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {
                             dm.Id,
                             dm.PatientId,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             dm.UserDate,
                             u.PhoneNumber,
                             dm.Notes,
                             ph.PharmacyName,
                             dm.PersonAttach
                         }
                             ).ToList();

            return Ok(output);
        }

        //===============================صرف الدواء للمستفيد من قبل موظف المركز================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> DispenseMedicationByManagement([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

                findMed.MangDispensDate = fromdata.MangDispensDate;
                findMed.MangDispensedAttach = fromdata.MangDispensedAttach;
                findMed.OrderState = 4; //تعني أن تم صرف الدواء للمستفيد من قبل إدارة المركز

            _db.Entry(findMed).State = EntityState.Modified;

            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Request with id " + id + " is updated."));

        }
        

        //=================================Update Request Medication========================
     
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateMedicationDispensedByManag([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            findMed.MangDispensedAttach = fromdata.MangDispensedAttach;
            findMed.MangDispensDate = fromdata.MangDispensDate;

            //bool MedExists = _db.DispensingMedication.Any(x => (x.PatientId == findMed.PatientId || x.MedId == findMed.MedId) && x.OrderState == 0 && x.Id != id);
            //if (!MedExists)
            //{
                _db.Entry(findMed).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Request with id " + id + " is updated."));

            //}
            //else
            //{

            //    return BadRequest(new JsonResult("Can not Update."));
            //}

        }

        //============================إضافة مريض جديد من قبل موظف الصيدلية=======================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddNewPatient([FromBody] PatientModel formdata)
        {
            // var newPatient = new PatientsData();

            List<string> ErrorList = new List<string>();

                var newPatient = new PatientsData
                {
                    PatientName = formdata.PatientName,
                    PassportNo = formdata.PassportNo,
                    NationalNo = formdata.NationalNo,
                    UserId = formdata.UserId,
                    UserDate = DateTime.UtcNow,
                    BranchId = formdata.BranchId,
                    PatType = formdata.PatType,
                    DepenId = formdata.DepenId,
                    EventId = formdata.EventId,
                    PersonType = formdata.PersonType,
                };
                bool clientPassportNoExists = _db.PatientsData.Any(x => x.PassportNo == newPatient.PassportNo);
                bool clientNationalNoExists = _db.PatientsData.Any(x => x.NationalNo == newPatient.NationalNo && newPatient.NationalNo != "000000000000");


                if (!clientPassportNoExists && !clientNationalNoExists)
                {
                    await _db.PatientsData.AddAsync(newPatient);
                    await _db.SaveChangesAsync();

                    return Ok(new JsonResult("The Patient was Added Successfully"));
                }
                else
                {
                    return BadRequest(new JsonResult("The Passport Number or National Number is already exist"));

                }


        }

        //=============================عرض تفاصيل طلب الدواء================================
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetRequestMedicineDetails([FromRoute] int id)
        {
            var output = await (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from br in _db.Branches
                         from dm in _db.DispensingMedication
                         from ph in _db.Pharmacies
                         where dm.Id == id 
                         && pd.Id == dm.PatientId && md.Id == dm.MedId 
                         && br.Id == pd.BranchId
                         && ph.Id == dm.PHId
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             dm.UserDate,
                             dm.MedId,
                             dm.PatientId,
                             dm.FirstOpened,
                             br.BranchName,
                             dm.LetterIndex,
                             ph.PharmacyName,
                             dm.PersonAttach
                         }
                             ).ToListAsync();

            return Ok(output);

        }

        //=============================فتح رسالة طلب الدواء لأول مرة========================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> FirstOpenedLetter([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            if (findMed.FirstOpened == 0)
            {
                findMed.FirstOpened = 1;

            }

            _db.Entry(findMed).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Request with id " + id + " is updated."));


        }


        //==============================================================================
        //==============================================================================
        //==============================================================================
        //=====================================الأدوية===============================

        //==================================Get Medications===============================
        [HttpGet("[action]")]
        public IActionResult GetMedications()
        {
            return Ok(_db.Medications.ToList());

        }


        //================================== ADD Medication ==============================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddMedication([FromBody] Medications formdata)
        {
            List<string> ErrorList = new List<string>();

            var NewMed = new Medications
            {
                MedArName = formdata.MedArName,
                MedEnName = formdata.MedEnName,
                UserId = formdata.UserId,
                UserDate = formdata.UserDate

            };
            bool MedExist = _db.Medications.Any(x => x.MedEnName == NewMed.MedEnName || x.MedArName == NewMed.MedArName);

            if (!MedExist)
            {
                await _db.Medications.AddAsync(NewMed);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Medication was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Medication is already exist"));
            }

        }


        //=================================UPDATE Medication==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateMedication([FromRoute] int id, [FromBody] Medications fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findMed = _db.Medications.FirstOrDefault(c => c.Id == id);

            if (findMed == null)
            {
                return NotFound();
            }

            findMed.MedArName = fromdata.MedArName;
            findMed.MedEnName = fromdata.MedEnName;

            bool MedExists = _db.Medications.Any(x => (x.MedEnName == findMed.MedEnName || x.MedArName == findMed.MedArName) && x.Id != id);
            if (!MedExists)
            {
                _db.Entry(findMed).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Medication with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The medication is Exist."));
            }

        }


        //=================================DELETE Medication==============================
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteMedication([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // find the Patient
            var findMed = await _db.Medications.FindAsync(id);

            if (findMed == null)
            {
                return NotFound();
            }



            bool findDispensings = _db.DispensingMedication.Any(SC => SC.MedId == id);

            if (findDispensings)
                return BadRequest(new JsonResult("لا يمكن حذف الدواء لارتباطها ببيانات أخرى"));



            _db.Medications.Remove(findMed);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Medication with id " + id + " is Deleted."));



        }

        //==============================================================================
        //==============================================================================
        //==============================================================================
        //=====================================الصيدليات===============================

        //==================================Get Pharmacies===============================
        [HttpGet("[action]")]
        public IActionResult GetPharmacies()
        {
            return Ok(_db.Pharmacies.ToList());

        }


        //================================== ADD Pharmacy ==============================
        [HttpPost("[action]")]
        public async Task<IActionResult> AddPharmacy([FromBody] Pharmacies formdata)
        {
            List<string> ErrorList = new List<string>();

            var newData = new Pharmacies
            {
                PharmacyName = formdata.PharmacyName,

            };
            bool PharExist = _db.Pharmacies.Any(x => x.PharmacyName == newData.PharmacyName);

            if (!PharExist)
            {
                await _db.Pharmacies.AddAsync(newData);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Pharmacy was Added Successfully"));
            }

            else
            {
                return BadRequest(new JsonResult("The Pharmacy is already exist"));
            }

        }


        //=================================UPDATE Pharmacy==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdatePharmacy([FromRoute] int id, [FromBody] Pharmacies fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findRow = _db.Pharmacies.FirstOrDefault(c => c.Id == id);

            if (findRow == null)
            {
                return NotFound();
            }


            bool PharExists = _db.Pharmacies.Any(x => x.PharmacyName == findRow.PharmacyName && x.Id != id);
           
            if (!PharExists)
            {
                findRow.PharmacyName = fromdata.PharmacyName;

                _db.Entry(findRow).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The Pharmacy with id " + id + " is updated."));

            }
            else
            {

                return BadRequest(new JsonResult("The Pharmacy is Exist."));
            }

        }


        //=================================DELETE Pharmacy==============================
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeletePharmacy([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findRow = await _db.Pharmacies.FindAsync(id);

            if (findRow == null)
            {
                return NotFound();
            }



            bool findDispensings = _db.DispensingMedication.Any(SC => SC.PHId == id);

            if (findDispensings)
                return BadRequest(new JsonResult("لا يمكن حذف الصيدلية لارتباطها ببيانات أخرى"));



            _db.Pharmacies.Remove(findRow);
            await _db.SaveChangesAsync();

            return Ok(new JsonResult("The Pharmacy with id " + id + " is Deleted."));



        }


        //===============================================================
        //===============================================================
        //===============================================================
        //===============================================================

        //=================================Get All Requests عرض كافة طلبات الدواء لموظف المركز===================================
        [HttpGet("[action]")]
        public async Task<IActionResult> GetALlRequests()
        {
            var output = await (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.MedId,
                             dm.PatientId,
                             ph.PharmacyName,
                             dm.PersonAttach,
                             dm.PrePrice,
                             dm.PreDays,
                             dm.PreDate,
                             dm.PHId
                         }
                             ).ToListAsync();

            //    var data = output.GroupBy(x => x.PatientId).Select(y => y.FirstOrDefault()).ToList();


            return Ok(output);

        }
      
        //================================    عرض طلبات الأدوية المبدئية للصيدلية===========================
        //=================================   عرض كافة العروض المبدئية للصيدلية ===================================
        //=================================   عرض الطلبات النهائية للصيدلية للصيدلية =================================== 
        //=================================   عرض الذي تم توفيره بالصيدلية =================================== 
        //=================================   عرض الذي تم صرفه من الصيدلية =================================== 
        [HttpGet("[action]/{id}/{orderstate}")]
        public IActionResult GetNotResponsedRequests([FromRoute] int id,int orderstate)
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where dm.PHId == id &&
                         dm.OrderState == orderstate && pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {
                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             ph.PharmacyName,
                             dm.PersonAttach,
                             dm.PrePrice,
                             dm.PreDays,
                             dm.PreDate

                         }
                             ).ToList();

            return Ok(output);

        }

        //=================================Get All Requests عرض كافة العروض المبدئية للمركز===================================
        //=================================Get All Requests عرض الذي تم توفيره من الصيدلية لموظف للمركز===================================
        //=================================Get All Requests عرض الذي تم صرفه من الصيدلية لموظف للمركز===================================
        [HttpGet("[action]/{orderstate}")]
        public IActionResult GetALLPreOffersRequestes([FromRoute] int orderstate)
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where
                         dm.OrderState == orderstate && pd.Id == dm.PatientId && md.Id == dm.MedId 
                         && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {
                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             ph.PharmacyName,
                             dm.PersonAttach,
                             dm.PrePrice,
                             dm.PreDays,
                             dm.PreDate

                         }
                             ).ToList();

            return Ok(output);

        }

        [HttpGet("[action]")]
        public IActionResult GetALLMedcationsPreparedFromPharmacy()
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where
                         (dm.OrderState == 3 || dm.OrderState == 8) && pd.Id == dm.PatientId && md.Id == dm.MedId
                         && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {
                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             ph.PharmacyName,
                             dm.PersonAttach,
                             dm.PrePrice,
                             dm.PreDays,
                             dm.PreDate

                         }
                             ).ToList();

            return Ok(output);

        }

        //=================================عرض العروض المبدئية التي تم الموافقة عليها لموظف الصيدلية 5/7============================
        [HttpGet("[action]/{id}")]
        public IActionResult GetALLAcceptedOffersRequestes([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where dm.PHId == id &&
                         (dm.OrderState == 5 || dm.OrderState == 7) && pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {
                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             ph.PharmacyName,
                             dm.PersonAttach,
                             dm.PrePrice,
                             dm.PreDays,
                             dm.PreDate

                         }
                             ).ToList();

            return Ok(output);

        }



        //================================Get  Responsed Requests عرض طلبات الأدوية التي تم صرفها من قبل الصيدلية أو تم صرف الدواء من قبل المركز===============================
        [HttpGet("[action]/{id}")]
        public IActionResult GetResponsedRequests([FromRoute] int id)
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where dm.PHId == id
                         && (dm.OrderState == 3 || dm.OrderState == 4) && pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensDate,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             dm.DispensedAttach,
                             dm.Notes,
                             ph.PharmacyName,
                             dm.PersonAttach

                         }
                             ).ToList();

            return Ok(output);

        }


        //============================عرض الأدوية المصروفة للمستفيد من قبل المركز==============================
        [HttpGet("[action]")]
        public IActionResult GetMedicationsProvidedToPatients()
        {
            var output = (
                         from pd in _db.PatientsData
                         from md in _db.Medications
                         from dm in _db.DispensingMedication
                         from us in _db.Users
                         from ph in _db.Pharmacies
                         where dm.OrderState == 4 && pd.Id == dm.PatientId && md.Id == dm.MedId && us.Id == dm.UserId
                         && ph.Id == dm.PHId
                         orderby dm.RequestDate descending
                         select new
                         {

                             dm.Id,
                             pd.PatientName,
                             pd.PassportNo,
                             pd.NationalNo,
                             md.MedEnName,
                             md.MedArName,
                             dm.RequestDate,
                             dm.RequestedQuantity,
                             dm.OrderState,
                             dm.DispensedQuantity,
                             us.PhoneNumber,
                             dm.UserDate,
                             dm.PatientId,
                             dm.Notes,
                             dm.MangDispensedAttach,
                             dm.MangDispensDate,
                             dm.DispensedAttach,
                             dm.DispensDate,
                             ph.PharmacyName,
                             dm.PersonAttach

                         }
                             ).ToList();

            return Ok(output);
        }

        //================================= رد المركز على عرض الصيدلية بالقبول أو الرفض==============================
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ReplyManagementOnPharmacy([FromRoute] int id, [FromBody] DispensingMedication fromdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var findRow = _db.DispensingMedication.FirstOrDefault(c => c.Id == id);

            if (findRow == null)
            {

                return NotFound();
            }


                findRow.OrderState = fromdata.OrderState;

                _db.Entry(findRow).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The row with id " + id + " is updated."));

        }

    }
}
