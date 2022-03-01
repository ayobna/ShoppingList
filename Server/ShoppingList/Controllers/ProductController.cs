using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.IO;

namespace ShoppingList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        [Route("api/AddProductsToShoppingList")]
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
                    if (!String.IsNullOrEmpty(products[i].Img))
                    {
                        string path = env.WebRootPath + $"/uploads/shoppingLists/";
                        string sqlPath = $"shoppingList_{products[i].ListID}";
                        path = path + sqlPath;
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }
                        string fileName = $"img_{productID}_{products[i].CreatorID}_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpg";
                        path = Path.Combine(path, fileName);
                        UploadFile.Upload(path, products[i].Img);
                        products[i].ProductID = productID;
                        products[i].Img = sqlPath + "/" + fileName;
                        products[i].IsActive = true;
                        productData.UpdaeProduct(products[i]);
                    }
                }
                return Ok();
            }
            catch (Exception e)
            {
                // need to think what to do here logs?
                throw;
            }
        }
    }
}
