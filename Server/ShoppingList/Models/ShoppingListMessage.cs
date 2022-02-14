using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public class ShoppingListMessage
    {
        public int ListID { get; set; }
        public int UserID { get; set; }
        public string Message { get; set; }
        public string CreatedOn { get; set; }
        public bool IsActive { get; set; }
    }
}
