const json2csvConverter = require('json-2-csv');
const json2xmlConverter = require('xml-js');
const xml2jsConverter = require('xml2js');
const ApplicationException = use('App/Exceptions/ApplicationException')

class JsonToFile {
  
    constructor () {
    }

    async convert(json, type) {
      try {
        let fileData;

        if(type.toLowerCase() == 'csv') {
          fileData = await json2csvConverter.json2csvAsync(json)
        }

        if(type.toLowerCase() == 'xml'){
          var options = {compact: true, ignoreComment: true, spaces: 4};
          fileData = await json2xmlConverter.json2xml(json, options)
        }

        return  fileData;
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

    async revert(fileData, type) {
      try {
        let json;

        if(type.toLowerCase() == 'csv') {
          json = json2csvConverter.csv2jsonAsync(fileData)
        }

        if(type.toLowerCase() == 'xml'){
          console.log('fileData', fileData)

          var options = {compact: true, ignoreComment: true, spaces: 4};
          json = json2xmlConverter.xml2json(fileData, options)
        }

        return json
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

}
  
module.exports = JsonToFile