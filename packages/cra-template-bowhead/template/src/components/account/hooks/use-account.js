import { useSelector } from "react-redux";
import { FIRESTORE_COLLECTIONS, STRIPE_SUBSCRIPTION_STATUS, USER_ROLES } from '../../../utils/constants'

const useAccount = () => {
  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { workspaces, stripeCustomerId },
    },
    workspace: { activeWorkspaceId },
    firestore: {
      status: { requested },
      data: { stripe }
    },
  } = state;

  const isOwner = workspaces && workspaces[activeWorkspaceId]?.role === USER_ROLES.OWNER;
  const stripeData = stripe && stripe[stripeCustomerId]
  const isSubscribed = stripeData?.status === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    stripeData?.status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE;
  const isRequestedStripeCustomer = requested[`${FIRESTORE_COLLECTIONS.STRIPE}/${stripeCustomerId}`];
  const isRequestedActiveWorkspace = requested[`${FIRESTORE_COLLECTIONS.WORKSPACES}/${activeWorkspaceId}`]
  const isRequestedActiveWorkspaceData = requested[activeWorkspaceId];
  const isLoading = isRequestedStripeCustomer &&
    !(isRequestedStripeCustomer === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspace === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspaceData === true);

  return { isLoading, isOwner, isSubscribed };
};

export default useAccount;
