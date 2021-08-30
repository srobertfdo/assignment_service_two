const { ServiceProvider } = require('@adonisjs/fold')

class ProtoBufferProvider extends ServiceProvider {
  register () {
    this.app.singleton('Robert/JsonToFile', () => {
      return new (require('.'))()
    })
  }
}

module.exports = ProtoBufferProvider