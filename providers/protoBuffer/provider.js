const { ServiceProvider } = require('@adonisjs/fold')

class ProtoBufferProvider extends ServiceProvider {
  register () {
    this.app.singleton('Robert/ProtoBuffer', () => {
      return new (require('.'))()
    })
  }
}

module.exports = ProtoBufferProvider