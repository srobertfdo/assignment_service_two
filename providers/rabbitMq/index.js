const rabbit = require('amqplib');
const UserFileDetailController = use('App/Controllers/Http/UserFileDetailController')
const Logger = use('Logger')
const ApplicationException = use('App/Exceptions/ApplicationException')

class RabbitMq {
  
    constructor (Config) {
      this.RMQ_CONFIG = Config.get('rabbitmq')
    }
    
    async consume() {
      try {
        Logger.info('Consumer starts...!');

        const connection = rabbit.connect(this.RMQ_CONFIG.URL);
  
        connection.then(async (conn)=>{
          const channel = await conn.createChannel();

          await channel.assertQueue(this.RMQ_CONFIG.QUEUE_NAME);

          channel.consume(this.RMQ_CONFIG.QUEUE_NAME, async (message)=>{
            Logger.info('Consumed Message:%s', message);

            let filetype = message.properties.headers['filetype']
            let bufferMessage = message.content

            Logger.info('Storing File Data...!');

            const ctrl = new UserFileDetailController()
            
            await ctrl.createOrUpdate({
              bufferMessage: bufferMessage,
              fileType: filetype,
              correlationId: message.properties.correlationId
            })
  
            Logger.info('Data Consumed!');
            channel.ack(message)
          })
        })        
      } catch (error) {
        throw new ApplicationException(error)
      }
    }
}
  
module.exports = RabbitMq