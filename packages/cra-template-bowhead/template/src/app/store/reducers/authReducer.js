const initState = { activeWorkspaceId: null };

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_WORKSPACE":
      return {
        ...state,
        activeWorkspaceId: action.activeWorkspaceId
      };
    case "SEND_EMAIL_LINK":
      return {
        ...state,
        isSendingEmailLink: true,
        isEmailLinkSent: false,
        sendEmailAuthError: null
      };
    case "SEND_EMAIL_LINK_SUCCESS":
      return {
        ...state,
        isSendingEmailLink: false,
        isEmailLinkSent: true,
        sendEmailAuthError: null
      };
    case "SEND_EMAIL_LINK_ERROR":
      return {
        ...state,
        isSendingEmailLink: false,
        isEmailLinkSent: false,
        sendEmailAuthError: action.error
      };
    case "SEND_EMAIL_LINK_RESET":
      return {
        ...state,
        isSendingEmailLink: false,
        isEmailLinkSent: false,
        sendEmailAuthError: null
      };

    case "SIGNING_OUT":
      return {
        ...state,
        signingOutError: null
      };
    case "SIGN_OUT_SUCCESS":
      return {
        ...state,
        signingOutError: null
      };
    case "SIGN_OUT_ERROR":
      return {
        ...state,
        signingOutError: action.error
      };

    case "DELETING_USER_DATA":
      return {
        ...state,
        isDeletingUserData: true,
        deletingUserDataError: null
      };
    case "DELETING_USER_DATA_SUCCESS":
      return {
        ...state,
        isDeletingUserData: false,
        deletingUserDataError: null
      };
    case "DELETING_USER_DATA_ERROR":
      return {
        ...state,
        isDeletingUserData: false,
        deletingUserDataError: action.error
      };

    case "VERIFY_USER":
      return {
        ...state,
        isVerifyingUser: true,
        isVerifyingUserError: null,
        isVerified: false
      };
    case "VERIFY_USER_SUCCESS":
      return {
        ...state,
        isVerifyingUser: false,
        isVerifyingUserError: null,
        isVerified: true
      };
    case "VERIFY_USER_ERROR":
      return {
        ...state,
        isVerifyingUserError: action.error,
        isVerifyingUser: false,
        isVerified: false
      };
    default:
      return state;
  }
};

export default authReducer;
