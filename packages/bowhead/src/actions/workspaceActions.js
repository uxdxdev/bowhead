import * as firestore from '../api/firestore'
import * as workspaceSlice from '../store/workspaceSlice'

export const setActiveWorkspace = activeWorkspaceId => {
  return dispatch => {
    dispatch(workspaceSlice.setActiveWorkspace(activeWorkspaceId));
  };
};

export const createWorkspace = ({ workspaceName, uid, email }) => {
  return async (dispatch) => {
    dispatch(workspaceSlice.createWorkspace());

    await firestore.createWorkspace({ workspaceName, uid, email })
      .then(({ activeWorkspaceId }) => {
        dispatch(workspaceSlice.createWorkspaceSuccess());
        dispatch(workspaceSlice.setActiveWorkspace(activeWorkspaceId));
      })
      .catch(error => {
        dispatch(workspaceSlice.createWorkspaceError(error));
      });
  };
}


export const leaveWorkspace = ({ uid, workspaceId }) => {
  return async (dispatch) => {
    dispatch(workspaceSlice.leaveWorkspace());

    await firestore.removeWorkspaceFromUser({ uid, workspaceId })
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

    await firestore.deleteWorkspaceAndProjects({ uid, workspaceId })
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

    return firestore.removeUserFromWorkspace({ uid, workspaceId })
      .then(() => {
        dispatch(workspaceSlice.removeUserSuccess());
      })
      .catch(error => {
        dispatch(workspaceSlice.removeUserError(error));
      });
  };
};
