import { createSlice } from '@reduxjs/toolkit'

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
    }
  }
})

export const {
  sendEmailLink,
  sendEmailLinkSuccess,
  sendEmailLinkError,
  sendEmailLinkReset,
} = authSlice.actions

export default authSlice.reducer