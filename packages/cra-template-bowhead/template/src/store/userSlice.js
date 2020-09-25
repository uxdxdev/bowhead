import { createSlice } from '@reduxjs/toolkit'

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
    }
  }
})

export const {
  deleteUser,
  deleteUserSuccess,
  deleteUserError,
} = userSlice.actions

export default userSlice.reducer