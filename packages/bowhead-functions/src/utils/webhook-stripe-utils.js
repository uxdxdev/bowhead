import { STRIPE_SUBSCRIPTION_STATUS } from './constants';

const isValidStatus = (status) => {
  return status === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE ||
    status === STRIPE_SUBSCRIPTION_STATUS.CANCELLED
}

export const dbUpdateSubscriptionByCustomerId = async (firestore, data) => {
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

export const dbUpdateCustomerData = (firestore, data) => {

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
    throw new Error(`dbUpdateCustomerData(): stripeCustomerId: ${stripeCustomerId} uid:${uid}`)
  }
}