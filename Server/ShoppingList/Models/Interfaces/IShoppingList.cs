using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public interface IShoppingList
    {
      

        public int CreateShoppinglist(Shoppinglist shoppinglist);
        public List<Shoppinglist> GetAllListsCreatedByUser();
        public List<Shoppinglist> GetAllListsUserIsAParticipant();
    }
}
