using Microsoft.AspNetCore.Mvc;
using ShoppingList.Data;
using ShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{
    public class Test : ControllerBase
    {
   
        [HttpGet]
        [Route("api/Hometry")]
        public List<Home> GetHome()
        {
            HomeData homeData = new HomeData();
            return homeData.GetHome();
        }

    }
}
