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

            await GetProducts(userConnection);

        }

        private async Task GetProducts(UserConnection userConnection)
        {
            _connections[Context.ConnectionId] = userConnection;
            var products = productData.GetProductsByListId(userConnection.ListID);
            await Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessage", products);
        }

        public async Task NewProduct()
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                
                GetProducts(userConnection);
            }
        }
        public async Task CheackProduct()
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                GetProducts(userConnection);
            }
        }
        public async Task UnCheackProduct( )
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                GetProducts(userConnection);
            }
        }
    }
}
