using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public interface IShoppingList
    {
        public List<Shoppinglist> GetShoppingList();

        public int CreateShoppinglist(Shoppinglist shoppinglist);
    }
}
