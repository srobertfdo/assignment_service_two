const { BlobServiceClient} = require("@azure/storage-blob");
const { AbortController } = require("@azure/abort-controller");
const Drive = use('Drive')
const ApplicationException = use('App/Exceptions/ApplicationException')
const Logger = use('Logger')

class BlobStorage {
  
    constructor (Config) {
      this.BS_CONFIG = Config.get('blobStorage')

      this.blobServiceClient = BlobServiceClient.fromConnectionString(this.BS_CONFIG.CONNECTTION_STRING)
      this.containerClient = this.blobServiceClient.getContainerClient(this.BS_CONFIG.CONTAINER);
    }

    async upload(blobName) {
      try {
        Logger.info('Upload Stream Starts...! %s', blobName);

        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        
        let uploadBlob = await blockBlobClient.uploadStream(Drive.getStream(blobName), 4 * 1024 * 1024, 20, {
          abortSignal: AbortController.timeout(30 * 60 * 1000), // Abort uploading with timeout in 30mins
          onProgress: (ev) => console.log(ev)
        });

        Logger.info("Upload Stream succeeds");
        
        if (uploadBlob && !!uploadBlob.requestId) {
          Logger.info('File Uploaded Successfully!');

          await Drive.delete(blobName)

          return true;
        } else {
          Logger.info('Error in file uploading!');

          return false
        }
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

    async download(blobName) {
      try {
        Logger.info('Downloaded blob content...! %s', blobName);

        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        const downloadBlockBlobResponse = await blockBlobClient.download(0); // download from 0 offset 

        let fileData = await streamToString(downloadBlockBlobResponse.readableStreamBody);

        //A helper function used to read a Node.js readable stream into a string
        async function streamToString(readableStream) {
          return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => {
              chunks.push(data.toString());
            });
            readableStream.on("end", () => {
              resolve(chunks.join(""));
            });
            readableStream.on("error", reject);
          });
        }

        return fileData;
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

    async delete(blobName) {
      try{
        Logger.info('Deleting blob content...! %s', blobName);

        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        const blobDeleteResponse = blockBlobClient.delete();
        
        Logger.info('blobDeleteResponse: %s', (await blobDeleteResponse).clientRequestId);

        return true;
      } catch (error) {
        throw new ApplicationException(error)
      }
    }

}
  
module.exports = BlobStorage