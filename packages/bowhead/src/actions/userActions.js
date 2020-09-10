import { AUTH_TYPE } from "../utils/constants";
import * as firebase from '../api/firebase'
import {
  verifyUserSignInUpdate,
  deleteUserAccountAndData
} from "../api/firestore";
import { deleteStripeCustomer } from '../api/stripe'
import * as userSlice from '../store/userSlice'

export const verifyUser = () => {
  return async (dispatch) => {
    dispatch(userSlice.verifyUser());

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

          if (AUTH_TYPE.SIGN_IN) {
            await verifyUserSignInUpdate({ uid, email })
              .then(() => {
                dispatch(userSlice.verifyUserSuccess());
              })
              .catch(error => {
                dispatch(userSlice.verifyUserError(error));
              });
          }
        })
        .catch(error => {
          dispatch(userSlice.verifyUserError(error));
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
    await deleteUserAccountAndData(uid)
      .catch(error => {
        return dispatch(userSlice.deleteUserError(error));
      })

    await firebase.deleteCurrentUser()
      .catch(error => {
        if (error.code === "auth/requires-recent-login") {
          window.alert("Your login credentials need to be re-verified. Please login again and retry your previous action. We do this to make sure your data stays safe.");
          dispatch(userSlice.deleteUserError(error));
          firebase.signOut();
          return;
        }
      });

    // done
    return dispatch(userSlice.deleteUserSuccess());
  }
};
