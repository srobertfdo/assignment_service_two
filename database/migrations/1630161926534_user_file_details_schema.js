'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserFileDetailsSchema extends Schema {
  up () {
    this.create('user_file_details', (table) => {
      table.increments()
      table.string('uuid').unique()
      table.string('blob_name', 255).notNullable()
      table.string('file_type', 50).notNullable()
      table.boolean('status').defaultTo(1)
      table.boolean('is_deleted').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('user_file_details')
  }
}

module.exports = UserFileDetailsSchema
