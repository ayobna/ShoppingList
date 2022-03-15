using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public class ShoppingListUser
    {
        public int ListID { get; set; }
        public int UserID { get; set; }
        public DateTime JoinedDate { get; set; }
        public bool IsApproved { get; set; }
    }
}
