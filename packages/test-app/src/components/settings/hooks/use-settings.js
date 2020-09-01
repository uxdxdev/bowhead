import { useSelector } from "react-redux";
import * as constants from "../../../utils/constants"

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

  const isOwner = workspaces && workspaces[activeWorkspaceId]?.role === constants.USER_ROLES.OWNER;
  const stripeData = stripe && stripe[stripeCustomerId]
  const isSubscribed = stripeData?.status === constants.STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    stripeData?.status === constants.STRIPE_SUBSCRIPTION_STATUS.ACTIVE;
  const isRequestedStripeCustomer = requested[`${constants.FIRESTORE_COLLECTIONS.STRIPE}/${stripeCustomerId}`];
  const isRequestedActiveWorkspace = requested[`${constants.FIRESTORE_COLLECTIONS.WORKSPACES}/${activeWorkspaceId}`]
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
