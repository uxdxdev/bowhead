import { createSlice } from '@reduxjs/toolkit'
import { reducerRegistry } from '../registry/reducer-registry'

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
  }
})

reducerRegistry.register('auth', authSlice.reducer)

export const {
  sendEmailLink,
  sendEmailLinkSuccess,
  sendEmailLinkError,
  sendEmailLinkReset,
  signOut,
  signOutSuccess,
  signOutError
} = authSlice.actions


export default authSlice.reducer