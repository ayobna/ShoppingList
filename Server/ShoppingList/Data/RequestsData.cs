using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
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
    }
}
