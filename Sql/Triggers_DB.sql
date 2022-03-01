-- Drop Trigger Trigger_Insert_Creator_Of_Shopping_List_To_shopping_list_users_table
Create Trigger Trigger_Insert_Creator_Of_Shopping_List_To_shopping_list_users_table
	On [shopping_lists] For Insert
As
	Declare @ListID int, @CreatorID int
	Set @ListID = (Select [ListID] from inserted)
	Set @CreatorID = (Select [CreatorID] from inserted)
	Insert [shopping_lists_users] ([ListID], [UserID], [JoinedDate], [IsApproved])
	Values (@ListID ,@CreatorID , GETDATE() , 1)
Go