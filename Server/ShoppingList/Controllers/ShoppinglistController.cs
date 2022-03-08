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
            try
            {
                List<ShoppingListCard> Shoppinglists = shoppingList.GetAllListsCreatedByUser(id);
                logger.LogInformation("new test");
                //logger.LogError("Error test ");
                return Ok(Shoppinglists);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name GetAllListsCreatedByUser - {e.Message}");
                // need to think what to do here logs?
                throw;
            }
        }

        [HttpGet]
        [Route("api/shoppingList/UserIsAParticipant/{id}")]
        public IActionResult GetAllListsUserIsAParticipant(int id)
        {
            try
            {
                List<ShoppingListCard> Shoppinglists = shoppingList.GetAllListsUserIsAParticipant(id);
                logger.LogInformation("new test");
                //logger.LogError("Error test ");
                return Ok(Shoppinglists);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name GetAllListsUserIsAParticipant    - {e.Message}");
                // need to think what to do here logs?
                throw;
            }


        }

        [HttpPost]
        [Route("api/shoppingList/CreateShoppingList")]
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

        [HttpPost]
        [Route("api/shoppingList/UpdateShoppinglist")]
        public IActionResult UpdateShoppinglist([FromBody] ShoppingListCard shoppinglist)
        {
            try
            {
                int res = shoppingList.UpdateShoppinglist(shoppinglist);
                logger.LogInformation($"Function name UpdateShoppinglist - Update shopping list with id {shoppinglist.ListID} success");
                return Ok(res);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name UpdateShoppinglist - {e.Message}");
             
                throw;
            }
        }

        [HttpPost]
        [Route("api/shoppingList/DeleteShoppinglist")]
        public IActionResult DeleteShoppinglist(int id)
        {
            try
            {
                shoppingList.DeleteShoppinglist(id);
                logger.LogInformation($"Function name DeleteShoppinglist - Delete shopping list with id {id} success");
                return Ok($"Function name DeleteShoppinglist - Delete shopping list with id {id} success");
            }
            catch (Exception e)
            {
                logger.LogError($"Function name CreateShoppingList - {e.Message}");
       
                throw;
            }
        }

        [HttpPost]
        [Route("api/shoppingList/CopyShoppingList")]
        public IActionResult CopyShoppingList([FromBody] Shoppinglist shoppinglist)
        {
            try
            {
                shoppinglist.CreatedOn = DateTime.Now;
                int copiedListID = shoppingList.CreateShoppinglist(shoppinglist);

                string path = env.WebRootPath + $"/uploads/shoppingLists/shoppingList_{copiedListID}";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                shoppingList.CopyShoppingList(shoppinglist.ListID, copiedListID, shoppinglist.CreatorID);
                logger.LogInformation($"Function name CopyShoppingList - copy shopping list with id {copiedListID} success");
                return Ok(copiedListID);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name CopyShoppingList - {e.Message}");
          
                throw;
            }
        }



        [HttpPost]
        [Route("api/shoppingList/ExitShoppingList")]
        public IActionResult ExitShoppingList(int ListID, int UserID)
        {
            try
            {
             

                shoppingList.ExitShoppingList(ListID, UserID);
                logger.LogInformation($"Function name ExitShoppingList - Exit shopping list with id {ListID} for User id {UserID} success");
                return Ok($"Exit shopping list with id {ListID} for User id {UserID} success");
            }
            catch (Exception e)
            {
                logger.LogError($"Function name ExitShoppingList - {e.Message}");
                
                throw;
            }
        }


    



    }
}
