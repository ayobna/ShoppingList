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
    public class UserController : ControllerBase
    {
        private readonly IUser user;
        //private readonly ILoggerService logger;
        private readonly ILogger<UserController> logger;
        public UserController(IUser user_, ILogger<UserController> logger_)
        {

            user = user_;
            logger = logger_;
        }


        [HttpPost]
        [Route("Api/Users/CreateUser")]
        public IActionResult Post([FromBody] User userReq)
        {
            try
            {
                User u = user.CreateUser(userReq);

                if (u == null)
                {
                    logger.LogWarning("User not created ");
                    return Ok("User not created");
                }
                else
                {
                    logger.LogInformation("User not created ");
                    return Ok(u);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        // test
        [HttpGet]
        [Route("api/usersGet")]
        public IActionResult GetAllUsers()
        {
            try
            {
                logger.LogInformation("Gat All Users");
                List<User> users = user.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ": DbConnection");
                return NotFound(ex);
            }
          
           
            //logger.LogError("Error test ");
        
        }


        [HttpGet]
        [Route("Api/GetUserById/{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                User u = user.GetUserById(id);
                if (u == null)
                {
                    logger.LogWarning(" Id not exists");
                    return NotFound();
                }
                else
                {
                    logger.LogInformation("User by Id");
                    return Ok(u);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
