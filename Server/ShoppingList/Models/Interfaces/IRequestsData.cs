using System.Collections.Generic;

namespace ShoppingList.Models.Interfaces
{
    public interface IRequestsData
    {
        public List<RequestsCard> GetRequestsByUser(int userID);
        public int ConfirmRequest(ShoppingListUser shoppingListUser);
        public int DeclineRequest(ShoppingListUser shoppingListUser);

    }
}
