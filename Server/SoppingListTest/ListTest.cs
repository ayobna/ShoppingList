using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using ShoppingList.Controllers;
using ShoppingList.Data;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System.Data.SqlClient;

namespace SoppingListTest
{
    [TestClass]
    public class ListTest
    {
       private readonly UserController _userController;

      
        private readonly Mock<IDbConnection> db = new Mock<IDbConnection>();
        private readonly Mock<IUser> UserMock = new Mock<IUser>();
        private readonly Mock<ILogger<UserController>> ILogger= new Mock<ILogger<UserController>>();
   
        public ListTest()
        {
            
              _userController = new UserController(UserMock.Object, ILogger.Object);
        }
        [TestMethod]
        public void TestMethod1()
        {
        }


        //[TestMethod]
        //public  void GetUserIDByEmailTest()
        //{
        //    // Create a mock version of the DbContext
        // //   User user= new User();
        //    UserMock.Setup(s => s.GetUserById(1)).Returns()=>
        //    {
        //        return 1;
        //    });

        //   var user= _userController.GetUserById(1);
        //    Assert.AreEqual(user.UserID, 1);
        //}
    }
}
