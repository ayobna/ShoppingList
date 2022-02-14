using ShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Data
{
    public class HomeData
    {
        private readonly DbConnection db = new DbConnection();

        //proc not Exsits yet
        public List<Home> GetHome()
        {
            SqlCommand cmd = db.CreateCommand("GetHomes", db.Connect(), "proc");
            DataTable tb = db.ReadAndClose(cmd);
            List<Home> homes = db.ConvertDataTable<Home>(tb);
            return homes;
        }
    }
}
