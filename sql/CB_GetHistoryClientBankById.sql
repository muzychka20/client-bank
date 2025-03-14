CREATE PROC CB_GetHistoryClientBankById
	@id int
AS
BEGIN
	SELECT kb.*, cl.keyname, dbo.[kir_GetAdressByLocation](gr.location) AS address FROM wtKlientBank AS kb
    LEFT JOIN wtServices AS s ON s.id = kb.service_id
    LEFT JOIN refClient AS cl ON cl.id = s.client
    LEFT JOIN wtGroups AS gr ON gr.group_id = s.id
    WHERE kb.id = @id
END

-- exec CB_GetHistoryClientBank '2024-09-29'