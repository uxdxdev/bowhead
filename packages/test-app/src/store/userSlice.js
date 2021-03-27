import { createSlice } from '@reduxjs/toolkit'
import { pluginRegistry, PLUGIN_TYPES } from '@mortond/bowhead'

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

pluginRegistry.register({
  type: PLUGIN_TYPES.REDUCER,
  name: 'user',
  reducer: userSlice.reducer
})

export const {
  deleteUser,
  deleteUserSuccess,
  deleteUserError,
} = userSlice.actions

export default userSlice.reducer