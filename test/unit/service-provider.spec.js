'use strict'

const { test } = use('Test/Suite')('Service Providers Test')

const RabbitMq = use('Robert/RabbitMq')
const ProtoBuffer = use('Robert/ProtoBuffer')
const Json2File = use('Robert/JsonToFile')
const BlobStorage = use('Robert/blobStorage')
const Drive = use('Drive')

test('It should encode and decode the data using ProtoBuffer service provider', async ({ assert }) => {
  let jsonObj = { 
    "name": "everything is fine", 
    "dob": "2020-02-12", 
    "salary": 100,
    "age": 25 
  }

  const ProtoBufferEncodeRes = await ProtoBuffer.encode(jsonObj)

  const ProtoBufferDecodeRes = await ProtoBuffer.decode(ProtoBufferEncodeRes)

  assert.equal(ProtoBufferDecodeRes.age, jsonObj.age)
})


test('It should consume the data using RabbitMq service provider', async ({ assert }) => {
  await RabbitMq.consume()
})


test('It should convert json to csv', async ({ assert }) => {
  let jsonObj = { 
    "name": "everything is fine", 
    "dob": "2020-02-12", 
    "salary": 100,
    "age": 25 
  }

  let jsonToCsvRes = await Json2File.convert(jsonObj, 'csv')
  
  let csvToJsonRes = await Json2File.revert(jsonToCsvRes, 'csv')

  assert.equal(csvToJsonRes[0].age, jsonObj.age)
})

test('It should upload file to blob storage', async ({ assert }) => {
  
  let blobName = 'unittestuserfile.xml'
  
  await Drive.put(blobName, "unittest")
  
  let uploadFileRes = await BlobStorage.upload(blobName)

  assert.equal(uploadFileRes, true)
})

test('It should download file to blob storage', async ({ assert }) => {
  
  let blobName = 'unittestuserfile.xml'

  let downloadFileRes = await BlobStorage.download(blobName)

  assert.equal(downloadFileRes, 'unittest')
})

test('It should delete file to blob storage', async ({ assert }) => {
  
  let blobName = 'unittestuserfile.xml'

  let deleteFileRes = await BlobStorage.delete(blobName)

  assert.equal(deleteFileRes, true)
})

