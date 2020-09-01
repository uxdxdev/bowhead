import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setActiveWorkspace } from '../../../actions/workspaceActions'
import { useFirestoreConnect } from "react-redux-firebase";
import * as constants from "../../../utils/constants";

const useDashboard = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch()

  const {
    firebase: {
      profile: { workspaces, stripeCustomerId },
    },
    firestore: {
      status: { requesting },
      data
    },
    workspace: { activeWorkspaceId },
    workspace: { isCreatingWorkspace }
  } = state;

  const role = workspaces && workspaces[activeWorkspaceId]?.role
  const subscriptionStatus = data && data.stripe && data.stripe[stripeCustomerId]?.status
  const isSubscribed = (subscriptionStatus === constants.STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    subscriptionStatus === constants.STRIPE_SUBSCRIPTION_STATUS.ACTIVE) ||
    role === constants.USER_ROLES.MEMBER

  const isLoading = requesting &&
    (Object.keys(requesting).length === 0 || // if we haven't made a request yet
      Object.keys(requesting).filter(value => /^stripe/.test(value)).filter(key => requesting[key] === true).length > 0) // if any stripe related requests are 'true'

  // on init set active workspace to first
  useEffect(() => {
    const firstWorkspace = workspaces && Object.keys(workspaces)[0];
    !activeWorkspaceId && firstWorkspace && dispatch(setActiveWorkspace(firstWorkspace))
  }, [activeWorkspaceId, dispatch, workspaces])

  // connect firestore to redux state
  // React.useMemo to memoize the config callback between renders for useFirestoreConnect()
  // this is the prevent the useFirestoreConnect() hook from being called on each render
  // the Dashboard will be re-rendered each time the { match } prop is updated by react-router
  const firestoreConnectConfigCallback = React.useMemo(() => {
    const collections = [];

    collections.push({
      collection: constants.FIRESTORE_COLLECTIONS.STRIPE,
      doc: stripeCustomerId,
    });

    workspaces &&
      Object.keys(workspaces).forEach((workspaceId) => {

        collections.push({
          collection: constants.FIRESTORE_COLLECTIONS.WORKSPACES,
          doc: workspaceId,
        });

        !isCreatingWorkspace && collections.push({
          collection: constants.FIRESTORE_COLLECTIONS.WORKSPACES,
          doc: workspaceId,
          orderBy: ["createdAt", "desc"],
          subcollections: [{ collection: constants.FIRESTORE_COLLECTIONS.PROJECTS }],
          storeAs: `${workspaceId}::projects`,
        });
      });

    return collections;
  }, [stripeCustomerId, workspaces, isCreatingWorkspace]);

  useFirestoreConnect(firestoreConnectConfigCallback);

  return {
    workspaces,
    isSubscribed,
    isLoading,
  };
};

export default useDashboard;
