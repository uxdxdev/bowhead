import { useSelector } from "react-redux";
import * as constants from "../../../utils/constants"
import { useWorkspaces } from "../../../hooks";

const useSettings = () => {
  // init workspaces
  useWorkspaces();

  const state = useSelector((state) => state);
  const {
    firebase: {
      profile: { workspaces, stripeCustomerId },
    },
    firestore: {
      status: { requested },
    },
  } = state;

  const activeWorkspaceId = state.workspace?.activeWorkspaceId;
  const isOwner = workspaces && workspaces[activeWorkspaceId]?.role === constants.USER_ROLES.OWNER;
  const isRequestedStripeCustomer = requested[`${constants.FIRESTORE_COLLECTIONS.STRIPE}/${stripeCustomerId}`];
  const isRequestedActiveWorkspace = requested[`${constants.FIRESTORE_COLLECTIONS.WORKSPACES}/${activeWorkspaceId}`]
  const isRequestedActiveWorkspaceData = requested[activeWorkspaceId];
  const isLoading = isRequestedStripeCustomer &&
    !(isRequestedStripeCustomer === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspace === true) &&
    isRequestedActiveWorkspaceData &&
    !(isRequestedActiveWorkspaceData === true);

  return { isLoading, isOwner };
};

export default useSettings;
