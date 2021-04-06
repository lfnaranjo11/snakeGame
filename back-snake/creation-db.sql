CREATE USER IF NOT EXISTS maxroach;
CREATE DATABASE game;
CREATE TABLE game.scores (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), points DECIMAL,username VARCHAR);
GRANT ALL ON DATABASE game TO maxroach;
GRANT ALL ON game.scores TO maxroach;
INSERT INTO game.scores (id,Points, userName) VALUES (000000000026,'10','jose');
DEFAULT gen_random_uuid()