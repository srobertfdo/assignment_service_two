'use strict'

const { test, trait } = use('Test/Suite')('User Controller Functional Test')
const Encryption = use('Encryption')

trait("Test/ApiClient");

test("Test Get All User Files ", async ({ assert, client }) => {
  const response = await client.get("/user/files").end();

  response.assertStatus(200);

  assert.isDefined(response.body.data)
  assert.isDefined(response.body.data.data)
  assert.isDefined(response.body.data.page)
  assert.equal(response.body.data.page, 1)
}).timeout(0);
