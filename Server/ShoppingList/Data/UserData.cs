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
      
        public User InsertUser( User user)
        {
            SqlCommand cmd = db.CreateCommand("[Proc_Insert_User]", db.Connect(), "proc");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = user.FirstName;
            cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = user.LastName;
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
          //  string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.User_Password);
            cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = user.Password;
            cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = user.PhoneNumber;
          
            cmd.Parameters.Add("@IsActive", SqlDbType.Bit).Value = user.IsActive;
            cmd.Parameters.Add("@Img", SqlDbType.NVarChar).Value = user.Img;
            cmd.Parameters.Add("@NotificationToken", SqlDbType.NVarChar).Value = user.NotificationToken;
            int res = db.ExecuteAndClose(cmd);
            if (res == 1)
            {
                user.UserID = Convert.ToInt32(cmd.Parameters["@UserID"].Value);
                return user;
            }
            return null;
        }
    }
}
