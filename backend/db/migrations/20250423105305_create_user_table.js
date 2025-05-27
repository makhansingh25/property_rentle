exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("google_id").unique();
    table
      .string("image")
      .defaultTo(
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
      );
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function (knex) {
//   return knex.schema.createTable("rooms", function (table) {
//     table.increments("id").primary();
//     table.string("image");
//     table.string("price").nullable();
//     table.string("name").notNullable();
//     table.string("location").notNullable();
//     table.string("room").notNullable();
//     table.string("bathroom").notNullable();
//     table.boolean("ac").nullable();
//     table.boolean("freeze").nullable();
//     table.boolean("heater").nullable();

//     table
//       .integer("user_id")
//       .unsigned()
//       .references("id")
//       .inTable("users")
//       .onDelete("CASCADE");

//     table.timestamps(true, true);
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTableIfExists("rooms");
// };
