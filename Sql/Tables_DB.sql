
----------------------------------------------- Tables -----------------------------------------------------
-- Drop Table users
CREATE TABLE users  
(
	 UserID int identity not null,
	 Email nvarchar (150) unique not null,
	 FirstName nvarchar(150) not null,
	 LastName nvarchar(150) not null,
	 Password nvarchar(max),
	 PhoneNumber nvarchar(150) null,
	 Img nvarchar(max) default 'user_default/user_default.png',
	 IsActive bit default 1,
	 NotificationToken nvarchar(max)
)
GO


-- Drop Table users
CREATE TABLE shopping_lists  
(
	 ListID int identity not null,
	 CreatorID int not null,
	 Title nvarchar (150) not null,
	 CreatedOn DateTime not null,
	 IsActive bit default 1,
)
GO

-- Drop Table users
CREATE TABLE products  
(
	 ProductID int identity not null,
	 CreatorID int not null,
	 [Name] nvarchar (150) not null,
	 Amount int not null,
	 Img nvarchar(max) default 'user_default/user_default.png',
	 CreatedOn DateTime not null,
	 IsActive bit default 1,

)
GO

-- Drop Table users
CREATE TABLE shopping_lists_users
(
	 ListID int identity not null,
	 UserID int not null,
	 Title nvarchar (150) not null,
	 JoinedDate DateTime not null,
	 IsApproved bit default 0
)
GO


-- Drop Table users
CREATE TABLE shopping_lists_messages
(
	 ListID int identity not null,
	 UserID int not null,
	 [Message] nvarchar (150) not null,
	 CreatedOn DateTime not null,
	 IsActive bit default 1
)
GO



----------------------------------------------- Primary Keys -----------------------------------------------------

ALTER TABLE users 
ADD
Constraint pk_users_UserID Primary key (UserID) 
GO

ALTER TABLE shopping_lists
ADD
Constraint pk_shopping_lists_ListID Primary key (ListID) 
GO


ALTER TABLE shopping_lists
ADD
Constraint pk_shopping_lists_ListID Primary key (ListID) 
GO
