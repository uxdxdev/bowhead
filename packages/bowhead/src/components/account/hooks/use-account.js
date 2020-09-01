import { useSelector } from "react-redux";
import * as constants from "../../../utils/constants"

const useAccount = () => {
  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { stripeCustomerId },
    },
    workspace: { activeWorkspaceId },
    firestore: {
      status: { requested },
    },
  } = state;


  const isRequestedStripeCustomer = requested[`${constants.FIRESTORE_COLLECTIONS.STRIPE}/${stripeCustomerId}`];
  const isRequestedActiveWorkspace = requested[`${constants.FIRESTORE_COLLECTIONS.WORKSPACES}/${activeWorkspaceId}`]
  const isRequestedActiveWorkspaceData = requested[activeWorkspaceId];
  const isLoading = isRequestedStripeCustomer &&
    !(isRequestedStripeCustomer === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspace === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspaceData === true);

  return { isLoading };
};

export default useAccount;
