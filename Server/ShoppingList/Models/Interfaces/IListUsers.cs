using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models.Interfaces
{
    public interface IListUsers
    {
        public List<ShoppingListUser> GetTheApprovedListUsers(int listId);
        public int AddUserForTheList(ShoppingListUser shoppingListUser);
        public int ApproveOrDeletUserFromList(ShoppingListUser shoppingListUser);
    }
}
