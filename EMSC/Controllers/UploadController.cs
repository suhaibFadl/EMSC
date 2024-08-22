using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using DinkToPdf;
using System.Diagnostics;
using static System.Net.WebRequestMethods;

namespace EMSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {

        IWebHostEnvironment webHostEnvironment;


        public UploadController(IWebHostEnvironment environment)
        {
            webHostEnvironment = environment;
        }

        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("WWWroot", "file");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"').ToString();
                    System.Diagnostics.Debug.WriteLine(fileName);
                    var fullPath = Path.Combine(pathToSave, fileName);
                    System.Diagnostics.Debug.WriteLine(fullPath);
                    var dbPath = Path.Combine(folderName, fileName);
                    System.Diagnostics.Debug.WriteLine(dbPath);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {

                        file.CopyTo(stream);

                    }
                    return Ok(new { fileName, file, pathToSave, fullPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        [AllowAnonymous]
        [HttpDelete("[action]/{id}")]
        public IActionResult DeleteFile([FromRoute] string id)
        {
            try
            {
                var file = Path.Combine("WWWroot", "file", id);

                FileInfo fi = new FileInfo(file);
                if (fi != null)
                {
                    System.IO.File.Delete(file);
                    fi.Delete();
                    return Ok(new { file });

                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }


        [HttpGet("[action]/{id}")]
        public IActionResult SavePDF([FromRoute] string id)
        {

            var filePath = Path.Combine("wwwroot", "RequestsMedicinesCreated", id + Guid.NewGuid().ToString() + ".pdf" );

            FileInfo fileInfo = new FileInfo(filePath);

            using (FileStream fileStream = fileInfo.Create())
            {
                // Perform any necessary operations with the created file stream
            }

            return Ok(new { file = filePath });
        }


        //public IActionResult SavePdf()
        //{
        //    try
        //    {
        //        var file = Request.Form.Files[0];
        //        var folderName = Path.Combine("WWWroot", "RequestsMedicinesCreated");
        //        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        //        if (file.Length > 0)
        //        {
        //            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"').ToString();
        //            System.Diagnostics.Debug.WriteLine(fileName);
        //            var fullPath = Path.Combine(pathToSave, fileName);
        //            System.Diagnostics.Debug.WriteLine(fullPath);
        //            var dbPath = Path.Combine(folderName, fileName);
        //            System.Diagnostics.Debug.WriteLine(dbPath);
        //            using (var stream = new FileStream(fullPath, FileMode.Create))
        //            {

        //                file.CopyTo(stream);

        //            }
        //            return Ok(new { fileName, file, pathToSave, fullPath });
        //        }
        //        else
        //        {
        //            return BadRequest();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex}");
        //    }
        //}



        [HttpGet("[action]/{id}")]
        public IActionResult SaveFile([FromRoute] string id)
        {

            string uniqueFileName = Guid.NewGuid().ToString() + id + ".pdf";


            string filePath = Path.Combine("WWWroot", "RequestsMedicinesCreated", uniqueFileName);


            FileInfo fileInfo = new FileInfo(filePath);

            using (FileStream fileStream = fileInfo.Create())
            {
                // Perform any necessary operations with the created file stream
            }


            //using (var fileStream = new FileStream(filePath, FileMode.Create))
            //{
            //}

            return Ok(filePath);
        }



        [HttpPost("save-pdf")]
        public IActionResult SavePdf()
        {
            var file = Request.Form.Files[0]; // Get the uploaded file

            if (file != null && file.Length > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine(webHostEnvironment.WebRootPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return Ok(); // Return an HTTP 200 OK response
            }

            return BadRequest(); // Return an HTTP 400 Bad Request response
        }
    }
}




