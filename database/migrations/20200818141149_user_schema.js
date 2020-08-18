
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id')

    table.string('username',30)
        .notNullable()
        .unique()
        .index()
    
    table.string('password',50).notNullable()

    table.string('department', 64).notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
