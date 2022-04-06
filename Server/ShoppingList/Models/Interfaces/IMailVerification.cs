using System.Threading.Tasks;

namespace ShoppingList.Models.Interfaces
{
    public interface IMailVerification
    {
        public int GenerateVeraficationCode();
        public  Task SendEmail(string subject, string sendTo, string firstName, string content, int code);
    }
}
