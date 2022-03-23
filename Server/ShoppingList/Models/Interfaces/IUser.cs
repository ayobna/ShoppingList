using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models.Interfaces
{
    public interface IUser
    {
        public User CreateUser(User user);
        public List<User> GetAllUsers();
        public User GetUserById(int id);

    }
}
