import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { activeWorkspaceId: null },
  reducers: {
    setWorkspace(state, action) {
      return {
        ...state,
        activeWorkspaceId: action.activeWorkspaceId
      }
    },
    sendEmailLink(state) {
      return {
        ...state,
        isSendingEmailLink: true,
        isEmailLinkSent: false,
        sendEmailAuthError: null
      };
    },
    sendEmailLinkSuccess(state) {
      return {
        ...state,
        isSendingEmailLink: false,
        isEmailLinkSent: true,
        sendEmailAuthError: null
      };
    },
    sendEmailLinkError(state, action) {
      return {
        ...state,
        isSendingEmailLink: false,
        isEmailLinkSent: false,
        sendEmailAuthError: action.error
      }
    },
    sendEmailLinkReset(state) {
      return {
        ...state,
        isSendingEmailLink: false,
        isEmailLinkSent: false,
        sendEmailAuthError: null
      }
    }
  }
})

export const {
  setWorkspace,
  sendEmailLink,
  sendEmailLinkSuccess,
  sendEmailLinkError,
  sendEmailLinkReset
} = authSlice.actions

export default authSlice.reducer


// const initState = { activeWorkspaceId: null };

// const authReducer = (state = initState, action) => {
//   switch (action.type) {



//     case "SIGNING_OUT":
//       return {
//         ...state,
//         signingOutError: null
//       };
//     case "SIGN_OUT_SUCCESS":
//       return {
//         ...state,
//         signingOutError: null
//       };
//     case "SIGN_OUT_ERROR":
//       return {
//         ...state,
//         signingOutError: action.error
//       };

//     case "DELETING_USER_DATA":
//       return {
//         ...state,
//         isDeletingUserData: true,
//         deletingUserDataError: null
//       };
//     case "DELETING_USER_DATA_SUCCESS":
//       return {
//         ...state,
//         isDeletingUserData: false,
//         deletingUserDataError: null
//       };
//     case "DELETING_USER_DATA_ERROR":
//       return {
//         ...state,
//         isDeletingUserData: false,
//         deletingUserDataError: action.error
//       };

//     case "VERIFY_USER":
//       return {
//         ...state,
//         isVerifyingUser: true,
//         isVerifyingUserError: null,
//         isVerified: false
//       };
//     case "VERIFY_USER_SUCCESS":
//       return {
//         ...state,
//         isVerifyingUser: false,
//         isVerifyingUserError: null,
//         isVerified: true
//       };
//     case "VERIFY_USER_ERROR":
//       return {
//         ...state,
//         isVerifyingUserError: action.error,
//         isVerifyingUser: false,
//         isVerified: false
//       };
//     default:
//       return state;
//   }
// };

// export default authReducer;
