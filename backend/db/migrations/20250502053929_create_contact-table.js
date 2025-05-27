/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("message", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("mobile").notNullable();
    table.string("email").notNullable();
    table.text("message").notNullable();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("property_id")
      .unsigned()
      .references("id")
      .inTable("rooms")
      .onDelete("CASCADE");
    table
      .integer("Receiver")
      .unsigned()
      .references("user_id")
      .inTable("rooms")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("message");
};
