import { useSelector, useDispatch } from "react-redux";
import { authenticateWithEmailLink } from "../../../actions/authActions";
import { AUTH_TYPE } from "../../../utils/constants";

const useSignIn = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch()

  const {
    auth, firebase: { auth: { uid } }
  } = state;

  const { sendEmailAuthError, isSendingEmailLink, isEmailLinkSent } = auth;

  const handleAuthenticateWithEmailLink = ({ email }) => {
    dispatch(authenticateWithEmailLink({ email, ref: AUTH_TYPE.SIGN_IN }))
  }

  return {
    sendEmailAuthError,
    handleAuthenticateWithEmailLink,
    isSendingEmailLink,
    isEmailLinkSent,
    uid,
  };
};

export default useSignIn;
