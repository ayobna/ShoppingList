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
        public IActionResult CreateUser([FromBody] User userReq)
        {
            try
            {


                int id = userData.CreateUser(userReq);

                if (id == -1)
                {
                    logger.LogWarning("CreateUser - Email exists in the db");
                    return Ok(id);
                }

                logger.LogInformation("CreateUser - User succesfully created");
                return Ok(id);
                
            }
            catch (Exception ex)
            {
                logger.LogError($"CreateUser - something wrong happaned while creating a user\n=> {ex.Message}");
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
        public IActionResult UpdateUser([FromBody] User user ,bool IshaveBase64Img)
        {
            try
            {
                if (IshaveBase64Img)
                {                
                  user.Img=  UploadFile(user , user.Img);                
                }
             User userAfterUpdate=   userData.UpdateUser(user);
                return Ok(userAfterUpdate);
            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Updated User With Img in DB");
                return NotFound(ex);
            }
        }

        private  string  UploadFile(User user ,string img)
        {
            try
            {
                string sqlPath, fileName;
                string path = env.WebRootPath + $"/uploads/users/";
                sqlPath = $"user_{user.UserID}";
                path +=sqlPath;
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                fileName = $"img_{user.UserID}_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpg";
                path = Path.Combine(path, fileName);
                logger.LogInformation("path Information", path);          
                Models.UploadFile.Upload(path, img);
                return sqlPath + "/" + fileName;
            }
            catch
            {
                logger.LogError("While updating an image for the user: " + user.UserID);
                return null;
            }
        }
    }
}
