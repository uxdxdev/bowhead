import { functions } from '@mortond/bowhead-functions'

exports.handler = async (event, context, callback) => {
  return await functions.webhookStripe({ headers: event.headers, body: event.body })
    .then(() => {
      callback(null, { statusCode: 200 })
    }).catch(error => {
      callback(error, { statusCode: 400 })
    });
}