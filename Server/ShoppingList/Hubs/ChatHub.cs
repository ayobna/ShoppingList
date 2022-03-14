
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
        public ChatHub(IDictionary<string, UserConnection> connections , IChatData chatData_)
        {
            _connections = connections;
            chatData = chatData_;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Context.Abort();
                //Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");
                //SendUsersConnected(userConnection.ListID);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.ListID.ToString());

            _connections[Context.ConnectionId] = userConnection;

            //await Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined {userConnection.ListID}");

            //await SendUsersConnected(userConnection.ListID);
        }

        public async Task SendMessage(ChatMessageCard chatMessageCard)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                chatMessageCard.CreatedOn = DateTime.Now;
                chatData.CreateChatMessage(chatMessageCard);
                await Clients.Group(userConnection.ListID.ToString()).SendAsync("ReceiveMessage", chatMessageCard);
            }
        }

        //public Task SendUsersConnected(int ListID)
        //{
        //    List<ChatMessageCard> Messages = chatData.GetChatMessages(ListID);

       
        //    return Clients.Group(ListID.ToString()).SendAsync("Messages", Messages);
        //}

        //public async Task GetMessage(ChatMessageCard item ,int ListID)
        //{
        
        //        await Clients.Group(ListID.ToString()).SendAsync("ReceiveMessages", item.FirstName, item.Message);
         
        //}
        //public Task BroadcastMessage(string name, string message) =>
        //Clients.All.SendAsync("broadcastMessage", name, message);

        //public Task Echo(string name, string message) =>
        //    Clients.Client(Context.ConnectionId)
        //           .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
