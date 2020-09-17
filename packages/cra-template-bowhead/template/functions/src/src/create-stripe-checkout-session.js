import { bowhead } from '../utils/bowhead'

exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    return await bowhead.createStripeCheckoutSession({ token: event.queryStringParameters.token, data })
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) })
        }).catch(error => {
            callback(error, { statusCode: 400 })
        });
}