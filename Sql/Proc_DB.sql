
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

Create Proc Proc_Get_All_Lists_Created_By_User
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


Create Proc Proc_Get_All_Lists_User_Is_A_Participant
@UserID int
AS
Select * From [shopping_lists_users]
where  [UserID]= @UserID
Go


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









