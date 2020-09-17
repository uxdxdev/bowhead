import { bowhead } from '../utils/bowhead'

exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    return await bowhead.deleteStripeCustomer({ token: event.queryStringParameters.token, data })
        .then(() => {
            callback(null, { statusCode: 200 })
        }).catch(error => {
            callback(error, { statusCode: 400 })
        });
}