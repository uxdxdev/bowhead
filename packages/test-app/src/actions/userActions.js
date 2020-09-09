import { AUTH_TYPE } from "../utils/constants";
import * as firebase from '../api/firebase'
import {
  verifyUserInviteUpdate
} from "../api/firestore";
import * as authSlice from '../store/authSlice'

export const verifyInvitedUser = () => {
  return async (dispatch) => {
    dispatch(authSlice.verifyInvitedUser());

    // get url params
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (firebase.isSignInWithEmailLink({ location: window.location.href })) {
      var email = window.localStorage.getItem("emailForSignIn");
      window.localStorage.removeItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }

      await firebase.signInWithEmailLink({ email, location: window.location.href })
        .then(async result => {
          const uid = result.user.uid;

          // invite
          if (ref === AUTH_TYPE.INVITE) {
            const workspaceId = params.get("workspaceId");
            const workspaceName = params.get("workspaceName");

            await verifyUserInviteUpdate({ workspaceId, workspaceName, email, uid })
              .then(() => {
                dispatch(authSlice.verifyInvitedUserSuccess());
              })
              .catch(error => {
                console.log('verifyUserInviteUpdate', error)
                dispatch(authSlice.verifyInvitedUserError(error));
              });
          }

        })
        .catch(error => {
          console.log('signInWithEmailLink', error)
          dispatch(authSlice.verifyInvitedUserError(error));
        });
    }
  };
};

