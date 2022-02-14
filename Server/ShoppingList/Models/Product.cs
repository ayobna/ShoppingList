using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public int CreatorID { get; set; }
        public string Name { get; set; }
        public int Amount { get; set; }

        public string Img { get; set; }
        public string CreatedOn { get; set; }
        public bool IsActive { get; set; }
    }
}
