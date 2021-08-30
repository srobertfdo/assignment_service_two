'use strict'

const { test, trait } = use('Test/Suite')('User Controller Functional Test')
const Encryption = use('Encryption')

trait("Test/ApiClient");

test("Test Get User File Data", async ({ assert, client }) => {
  const response = await client.get("/user/files/df9e4ffa-bfb5-42a9-826d-28ad9fc48945/data").end();

  response.assertStatus(200);

  assert.isDefined(response.body.data)
  let decryptedResponseBody = JSON.parse(Encryption.decrypt(response.body.data))
  assert.isDefined(decryptedResponseBody.uuid)
  assert.equal('df9e4ffa-bfb5-42a9-826d-28ad9fc48945', decryptedResponseBody.uuid)
}).timeout(0);

test("Test Get All User Files ", async ({ assert, client }) => {
  const response = await client.get("/user/files").end();

  response.assertStatus(200);

  assert.isDefined(response.body.data)
  assert.isDefined(response.body.data.data)
  assert.isDefined(response.body.data.page)
  assert.equal(response.body.data.page, 1)
}).timeout(0);
