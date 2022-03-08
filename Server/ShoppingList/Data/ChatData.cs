using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace ShoppingList.Data
{
    public class ChatData : IChatData
    {

        private readonly IDbConnection db;

        public ChatData(IDbConnection db_)
        {
            db = db_;
        }


        public List<ChatMessageCard> GetChatMessages(int listID)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_Chat_Messages", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = listID;
            DataTable tb = db.ReadAndClose(cmd);
            List<ChatMessageCard> messageList = db.ConvertDataTable<ChatMessageCard>(tb);
            return messageList;
        }
    }
}
