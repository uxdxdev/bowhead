import { functions } from '@mortond/bowhead-functions'

exports.handler = async (event, context, callback) => {
    return await functions.deleteStripeCustomer({ token: event.queryStringParameters.token, body: event.body })
        .then(() => {
            callback(null, { statusCode: 200 })
        }).catch(error => {
            callback(error, { statusCode: 400 })
        });
}