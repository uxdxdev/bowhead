import { bowhead } from '../utils/bowhead'

exports.handler = async (event, context, callback) => {
  const stripeSignature = event.headers['stripe-signature'];

  return await bowhead.webhookStripe({ stripeSignature, rawBody: event.body })
    .then(() => {
      callback(null, { statusCode: 200 })
    }).catch(error => {
      callback(error, { statusCode: 400 })
    });
}