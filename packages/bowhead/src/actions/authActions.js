import * as firebase from '../api/firebase'
import * as authSlice from '../store/authSlice'

export const resetSendEmailLink = () => {
  return dispatch => {
    dispatch(authSlice.sendEmailLinkReset());
  };
};

export const signOut = () => {
  return async (dispatch) => {
    dispatch(authSlice.signOut());

    await firebase.signOut()
      .then(() => {
        dispatch(authSlice.signOutSuccess());
      })
      .catch(error => {
        dispatch(authSlice.signOutError(error));
      });
  };
};

export const sendSignInEmailLink = ({ email, data }) => {
  return async (dispatch) => {
    dispatch(authSlice.sendEmailLink());

    await firebase.sendSignInEmail({ email, data })
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
      })
      .then(() => {
        dispatch(authSlice.sendEmailLinkSuccess());
      })
      .catch(error => {
        dispatch(authSlice.sendEmailLinkError(error));
      });
  };
};