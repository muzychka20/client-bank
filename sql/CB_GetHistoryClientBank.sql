CREATE PROC CB_GetHistoryClientBank
	@date VARCHAR(10)
AS
BEGIN
	SELECT kb.*, cl.keyname, dbo.[kir_GetAdressByLocation](gr.location) AS address FROM wtKlientBank AS kb
    LEFT JOIN wtServices AS s ON s.id = kb.service_id
    LEFT JOIN refClient AS cl ON cl.id = s.client
    LEFT JOIN wtGroups AS gr ON gr.group_id = s.id					
    WHERE CAST(kb.Date AS DATE) = @date
END

-- exec CB_GetHistoryClientBank '2024-09-29'