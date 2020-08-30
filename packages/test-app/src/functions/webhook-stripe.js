import { stripe } from '../utils/stripeBackend'
import { firestore } from '../utils/firebaseBackend';
import { STRIPE_SUBSCRIPTION_STATUS } from '../utils/constants';

const isValidStatus = (status) => {
  return status === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE ||
    status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED
}

const dbUpdateSubscriptionByCustomerId = async (data) => {
  const stripeCustomerId = data.customer || null;
  const status = data.status || null;
  const planId = data.plan.id || null;
  const interval = data.plan.interval || null;
  if (isValidStatus(status) && stripeCustomerId && planId && interval) {
    if (status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED) {
      // delete stripe customer data from DB
      await firestore.collection("stripe").doc(stripeCustomerId).delete();
    } else {
      // update stripe customer data in DB
      await firestore.collection("stripe").doc(stripeCustomerId).set({ status, planId, interval }, { merge: true });
    }
  }
}

const dbUpdateCustomerData = (data) => {

  const stripeCustomerId = data.customer || null;
  const uid = data.client_reference_id || null;

  if (stripeCustomerId && uid) {

    const userRef = firestore.collection("users").doc(uid);
    const batch = firestore.batch();

    // user
    batch.set(
      userRef,
      {
        stripeCustomerId
      },
      { merge: true }
    );


    // stripe
    const stripeRef = firestore.collection("stripe").doc(stripeCustomerId);
    batch.set(
      stripeRef,
      {
        uid
      },
      { merge: true }
    );

    return batch.commit()
  } else {
    throw new Error('dbUpdateCustomerData() : no uid provided')
  }
}

exports.handler = async (event, context, callback) => {
  const sig = event.headers['stripe-signature'];

  const endpointSecret = process.env.REACT_APP_STRIPE_WEBHOOK_SIGNING_SECRET;
  let verifiedEvent;
  try {
    verifiedEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (error) {
    return callback(error, { statusCode: 400 })
  }

  switch (verifiedEvent.type) {
    case 'customer.subscription.created':
      await dbUpdateSubscriptionByCustomerId(verifiedEvent.data.object)
      break;
    case 'customer.subscription.updated':
      await dbUpdateSubscriptionByCustomerId(verifiedEvent.data.object)
      break;
    case 'customer.subscription.deleted':
      await dbUpdateSubscriptionByCustomerId(verifiedEvent.data.object)
      break;
    case 'checkout.session.completed':
      await dbUpdateCustomerData(verifiedEvent.data.object)
      break;
    default:
      // Unexpected event type
      callback(null, { statusCode: 400 })
  }

  // return 200 if no other errors thrown
  callback(null, { statusCode: 200 });
}