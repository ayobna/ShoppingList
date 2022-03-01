using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public class Shoppinglist
    {

        public int ListID { get; set; }
        public int CreatorID { get; set; }
        public string Title { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsActive { get; set; }


    }
}
