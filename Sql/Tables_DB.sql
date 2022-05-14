
----------------------------------------------- Tables -----------------------------------------------------
-- Drop Table users
CREATE TABLE users  
(
	 UserID int identity not null,
	 Email nvarchar (150) unique not null,
	 FirstName nvarchar(150) not null,
	 LastName nvarchar(150) not null,	
	Password varbinary(max) NOT NULL,
	 PhoneNumber nvarchar(150) null,
	 Img nvarchar(max) default 'user_default/user_default.png',
	 IsActive bit default 1,
	 NotificationToken nvarchar(max)
)
GO


-- Drop Table shopping_lists
CREATE TABLE shopping_lists  
(
	 ListID int identity not null,
	 CreatorID int not null,
	 Title nvarchar (150) not null,
	 CreatedOn DateTime not null,
	 IsActive bit default 1,
)
GO

-- Drop Table products
CREATE TABLE products  
(
	 ProductID int identity not null,
	 ListID int not null,
	 CreatorID int not null,
	 [Name] nvarchar (150) not null,
	 Amount int not null,
	 Img nvarchar(max) default 'default/default_img.jpg',
	 CreatedOn DateTime not null,
	 IsChecked bit default 0,
	 IsActive bit default 1
)
GO



-- Drop Table shopping_lists_users
CREATE TABLE shopping_lists_users
(
	 ListID int not null,
	 UserID int not null,
	 --Title nvarchar (150) not null,
	 JoinedDate DateTime not null,
	 IsApproved bit default 0
)
GO


-- Drop Table shopping_lists_messages
CREATE TABLE shopping_lists_messages
(
	 ListID int not null,
	 UserID int not null,
	 CreatedOn DateTime not null,
	 [Message] nvarchar (150) not null,
	 IsActive bit default 1
)
GO


select*from users
----------------------------------------------- Primary Keys -----------------------------------------------------

ALTER TABLE users 
ADD
Constraint pk_users_UserID Primary key (UserID) 
GO

ALTER TABLE shopping_lists
ADD
Constraint pk_shopping_lists_ListID Primary key (ListID) 
GO


ALTER TABLE products
ADD
Constraint pk_products_ProductID Primary key (ProductID) 
GO

ALTER TABLE shopping_lists_users 
ADD
Constraint pk_shopping_lists_users_ListID_UserID Primary key (ListID, UserID) 
GO

ALTER TABLE shopping_lists_messages
ADD
Constraint pk_shopping_lists_messages_ListID_UserID_CreatedOn Primary key (ListID, UserID,CreatedOn) 
GO


----------------------------------------------- foreign Keys -----------------------------------------------------

ALTER TABLE shopping_lists
ADD
CONSTRAINT [fk_shopping_lists_CreatorID_users_UserID] FOREIGN KEY 
	       (CreatorID) REFERENCES 
                users ([UserID])
go


ALTER TABLE [products]
ADD
CONSTRAINT [fk_products_ListID_shopping_lists_ListID] FOREIGN KEY 
	       (ListID) REFERENCES 
                shopping_lists (ListID),
CONSTRAINT [fk_products_CreatorID_users_UserID] FOREIGN KEY 
	       (CreatorID) REFERENCES 
                users (UserID)
go

ALTER TABLE [shopping_lists_users]
ADD
CONSTRAINT [fk_shopping_lists_users_ListID_shopping_lists_ListID] FOREIGN KEY 
	       (ListID) REFERENCES 
                shopping_lists (ListID),
CONSTRAINT [fk_shopping_lists_users_UserID_users_UserID] FOREIGN KEY 
	       (UserID) REFERENCES 
                users (UserID)
go

ALTER TABLE [shopping_lists_messages]
ADD
CONSTRAINT [fk_shopping_lists_messages_ListID_shopping_lists_ListID] FOREIGN KEY 
	       (ListID) REFERENCES 
                shopping_lists (ListID),
CONSTRAINT [fk_shopping_lists_messages_UserID_users_UserID] FOREIGN KEY 
	       (UserID) REFERENCES 
                users (UserID)
go

-------------------------------------------------------------------------------------------------Proc--------------------------------------------------------------------------------------


-------------------------------------------------User----------------------------------------------

Create Proc Proc_Get_Users
AS
Select * From [users]
Go

--exec Proc_Get_Users

create Proc Proc_Create_User
@Email nvarchar (150),
@FirstName nvarchar (150),
@LastName nvarchar (150),
@Password nvarchar(max),
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
--exec Proc_Create_User 'test4@g.com','test4','test4', '12345', '123458',null,1,null, @UserID OUTPUT
--SELECT @UserID

Create proc Proc_Get_User_By_Id
	@UserID int
as
	select  UserID,[Email],[FirstName],[LastName],[Password],[PhoneNumber],[Img],[IsActive],[NotificationToken]from users where UserID = @UserID
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


