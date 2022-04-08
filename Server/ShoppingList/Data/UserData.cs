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
      
        public int CreateUser(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Create_User", db.Connect(), "proc");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = user.FirstName;
            cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = user.LastName;
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = passwordHash;
            cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = user.PhoneNumber;
            db.ExecuteAndClose(cmd);
            return Convert.ToInt32(cmd.Parameters["@UserID"].Value);
        }

        public User UpdateUser(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Update_User", db.Connect(), "proc");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value =user.UserID;
            cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = user.FirstName;
            cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = user.LastName;
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
            cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = user.PhoneNumber;
            cmd.Parameters.Add("@Img", SqlDbType.NVarChar).Value = user.Img;
            DataTable tb = db.ReadAndClose(cmd);
            List<User> users = db.ConvertDataTable<User>(tb);
            return users[0];
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

        // what do you think mates? to create profile contoller? ot keep profile things here?
        public int DeleteUser(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Delete_User", db.Connect(), "proc");
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = id;
            return db.ExecuteAndClose(cmd);
        }

        public List<ProfileSatistics> GetProfileSatistics(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_Profile_Satistics", db.Connect(), "proc");
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = id;
            DataTable tb = db.ReadAndClose(cmd);
            List<ProfileSatistics> userSatistics = db.ConvertDataTable<ProfileSatistics>(tb);
            return userSatistics;
        }

        public int UpdatePasswordInProfile(User user, string oldPassword)
        {
            User u= CheackUpdatePasswordInProfile(user.Email, oldPassword);
            if(u!=null)
            return UpdatePassword(user);
            return -1;
        }
        private int UpdatePassword(User user)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Update_Password", db.Connect(), "proc");
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = user.Email;
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = passwordHash;
            int res= db.ExecuteAndClose(cmd);
            return res;
        }

        private User CheackUpdatePasswordInProfile(string Email ,string Password)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Check_Login_Details", db.Connect(), "proc");
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = Email;
            DataTable tb = db.ReadAndClose(cmd);
            List<User> userLIst = db.ConvertDataTable<User>(tb);
            if (userLIst.Count == 1)
                if (BCrypt.Net.BCrypt.Verify(Password, userLIst[0].Password))
                {
                    userLIst[0].Password = null;
                    return userLIst[0];
                }
            return null;

        }
    }
}
