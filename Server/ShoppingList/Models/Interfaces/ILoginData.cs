using System.Collections.Generic;

namespace ShoppingList.Models.Interfaces
{
    public interface ILoginData
    {
        public List<User> CheckLoginDetails(User user);
        public int UpdateUserNotificationToken(User user);
        public List<User> CheckIfUserExistsByEmail(User user);
        public int UpdatePassword(User user);
    }
}
