# @mortond/bowhead-functions

Required server-less functions for functionality implemented in [@mortond/bowhead](https://www.npmjs.com/package/@mortond/bowhead)

## Functions

- webhookStripe
- deleteStripeCustomer
- createStripeCustomerPortalSession
- createStripeCheckoutSession

See the [Bowhead Create-React-App template](https://github.com/daithimorton/bowhead/tree/master/packages/test-app) for more details.

## Example: Netlify functions

```javascript
// utils/bowhead.js
const BowheadFunctions = require('@mortond/bowhead-functions')

const config = {
    firebase: {
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
        databaseProductionUrl: process.env.REACT_APP_FIREBASE_FIRESTORE_PROD_DATABASE_URL,
    },
    stripe: {
        stripeWebhookSigningSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SIGNING_SECRET,
        stripeSecretKey: process.env.REACT_APP_STRIPE_SECRET_KEY
    }
}

const bowhead = new BowheadFunctions(config);
export { bowhead };

// netlify-functions/create-stripe-checkout-session.js
import { bowhead } from '../functions-utils/bowhead'

exports.handler = async (event, context, callback) => {
    return await bowhead.createStripeCheckoutSession({ token: event.queryStringParameters.token, body: event.body })
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) })
        }).catch(error => {
            callback(error, { statusCode: 400 })
        });
}

// netlify-functions/webhook-stripe.js
exports.handler = async (event, context, callback) => {
  const stripeSignature = event.headers['stripe-signature'];

  return await bowhead.webhookStripe({ stripeSignature, rawBody: event.body })
    .then(() => {
      callback(null, { statusCode: 200 })
    }).catch(error => {
      callback(error, { statusCode: 400 })
    });
}
```