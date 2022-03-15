using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models
{
    public interface IShoppingList
    {
        public int CreateShoppinglist(Shoppinglist shoppinglist);
        public int UpdateShoppinglist(ShoppingListCard shoppinglist);
        public List<ShoppingListCard> GetAllListsCreatedByUser(int id);
        public List<ShoppingListCard> GetAllListsUserIsAParticipant(int id);
        public void CopyShoppingList(int originalListID, int copiedListID, int creatorID);
        public void DeleteShoppinglist(int id);
        public void ExitShoppingList(int ListID, int UserID);
        public Shoppinglist GetListCreatorByListID(int id);
    }
}
