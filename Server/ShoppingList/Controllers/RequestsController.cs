using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace ShoppingList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestsData requestsData;

        private readonly ILogger<ShoppinglistController> logger;

        public RequestsController(IRequestsData requestsData_, ILogger<ShoppinglistController> logger_)
        {

            requestsData = requestsData_;
            logger = logger_;
        }

        [HttpGet]
        [Route("Api/Requests/GetRequestsByUserId/{id}")]
        public IActionResult GetRequestsByUserId(int id)
        {
            try
            {
                List<RequestsCard> requests = requestsData.GetRequestsByUser(id);
                if (requests == null)
                {
                    logger.LogWarning(" Id not exists");
                    return NotFound();
                }

                logger.LogInformation("requests by user Id" + " " + id);
                return Ok(requests);

            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get requests by ListId DB");
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("Api/Requests/ConfirmRequest")]
        public IActionResult ConfirmRequest([FromBody] ShoppingListUser shoppingListUser)
        {
            try
            {
                int res = requestsData.ConfirmRequest(shoppingListUser);

                logger.LogInformation($"Confirm request to list id = {shoppingListUser.ListID} by user id = {shoppingListUser.UserID} succeed");
                return Ok(res);

            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get requests by ListId DB");
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("Api/Requests/DeclineRequest")]
        public IActionResult DeclineRequest([FromBody] ShoppingListUser shoppingListUser)
        {
            try
            {
                int res = requestsData.DeclineRequest(shoppingListUser);

                logger.LogInformation($"Decline request to list id = {shoppingListUser.ListID} by user id = {shoppingListUser.UserID} succeed");
                return Ok(res);

            }
            catch (Exception ex)
            {
                logger.LogError(": Did not Get requests by ListId DB");
                return BadRequest(ex);
            }
        }
    }
}
