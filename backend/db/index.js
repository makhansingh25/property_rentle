const knex = require("knex");
const knexConfig = require("../knexfile");

const envirement = "development";
const db = knex(knexConfig[envirement]);

module.exports = db;
