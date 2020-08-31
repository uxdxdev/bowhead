import { stripe } from '../utils/stripeBackend'
import { verifyToken } from '../utils/firebaseBackend';

exports.handler = async (event, context, callback) => {
    const user = await verifyToken(event?.queryStringParameters?.token);
    if (!user) return callback(null, { statusCode: 401 })

    const data = JSON.parse(event?.body);

    // do not provide a free trial if the user has previously signed up
    data?.customer && delete data?.subscription_data;

    await stripe.checkout.sessions.create(data).then((session) => {
        callback(null, {
            statusCode: 200, body: JSON.stringify(session)
        })
    }).catch(error => {
        callback(error, { statusCode: 400 })
    });
}