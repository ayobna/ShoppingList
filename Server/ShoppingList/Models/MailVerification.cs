using ShoppingList.Models.Interfaces;
using System;
using System.Net;
using System.Net.Mail;

namespace ShoppingList.Models
{
    public class MailVerification : IMailVerification
    {
        public int GenerateVeraficationCode()
        {
            Random rnd = new Random();
            return rnd.Next(10000, 100000);
        }

        public void SendEmail(string subject,string to, string firstName, string content,int code)
        {
            // הגדרת אובייקט ההודעה 
            MailMessage message = new MailMessage();
            SmtpClient smtp = new SmtpClient();
            message.From = new MailAddress("MyShoppingList <myshoppinglistappspt@gmail.com> "); // ממי נשלח המייל
            message.To.Add(new MailAddress(to)); // הכתובת אליה נשלח המייל
            message.Subject = subject; // נושא המייל
            message.IsBodyHtml = true; // הגדרתו כמייל מסוג HTML
            // גוף ההודעה
            message.Body = $@"<body style='direction:rtl; font-family:tahoma'>
<p>שלום {firstName},</p>
<p>{content}</p>
<H3>{code}</H3>
<p style='color:red'>* קוד זה זמין ל-10 דקות בלבד</p>
<p>בברכה,</p>
<img alt='studentico logo' width='200' src='https://i.imgur.com/yoMwcpP.png'/>
</body>";
            smtp.Port = 587; // הגדרת הפורט
            smtp.Host = "smtp.gmail.com"; // שרת של גוגל
            smtp.EnableSsl = true; // הגדרת אבטחה
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("studenticoinfo@gmail.com", "Tal1234!"); // הגדרת הפרטים של המייל ממנו נשלחת ההודעה
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network; // שיטת ההעברה - ברשת
            smtp.Send(message); // שליחת המייל
        }
    }
}
