using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Data;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{

    public class ShoppinglistController : ControllerBase
    {
        private readonly IShoppingList shoppingList;
        //private readonly ILoggerService logger;

        private readonly ILogger<ShoppinglistController> logger;

        private readonly IWebHostEnvironment env;

        public ShoppinglistController(IShoppingList shoppingList_, ILogger<ShoppinglistController> logger_, IWebHostEnvironment hostingEnvironment_)
        {
         

            shoppingList = shoppingList_;
            logger = logger_;
            env = hostingEnvironment_;
        }

        [HttpGet]
        [Route("api/shoppingList")]
        public IActionResult  GetAllListsUserIsAParticipant()
        {
            shoppingList.GetAllListsCreatedByUser();
            logger.LogInformation("new test");
           //logger.LogError("Error test ");
            return Ok(1);
        }

        [HttpPost]
        [Route("api/CreateShoppingList")]
        public IActionResult CreateShoppingList([FromBody] Shoppinglist shoppinglist)
        {
            try
            {
                return Ok(1);
            }
            catch (Exception e)
            {

                throw ;
            }
        }


        





    }
}
