using System;

namespace ShoppingList.Models
{
    public class ShoppingListCard
    {
        public int ListID { get; set; }
        public string Title { get; set; }
        public DateTime CreatedOn { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
