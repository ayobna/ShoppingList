using ShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Data
{
    public class ShoppingListData
    {

        private readonly DbConnection db = new DbConnection();

        //proc not Exsits yet
        public List<Shoppinglist> GetShoppingList()
        {
            SqlCommand cmd = db.CreateCommand("Proc_Get_District", db.Connect(), "proc");
            DataTable tb = db.ReadAndClose(cmd);
            List<Shoppinglist> shoppinglist = db.ConvertDataTable<Shoppinglist>(tb);
            return shoppinglist;
        }
    }
}
