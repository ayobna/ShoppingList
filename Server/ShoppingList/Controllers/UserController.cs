using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly IUser userData;
        //private readonly ILoggerService logger;
        private readonly ILogger<UserController> logger;
        private readonly IWebHostEnvironment env;
        public UserController(IUser user_, ILogger<UserController> logger_, IWebHostEnvironment hostingEnvironment_)
        {
            userData = user_;
            logger = logger_;
            env = hostingEnvironment_;
        }


        [HttpPost]
        [Route("Api/Users/CreateUser")]
        public IActionResult Post([FromBody] User userReq)
        {
            try
            {
                User u = userData.CreateUser(userReq);
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
                List<User> users = userData.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ": DbConnection");
                return NotFound(ex);
            }
        }


        [HttpGet]
        [Route("Api/GetUserById/{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                User u = userData.GetUserById(id);
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

        [HttpPost]
        [Route("api/User/UpdateUser")]
        public IActionResult UpdateUser([FromBody] User user ,string base64)
        {
            try
            {
                if (!String.IsNullOrEmpty(base64))
                {
                    string sqlPath, fileName;
                    UploadFile(user, out sqlPath, out fileName);
                    user.Img = sqlPath + "/" + fileName;
                }
                userData.UpdateUser(user);
                return Ok(" Update User With Img successfully");
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Updated User With Img in DB");
                return NotFound(ex);
            }
        }

        private void UploadFile(User user, out string sqlPath, out string fileName)
        {
            try
            {
                string path = env.WebRootPath + $"/uploads/shoppingLists/";
                sqlPath = $"User_{user.UserID}";
                path = path + sqlPath;
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                fileName = $"img_{user.UserID}_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpg";
                path = Path.Combine(path, fileName);
                logger.LogInformation("path Information", path);
                Models.UploadFile.Upload(path, user.Img);
            }
            catch
            {
                logger.LogError("While updating an image for the user: " + user.UserID);
                sqlPath = "";
                fileName = "";
            }
        }
    }
}
