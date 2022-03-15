using ShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Data
{
    public class ShoppingListData : IShoppingList
    {

        private readonly IDbConnection db;

        public ShoppingListData(IDbConnection db_)
        {
            db = db_;
        }

        public int CreateShoppinglist(Shoppinglist shoppinglist)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Create_Shopping_List", db.Connect(), "proc");
            cmd.Parameters.Add("@CreatorID", SqlDbType.Int).Value = shoppinglist.CreatorID;
            cmd.Parameters.Add("@Title", SqlDbType.NVarChar).Value = shoppinglist.Title;
            cmd.Parameters.Add("@CreatedOn", SqlDbType.DateTime).Value = shoppinglist.CreatedOn;
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Direction = ParameterDirection.Output;

            int res = db.ExecuteAndClose(cmd);

            if (res < 1)
            {
                throw new Exception("Somthing went wrong while adding shopping list in sql");
            }
            return Convert.ToInt32(cmd.Parameters["@ListID"].Value);
        }


        public int UpdateShoppinglist(ShoppingListCard shoppinglist)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Update_List", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = shoppinglist.ListID;
            cmd.Parameters.Add("@Title", SqlDbType.NVarChar).Value = shoppinglist.Title;

            int res = db.ExecuteAndClose(cmd);

            if (res < 1)
            {
                throw new Exception("Somthing went wrong while update shopping list in sql");
            }
            return res;
        }

        public void DeleteShoppinglist(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Delete_List", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = id;

            int res = db.ExecuteAndClose(cmd);

            if (res < 1)
            {
                throw new Exception("Somthing went wrong while delete shopping list in sql"); // its not delete only update status
            }
        }


        public List<ShoppingListCard> GetAllListsCreatedByUser(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_All_Lists_Created_By_User", db.Connect(), "proc");
            cmd.Parameters.Add("@CreatorID", SqlDbType.Int).Value = id;
            DataTable tb = db.ReadAndClose(cmd);
            List<ShoppingListCard> shoppinglist = db.ConvertDataTable<ShoppingListCard>(tb);
            return shoppinglist;
        }

        public List<ShoppingListCard> GetAllListsUserIsAParticipant(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_All_Lists_User_Is_A_Participant", db.Connect(), "proc");
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = id;
            DataTable tb = db.ReadAndClose(cmd);
            List<ShoppingListCard> shoppinglist = db.ConvertDataTable<ShoppingListCard>(tb);
            return shoppinglist;
        }

        public Shoppinglist GetListCreatorByListID(int id)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_List_Creator_By_ListID", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = id;
            DataTable tb = db.ReadAndClose(cmd);
            List<Shoppinglist> shoppinglists = db.ConvertDataTable<Shoppinglist>(tb);         
            return shoppinglists[0];
        }


        public void CopyShoppingList(int originalListID, int copiedListID, int creatorID)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Insert_Products_To_Copied_List", db.Connect(), "proc");
            cmd.Parameters.Add("@OriginalListID", SqlDbType.Int).Value = originalListID;
            cmd.Parameters.Add("@CopiedListID", SqlDbType.Int).Value = copiedListID;
            cmd.Parameters.Add("@CreatorID", SqlDbType.Int).Value = creatorID;
            int res = db.ExecuteAndClose(cmd);
            if (res < 1)
            {
                throw new Exception("Somthing went wrong inserting prodeuct to copied list.");
            }
        }

        public void ExitShoppingList(int ListID, int UserID)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Exit_From_List_User_is_A_Participant", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = ListID;
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;       
            int res = db.ExecuteAndClose(cmd);
            if (res < 1)
            {
                throw new Exception("Somthing went wrong inserting prodeuct to copied list.");
            }
        }



    }

}
