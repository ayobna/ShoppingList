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
    public class ListUsersData : IListUsers
    {

        private readonly IDbConnection db;

        public ListUsersData(IDbConnection db_)
        {
            db = db_;
        }
       
        public List<User> GetParticipantsInTheShoppingListByListId(int listId)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_List_Users", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = listId;
            DataTable tb = db.ReadAndClose(cmd);
            List<User> shoppingListUser = db.ConvertDataTable<User>(tb);
            return shoppingListUser;
        }

        public int AddUserForTheList(ShoppingListUser shoppingListUser)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Add_User_To_List", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = shoppingListUser.ListID;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = shoppingListUser.UserID;
            cmd.Parameters.Add("@JoinedDate", SqlDbType.DateTime).Value = shoppingListUser.JoinedDate;
            int res = db.ExecuteAndClose(cmd);

            if (res < 1)
            {
                throw new Exception("Somthing went wrong while adding user to a list in sql");
            }
            return Convert.ToInt32(cmd.Parameters["@UserID"].Value);
        }

        public List<User> GetUserByEmailToAddToListUsers(string userEmail)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_Users_For_Search", db.Connect(), "proc");
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = userEmail;
            DataTable tb = db.ReadAndClose(cmd);
            List<User> usersList = db.ConvertDataTable<User>(tb);
            return usersList;
        }



    }
}
