
-------------------------------------------------User----------------------------------------------

Create Proc Proc_Get_Users
AS
Select * From [users]
Go

--exec Proc_Get_Users

--Drop Proc Proc_Create_User
--@Email nvarchar (150),
--@FirstName nvarchar (150),
--@LastName nvarchar (150),
--@Password varchar(max),
--@PhoneNumber nvarchar (150),
--@Img nvarchar(max),
--@IsActive bit,
--@NotificationToken nvarchar(max),
--@UserID int output
--AS
--IF NOT EXISTS (Select * From [users] Where Email=@Email or PhoneNumber=@PhoneNumber) 
--Begin
--    Insert [users] ([Email],[FirstName],[LastName],[Password],[PhoneNumber],[Img],[IsActive],[NotificationToken]) 
--    values (@Email, @FirstName, @LastName, @Password, @PhoneNumber, @Img, @IsActive, @NotificationToken)
--	set @UserID = @@identity 
--End 
--Go

--DECLARE @UserID int;
--exec Proc_Create_User 'test5@g.com','test4','test4', '12345', '1268',null,1,null, @UserID OUTPUT
--SELECT @UserID



alter Proc Proc_Update_User
@UserID int ,
@Email nvarchar (150),
@FirstName nvarchar (150),
@LastName nvarchar (150),
@PhoneNumber nvarchar (150),
@Img nvarchar(max)
AS 
Begin
  	UPDATE [users]
	SET  [Email]=@Email,[FirstName]=@FirstName,[LastName]=@LastName,[PhoneNumber]=@PhoneNumber,[Img]=@Img
	WHERE  [UserID]=@UserID ;
	Begin transaction
	select  UserID,[Email],[FirstName],[LastName],[Password],[PhoneNumber],[Img],[IsActive],[NotificationToken]from users where UserID = @UserID
	IF @@ERROR<>0
		Begin
			rollback transaction
			return
		End
commit transaction
End 
Go



Alter proc Proc_Get_User_By_Id
	@UserID int
as
Begin transaction
	select  UserID,[Email],[FirstName],[LastName],[Password],[PhoneNumber],[Img],[IsActive],[NotificationToken]from users where UserID = @UserID
	IF @@ERROR<>0
		Begin
			rollback transaction
			return
		End
commit transaction
go

-- user --> profile
Create proc Proc_Delete_User
@UserID int
as
Begin transaction
	UPDATE [users]
	SET [IsActive] = 0
	WHERE [UserID] = @UserID	
	IF @@ERROR<>0
		Begin
			rollback transaction
			return
		End
commit transaction
go


Create proc Proc_Get_Profile_Satistics
@UserID int
as
	Select dbo.Func_Return_Amount_Of_Lists_Created_By_CurrentUser(@UserID) as MyListsAmount, dbo.Func_Return_Amount_Of_Lists_Current_User_Shares_But_No_Creator(@UserID) as OtherListsAmount
go

Create proc Proc_Update_Password_In_Profile
@UserID int,
@OldPassword nvarchar(max),
@NewPassword nvarchar(max)
as
	Begin transaction
	if exists(Select * from users where [UserID] = @UserID And [Password] = @OldPassword)
	begin
		UPDATE [users]
		SET [Password] = @NewPassword
		WHERE [UserID] = @UserID	
		IF @@ERROR<>0
			Begin
				rollback transaction
				return
			End
	end
	commit transaction
go
--exec  Proc_Get_Profile_Satistics 13
--exec Proc_Get_User_By_Id 2


-------------------------------------------------List----------------------------------------------

Alter Proc Proc_Get_All_Lists_Created_By_User
@CreatorID int
AS
SELECT			shopping_lists.ListID, shopping_lists.Title, shopping_lists.CreatedOn, users.FirstName, users.LastName
FROM            shopping_lists INNER JOIN users 
				ON shopping_lists.CreatorID = users.UserID
WHERE        (shopping_lists.CreatorID = @CreatorID) AND (shopping_lists.IsActive = 1)
ORDER BY shopping_lists.CreatedOn DESC
Go

-- Drop Proc Proc_Create_Shopping_List
Create Proc Proc_Create_Shopping_List
@CreatorID int,
@Title Nvarchar(150),
@CreatedOn DateTime,
@ListID int out
AS
	INSERT INTO [shopping_lists] ([CreatorID], [Title], [CreatedOn])
	VALUES (@CreatorID, @Title, @CreatedOn);
	Set @ListID = @@IDENTITY
Go

-- Drop Proc Proc_Update_List
Create Proc Proc_Update_List
@ListID int,
@Title nvarchar(150)
AS
	UPDATE [shopping_lists]
	SET [Title] = @Title
	WHERE [ListID] = @ListID;
Go

-- Drop Proc Proc_Delete_List
Create Proc Proc_Delete_List
@ListID int
AS
	UPDATE [shopping_lists]
	SET [IsActive] = 0
	WHERE [ListID] = @ListID;
Go

-- Proc_Insert_Products_To_Copied_List
Create Proc Proc_Insert_Products_To_Copied_List
@OriginalListID int,
@CopiedListID int,
@CreatorID int
AS
	Begin Transaction
		DECLARE @productID int
		-- קבלת כל האירועים אותם מנהל המשתמש ושייכים לקורס אותו הוא מוחק
		DECLARE db_cursor CURSOR FOR 
		SELECT [ProductID]
		FROM  [products]
		WHERE [ListID] = @OriginalListID and [IsActive] = 1

		OPEN db_cursor 
		FETCH NEXT FROM db_cursor INTO @productID  

		WHILE @@FETCH_STATUS = 0  
		BEGIN 
			Declare @Name nvarchar(150), @Amount int, @Img nvarchar(max), @CreatedOn datetime
			Set @Name = (Select [Name] from [products] where [ProductID] = @productID)
			Set @Amount = (Select [Amount] from [products] where [ProductID] = @productID)
			Set @Img = (Select [Img] from [products] where [ProductID] = @productID)
			Set @CreatedOn = (Select [CreatedOn] from [products] where [ProductID] = @productID)

			INSERT INTO [products] ([ListID], [CreatorID], [Name], [Amount], [Img] ,[CreatedOn])
			VALUES (@CopiedListID, @CreatorID, @Name, @Amount,@Img ,@CreatedOn);
			IF @@error<>0
			begin
				ROLLBACK TRANSACTION
				DELETE FROM [products] WHERE [ListID] = @CopiedListID;
				DELETE FROM [shopping_lists_users] WHERE [ListID] = @CopiedListID;
				DELETE FROM [shopping_lists] WHERE [ListID] = @CopiedListID;
				RETURN
			end
			FETCH NEXT FROM db_cursor INTO @productID -- מעבר לאירוע הבא
		END 

		CLOSE db_cursor
		DEALLOCATE db_cursor
	Commit Transaction
Go


Alter Proc Proc_Get_All_Lists_User_Is_A_Participant
@UserID int
AS
SELECT        shopping_lists.ListID, shopping_lists.Title, shopping_lists.CreatedOn, users.FirstName, users.LastName
FROM            shopping_lists INNER JOIN
                         shopping_lists_users ON shopping_lists.ListID = shopping_lists_users.ListID INNER JOIN
                         users ON shopping_lists.CreatorID = users.UserID
WHERE        (shopping_lists_users.UserID = @UserID) AND (NOT (shopping_lists.CreatorID =@UserID)) AND (shopping_lists.IsActive = 1) AND (shopping_lists_users.IsApproved = 1)
ORDER BY shopping_lists.CreatedOn DESC
Go

exec Proc_Get_All_Lists_User_Is_A_Participant 1




Create Proc Proc_Exit_From_List_User_is_A_Participant
@ListID int,
@UserID int
AS
delete from [shopping_lists_users]
WHERE  [ListID]= @ListID ANd [UserID]=@UserID
Go

exec  Proc_Exit_From_List_User_is_A_Participant 24,1
-------------------------------------------------Product----------------------------------------------

--declare @x int, @date datetime
--set @date = GetDate()
--exec Proc_Create_Shopping_List 1, 'try', @date , @x out

-- Drop Proc Proc_Create_Product
Create Proc Proc_Create_Product
@ListID int,
@CreatorID int,
@Name Nvarchar(150),
@Amount int,
@CreatedOn DateTime,
@ProductID int out
AS
	INSERT INTO [products] ([ListID], [CreatorID], [Name], [Amount], [CreatedOn])
	VALUES (@ListID, @CreatorID, @Name, @Amount, @CreatedOn);
	Set @ProductID = @@IDENTITY
Go

-- Drop Proc Proc_Update_Product
Create Proc Proc_Update_Product
@ProductID int,
@Name Nvarchar(150),
@Amount int,
@Img Nvarchar(max),
@IsActive bit
AS
	UPDATE [products]
	SET [Name] = @Name, [Amount] = @Amount, [Img] = @Img, [IsActive] = @IsActive
	WHERE [ProductID] = @ProductID;
Go


-- chat

-- Drop Proc_Get_Chat_Messages
Alter Proc Proc_Get_Chat_Messages
@ListID int
AS
SELECT			shopping_lists_messages.ListID, shopping_lists_messages.UserID, shopping_lists_messages.Message, shopping_lists_messages.CreatedOn, users.FirstName, users.LastName, users.Img
FROM            shopping_lists_messages INNER JOIN users 
				ON shopping_lists_messages.UserID = users.UserID
WHERE        (shopping_lists_messages.ListID = @ListID) AND (shopping_lists_messages.IsActive = 1)
ORDER BY  shopping_lists_messages.CreatedOn desc
Go

exec Proc_Get_Chat_Messages 45


Create Proc Proc_Create_Message
@ListID int,
@UserID int,
@Message nvarchar(150),
@CreatedOn datetime
AS
	INSERT INTO  [shopping_lists_messages]([ListID],[UserID],[CreatedOn],[Message],[IsActive])
								 VALUES (@ListID, @UserID,@CreatedOn, @Message, 1);
Go
--select* from [dbo].[shopping_lists_messages]


------------------------------------------------------------------members---------------------------------------------------------------------
 Alter Proc Proc_Get_List_Users
 @ListID int
 As
 SELECT shopping_lists_users.UserID, users.FirstName, users.LastName, users.Img,  users.Email, users.PhoneNumber, dbo.Func_Return_True_If_Creator_Of_List(@ListID,shopping_lists_users.UserID) As IsCreator
FROM     shopping_lists_users INNER JOIN
                  users ON dbo.shopping_lists_users.UserID = dbo.users.UserID
Where (shopping_lists_users.ListID = @ListID) And (shopping_lists_users.IsApproved = 1)
Go

--exec Proc_Get_List_Users 6
--select * from [shopping_lists_users]
--select * from users

 alter Proc Proc_Add_User_To_List
 @ListID int,
 @UserID int,
 @JoinedDate DateTime
 As
INSERT INTO [shopping_lists_users] ([ListID],[UserID],[JoinedDate])
						    VALUES (@ListID, @UserID,@JoinedDate);
Go
--exec Proc_Add_User_To_List 6,5

alter Proc Proc_Get_User_For_Search
@Email nvarchar (150),
@ListID int
As
Begin transaction
SELECT Email, FirstName, LastName, UserID,Img, NotificationToken, dbo.Func_Chack_Statuse_Of_Request(@Email,@ListID) AS IsApproved
FROM     users 
Where Email = @Email
IF @@ERROR<>0
		Begin
			rollback transaction
			return
		End
commit transaction
Go
--exec Proc_Get_User_For_Search 'test3@g.com', 87

-- Alter Proc Proc_User_Confirmation_Ofֹ_Joining 
-- @ListID int,
-- @UserID int,
-- @JoinedDate DateTime,
-- @IsApproved bit
-- As
-- If(@IsApproved = 1)
--	Begin
--		UPDATE [shopping_lists_users]
--		SET  ListID= @ListID, UserID = @UserID, [JoinedDate] = @JoinedDate, [IsApproved] = 1
--		WHERE ListID = @ListID And UserID= @UserID
--	End
--Else
--	Begin
--		Delete From [shopping_lists_users]
--		Where ListID = @ListID And UserID= @UserID
--	End
--Go

 --exec Proc_User_Confirmation_Ofֹ_Joining 6, 5, null,0


 ---------------------------- Requests -------------------------------------------------------+
 -- Drop proc Proc_Get_Requests_By_User
 Create Proc Proc_Get_Requests_By_User
 @UserID int
 As
	SELECT         shopping_lists_users.ListID, shopping_lists.Title, users.NotificationToken, users.FirstName, users.LastName
	FROM           shopping_lists INNER JOIN shopping_lists_users 
	ON shopping_lists.ListID = shopping_lists_users.ListID INNER JOIN users 
	ON shopping_lists.CreatorID = users.UserID
	WHERE        (shopping_lists_users.IsApproved = 0) AND (shopping_lists.IsActive = 1) AND (users.IsActive = 1) AND (shopping_lists_users.UserID = @UserID)
	ORDER BY shopping_lists_users.JoinedDate DESC
 GO
 -- exec Proc_Get_Requests_By_User 1

  -- Drop proc Proc_Confirm_Request
 Create Proc Proc_Confirm_Request
 @ListID int , 
 @UserID int,
 @JoinedDate DateTime
 As
		UPDATE [shopping_lists_users]
		SET  [JoinedDate] = @JoinedDate, [IsApproved] = 1
		WHERE ListID = @ListID And UserID= @UserID
 GO

 -- Drop proc Proc_Decline_Request
 Create Proc Proc_Decline_Request
 @ListID int , 
 @UserID int
 As
		Delete From [shopping_lists_users] WHERE ListID = @ListID And UserID= @UserID
 GO

 ---------------------------- Login -------------------------------------------------------+
 -- its for now until we will decide how we doing the page in the best way

 Create Proc Proc_Check_Login_Details
 @Email nvarchar(150), 
 @Password nvarchar(max)
 As
	Select [UserID],[Email],[FirstName],[LastName],[PhoneNumber],[Img],[IsActive],[NotificationToken] from [users] Where UPPER([Email]) = UPPER(@Email) AND [Password] = @Password AND [IsActive] = 1
 GO

 --Exec Proc_Check_Login_Details 'Test@g.com','test1234'

 Create Proc Proc_Update_User_Notification_Token
 @UserID int, 
 @NotificationToken nvarchar(max)
 As
 		UPDATE [users]
		SET  [NotificationToken] = @NotificationToken
		WHERE [UserID] = @UserID
 GO

 Create Proc Proc_CheckIfUserExistsByEmail
 @Email nvarchar(150)
 As
	Select FirstName from users Where Upper(Email) = Upper(@Email) And IsActive = 1
 GO

 Create Proc Proc_Update_Password
 @Email nvarchar(150),
 @Password nvarchar(max)
 As
		UPDATE [users]
		SET  [Password] = @Password
		WHERE Email = @Email
 GO

  ---------------------------- Register -------------------------------------------------------+

Create Proc Proc_Create_User
@FirstName  nvarchar(150),
@LastName  nvarchar(150),
@Email nvarchar(150),
@Password  nvarchar(max),
@PhoneNumber nvarchar(150),
@UserID int output
AS
set @UserID = -1
IF NOT EXISTS (Select * From [users] Where Upper(Email)=Upper(@Email)) 
Begin
    Insert[users] ([Email],[FirstName],[LastName],[Password],[PhoneNumber]) 
    values (@Email,@FirstName,@LastName,@Password,@PhoneNumber)
	set @UserID = @@identity
End 
Go


