import * as constants from "../utils/constants";
import * as firebase from '../api/firebase'
import {
  updateMemberStatus,
} from "../api/firestore";
import * as authSlice from '../store/authSlice'

export const resetSendEmailLink = () => {
  return dispatch => {
    dispatch(authSlice.sendEmailLinkReset());
  };
};

export const sendSignInEmailLink = ({ email, ref, data }) => {
  return async (dispatch) => {
    dispatch(authSlice.sendEmailLink());

    await firebase.sendSignInEmail({ email, ref, data })
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);

        // invite
        if (ref === constants.AUTH_TYPE.INVITE) {
          const { workspaceId } = data;
          return updateMemberStatus({ workspaceId, email, status: "pending" })
        }
      })
      .then(() => {
        dispatch(authSlice.sendEmailLinkSuccess());
      })
      .catch(error => {
        dispatch(authSlice.sendEmailLinkError(error));
      });
  };
};