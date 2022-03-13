using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
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
        public void CreateChatMessage(ChatMessageCard chatMessageCard)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Create_Message", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = chatMessageCard.ListID;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = chatMessageCard.UserID;
            cmd.Parameters.Add("@Message", SqlDbType.NVarChar).Value = chatMessageCard.Message;
            cmd.Parameters.Add("@CreatedOn", SqlDbType.DateTime).Value = chatMessageCard.CreatedOn;

            int res = db.ExecuteAndClose(cmd);

            if (res < 1)
            {
                throw new Exception("Somthing went wrong inserting prodeuct to copied list.");
            }

        }
    }
}
