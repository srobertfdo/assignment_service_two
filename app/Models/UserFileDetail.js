'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
// const { v4: uuidv4 } = require('uuid');

class UserFileDetail extends Model {
    static boot () {
        super.boot()

        // this.addHook('beforeCreate', async (userInstance) => {
        //     userInstance.uuid = await uuidv4()
        // })
    }
}

module.exports = UserFileDetail
