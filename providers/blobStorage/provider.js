const { ServiceProvider } = require('@adonisjs/fold')

class ProtoBufferProvider extends ServiceProvider {
  register () {
    this.app.singleton('Robert/blobStorage', () => {
      const Config = this.app.use('Adonis/Src/Config')

      return new (require('.'))(Config)
    })
  }
}

module.exports = ProtoBufferProvider