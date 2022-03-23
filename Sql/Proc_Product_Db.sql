Alter Proc Proc_Get_Products_By_ListId
@ListID int
AS
select *from [products]
where [ListID] = @ListID  and IsActive =1 
Go
exec Proc_Get_Products_By_ListId 59
--create Proc Proc_Get_Products_By_ListId
--@ListID int
--AS
--select *from [products]
--where [ListID] = @ListID and IsActive =1
--Go

--exec Proc_Get_Products_By_ListId 45




Create Proc Proc_Update_Product_By_ProductId_And_CreatorID
@ProductID int,
@CreatorID int,
@Name nvarchar(150),
@Amount int ,
@Img nvarchar(150),
@IsActive bit
AS
UPDATE [products]
	SET  Img =@Img , Amount=@Amount,[Name]=@Name,[IsActive] =@IsActive
	WHERE [ProductID] =@ProductID  and CreatorID=@CreatorID;
Go

exec Proc_Update_Product_By_ProductId_And_CreatorID 64,1



Create Proc Proc_Get_List_Creator_By_ListID
@ListID int
AS
select *from [shopping_lists]
where [ListID]=@ListID
go

--exec Proc_Get_List_CreatorId_By_ListID 55


alter Proc Proc_Delete_Product_By_ID
@ProductID int
AS
		UPDATE [products]
	SET [IsActive]=0
	WHERE [ProductID] =@ProductID  
go



alter Proc Proc_Checked_Product_By_ID
@ProductID int
AS
	UPDATE [products]
	SET [IsChecked]=1
	WHERE [ProductID] =@ProductID  
go


alter Proc Proc_Un_Checked_Product_By_ID
@ProductID int
AS
	UPDATE [products]
	SET [IsChecked]=0
	WHERE [ProductID] =@ProductID  
go

Create Proc Proc_Insert_User
@FirstName  nvarchar(150),
@LastName  nvarchar(150),
@Email nvarchar(150),
@Password  nvarchar(150),
@PhoneNumber nvarchar(150),
@UserID int output
AS
IF NOT EXISTS (Select * From [users] Where Email=@Email or PhoneNumber=@PhoneNumber) 
Begin
    Insert[users] ([Email],[FirstName],[LastName],[Password],[PhoneNumber]) 
    values (@Email,@FirstName,@LastName,@Password,@PhoneNumber)
	set @UserID = @@identity
End 
Go


DECLARE @UserID int;
exec Proc_Insert_User 'ayob','nas','as@g.com','asd1234','0502158', @UserID OUTPUT
SELECT @UserID
