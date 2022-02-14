using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public class ShoppinglistUser
    {
        public int ListID { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public string JoinedDate { get; set; }
        public bool IsApproved { get; set; }
    }
}
