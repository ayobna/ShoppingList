
-------------------------------------------------User----------------------------------------------

Create Proc Proc_Get_Users
AS
Select * From [users]
Go

--exec Proc_Get_Users

Create Proc Proc_Create_User
@Email nvarchar (150),
@FirstName nvarchar (150),
@LastName nvarchar (150),
@Password varchar(max),
@PhoneNumber nvarchar (150),
@Img nvarchar(max),
@IsActive bit,
@NotificationToken nvarchar(max),
@UserID int output
AS
IF NOT EXISTS (Select * From [users] Where Email=@Email or PhoneNumber=@PhoneNumber) 
Begin
    Insert [users] ([Email],[FirstName],[LastName],[Password],[PhoneNumber],[Img],[IsActive],[NotificationToken]) 
    values (@Email, @FirstName, @LastName, @Password, @PhoneNumber, @Img, @IsActive, @NotificationToken)
	set @UserID = @@identity 
End 
Go

--DECLARE @UserID int;
--exec Proc_Create_User 'test5@g.com','test4','test4', '12345', '1268',null,1,null, @UserID OUTPUT
--SELECT @UserID

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
		-- ���� �� �������� ���� ���� ������ ������� ����� ���� ��� ����
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
			FETCH NEXT FROM db_cursor INTO @productID -- ���� ������ ���
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
ORDER BY shopping_lists_messages.CreatedOn
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
 Create Proc Proc_Get_List_Users
 @ListID int,
 @UserID int
 As
 SELECT shopping_lists_users.UserID, users.FirstName, users.LastName, users.Img
FROM     shopping_lists_users INNER JOIN
                  users ON dbo.shopping_lists_users.UserID = dbo.users.UserID
Where (shopping_lists_users.ListID = @ListID) And (shopping_lists_users.IsApproved = 1) And (Not (shopping_lists_users.UserID = @UserID))
Go

--exec Proc_Get_List_Users 6,2
--select * from [shopping_lists_users]
--select * from users

 Create Proc Proc_Add_User_To_List
 @ListID int,
 @UserID int
 As
INSERT INTO [shopping_lists_users] ([ListID],[UserID],[JoinedDate],[IsApproved])
						    VALUES (@ListID, @UserID,GETDATE(), 0);
Go
--exec Proc_Add_User_To_List 6,5

 Create Proc Proc_User_Confirmation_Of�_Joining 
 @ListID int,
 @UserID int,
 @IsApproved bit
 As
 If(@IsApproved = 1)
	Begin
		UPDATE [shopping_lists_users]
		SET  ListID= @ListID, UserID = @UserID, [JoinedDate] = GETDATE(), [IsApproved] = 1
		WHERE ListID = @ListID And UserID= @UserID
	End
Else
	Begin
		Delete From [shopping_lists_users]
		Where ListID = @ListID And UserID= @UserID
	End
Go

 --exec Proc_User_Confirmation_Of�_Joining 6, 5, 0
