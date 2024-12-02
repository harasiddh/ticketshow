CREATE TABLE IF NOT EXISTS "user" (
	"id" INTEGER NOT NULL,
	"email" TEXT UNIQUE NOT NULL,
	"password" TEXT NOT NULL,
	"active" INTEGER NOT NULL,
	"fs_uniquifier" TEXT NOT NULL,
	"account_balance" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "role" (
	"id" INTEGER NOT NULL,
	"name" TEXT UNIQUE NOT NULL,
	"description" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "roles_users" (
	"id" INTEGER NOT NULL,
	"user_id" INTEGER NOT NULL,
	"role_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("role_id") REFERENCES "role"("id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "theatre" (
	"id" INTEGER NOT NULL,
	"name" TEXT NOT NULL,
	"location" TEXT NOT NULL,
	"picture" TEXT NOT NULL,
	"theatre_base_price" INTEGER NOT NULL,
	"seating_capacity" INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "movie" (
	"id" INTEGER NOT NULL,
	"title" TEXT NOT NULL,
	"poster" TEXT NOT NULL,
	"genre" TEXT NOT NULL,
	"duration" INTEGER NOT NULL,
	"movie_price" INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "screening" (
	"id"	INTEGER NOT NULL,
	"theatre_name"	TEXT NOT NULL,
	"movie_title"	TEXT NOT NULL,
	"seats_available"	INTEGER NOT NULL,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"ticket_price"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("theatre_name") REFERENCES "theatre"("name"),
	FOREIGN KEY("movie_title") REFERENCES "movie"("title")
);

CREATE TABLE IF NOT EXISTS "booking" (
    "id" INTEGER NOT NULL,
	"screening_id" INTEGER NOT NULL,
	"user_email" TEXT NOT NULL,
	"tickets_booked" INTEGER NOT NULL,
	"amount_paid"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("screening_id") REFERENCES "screenings"("id"),
	FOREIGN KEY("user_email") REFERENCES "user"("email")
);
-- Insert roles
INSERT OR IGNORE INTO role (name, description) VALUES ('admin', 'Administrator role');
INSERT OR IGNORE INTO role (name, description) VALUES ('user', 'User role');

-- Insert admin user
INSERT OR IGNORE INTO user (email, password, active, fs_uniquifier) 
VALUES ('admin@ticketshow.com', 'admin@ticketshow.com', 1, 'lGSYN8YJqq50jSXKp64fKg');

-- Assign admin role to the admin user
INSERT OR IGNORE INTO roles_users (user_id, role_id)
SELECT user.id, role.id
FROM user
JOIN role ON role.name = 'admin'
WHERE user.email = 'admin@ticketshow.com';

-- Create a trigger to automatically assign the 'user' role to new users
CREATE TRIGGER IF NOT EXISTS assign_user_role
AFTER INSERT ON user
BEGIN
    INSERT OR IGNORE INTO roles_users (user_id, role_id)
    SELECT NEW.id, role.id
    FROM role
    WHERE role.name = 'user';
END;