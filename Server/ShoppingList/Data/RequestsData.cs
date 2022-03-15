using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace ShoppingList.Data
{
    public class RequestsData : IRequestsData
    {
        private readonly IDbConnection db;

        public RequestsData(IDbConnection db_)
        {
            db = db_;
        }

        public List<RequestsCard> GetRequestsByUser(int userID)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_Requests_By_User", db.Connect(), "proc");
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userID;
            DataTable tb = db.ReadAndClose(cmd);
            List<RequestsCard> messageList = db.ConvertDataTable<RequestsCard>(tb);
            return messageList;
        }

        public int ConfirmRequest(ShoppingListUser shoppingListUser)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Confirm_Request", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = shoppingListUser.ListID;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = shoppingListUser.UserID;
            cmd.Parameters.Add("@JoinedDate", SqlDbType.DateTime).Value = DateTime.Now;

            int res = db.ExecuteAndClose(cmd);

            if (res != 1)
            {
                throw new Exception("Somthing went wrong while confirm request in sql");
            }
            return res;
        }

        public int DeclineRequest(ShoppingListUser shoppingListUser)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Decline_Request", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = shoppingListUser.ListID;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = shoppingListUser.UserID;

            int res = db.ExecuteAndClose(cmd);

            if (res != 1)
            {
                throw new Exception("Somthing went wrong while decline request in sql");
            }
            return res;
        }
    }
}
