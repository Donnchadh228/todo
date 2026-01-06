
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'todo')
BEGIN
    CREATE DATABASE todo;
    PRINT 'Database "todo" created successfully.';
END
ELSE
BEGIN
    PRINT 'Database "todo" already exists.';
END
GO