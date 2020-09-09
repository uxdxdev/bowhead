import { functions } from '../utils/functions'

exports.handler = async (event, context, callback) => {
    return await functions.createStripeCustomerPortalSession({ token: event.queryStringParameters.token, body: event.body })
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) })
        }).catch(error => {
            callback(error, { statusCode: 400 })
        });
}