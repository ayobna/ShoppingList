using System;

namespace ShoppingList.Models
{
    public class VerificationCode
    {
        public int Code { get; set; }
        public DateTime CreatedTime { get; set; }

        public VerificationCode(int code, DateTime createdTime)
        {
            Code = code;
            CreatedTime = createdTime;
        }
    }
}
