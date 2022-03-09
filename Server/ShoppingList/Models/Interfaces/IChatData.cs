using System.Collections.Generic;

namespace ShoppingList.Models.Interfaces
{
    public interface IChatData
    {
        public List<ChatMessageCard> GetChatMessages(int listID);
        public void CreateChatMessage(ChatMessageCard chatMessageCard);
    }
}
