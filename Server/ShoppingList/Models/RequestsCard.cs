using System;

namespace ShoppingList.Models
{
    public class RequestsCard
    {
        public int ListID { get; set; }
        public DateTime JoinedDate { get; set; }
        public string Title { get; set; }
        public string NotificationToken { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

    }
}
