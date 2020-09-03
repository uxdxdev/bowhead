import { createSlice } from '@reduxjs/toolkit'
import { pluginRegistry, PLUGIN_TYPES } from '@mortond/bowhead'

const authSlice = createSlice({
  name: 'auth',
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
    verifyInvitedUser(state) {
      return {
        ...state,
        isVerifyingInvitedUser: true,
        isVerifyingInvitedUserError: null,
        isInvitedUserVerified: false
      };
    },
    verifyInvitedUserSuccess(state) {
      return {
        ...state,
        isVerifyingInvitedUser: false,
        isVerifyingInvitedUserError: null,
        isInvitedUserVerified: true
      };
    },
    verifyInvitedUserError(state, action) {
      return {
        ...state,
        isVerifyingInvitedUser: false,
        isVerifyingInvitedUserError: action.payload,
        isInvitedUserVerified: false
      };
    },
  }
})

pluginRegistry.register('auth-reducer', {
  type: PLUGIN_TYPES.REDUCER,
  name: 'auth',
  reducer: authSlice.reducer
})

export const {
  sendEmailLink,
  sendEmailLinkSuccess,
  sendEmailLinkError,
  sendEmailLinkReset,
  verifyInvitedUser,
  verifyInvitedUserSuccess,
  verifyInvitedUserError
} = authSlice.actions

export default authSlice.reducer