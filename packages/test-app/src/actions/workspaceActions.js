import * as firebase from '../api/firebase'
import * as workspaceSlice from '../store/workspaceSlice'

export const setActiveWorkspace = activeWorkspaceId => {
  return dispatch => {
    dispatch(workspaceSlice.setActiveWorkspace(activeWorkspaceId));
  };
};

export const createWorkspace = ({ workspaceName, uid, email }) => {
  return async (dispatch) => {
    dispatch(workspaceSlice.createWorkspace());

    await firebase.createWorkspace({ workspaceName, uid, email })
      .then(() => {
        dispatch(workspaceSlice.createWorkspaceSuccess());
      })
      .catch(error => {
        dispatch(workspaceSlice.createWorkspaceError(error));
      });
  };
}


export const leaveWorkspace = ({ uid, workspaceId }) => {
  return async (dispatch) => {
    dispatch(workspaceSlice.leaveWorkspace());

    await firebase.removeWorkspaceFromUser({ uid, workspaceId })
      .then(() => {
        dispatch(workspaceSlice.leaveWorkspaceSuccess());
      })
      .catch(error => {
        console.error(error);
        dispatch(workspaceSlice.leaveWorkspaceError(error));
      });
  };
};

export const deleteWorkspace = ({ uid, workspaceId }) => {
  return async (dispatch) => {
    dispatch(workspaceSlice.deleteWorkspace());

    await firebase.deleteWorkspace({ uid, workspaceId })
      .then(() => {
        dispatch(workspaceSlice.deleteWorkspaceSuccess(workspaceId));
        dispatch(workspaceSlice.setActiveWorkspace(null));
      })
      .catch(error => {
        console.error(error);
        dispatch(workspaceSlice.deleteWorkspaceError(error));
      });
  };
};

export const removeMember = ({ uid, workspaceId }) => {
  return (dispatch) => {
    dispatch(workspaceSlice.removeUser());

    return firebase.removeUserFromWorkspace({ uid, workspaceId })
      .then(() => {
        dispatch(workspaceSlice.removeUserSuccess());
      })
      .catch(error => {
        dispatch(workspaceSlice.removeUserError(error));
      });
  };
};
