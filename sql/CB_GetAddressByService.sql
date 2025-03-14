alter PROC CB_GetAddressByService
	@service_id int
AS
BEGIN
	SELECT l.room as room, l.id as room_id, h.house as house, h.id as id, st.keyname as street, st.id as street_od, c.name as city, c.id as city_id, cl.keyname as client, cl.id as client_id
	FROM wtServices as s
	LEFT JOIN wtGroups as gr on gr.group_id = s.group_id
	LEFT JOIN refClient as cl on cl.id = s.client
	LEFT JOIN refLocation as l on l.id = gr.location
	LEFT JOIN refHouse as h on h.id = l.house
	LEFT JOIN refStreet as st on st.id = h.street
	LEFT JOIN refCity as c on c.id = st.city
	WHERE s.id = @service_id
END


-- exec CB_GetAddressByService 18033
-- exec CB_GetAddressByService 54940
-- exec CB_GetAddressByService 102041