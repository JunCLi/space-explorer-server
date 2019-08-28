exports.up = pgm => {
  //1. Users Table
  pgm.sql(`
    CREATE TABLE "space_explorer"."users" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "user_date_created" DATE NOT NULL DEFAULT CURRENT_DATE,
			"first_name" VARCHAR(128),
			"last_name" VARCHAR(128)
    );
	`)

	pgm.sql(`
    CREATE TABLE "space_explorer"."trip_booking" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INT NOT NULL,
      "flight_number" INT NOT NULL,
      "status" VARCHAR(64) NOT NULL,
      "date_added" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES space_explorer.users (id)
    )
  `)
};