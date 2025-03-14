alter PROCEDURE [dbo].[CB_InsertKlientBank]
	@mfo varchar(9),
	@dt datetime,
	@NumDoc varchar(20), 
	@Summa money,
	@NameB varchar(50), 
	@NaznP varchar(200),
	@username varchar(50) = ''	
AS
BEGIN	
	SET NOCOUNT ON
	SET FMTONLY OFF

    declare @dt0 datetime = dbo.udf_RoundDay(@dt)
	declare @dt1 datetime = dateadd(day, 1 , @dt0),
			@dt_load datetime = getdate(),
			@res int = 0,
			@kb_id int

	begin try
	begin tran tins	
		if isnull((select top 1 id from wtKlientbank where MfoA=@mfo 
				and Date >= @dt0 and Date < @dt1
				and NumDoc = @NumDoc
				and Summa = @Summa
				and NameB = @NameB
				and NaznP = @NaznP),0) = 0
		begin
			insert into wtKlientBank ([Date],[NumDoc],[Summa],[MfoA],[NameB],[NaznP],[dt_load],[status], [user_name], [rfo_id], payment_id) 
			values (@dt, @NumDoc, @Summa, @mfo, @NameB, @NaznP,@dt_load, 1, @username, 0, 0)
			set @kb_id = SCOPE_IDENTITY()
			exec ui_InsertKlientBankPayments  @kb_id, @username
			set @res = 1
		end
	commit tran tins;
	end try
	begin catch
		rollback tran;
	end catch;
	return @res
END


