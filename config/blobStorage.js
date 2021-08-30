'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  |
  |
  */
  CONNECTTION_STRING: Env.get('BLOBE_STORAGE_CONNECTTION_STRING'),
  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  |
  |
  */
  CONTAINER: Env.get('BLOBE_STORAGE_CONTAINER'),

}