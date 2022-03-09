using System;

namespace ShoppingList.Models
{
    public class ChatMessageCard
    {
        public int ListID { get; set; }
        public int UserID { get; set; }
        public string Message { get; set; }
        public DateTime CreatedOn { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
