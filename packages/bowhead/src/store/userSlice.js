import { createSlice } from '@reduxjs/toolkit'
import { pluginRegistry } from '../registry/plugin-registry'
import { PLUGIN_TYPES } from '../utils/pluginTypes'

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    deleteUser(state) {
      return {
        ...state,
        isDeletingUserData: true,
        deletingUserDataError: null
      };
    },
    deleteUserSuccess(state) {
      return {
        ...state,
        isDeletingUserData: false,
        deletingUserDataError: null
      };
    },
    deleteUserError(state, action) {
      return {
        ...state,
        isDeletingUserData: false,
        deletingUserDataError: action.error
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

pluginRegistry.register('user-reducer', {
  type: PLUGIN_TYPES.REDUCER,
  name: 'user',
  reducer: userSlice.reducer
})

export const {
  deleteUser,
  deleteUserSuccess,
  deleteUserError,
  verifyUser,
  verifyUserSuccess,
  verifyUserError
} = userSlice.actions

export default userSlice.reducer