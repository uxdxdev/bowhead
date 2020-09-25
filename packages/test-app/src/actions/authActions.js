import { updateMemberStatus, sendSignInEmail } from '../api/firebase'
import * as authSlice from '../store/authSlice'

export const resetSendEmailLink = () => {
  return dispatch => {
    dispatch(authSlice.sendEmailLinkReset());
  };
};

export const inviteUserSendEmailLink = ({ email, data }) => {
  return async (dispatch) => {
    dispatch(authSlice.sendEmailLink());

    await sendSignInEmail({ email, data })
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        const { workspaceId } = data;
        return updateMemberStatus({ workspaceId, email, status: "pending" })
      })
      .then(() => {
        dispatch(authSlice.sendEmailLinkSuccess());
      })
      .catch(error => {
        dispatch(authSlice.sendEmailLinkError(error));
      });
  };
};