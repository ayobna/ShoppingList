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
    public class ListUsersController :ControllerBase
    {
        private readonly IListUsers  listUsers;
        //private readonly ILoggerService logger;
        private readonly ILogger<UserController> logger;
        public ListUsersController(IListUsers listUsers_, ILogger<UserController> logger_)
        {
            listUsers = listUsers_;
            logger = logger_;
        }
        [HttpGet]
        [Route("Api/GetTheApprovedListUsers/{id}")]
        public IActionResult GetTheApprovedListUsers(int id)
        {
            try
            {
                List<ShoppingListUser> shoppingListUser = listUsers.GetTheApprovedListUsers(id);
                if (shoppingListUser == null)
                {
                    logger.LogWarning(" Id not exists");
                    return NotFound();
                }
                else
                {
                    logger.LogInformation("List by Id" + " " + id);
                    return Ok(shoppingListUser);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get The Users Of the list by ListId DB");
                return BadRequest(ex);
            }
        }
       
        [HttpPost]
        [Route("api/shoppingList/AddUserForTheList")]
        public IActionResult AddUserForTheList([FromBody] ShoppingListUser listusers)
        {
            try
            {
                listusers.JoinedDate = DateTime.Now;
                int userID = listUsers.AddUserForTheList(listusers);
                logger.LogInformation($"Function name AddUserForTheList - add the user id {userID} to be a member in list id {listusers.ListID} success");
                return Ok(userID);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name AddUserForTheList - {e.Message}");
                throw;
            }
        }

        [HttpPost]
        [Route("api/shoppingList/ApproveOrDeletUserFromList")]
        public IActionResult ApproveOrDeletUserFromList([FromBody] ShoppingListUser listusers)
        {
            try
            {
                listusers.JoinedDate = DateTime.Now;
                int res = listUsers.ApproveOrDeletUserFromList(listusers);
                logger.LogInformation($"Function name ApproveOrDeletUserFromList - approvin or deleting the user id {listusers.UserID} in list id {listusers.ListID}, success");
                return Ok(res);
            }
            catch (Exception e)
            {
                logger.LogError($"Function name ApproveOrDeletUserFromList - {e.Message}");

                throw;
            }
        }
    }
}
