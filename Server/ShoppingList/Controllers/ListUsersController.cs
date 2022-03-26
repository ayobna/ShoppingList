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
        [Route("Api/GetParticipantsInTheShoppingListByListId/{id}")]
        public IActionResult GetParticipantsInTheShoppingListByListId(int id)
        {
            try
            {
                List<User> shoppingListUser = listUsers.GetParticipantsInTheShoppingListByListId(id);
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
        [HttpGet]
        [Route("Api/GetUserByEmailToAddToListUsers/{email}")]
        public IActionResult GetUserByEmailToAddToListUsers(string email)
        {
            try
            {
                List<User> searchListUsers = listUsers.GetUserByEmailToAddToListUsers(email);
                if (searchListUsers == null)
                {
                    logger.LogWarning(" email not exists");
                    return NotFound();
                }
                else
                {
                    logger.LogInformation("get user with email " + " " + email);
                    return Ok(searchListUsers);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get The User with the email");
                return BadRequest(ex);
            }
        }

    }
}
