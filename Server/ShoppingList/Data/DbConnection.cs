using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ShoppingList.Data
{
    public class DbConnection : IDbConnection
    {
        private string connectionString = null;
        //"Server = tcp:shoppinglistdbserver2022.database.windows.net,1433;Initial Catalog = ShoppingList_db; Persist Security Info=False;User ID = Ayoub; Password=@.Ayob.@; MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout = 30"
        //   private string connectionString = ConfigurationManager.ConnectionStrings["Production"].ConnectionString;
        //ctor --> only create the connection
        public DbConnection(string _connectionString)
        {
            connectionString = _connectionString;
        }

        //create connetion to DB
        public SqlConnection Connect()
        {
            SqlConnection con = new SqlConnection(connectionString);
            con.Open();
            return con;
        }

        //create sql command
        public SqlCommand CreateCommand(string CommandSTR, SqlConnection con, string type = "")
        {
            SqlCommand cmd = new SqlCommand(CommandSTR, con);
            cmd.CommandTimeout = 10;
            cmd.CommandType = System.Data.CommandType.Text;

            if (type == "proc")
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

            return cmd;
        }

        //exec sql command
        public int ExecuteAndClose(SqlCommand cmd)
        {
            try
            {
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        //get rows from DB
        public DataTable ReadAndClose(SqlCommand cmd)
        {
            try
            {
                DataSet ds = new DataSet(); //אובייקט לביצוע פעולות המרה על הנתונים מתוך המסד
                SqlDataAdapter da = new SqlDataAdapter(cmd); //מתאם לביצוע פעולה והמרה של הנתונים
                da.Fill(ds, "Table"); //שמירת הנתונים בתוך האדפטר
                DataTable dt = ds.Tables["Table"]; //dataset המרה של הנתונים לטיפוס המתאים באמצעות ה 

                return dt;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        //convert dataTable to list
        public List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }

        //get the row item according to the list type
        public T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                        if (dr[column.ColumnName] != System.DBNull.Value)
                            pro.SetValue(obj, dr[column.ColumnName], null);
                        else
                            continue;
                }
            }
            return obj;
        }
    }
}
