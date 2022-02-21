using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private readonly ILoggerService logger;

        public UserController(IUser user_, ILoggerService logger_)
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
                    return NotFound();
                }
                else
                {
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
            logger.LogError("Error test ");
            return Ok(user.GetAllUsers());
        }


        [HttpGet]
        [Route("Api/GetUserById/{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                User u = user.GetUserById(id);
                if (u == null)
                {
                    return NotFound();
                }
                else
                {
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
