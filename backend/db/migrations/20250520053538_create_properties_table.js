/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rooms", function (table) {
    table.increments("id").primary();
    table.string("image").notNullable;
    table.string("price").notNullable();
    table.string("name").notNullable();
    table.string("location").notNullable();
    table.string("room").notNullable();
    table.string("bathroom").notNullable();
    table.boolean("ac").nullable();
    table.boolean("freeze").nullable();
    table.boolean("heater").nullable();

    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.hasTable("rooms").then(function (exists) {
    if (exists) {
      return knex.schema.dropTable("rooms");
    }
  });
};
;
