ALTER PROCEDURE [dbo].[ui_InsertKlientBankPayments] --3, 'grisha'
	@kb_id int,
	@username varchar(50)
AS
begin
	SET NOCOUNT ON

	 declare 
		@client_id int = 0,
		@docno int,
		@service_id int = 0,
		@service_old int = 0,
		@optype int = 1,
		@dt datetime = getdate(),
		@dt_p datetime,
		@rfo_id int = 0,
		@amount money = 0,
		@payment_id int = 0,
		@notes varchar(500) = '',
		@result bit = 0,
		@status int = 0, 
		@NameB varchar(50) = '',
		@paytype_id int = 0,
		@user_fio varchar(100) = '',
		@user_id int = 0,
		@user_fio_old varchar(100) = '',
		@naznp varchar(200) = '',
		@dt_plat datetime = getdate(),
		@fp_plat datetime
 
	 declare @serviceNoname int = 93238
 
	 set @dt_p=dbo.udf_RoundDay(@dt);
	 select @user_fio = isnull(fio, 'ЛК'), @user_id = isnull(id, 145) from refUser where name = @username
	 
	 begin try
		begin tran t1
			select @client_id=s.client, 
				   @service_id = isnull(s.group_id,0),
				   @rfo_id = isnull(kb.rfo_id,0), 
				   @service_old = isnull(pn.service,0), 
				   @amount = kb.Summa,
				   @payment_id = isnull(pn.id, 0),
				   @notes = isnull(pn.notes,''),
				   @status = isnull(kb.status,3),
				   @NameB = kb.NameB,
				   @user_fio_old = ru.fio,
				   @naznp = kb.NaznP,
				   @dt_plat = dbo.udf_RoundDay(kb.Date)
			from wtServices s
				left join wtKlientBank kb on kb.service_id = s.group_id
				left join wtRFOnew rfo on rfo.id = kb.rfo_id
				left join wtPaymentNew pn on pn.rfo = rfo.id
				left join refUser ru on ru.name=kb.user_name 
			where kb.id=@kb_id

			set @fp_plat=dbo.udf_RoundMonth(@dt_plat);

			if @service_id > 0 and @status != 3 -- Удаленный платеж
			begin				
				if @service_old = @serviceNoname -- был Клиент-банк до выяснения?
				begin -- да
					if @service_id != @serviceNoname set @notes = @notes + ' Реальный владелец платежа выяснен ' + convert(varchar(30),@dt, 105) + '. Выполнил(а) ' + @user_fio
					update wtPaymentNew set client = @client_id, service = @service_id, notes = @notes where id = @payment_id and amount = @amount
					update wtRFOnew set client = @client_id, notes = @notes where id = @rfo_id and amount = @amount
					set @result = 1
					execute ui_RefreshClientBalance @client_id -- моментальное отражение в балансе
				end
				else -- нет - Это реальный клиент
				begin
					if @rfo_id = 0 and @payment_id = 0 and @status = 1
					begin
						set @notes = @naznp + ' --> ' + (case @service_id when @serviceNoname then 'Платеж по клиент-банк проведен до выяснения!' else 'Платеж проанализирован! Выполнил(а) ' + @user_fio_old end)
						select @paytype_id = isnull(id,0) from refPaymentType where klient_bank_nameb = @NameB 
						if @paytype_id > 0
						begin
							execute dbo.[udp_GenDay] 'KB-',@dt_p,@gen=@docno output -- Получение номера документа
							insert into wtRFOnew(amount, client, docno, dt, is_debit, notes, optype, p_type, i_user, i_user_id) values (@amount, @client_id, ISNULL(@docno,''), @dt_plat, 1, @notes, @optype, @paytype_id, @user_fio, @user_id)
 							set @rfo_id=(select top 1 SCOPE_IDENTITY() from wtRFOnew);
 
							insert into wtPaymentNew(dt, fp, client, ptype, destination, amount, pk_no, pko_dt, notes, idt, usr, rfo, service)
								values(@dt_plat, @fp_plat, @client_id, @paytype_id, 1, @amount, @docno, @dt_p, @notes, @dt, @user_fio, @rfo_id, @service_id)
							set @payment_id=(select top 1 SCOPE_IDENTITY() from wtPaymentNew);
							
							update wtKlientBank set rfo_id = @rfo_id, payment_id = @payment_id, status = 5 where id = @kb_id
							set @result = 1
							execute ui_RefreshClientBalance @client_id -- моментальное отражение в балансе
						end
					end 
				end	
			end
    		commit tran t1;
	end try
	begin catch
		print error_message();
		rollback tran;
		set @result = 0
	end catch;
	select @result as result
end;

--exec [dbo].[ui_InsertKlientBankPayments] 3, 'grisha'