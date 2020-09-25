import {
  verifyUserInviteUpdate,
  deleteUserWorkspaces,
  isSignInWithEmailLink,
  signInWithEmailLink,
  deleteCurrentUser,
  signOut
} from '../api/firebase'
import * as authSlice from '../store/authSlice'
import * as userSlice from '../store/userSlice'
import { deleteUserProfile, deleteStripeCustomer } from '@mortond/bowhead'

export const verifyInvitedUser = () => {
  return async (dispatch) => {
    dispatch(authSlice.verifyInvitedUser());

    // get url params
    const params = new URLSearchParams(window.location.search);

    if (isSignInWithEmailLink({ location: window.location.href })) {
      var email = window.localStorage.getItem("emailForSignIn");
      window.localStorage.removeItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }

      await signInWithEmailLink({ email, location: window.location.href })
        .then(async result => {
          const uid = result.user.uid;

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

        })
        .catch(error => {
          console.log('signInWithEmailLink', error)
          dispatch(authSlice.verifyInvitedUserError(error));
        });
    }
  };
};

export const deleteCurrentUserAccount = ({ uid, stripeCustomerId }) => {
  return async (dispatch) => {

    dispatch(userSlice.deleteUser());

    // stripe
    stripeCustomerId && await deleteStripeCustomer(stripeCustomerId)
      .then((response) => {
        if (!response.ok) {
          return dispatch(userSlice.deleteUserError({ error: 'failed to delete stripe customer data' }));
        }
      })
      .catch(error => {
        return dispatch(userSlice.deleteUserError(error));
      })

    // user
    await deleteUserProfile()
      .catch(error => {
        return dispatch(userSlice.deleteUserError(error));
      })

    // delete user workspaces
    await deleteUserWorkspaces({ uid })

    await deleteCurrentUser()
      .catch(error => {
        if (error.code === "auth/requires-recent-login") {
          window.alert(`Your login credentials need to be re-verified in order to delete your authentication details. We do this to make sure your data stays safe. Your user information and Stripe data have already been deleted. Please login again and delete your account to finalise the deletion of your user data.`);
          dispatch(userSlice.deleteUserError(error));
          signOut();
          return;
        }
      });

    // done
    return dispatch(userSlice.deleteUserSuccess());
  }
};
