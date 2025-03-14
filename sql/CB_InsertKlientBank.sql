ALTER PROCEDURE [dbo].[CB_InsertKlientBank]
    @mfo VARCHAR(9),
    @dt DATETIME,
    @NumDoc VARCHAR(20), 
    @Summa MONEY,
    @NameB VARCHAR(50), 
    @NaznP VARCHAR(200),
    @service_id INT,
    @username VARCHAR(50) = ''
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @dt0 DATETIME = dbo.udf_RoundDay(@dt);
    DECLARE @dt1 DATETIME = DATEADD(DAY, 1 , @dt0);
    DECLARE @dt_load DATETIME = GETDATE();
    DECLARE @res INT = 0;
    
    DECLARE @kb_id TABLE (ID INT);

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM wtKlientBank WHERE NumDoc = @NumDoc AND Summa = @Summa)
        BEGIN
            INSERT INTO wtKlientBank ([Date], [NumDoc], [Summa], [MfoA], [NameB], [NaznP], [dt_load], [status], [user_name], [rfo_id], payment_id, service_id) 
            OUTPUT INSERTED.ID INTO @kb_id
            VALUES (@dt, @NumDoc, @Summa, @mfo, @NameB, @NaznP, @dt_load, 1, @username, 0, 0, @service_id);

            SELECT @res = ID FROM @kb_id;

            DECLARE @payment_result INT;
            EXEC @payment_result = ui_InsertKlientBankPayments @res, @username;
        END;
        ELSE
        BEGIN
            SET @res = -1;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @res = 0;
    END CATCH;

    SELECT @res;
END;
