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

                logger.LogInformation("CreateUser - User successfully created");
                return Ok(id);

            }
            catch (Exception ex)
            {
                logger.LogError($"CreateUser - something wrong happened while creating a user\n=> {ex.Message}");
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
        public IActionResult UpdateUser([FromBody] User user, bool IshaveBase64Img, string defualtImg)
        {
            try
            {
                if (IshaveBase64Img)
                {
                    user.Img = UploadFile(user, user.Img);
                }
                if (defualtImg != null)
                {
                    user.Img = defualtImg;
                }
                User userAfterUpdate = userData.UpdateUser(user);
                return Ok(userAfterUpdate);
            }
                   catch (Exception ex)
            {
                logger.LogError(": Did not Updated User With Img in DB");
                return NotFound(ex);
            }
        }

        private string UploadFile(User user, string img)
        {
            try
            {
                string sqlPath, fileName;
                string path = env.WebRootPath + $"/uploads/users/";
                sqlPath = $"user_{user.UserID}";
                path += sqlPath;
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

        // what do you think mates? to create profile controller? to keep profile things here?
        [HttpDelete]
        [Route("Api/Users/DeleteUser")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                int res = userData.DeleteUser(id);
                logger.LogInformation("DeleteUser - User successfully Deleted");
                return Ok(res);
            }
            catch (Exception ex)
            {
                logger.LogError($"DeleteUser - something wrong happened while Deleting a user\n=> {ex.Message}");
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("api/GetProfileSatistics")]
        public IActionResult GetProfileSatistics(int id)
        {
            try
            {
                logger.LogInformation("Get User statistics");
                List<ProfileSatistics> userSatistics = userData.GetProfileSatistics(id);
                if (userSatistics.Count <= 0)
                {
                    return BadRequest();
                }
                return Ok(userSatistics[0]);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Something went wrong while get the user statistics");
                return NotFound(ex);
            }
        }

        [HttpPost]
        [Route("Api/Users/UpdatePasswordInProfile")]
        public IActionResult UpdatePasswordInProfile([FromBody] User user, string oldPassword)
        {
            try
            {
                int res = userData.UpdatePasswordInProfile(user,oldPassword);
                string logMessage = "UpdatePasswordInProfile - update user password succseed";
                if (res == -1)
                {
                    logMessage = "UpdatePasswordInProfile- update user password failled because old password not the cureent password";
                }
                logger.LogInformation(logMessage);
                return Ok(res);
            }
            catch (Exception ex)
            {
                logger.LogError($"DeleteUser - something wrong happened while Deleting a user\n=> {ex.Message}");
                return BadRequest(ex);
            }
        }



    }
}
