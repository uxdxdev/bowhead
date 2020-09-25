import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'bowheadUser',
  initialState: {},
  reducers: {
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
  verifyUser,
  verifyUserSuccess,
  verifyUserError
} = userSlice.actions

export default userSlice.reducer