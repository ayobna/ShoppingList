using SendGrid;
using SendGrid.Helpers.Mail;
using ShoppingList.Models.Interfaces;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public class MailVerification : IMailVerification
    {
        string apiKey;
        public int GenerateVeraficationCode()
        {
            Random rnd = new Random();
            return rnd.Next(10000, 100000);
        }

        public MailVerification(string _apiKey)
        {
            apiKey = _apiKey;
        }
        public async Task SendEmail(string subject, string sendTo, string firstName, string content, int code)
        {

            string apiKey = this.apiKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("myshoppinglistappspt@gmail.com", "ShoppingList User");

            var to = new EmailAddress(sendTo, firstName);
            var plainTextContent = content;
            var htmlContent = $@"<body style='direction:rtl; font-family:tahoma'>
<p>שלום {firstName},</p>
<p>{content}</p>
<H3>{code}</H3>
<p style='color:red'>* קוד זה זמין ל-10 דקות בלבד</p>
<p>בברכה,</p>
<img alt='studentico logo' width='200' src='https://i.imgur.com/yoMwcpP.png'/>
</body>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

        }
    }
}
