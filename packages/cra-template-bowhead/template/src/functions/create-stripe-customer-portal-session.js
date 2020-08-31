import { stripe } from '../utils/stripeBackend'
import { verifyToken } from '../utils/firebaseBackend';

exports.handler = async (event, context, callback) => {
    const user = await verifyToken(event?.queryStringParameters?.token);
    if (!user) return callback(null, { statusCode: 401 })

    const data = JSON.parse(event?.body);

    await stripe.billingPortal.sessions.create(data).then((session) => {
        callback(null, {
            statusCode: 200, body: JSON.stringify(session)
        })
    }).catch(error => {
        callback(error, { statusCode: 400 })
    });
}