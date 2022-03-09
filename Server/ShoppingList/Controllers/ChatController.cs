using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Data;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Controllers
{

 
    public class ChatController : ControllerBase
    {
        private readonly IChatData chatData;
        //private readonly ILoggerService logger;

        private readonly ILogger<ShoppinglistController> logger;



        public ChatController(IChatData chatData_, ILogger<ShoppinglistController> logger_)
        {

            chatData = chatData_;
            logger = logger_;

        }

        [EnableCors("AnotherPolicy")]
        [HttpGet]
        [Route("api/shoppingList/ChatMessages/{id}")]
        public IActionResult GetChatMessages(int id)
        {
            try
            {
                List<ChatMessageCard>  chatMessageCards = chatData.GetChatMessages(id);
                logger.LogInformation("get chat MessageCards by List id");
                //logger.LogError("Error test ");
                return Ok(chatMessageCards);
            }
            catch (Exception ex)
            {
                logger.LogError($"Function name GetChatMessages - {ex.Message}");

                  return NotFound(ex);
            }
        }

    }
}
