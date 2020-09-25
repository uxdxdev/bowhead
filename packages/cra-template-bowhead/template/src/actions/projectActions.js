import * as firebase from '../api/firebase'
import * as projectSlice from '../store/projectSlice'

export const resetCreateProjectState = () => {
  return dispatch => {
    dispatch(projectSlice.createProjectErrorReset());
  };
};

export const createProject = ({ workspaceId, title, summary }) => {
  return async (dispatch) => {
    dispatch(projectSlice.createProject());

    await firebase.createProject({ workspaceId, title, summary })
      .then(() => {
        dispatch(projectSlice.createProjectSuccess());
      })
      .catch(error => {
        dispatch(projectSlice.createProjectError(error));
      });
  };
};

export const deleteProject = ({ projectId, workspaceId }) => {
  return async (dispatch) => {

    dispatch(projectSlice.deleteProject());

    await firebase.deleteProject({ projectId, workspaceId })
      .then(() => {
        dispatch(projectSlice.deleteProjectSuccess());
      })
      .catch(error => {
        dispatch(projectSlice.deleteProjectError(error));
      });
  };
};
