using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Data;
using System.Data.SqlClient;

namespace ShoppingList.Data
{
    public class ProductData : IProductData
    {
        private readonly IDbConnection db;

        public ProductData(IDbConnection db_)
        {
            db = db_;
        }

        public int CreateProduct(Product product)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Create_Product", db.Connect(), "proc");
            cmd.Parameters.Add("@ListID", SqlDbType.Int).Value = product.ListID;
            cmd.Parameters.Add("@CreatorID", SqlDbType.Int).Value = product.CreatorID;
            cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = product.Name;
            cmd.Parameters.Add("@Amount", SqlDbType.Int).Value = product.Amount;
            cmd.Parameters.Add("@CreatedOn", SqlDbType.DateTime).Value = product.CreatedOn;
            cmd.Parameters.Add("@ProductID", SqlDbType.Int).Direction = ParameterDirection.Output;

            int res = db.ExecuteAndClose(cmd);

            if (res != 1)
            {
                throw new Exception("Somthing went wrong while adding product in sql");
            }
            return Convert.ToInt32(cmd.Parameters["@ProductID"].Value);
        }

        public int UpdaeProduct(Product product)
        {
            SqlCommand cmd = db.CreateCommand("Proc_Create_Product", db.Connect(), "proc");
            cmd.Parameters.Add("@ProductID", SqlDbType.Int).Value = product.ProductID;
            cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = product.Name;
            cmd.Parameters.Add("@Amount", SqlDbType.Int).Value = product.Amount;
            cmd.Parameters.Add("@Img", SqlDbType.NVarChar).Value = product.Img;
            cmd.Parameters.Add("@IsActive", SqlDbType.Bit).Value = product.IsActive;

            int res = db.ExecuteAndClose(cmd);

            if (res != 1)
            {
                throw new Exception("Somthing went wrong while adding product in sql");
            }
            return res;
        }


        //public List<Shoppinglist> GetAllListsCreatedByUser()
        //{
        //    SqlCommand cmd = db.CreateCommand("Proc_Get_All_Lists_Created_By_User", db.Connect(), "proc");
        //    DataTable tb = db.ReadAndClose(cmd);
        //    List<Shoppinglist> shoppinglist = db.ConvertDataTable<Shoppinglist>(tb);
        //    return shoppinglist;
        //}
    }
}
