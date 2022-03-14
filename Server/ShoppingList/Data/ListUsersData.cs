﻿using ShoppingList.Models;
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
       
        public List<ShoppingListUser> GetTheApprovedListUsers(int listId)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_List_Users", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = listId;
            DataTable tb = db.ReadAndClose(cmd);
            List<ShoppingListUser> shoppingListUser = db.ConvertDataTable<ShoppingListUser>(tb);
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

        public int ApproveOrDeletUserFromList(ShoppingListUser shoppingListUser)
        {
            SqlCommand cmd = db.CreateCommand("Proc_User_Confirmation_Ofֹ_Joining ", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = shoppingListUser.ListID;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = shoppingListUser.UserID;
            cmd.Parameters.Add("@JoinedDate", SqlDbType.DateTime).Value = shoppingListUser.JoinedDate;
            cmd.Parameters.Add("@IsApproved", SqlDbType.Bit).Value = shoppingListUser.IsApproved;
            int res = db.ExecuteAndClose(cmd);

            if (res < 1)
            {
                throw new Exception("Somthing went wrong while approvin or removing a user from the list in sql");
            }
            return Convert.ToInt32(cmd.Parameters["@ListID"].Value);
        }

    }
}
