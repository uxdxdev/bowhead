import { createSlice } from '@reduxjs/toolkit'

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: { activeWorkspaceId: null },
  reducers: {
    setActiveWorkspace(state, action) {
      return {
        ...state,
        activeWorkspaceId: action.activeWorkspaceId
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
  }
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
  deleteWorkspaceError
} = workspaceSlice.actions

export default workspaceSlice.reducer