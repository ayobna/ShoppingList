using Microsoft.AspNetCore.SignalR;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Hubs
{
    public class ListProductsHub:Hub
    {
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly IProductData productData;
        public ListProductsHub(IDictionary<string, UserConnection> connections, IProductData _productData)
        {
            _connections = connections;
            productData = _productData;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Context.Abort();
            
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.ListID.ToString());

            _connections[Context.ConnectionId] = userConnection;
            var products = productData.GetProductsByListId(userConnection.ListID);
            await Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessage", "Test hub", products);


        }

        public async Task SendProducts(ChatMessageCard chatMessageCard)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
            
            }
        }
        public async Task CheackProduct(ChatMessageCard chatMessageCard)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
            }
        }
        public async Task UnCheackProduct(ChatMessageCard chatMessageCard)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                //chatMessageCard.CreatedOn = DateTime.Now;
                //chatData.CreateChatMessage(chatMessageCard);
                //await Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessage", chatMessageCard);
            }
        }
    }
}
