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

    
        public List<Shoppinglist> GetAllListsCreatedByUser()
        { 
            SqlCommand cmd = db.CreateCommand("Proc_Get_All_Lists_Created_By_User", db.Connect(), "proc");
            DataTable tb = db.ReadAndClose(cmd);
            List<Shoppinglist> shoppinglist = db.ConvertDataTable<Shoppinglist>(tb);
            return shoppinglist;
        }

        public List<Shoppinglist> GetAllListsUserIsAParticipant()
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_All_Lists_User_Is_A_Participant", db.Connect(), "proc");
            DataTable tb = db.ReadAndClose(cmd);
            List<Shoppinglist> shoppinglist = db.ConvertDataTable<Shoppinglist>(tb);
            return shoppinglist;
        }   


    }
}
