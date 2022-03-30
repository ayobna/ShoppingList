using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SendMailController : ControllerBase
    {

        private readonly IUser userData;
        //private readonly ILoggerService logger;
        private readonly ILogger<UserController> logger;
      //  private readonly IWebHostEnvironment env;
        public SendMailController(IUser user_, ILogger<UserController> logger_)
        {
            userData = user_;
            logger = logger_;
          
        }


        [HttpPost]
        [Route("api/Login/sendmail")]
        public async Task Execute()
        {
            try
            {
                string apiKey = "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";
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress("ayobnas@gmail.com", "Example User");
                var subject = "Sending with SendGrid is Fun";
                var to = new EmailAddress("ayobnas12@gmail.com", "Example User");
                var plainTextContent = "and easy to do anywhere, even with C#";
                var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg);

            }
            catch (Exception ex)
            {
                logger.LogError($"Login to email Failed!\n=> {ex.Message}");
              
            }
        }

      
    }
}
