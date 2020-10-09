import * as firebase from '../api/firebase'
import * as bowheadSlice from '../store/bowheadSlice'
import { isSignInWithEmailLink, signInWithEmailLink, verifyUserSignInUpdate } from '../api/firebase'

export const resetSendEmailLink = () => {
  return dispatch => {
    dispatch(bowheadSlice.sendEmailLinkReset());
  };
};

export const signOut = () => {
  return async (dispatch) => {
    dispatch(bowheadSlice.signOut());

    await firebase.signOut()
      .then(() => {
        dispatch(bowheadSlice.signOutSuccess());
      })
      .catch(error => {
        dispatch(bowheadSlice.signOutError(error));
      });
  };
};

export const sendSignInEmailLink = ({ email, data }) => {
  return async (dispatch) => {
    dispatch(bowheadSlice.sendEmailLink());

    await firebase.sendSignInEmail({ email, data })
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
      })
      .then(() => {
        dispatch(bowheadSlice.sendEmailLinkSuccess());
      })
      .catch(error => {
        dispatch(bowheadSlice.sendEmailLinkError(error));
      });
  };
};


export const verifyUser = () => {
  return async (dispatch) => {
    dispatch(bowheadSlice.verifyUser());

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

          await verifyUserSignInUpdate({ uid, email })
            .then(() => {
              dispatch(bowheadSlice.verifyUserSuccess());
            })
            .catch(error => {
              dispatch(bowheadSlice.verifyUserError(error));
            });
        })
        .catch(error => {
          dispatch(bowheadSlice.verifyUserError(error));
        });
    }
  };
};
