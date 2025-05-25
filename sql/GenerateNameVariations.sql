alter  PROCEDURE GenerateNameVariations
AS
BEGIN
    CREATE TABLE #NameVariations (
        client_id int,
        original_name nvarchar(255),
        name_variation nvarchar(255)
    )

    ;WITH SplitNames AS (
        SELECT 
            id,
            keyname as full_name,
            LTRIM(RTRIM(
                SUBSTRING(keyname, 
                    1, 
                    CASE 
                        WHEN CHARINDEX(' ', keyname) > 0 THEN CHARINDEX(' ', keyname) 
                        ELSE LEN(keyname) 
                    END
                )
            )) as first_part,
            LTRIM(RTRIM(
                SUBSTRING(keyname, 
                    CASE 
                        WHEN CHARINDEX(' ', keyname) > 0 THEN CHARINDEX(' ', keyname) + 1
                        ELSE LEN(keyname) + 1
                    END,
                    CASE 
                        WHEN CHARINDEX(' ', keyname, CHARINDEX(' ', keyname) + 1) > 0 
                        THEN CHARINDEX(' ', keyname, CHARINDEX(' ', keyname) + 1) - CHARINDEX(' ', keyname) - 1
                        ELSE LEN(keyname)
                    END
                )
            )) as second_part,
            LTRIM(RTRIM(
                SUBSTRING(keyname,
                    CASE 
                        WHEN CHARINDEX(' ', keyname, CHARINDEX(' ', keyname) + 1) > 0 
                        THEN CHARINDEX(' ', keyname, CHARINDEX(' ', keyname) + 1) + 1
                        ELSE LEN(keyname) + 1
                    END,
                    LEN(keyname)
                )
            )) as third_part
        FROM refClient
        WHERE 
            keyname IS NOT NULL 
            AND keyname <> ''
            AND keyname NOT LIKE '%закрыт%'
            AND keyname NOT LIKE '%ЗАКРЫТ%'
            AND LEN(keyname) - LEN(REPLACE(keyname, ' ', '')) = 2
    )
    INSERT INTO #NameVariations
    SELECT 
        id,
        full_name,
        name_var
    FROM SplitNames
    CROSS APPLY (VALUES
        (first_part + ' ' + second_part + ' ' + third_part),
        (first_part + ' ' + third_part + ' ' + second_part),
        (second_part + ' ' + first_part + ' ' + third_part),
        (second_part + ' ' + third_part + ' ' + first_part),
        (third_part + ' ' + first_part + ' ' + second_part),
        (third_part + ' ' + second_part + ' ' + first_part)
    ) AS variations(name_var)
    WHERE third_part <> ''

    ;WITH SplitNamesUkr AS (
        SELECT 
            id,
            keyname_ukr as full_name,
            LTRIM(RTRIM(
                SUBSTRING(keyname_ukr, 
                    1, 
                    CASE 
                        WHEN CHARINDEX(' ', keyname_ukr) > 0 THEN CHARINDEX(' ', keyname_ukr) 
                        ELSE LEN(keyname_ukr) 
                    END
                )
            )) as first_part,
            LTRIM(RTRIM(
                SUBSTRING(keyname_ukr, 
                    CASE 
                        WHEN CHARINDEX(' ', keyname_ukr) > 0 THEN CHARINDEX(' ', keyname_ukr) + 1
                        ELSE LEN(keyname_ukr) + 1
                    END,
                    CASE 
                        WHEN CHARINDEX(' ', keyname_ukr, CHARINDEX(' ', keyname_ukr) + 1) > 0 
                        THEN CHARINDEX(' ', keyname_ukr, CHARINDEX(' ', keyname_ukr) + 1) - CHARINDEX(' ', keyname_ukr) - 1
                        ELSE LEN(keyname_ukr)
                    END
                )
            )) as second_part,
            LTRIM(RTRIM(
                SUBSTRING(keyname_ukr,
                    CASE 
                        WHEN CHARINDEX(' ', keyname_ukr, CHARINDEX(' ', keyname_ukr) + 1) > 0 
                        THEN CHARINDEX(' ', keyname_ukr, CHARINDEX(' ', keyname_ukr) + 1) + 1
                        ELSE LEN(keyname_ukr) + 1
                    END,
                    LEN(keyname_ukr)
                )
            )) as third_part
        FROM refClient
        WHERE 
            keyname_ukr IS NOT NULL 
            AND keyname_ukr <> ''
            AND keyname_ukr NOT LIKE '%закрыт%'
            AND keyname_ukr NOT LIKE '%ЗАКРЫТ%'
            AND keyname_ukr NOT LIKE '%закрит%'
            AND keyname_ukr NOT LIKE '%ЗАКРИТ%'
            AND LEN(keyname_ukr) - LEN(REPLACE(keyname_ukr, ' ', '')) = 2
    )
    INSERT INTO #NameVariations
    SELECT 
        id,
        full_name,
        name_var
    FROM SplitNamesUkr
    CROSS APPLY (VALUES
        (first_part + ' ' + second_part + ' ' + third_part),
        (first_part + ' ' + third_part + ' ' + second_part),
        (second_part + ' ' + first_part + ' ' + third_part),
        (second_part + ' ' + third_part + ' ' + first_part),
        (third_part + ' ' + first_part + ' ' + second_part),
        (third_part + ' ' + second_part + ' ' + first_part)
    ) AS variations(name_var)
    WHERE third_part <> ''

    
    truncate table refClient_AI
    
    insert into refClient_AI
    select DISTINCT 
        client_id,
        original_name,
        LTRIM(RTRIM(name_variation)) as name_variation
    FROM #NameVariations
    WHERE 
        name_variation IS NOT NULL 
        AND name_variation <> ''
        AND name_variation NOT LIKE '%закрыт%'
        AND name_variation NOT LIKE '%ЗАКРЫТ%'
        AND name_variation NOT LIKE '%закрит%'
        AND name_variation NOT LIKE '%ЗАКРИТ%'
        AND LEN(name_variation) - LEN(REPLACE(name_variation, ' ', '')) = 2
    ORDER BY client_id, name_variation

    DROP TABLE #NameVariations
END

-- EXEC GenerateNameVariations