import { useSelector, useDispatch } from "react-redux";
import { sendSignInEmailLink } from "../../../actions/authActions";
import * as constants from "../../../utils/constants";

const useSignIn = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch()

  const {
    bowheadAuth, firebase: { auth: { uid } }
  } = state;

  const { sendEmailAuthError, isSendingEmailLink, isEmailLinkSent } = bowheadAuth;

  const handleSendSignInEmailLink = ({ email }) => {
    dispatch(sendSignInEmailLink({ email, ref: constants.AUTH_TYPE.SIGN_IN }))
  }

  return {
    sendEmailAuthError,
    handleSendSignInEmailLink,
    isSendingEmailLink,
    isEmailLinkSent,
    uid,
  };
};

export default useSignIn;
