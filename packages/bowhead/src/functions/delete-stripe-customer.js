import { stripe } from '../utils/backend/stripeBackend'
import { verifyToken } from '../utils/backend/firebaseBackend';

exports.handler = async (event, context, callback) => {
    const user = await verifyToken(event.queryStringParameters.token);
    if (!user) callback(null, { statusCode: 401 })

    const { stripeCustomerId } = JSON.parse(event.body);
    await stripe.customers.del(stripeCustomerId).then(() => {
        callback(null, {
            statusCode: 200
        })
    }).catch(error => {
        callback(error, { statusCode: 400 })
    });
}