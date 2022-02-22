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
            throw new NotImplementedException();
           
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
