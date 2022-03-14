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
    }
}
