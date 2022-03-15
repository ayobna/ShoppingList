create Proc Proc_Get_Products_By_ListId
@ListID int
AS
select *from [products]
where [ListID] = @ListID
Go

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

exec Proc_Get_List_CreatorId_By_ListID 55