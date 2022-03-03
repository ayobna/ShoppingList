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

        //public void UserController_whenRetrievingGetAllUsers_returnUsers()
        //{
        //    var userMock = new Mock<IUser>();
        //    var logger = new Mock<ILogger<UserController>>();
        //    var userController = new UserController(userMock.Object, logger.Object);

        //    var result = userController.GetAllUsers();

        //    Assert.AreEqual(1, result);
        //    userMock.Verify(v => v.GetAllUsers(), Times.Once());
        //}

        //public void ShoppingCart_WhenAdding2ItemsToShoppingCart_CheckTotalIsFor2Items()
        //{
        //    var shopingCart = new ShoppingCart();
        //    shoppingCart.addItem(new Item(price = 5));
        //    shoppingCart.addItem(new Item(price = 15));

        //    Assert.AreEqual(20, shoppingCart.getTotal());
        //}

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
