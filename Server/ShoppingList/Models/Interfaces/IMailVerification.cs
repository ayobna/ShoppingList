namespace ShoppingList.Models.Interfaces
{
    public interface IMailVerification
    {
        public int GenerateVeraficationCode();
        public void SendEmail(string subject, string to, string firstName, string content, int code);
    }
}
