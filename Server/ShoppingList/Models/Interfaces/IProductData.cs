using System.Collections.Generic;

namespace ShoppingList.Models.Interfaces
{
    public interface IProductData
    {
        public int CreateProduct(Product product);
        public int UpdateProduct(Product product);
        public List<Product> GetProductsByListId(int id);
        public int DeleteProductByID(int ProductID);
    }
}
