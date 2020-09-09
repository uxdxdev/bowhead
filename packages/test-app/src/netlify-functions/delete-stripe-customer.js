import { functions } from '../utils/functions'

exports.handler = async (event, context, callback) => {
    const stripeCustomerId = event.body.stripeCustomerId;
    return await functions.deleteStripeCustomer({ token: event.queryStringParameters.token, stripeCustomerId })
        .then(() => {
            callback(null, { statusCode: 200 })
        }).catch(error => {
            callback(error, { statusCode: 400 })
        });
}