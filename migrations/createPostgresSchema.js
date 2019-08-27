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
};