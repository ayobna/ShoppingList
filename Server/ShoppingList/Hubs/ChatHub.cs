using Microsoft.AspNetCore.SignalR;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly IChatData chatData;

        public ChatHub(IChatData chatData_, IDictionary<string, UserConnection> connections)
        {
            chatData = chatData_;
            _connections = connections;
        }

        //public override Task OnDisconnectedAsync(Exception exception)
        //{
        //    if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
        //    {
        //        _connections.Remove(Context.ConnectionId);
        //        Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");
        //        SendUsersConnected(userConnection.Room);
        //    }

        //    return base.OnDisconnectedAsync(exception);
        //}

        public async Task JoinChat(UserConnection userConnection)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.ListID.ToString());

                //_connections[Context.ConnectionId] = userConnection;

                List<ChatMessageCard> chatMessages = chatData.GetChatMessages(userConnection.ListID);

                await Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessages", chatMessages);

                //await SendUsersConnected(userConnection.Room);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        //public async Task SendMessage(string message  )
        //{
        //    if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
        //    {
        //        await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", userConnection.User, message);
        //    }
        //}

        //public Task SendUsersConnected(string room)
        //{
        //    var users = _connections.Values
        //        .Where(c => c.Room == room)
        //        .Select(c => c.User);

        //    return Clients.Group(room).SendAsync("UsersInRoom", users);
        //}

    }
}
