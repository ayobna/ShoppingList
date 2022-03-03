using Microsoft.AspNetCore.Cors;
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
    [EnableCors("AllowMyOrigin")]
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
        [Route("api/shoppingList/CreatedByUser/{id}")]
        public IActionResult GetAllListsCreatedByUser(int id)
        {
         List<Shoppinglist> Shoppinglists =   shoppingList.GetAllListsCreatedByUser(id);
            logger.LogInformation("new test");
           //logger.LogError("Error test ");
            return Ok(Shoppinglists);
        }

        [HttpGet]
        [Route("api/shoppingList/UserIsAParticipant/{id}")]
        public IActionResult GetAllListsUserIsAParticipant(int id)
        {
            List<Shoppinglist> Shoppinglists = shoppingList.GetAllListsUserIsAParticipant(id);
            logger.LogInformation("new test");
            //logger.LogError("Error test ");
            return Ok(Shoppinglists);
        }
        [HttpPost]
        [Route("api/CreateShoppingList")]
        public IActionResult CreateShoppingList([FromBody] Shoppinglist shoppinglist)
        {
            try
            {
                shoppinglist.CreatedOn = DateTime.Now;
                int listID = shoppingList.CreateShoppinglist(shoppinglist);
                logger.LogInformation($"Function name CreateShoppingList - Create shopping list with id {listID} success");
                return Ok(listID);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name CreateShoppingList - {e.Message}");
                // need to think what to do here logs?
                throw;
            }
        }

    }
}
