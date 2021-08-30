const json2csvConverter = require('json-2-csv');
const {parseString } = require('xml2js');
const  xml2js = require('xml2js');
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
          var builder = new xml2js.Builder({headless :true});
          fileData =  builder.buildObject(json);
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
          parseString(fileData, function (err, results) {
              json = results;
          });
        }

        return json
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

}
  
module.exports = JsonToFile