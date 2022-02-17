using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        private readonly ILoggerService logger;

        public ShoppinglistController(IShoppingList shoppingList_ ,ILoggerService logger_)
        {

            shoppingList = shoppingList_;
            logger = logger_;

        }

        [HttpGet]
        [Route("api/shoppingList")]
        public IActionResult TE()
        {
            shoppingList.GetShoppingList();
            logger.LogError("Error test ");
            return Ok(1);
        }


    }
}
