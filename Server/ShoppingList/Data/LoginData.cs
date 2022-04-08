using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace ShoppingList.Data
{
    public class LoginData : ILoginData
    {
        private readonly IDbConnection db;

        public LoginData(IDbConnection db_)
        {
            db = db_;
        }

        public List<User> CheckLoginDetails(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Check_Login_Details", db.Connect(), "proc");
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;


            DataTable tb = db.ReadAndClose(cmd);
            List<User> userLIst = db.ConvertDataTable<User>(tb);
            if (userLIst.Count == 1)            
                if (BCrypt.Net.BCrypt.Verify(user.Password, userLIst[0].Password))
                {
                    userLIst[0].Password = null;
                    return userLIst;
                }            
             return null;
        }

        public int UpdateUserNotificationToken(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Update_User_Notification_Token", db.Connect(), "proc");
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = user.UserID;
            cmd.Parameters.Add("@NotificationToken", SqlDbType.NVarChar).Value = user.NotificationToken;
            int res = db.ExecuteAndClose(cmd);

            if (res != 1)
            {
                throw new Exception($"Somthing went wrong while update notification token to userID {user.UserID} in sql");
            }
            return res;
        }

        public List<User> CheckIfUserExistsByEmail(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_CheckIfUserExistsByEmail", db.Connect(), "proc");
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;

            DataTable tb = db.ReadAndClose(cmd);
            List<User> userLIst = db.ConvertDataTable<User>(tb);
            return userLIst;
        }

        public int UpdatePassword(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Update_Password", db.Connect(), "proc");
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = passwordHash;
            int res = db.ExecuteAndClose(cmd);

            if (res != 1)
            {
                throw new Exception($"Somthing went wrong while update password to email {user.Email} in sql");
            }
            return res;
        }
    }
}
