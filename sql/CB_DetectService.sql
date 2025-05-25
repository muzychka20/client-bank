create proc CB_DetectService
	@naznp varchar(200),
	@client_id int,
	@location_id int,
	@on_login int
as
begin
	declare
		@service_id int = 0,
		@login int = 0,
		@work varchar(200) = ''

	if @on_login = 1 -- check login
	begin
		set @work = replace(@naznp, ' ', '')+'<0>'   -- 'Hello World'  -> 'HelloWorld<0>';  example: <18033>
		set @work = substring(@work, CHARINDEX('<', @work) + 1, abs(CHARINDEX('>', @work) - CHARINDEX('<', @work) - 1)) -- 'HelloWorld<example>Test' -> 'example'
		begin try
			set @login = convert(int, @work)
		end try
		begin catch
			set @login = 0
		end catch
		if @login > 0 select @client_id=isnull(id,0) from refClient where id = @login and dt0 < getdate() and dt1 > getdate()
		if @client_id > 0
		begin try
			select @service_id = isnull(id, 0) from wtServices where type=1 and dt0 < getdate() and dt1 > getdate() and client = @client_id
		end try
		begin catch
			set @service_id = 0
		end catch
	end 

	if @client_id > 0 and @service_id = 0
	begin try
		select @service_id = isnull(id, 0) from wtServices where type=1 and dt0 < getdate() and dt1 > getdate() and client = @client_id
	end try
	begin catch
		set @service_id = 0	
	end catch

	if @location_id > 0 and @service_id = 0
	begin try
		select @service_id = isnull(id, 0) from wtServicesInternet where location = @location_id
	end try
	begin catch
		set @service_id = 0
	end catch

	select @service_id
end

/*
USE [i_bill_serv2];
GRANT EXEC ON dbo.CB_DetectService TO PUBLIC
*/