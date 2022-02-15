using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{

    public class ShoppinglistController : ControllerBase
    {
        private readonly IShoppingList shoppingList;

        public ShoppinglistController(IShoppingList shoppingList_)
        {
      
            shoppingList = shoppingList_;

        }

        [HttpGet]
        [Route("api/shoppingList")]
        public IActionResult TE()
        {
            return Ok(1);
        }


    }
}
