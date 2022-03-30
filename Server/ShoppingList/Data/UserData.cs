using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Data
{
    public class UserData :IUser
    {

        private readonly IDbConnection db;

        public UserData(IDbConnection db_)
        {
            db = db_;
        }
      
        public User CreateUser(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Insert_User", db.Connect(), "proc");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = user.FirstName;
            cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = user.LastName;
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
            cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = user.@Password;
            cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = user.PhoneNumber;
            int res = db.ExecuteAndClose(cmd);
            if (res == 1)
            {
                user.UserID = Convert.ToInt32(cmd.Parameters["@UserID"].Value);
                return user;
            }
            return null;
        }

        public int UpdateUser(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Update_User", db.Connect(), "proc");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value =user.UserID;
            cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = user.FirstName;
            cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = user.LastName;
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
            cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = user.PhoneNumber;
            cmd.Parameters.Add("@Img", SqlDbType.NVarChar).Value = user.PhoneNumber;
            int res = db.ExecuteAndClose(cmd);
            if (res != 1)
            {
                throw new Exception("Somthing went wrong while decline request in sql");
            }
            return res;
        }
        public List<User> GetAllUsers()
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_Users", db.Connect(), "proc");
            DataTable tb = db.ReadAndClose(cmd);
            List<User> users = db.ConvertDataTable<User>(tb);
            return users;
        }
        public User GetUserById(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_User_By_Id", db.Connect(), "proc");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = id;

            DataTable tb = db.ReadAndClose(cmd);
            List<User> users = db.ConvertDataTable<User>(tb);
            if (users == null)
            {
                return null;

            }
            return users[0];
        }

    
  
    }
}
