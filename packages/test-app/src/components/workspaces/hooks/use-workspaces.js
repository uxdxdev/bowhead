import { useSelector } from "react-redux";
import { FIRESTORE_COLLECTIONS } from "../../../utils/constants"
import { useInit } from "../../../hooks";

const useSettings = () => {
  const { isWorkspaceOwner, isSubscribed } = useInit();

  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { stripeCustomerId },
    },
    firestore: {
      status: { requested },
    },
  } = state;

  const activeWorkspaceId = state.workspace?.activeWorkspaceId;
  const isRequestedStripeCustomer = requested[`stripe/${stripeCustomerId}`];
  const isRequestedActiveWorkspace = requested[`${FIRESTORE_COLLECTIONS.WORKSPACES}/${activeWorkspaceId}`]
  const isRequestedActiveWorkspaceData = requested[activeWorkspaceId];
  const isLoading = isRequestedStripeCustomer &&
    !(isRequestedStripeCustomer === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspace === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspaceData === true);

  return { isLoading, isSubscribed, isWorkspaceOwner };
};

export default useSettings;
