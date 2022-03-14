


Insert  [shopping_lists]([CreatorID],[Title],[CreatedOn],[IsActive])  values (1,N'Milk',GETDATE(),1)
GO
Insert  [dbo].[shopping_lists_users] ([ListID],[UserID],[JoinedDate],[IsApproved])  values (6,2,GETDATE(),1)
GO