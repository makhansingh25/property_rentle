exports.up = function (knex) {
  return knex.schema.createTable("bookmarks", function (table) {
    table.increments("id").primary();
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
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("bookmarks");
};
