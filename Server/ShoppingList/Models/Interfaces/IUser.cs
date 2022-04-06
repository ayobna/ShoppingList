using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Models.Interfaces
{
    public interface IUser
    {
        public int CreateUser(User user);
        public List<User> GetAllUsers();
        public User GetUserById(int id);
        public User UpdateUser(User user);
        public int DeleteUser(int id);
        public List<ProfileSatistics> GetProfileSatistics(int id);
        public int UpdatePasswordInProfile(User user, string oldPassword);
    }
}
