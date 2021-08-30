'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ApplicationException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = ApplicationException
