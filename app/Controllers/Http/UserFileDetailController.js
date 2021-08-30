'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const UserFileDetailModel = use('App/Models/UserFileDetail')
const ProtoBuffer = use('Robert/ProtoBuffer')
const Json2File = use('Robert/JsonToFile')
const BlobStorage = use('Robert/blobStorage')
const Drive = use('Drive')
const ApplicationException = use('App/Exceptions/ApplicationException')
const Encryption = use('Encryption')

class UserFileDetailController {
    async createOrUpdate(request) {
        try {
            let UserFileDetails;
            let {fileType, correlationId, bufferMessage} = request
            let blobName = Date.now()+'user.'+fileType.toLowerCase()

            // Decode Google Proto buffer
            let jsonRes = await ProtoBuffer.decode(bufferMessage);

            // Convert Json to csv/xml file
            let Json2FileRes = await Json2File.convert(jsonRes, fileType)

            // If UserFileDetails is not null and the file type is same, then update the exiting file in blob storage
            // Else remove the old file from blob storage

            UserFileDetails = await UserFileDetailModel.query().where({'uuid': correlationId, 'is_deleted':0}).first()

            if(UserFileDetails){
                if(UserFileDetails.file_type == fileType.toLowerCase()){
                    blobName = UserFileDetails.blob_name
                } else {
                    // remove old file from blob storage
                    await BlobStorage.delete(UserFileDetails.blob_name)
                }
            } 

            // Store file in temp folder
            await Drive.put(blobName, Json2FileRes)

            // upload to blob storage
            await BlobStorage.upload(blobName)

            // Update or create record in database
            if(UserFileDetails){
                UserFileDetails = await UserFileDetailModel
                    .query()
                    .where('uuid', correlationId)
                    .update({ 
                        blob_name: blobName,
                        file_type : fileType,
                    })
            } else (
                UserFileDetails = await UserFileDetailModel.create({
                    blob_name : blobName,
                    file_type : fileType,
                    uuid : correlationId,
                })
            )

            return UserFileDetails;
        } catch (error) {
            throw new ApplicationException(error)
        }
    }

    async getUserFileDataById({ params, request, response }) {
        try {
            let UserFileDetails = await UserFileDetailModel.query()
                                        .select('uuid', 'blob_name', 'file_type', 'created_at', 'updated_at')
                                        .where({'uuid': params.id, 'is_deleted':0})
                                        .first()

            if(UserFileDetails){
                // Download file from blob storage
                let BlobStorageRes = await BlobStorage.download(UserFileDetails.blob_name)

                // Convert csv/xml file to json
                let FileToJsonRes = await Json2File.revert(BlobStorageRes, UserFileDetails.file_type)
                
                UserFileDetails.FileData = FileToJsonRes
                
                return response
                    .status(200)
                    .send({ 
                        message: 'User file details!',  
                        data: Encryption.encrypt(JSON.stringify(UserFileDetails))
                    })
            } else {
                return response
                    .status(400)
                    .send({ 
                        message: 'User file not found!',  
                    })
            }
            
        } catch (error) {
            throw new ApplicationException(error)
        }
    }

    async getAllUserFiles({ params, request, response }) {
        try {
            const query = request.get()
            let page = query.page | 1

            let UserFileDetails = await UserFileDetailModel
                .query()
                .select('uuid', 'blob_name', 'file_type', 'created_at', 'updated_at')
                .where({
                    'is_deleted': 0,
                    "status": 1
                })
                .paginate(page)

            return response
                .status(200)
                .send({ 
                    message: 'All user file details!',  
                    data: UserFileDetails 
                })
            
        } catch (error) {
            throw new ApplicationException(error)
        }
    }
}

module.exports = UserFileDetailController
