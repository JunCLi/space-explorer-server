exports.up = pgm => {
  //1. Users Table
  pgm.sql(`
    CREATE TABLE "space_explorer"."users" (
      "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "user_date_created" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
			"first_name" VARCHAR(128),
			"last_name" VARCHAR(128)
    );
	`)

	pgm.sql(`
    CREATE TABLE "space_explorer"."booked_trips" (
      "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "user_id" INT NOT NULL,
      "flight_number" INT NOT NULL,
      "status" VARCHAR(64) NOT NULL,
			"date_added" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
			"last_modified" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES space_explorer.users (id)
    );
	`)

	// pgm.sql(`
	// 	CREATE TABLE "space_explorer"."cancelled_trips" (
	// 		"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	// 		"user_id" INT NOT NULL,
	// 		"booked_trip_id" INT NOT NULL,
	// 		"flight_number" INT NOT NULL,
	// 		"date_added" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     FOREIGN KEY (user_id) REFERENCES space_explorer.users (id),
	// 		FOREIGN KEY (booked_trip_id) REFERENCES space_explorer.booked_trips(id)
	// 	)
	// `)
	
	pgm.sql(`
		CREATE TABLE "space_explorer"."blacklist_jwt" (
			"user_id" INT NOT NULL,
			"token" TEXT NOT NULL,
			"date_added" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
			"token_issued" BIGINT NOT NULL,
			"token_expiration" BIGINT NOT NULL
		);
	`)
};