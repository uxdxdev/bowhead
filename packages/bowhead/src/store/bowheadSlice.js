import { createSlice } from '@reduxjs/toolkit'

const bowheadSlice = createSlice({
  name: 'bowhead',
  initialState: {},
  reducers: {
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
    },
    signOut(state) {
      return {
        ...state,
        isSigningOut: true,
        signOutError: null
      };
    },
    signOutSuccess(state) {
      return {
        ...state,
        isSigningOut: false,
        signOutError: null
      };
    },
    signOutError(state, action) {
      return {
        ...state,
        isSigningOut: false,
        signOutError: action.error
      };
    },
    verifyUser(state) {
      return {
        ...state,
        isVerifyingUser: true,
        isVerifyingUserError: null,
        isVerified: false
      };
    },
    verifyUserSuccess(state) {
      return {
        ...state,
        isVerifyingUser: false,
        isVerifyingUserError: null,
        isVerified: true
      };
    },
    verifyUserError(state, action) {
      return {
        ...state,
        isVerifyingUser: false,
        isVerifyingUserError: action.error,
        isVerified: false
      };
    },
  }
})

export const {
  sendEmailLink,
  sendEmailLinkSuccess,
  sendEmailLinkError,
  sendEmailLinkReset,
  signOut,
  signOutSuccess,
  signOutError,
  verifyUser,
  verifyUserSuccess,
  verifyUserError
} = bowheadSlice.actions


export default bowheadSlice.reducer