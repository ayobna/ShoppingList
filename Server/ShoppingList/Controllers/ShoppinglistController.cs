using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Data;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{

    public class ShoppinglistController : ControllerBase
    {
        private readonly IShoppingList shoppingList;
        //private readonly ILoggerService logger;

        private readonly ILogger<ShoppinglistController> logger;

        public ShoppinglistController(IShoppingList shoppingList_, ILogger<ShoppinglistController> logger_)
        {
         

            shoppingList = shoppingList_;
            logger = logger_;
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


    }
}
