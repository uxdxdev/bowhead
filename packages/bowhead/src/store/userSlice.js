import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'bowheadUser',
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

export const {
  deleteUser,
  deleteUserSuccess,
  deleteUserError,
  verifyUser,
  verifyUserSuccess,
  verifyUserError
} = userSlice.actions

export default userSlice.reducer