using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Data
{
    public interface IDbConnection
    {
        public SqlConnection Connect();
        public SqlCommand CreateCommand(string CommandSTR, SqlConnection con, string type = "");
        public int ExecuteAndClose(SqlCommand cmd);
        public DataTable ReadAndClose(SqlCommand cmd);
        public List<T> ConvertDataTable<T>(DataTable dt);
        public T GetItem<T>(DataRow dr);
    }
}
