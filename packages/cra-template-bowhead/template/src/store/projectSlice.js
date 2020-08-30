import { createSlice } from '@reduxjs/toolkit'

const projectSlice = createSlice({
  name: 'project',
  initialState: {},
  reducers: {
    createProject(state) {
      return {
        ...state,
        isCreatingProject: true,
        createProjectError: null,
      };
    },
    createProjectSuccess(state) {
      return {
        ...state,
        isCreatingProject: false,
        createProjectError: null,
      };
    },
    createProjectError(state, action) {
      return {
        ...state,
        isCreatingProject: false,
        createProjectError: action.error,
      }
    },
    createProjectErrorReset(state) {
      return {
        ...state,
        isCreatingProject: false,
        createProjectError: null,
      }
    },
    deleteProject(state) {
      return {
        ...state,
        isDeletingProject: true,
        deleteProjectError: null
      };
    },
    deleteProjectSuccess(state) {
      return {
        ...state,
        isDeletingProject: false,
        deleteProjectError: null
      };
    },
    deleteProjectError(state, action) {
      return {
        ...state,
        isDeletingProject: false,
        deleteProjectError: action.error
      }
    },
  }
})

export const {
  createProject,
  createProjectSuccess,
  createProjectError,
  createProjectErrorReset,
  deleteProject,
  deleteProjectSuccess,
  deleteProjectError
} = projectSlice.actions

export default projectSlice.reducer


