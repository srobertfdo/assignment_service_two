const protoBuffer = require('protobufjs');
const ApplicationException = use('App/Exceptions/ApplicationException')

class ProtoBuffer {
  
    constructor () {
    }

    async verify(obj) {
      try {
        const root = await protoBuffer.load('./providers/protoBuffer/user.proto');

        const User = root.lookupType('userpackage.User');

        return User.verify(obj)
      } catch (error) {
          throw new ApplicationException(error)
      }
    }
    
    async encode(obj) {
      try {
        const root = await protoBuffer.load('./providers/protoBuffer/user.proto');

        const User = root.lookupType('userpackage.User');

        return User.encode(obj).finish()
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

    async decode(buf) {
      try {
        const root = await protoBuffer.load('./providers/protoBuffer/user.proto');

        const User = root.lookupType('userpackage.User');

        return User.decode(buf)
      } catch (error) {
        console.log('error',error)
        throw new ApplicationException(error)
      }
    }
    
}
  
module.exports = ProtoBuffer