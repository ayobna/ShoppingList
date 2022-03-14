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