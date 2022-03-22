using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace ShoppingList.Controllers
{
    [EnableCors("AllowMyOrigin")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginData loginData;

        private readonly ILogger<ShoppinglistController> logger;

        public LoginController(ILoginData loginData_, ILogger<ShoppinglistController> logger_)
        {

            loginData = loginData_;
            logger = logger_;
        }

        [HttpPost]
        [Route("api/Login/CheckLoginDetails")]
        public IActionResult CheckLoginDetails([FromBody] User user)
        {
            try
            {
                List<User> userList = loginData.CheckLoginDetails(user);
                if (userList.Count == 0)
                {
                    logger.LogInformation($"Login to email {user.Email} failed!");
                    return Ok(null);
                }

                logger.LogInformation($"Login to email {user.Email} succeed!");
                return Ok(userList[0]);

            }
            catch (Exception ex)
            {
                logger.LogError($"Login to email {user.Email} Failed!\n=> {ex.Message}");
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("api/Login/UpdateUserNotificationToken")]
        public IActionResult UpdateUserNotificationToken([FromBody] User user)
        {
            try
            {
                int res = loginData.UpdateUserNotificationToken(user);
                logger.LogInformation($"Update notification token to userID {user.UserID} succeed!");
                return Ok(res);

            }
            catch (Exception ex)
            {
                logger.LogError($"Login to email {user.Email} Failed!\n=> {ex.Message}");
                return BadRequest(ex);
            }
        }
    }
}
