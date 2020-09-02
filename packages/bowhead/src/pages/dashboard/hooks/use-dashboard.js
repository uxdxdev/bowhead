import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import * as constants from "../../../utils/constants";

const useDashboard = () => {
  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { stripeCustomerId },
    },
    firestore: {
      status: { requesting },
      data
    },
    listeners: { collections }
  } = state;

  const subscriptionStatus = data && data.stripe && data.stripe[stripeCustomerId]?.status
  const isSubscribed = subscriptionStatus === constants.STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    subscriptionStatus === constants.STRIPE_SUBSCRIPTION_STATUS.ACTIVE
  const isLoading = requesting &&
    (Object.keys(requesting).length === 0 || // if we haven't made a request yet
      Object.keys(requesting).filter(value => /^stripe/.test(value)).filter(key => requesting[key] === true).length > 0) // if any stripe related requests are 'true'

  // keep stripe data listener enabled
  useFirestoreConnect([...collections, {
    collection: constants.FIRESTORE_COLLECTIONS.STRIPE,
    doc: stripeCustomerId,
  }]);

  return {
    isSubscribed,
    isLoading,
  };
};

export default useDashboard;
