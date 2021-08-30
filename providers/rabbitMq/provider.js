const { ServiceProvider } = require('@adonisjs/fold')

class RabbitMqProvider extends ServiceProvider {
  register () {
    this.app.singleton('Robert/RabbitMq', () => {
      const Config = this.app.use('Adonis/Src/Config')

      return new (require('.'))(Config)
    })
  }

  boot () {
    const Config = this.app.use('Adonis/Src/Config')

    const RabbitMq = new (require('.'))(Config)
        
    RabbitMq.consume()
  }
}

module.exports = RabbitMqProvider