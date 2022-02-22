
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
Select * From [shopping_lists]
where CreatorID = @CreatorID
Go


Create Proc Proc_Get_All_Lists_User_Is_A_Participant
@UserID int
AS
Select * From [shopping_lists_users]
where  [UserID]= @UserID
Go
