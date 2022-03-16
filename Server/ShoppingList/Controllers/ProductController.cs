using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;

namespace ShoppingList.Controllers
{

    public class ProductController : ControllerBase
    {
        private readonly IProductData productData;
        //private readonly ILoggerService logger;

        private readonly ILogger<ShoppinglistController> logger;

        private readonly IWebHostEnvironment env;

        public ProductController(IProductData productData_, ILogger<ShoppinglistController> logger_, IWebHostEnvironment hostingEnvironment_)
        {
            productData = productData_;
            logger = logger_;
            env = hostingEnvironment_;
        }


        [HttpPost]
        [Route("api/Product/AddProductsToShoppingList")]
        public IActionResult AddProductsToShoppingList([FromBody] Product[] products)
        {
            try
            {
                //shoppinglist.CreatedOn = DateTime.Now;
                //int listID = shoppingList.CreateShoppinglist(shoppinglist);
                for (int i = 0; i < products.Length; i++)
                {
                    products[i].CreatedOn = DateTime.Now;
                    int productID = productData.CreateProduct(products[i]);
                    products[i].ProductID = productID;
                    Product product = products[i];
                    if (!String.IsNullOrEmpty(product.Img))
                    {
                        string sqlPath, fileName;
                        UploadFile(product, out sqlPath, out fileName);
                        product.ProductID = product.ProductID;
                        product.Img = sqlPath + "/" + fileName;
                        product.IsActive = true;
                        productData.UpdateProduct(product);
                    }
                }
                return Ok("Add Products To ShoppingList successfully");
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not create sharp products in DB");
                return NotFound(ex);
            }
        }
        [HttpPost]
        [Route("api/Product/AddProductToShoppingList")]
        public IActionResult AddProductToShoppingList([FromBody] Product product)
        {
            try
            {
                product.CreatedOn = DateTime.Now;
                int productID = productData.CreateProduct(product);
                product.ProductID = productID;
                if (!String.IsNullOrEmpty(product.Img))
                {
                    string sqlPath, fileName;
                    UploadFile(product, out sqlPath, out fileName);
                    product.ProductID = product.ProductID;
                    product.Img = sqlPath + "/" + fileName;
                    product.IsActive = true;
                    productData.UpdateProduct(product);
                }

                return Ok(" Add Product To ShoppingList successfully");
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not create sharp products in DB");
                return NotFound(ex);
            }
        }

        private void UploadFile(Product product, out string sqlPath, out string fileName)
        {
            string path = env.WebRootPath + $"/uploads/shoppingLists/";
            sqlPath = $"shoppingList_{product.ListID}";
            path = path + sqlPath;
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            fileName = $"img_{product.ProductID}_{product.CreatorID}_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpg";
            path = Path.Combine(path, fileName);
            logger.LogInformation("path Information", path);
            Models.UploadFile.Upload(path, product.Img);
        }

        [HttpPost]
        [Route("Api/UpdateProductNewImg")]
        public IActionResult UpdateProductNewImg([FromBody] Product product)
        {
            try
            {
                string sqlPath, fileName;
                UploadFile(product, out sqlPath, out fileName);
                product.Img = sqlPath + "/" + fileName;
                productData.UpdateProduct(product);
                return Ok(" UpdateProduct successfully");
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get Products by ListId DB");
                return BadRequest(ex);
            }
        }
        [HttpPost]
        [Route("Api/UpdateProduct")]
        public IActionResult UpdateProduct([FromBody] Product product)
        {
            try
            {
                productData.UpdateProduct(product);
                return Ok("Update Product successfully");
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get Products by ListId DB");
                return BadRequest(ex);
            }
        }




        [HttpGet]
        [Route("Api/GetProductsByListId/{id}")]
        public IActionResult GetProductbyListId(int id)
        {
            try
            {
                List<Product> products = productData.GetProductsByListId(id);
                if (products == null)
                {
                    logger.LogWarning(" Id not exists");
                    return NotFound();
                }
                else
                {
                    logger.LogInformation("List by Id" + " " + id);
                    return Ok(products);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get Products by ListId DB");
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("Api/DeleteProduct/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            try
            {
                productData.DeleteProductByID(id);
                return Ok(" Delete Product successfully");
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get Products by ListId DB");
                return BadRequest(ex);
            }
        }


    }
}
