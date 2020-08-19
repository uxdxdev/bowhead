import { stripe } from '../utils/backend/stripeBackend'
import { firestore } from '../utils/backend/firebaseBackend';
import { STRIPE_SUBSCRIPTION_STATUS } from '../utils/constants';

const isValidStatus = (status) => {
  return status === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE ||
    status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED
}

const dbUpdateSubscriptionByCustomerId = async (data) => {
  const customer = data.customer || null;
  const status = data.status || null;
  const planId = data.plan.id || null;
  const interval = data.plan.interval || null;
  if (isValidStatus(status) && customer && planId && interval) {
    if (status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED) {
      // delete stripe customer data from DB
      await firestore.collection("stripe").doc(customer).delete();
    } else {
      // update stripe customer data in DB
      await firestore.collection("stripe").doc(customer).set({ status, planId, interval }, { merge: true });
    }
  }
}

const dbUpdateCustomerData = (data) => {

  const customer = data.customer || null;
  const uid = data.client_reference_id || null;

  if (customer && uid) {

    const userRef = firestore.collection("users").doc(uid);
    const batch = firestore.batch();

    // user
    batch.set(
      userRef,
      {
        customer
      },
      { merge: true }
    );


    // stripe
    const stripeRef = firestore.collection("stripe").doc(customer);
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
  const endpointSecret = process.env.REACT_APP_STRIPE_SIGNING_SECRET;
  let verifiedEvent;
  try {
    verifiedEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (error) {
    callback(error, { statusCode: 400 })
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
