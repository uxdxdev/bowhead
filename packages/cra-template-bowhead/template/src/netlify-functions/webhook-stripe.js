import { functions } from '../utils/functions'

exports.handler = async (event, context, callback) => {
  const stripeSignature = event.headers['stripe-signature'];

  return await functions.webhookStripe({ stripeSignature, rawBody: event.body })
    .then(() => {
      callback(null, { statusCode: 200 })
    }).catch(error => {
      callback(error, { statusCode: 400 })
    });
}