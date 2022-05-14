--getting the list manager

create function Func_Return_True_If_Creator_Of_List(@listId int,@UserId int)
Returns bit
As
Begin
	If Exists (Select * From shopping_lists Where [ListID] = @listId And [CreatorID] = @UserId)
		Begin
			Return 1
		End
	Return 0
End
Go

--if a request was sent or not
create function Func_Chack_Statuse_Of_Request(@Email nvarchar (150), @listId int)
Returns int
As
Begin
	If Exists (SELECT * FROM users inner JOIN shopping_lists_users ON users.UserID = shopping_lists_users.UserID Where users.Email = @Email and shopping_lists_users.ListID = @ListID)
		Begin
			declare @isApproved bit 
			set @isApproved = (SELECT shopping_lists_users.IsApproved FROM users inner JOIN shopping_lists_users ON users.UserID = shopping_lists_users.UserID Where users.Email = @Email and shopping_lists_users.ListID = @ListID)
			If (@isApproved = 1)
				Begin
					Return 1
				End
			Else
				Begin
					Return 0
				End
		End
	Return 2
End
Go

-- get the amount of lists that the current user created
Create function Func_Return_Amount_Of_Lists_Created_By_CurrentUser(@UserId int)
Returns int
As
Begin
	return (Select Count(*) from [shopping_lists] Where [CreatorID] = @UserId And [IsActive] = 1)
End
Go

-- get the amount of lists that the current user shares but not their creator
Create function Func_Return_Amount_Of_Lists_Current_User_Shares_But_No_Creator(@UserId int)
Returns int
As
Begin

return (
SELECT  COUNT(*)
FROM            dbo.shopping_lists INNER JOIN
                         dbo.shopping_lists_users ON dbo.shopping_lists.ListID = dbo.shopping_lists_users.ListID
where        (dbo.shopping_lists_users.IsApproved = 1) AND (NOT (dbo.shopping_lists.CreatorID = @UserId)) AND (dbo.shopping_lists_users.UserID = @UserId) AND (dbo.shopping_lists.IsActive = 1)
)
End
Go

