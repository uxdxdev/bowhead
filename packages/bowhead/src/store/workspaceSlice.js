import { createSlice } from '@reduxjs/toolkit'
import { pluginRegistry } from '../registry/plugin-registry'
import { PLUGIN_TYPES } from '../utils/pluginTypes'

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: { activeWorkspaceId: null },
  reducers: {
    setActiveWorkspace(state, action) {
      return {
        ...state,
        activeWorkspaceId: action.payload
      }
    },
    createWorkspace(state) {
      return {
        ...state,
        isCreatingWorkspace: true,
        createWorkspaceError: null,
      };
    },
    createWorkspaceSuccess(state) {
      return {
        ...state,
        isCreatingWorkspace: false,
        createWorkspaceError: null,
      };
    },
    createWorkspaceError(state, action) {
      return {
        ...state,
        isCreatingWorkspace: false,
        createWorkspaceError: action.error,
      }
    },
    createWorkspaceErrorReset(state) {
      return {
        ...state,
        isCreatingWorkspace: false,
        createWorkspaceError: null,
      }
    },
    leaveWorkspace(state) {
      return {
        ...state,
        isLeavingWorkspace: true,
        isLeavingWorkspaceError: null
      };
    },
    leaveWorkspaceSuccess(state) {
      return {
        ...state,
        isLeavingWorkspace: false,
        isLeavingWorkspaceError: null
      };
    },
    leaveWorkspaceError(state, action) {
      return {
        ...state,
        isLeavingWorkspace: true,
        isLeavingWorkspaceError: action.error
      }
    },
    deleteWorkspace(state) {
      return {
        ...state,
        isDeletingWorkspace: true,
        isDeletingWorkspaceError: null
      };
    },
    deleteWorkspaceSuccess(state) {
      return {
        ...state,
        isDeletingWorkspace: true,
        isDeletingWorkspaceError: null
      };
    },
    deleteWorkspaceError(state, action) {
      return {
        ...state,
        isDeletingWorkspace: true,
        isDeletingWorkspaceError: action.error
      }
    },
    removeUser(state) {
      return {
        ...state,
        isRemovingUserData: true,
        removingUserDataError: null
      };
    },
    removeUserSuccess(state) {
      return {
        ...state,
        isRemovingUserData: false,
        removingUserDataError: null
      };
    },
    removeUserError(state, action) {
      return {
        ...state,
        isRemovingUserData: false,
        removingUserDataError: action.error
      };
    },
  }
})

pluginRegistry.register({
  type: PLUGIN_TYPES.REDUCER,
  name: 'workspace',
  reducer: workspaceSlice.reducer
})

export const {
  setActiveWorkspace,
  createWorkspace,
  createWorkspaceSuccess,
  createWorkspaceError,
  createWorkspaceErrorReset,
  leaveWorkspace,
  leaveWorkspaceSuccess,
  leaveWorkspaceError,
  deleteWorkspace,
  deleteWorkspaceSuccess,
  deleteWorkspaceError,
  removeUser,
  removeUserSuccess,
  removeUserError
} = workspaceSlice.actions

export default workspaceSlice.reducer