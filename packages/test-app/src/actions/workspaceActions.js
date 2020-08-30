import { createWorkspaceWithData, deleteWorkspaceAndProjects, removeWorkspaceFromUser } from '../api/firestore'
import { setWorkspace } from '../store/authSlice'

export const setActiveWorkspace = activeWorkspaceId => {
  return dispatch => {
    dispatch(setWorkspace(activeWorkspaceId));
  };
};

export const createWorkspace = ({ workspaceName, uid, email }) => {
  return async (dispatch) => {
    dispatch({ type: "CREATE_WORKSPACE" });

    await createWorkspaceWithData({ workspaceName, uid, email })
      .then(({ activeWorkspaceId }) => {
        dispatch({ type: "CREATE_WORKSPACE_SUCCESS" });
        dispatch(setWorkspace(activeWorkspaceId));
      })
      .catch(error => {
        dispatch({ type: "CREATE_WORKSPACE_ERROR", error });
      });
  };
}


export const leaveWorkspace = ({ uid, workspaceId }) => {
  return async (dispatch) => {
    dispatch({ type: "LEAVE_WORKSPACE" });

    await removeWorkspaceFromUser({ uid, workspaceId })
      .then(() => {
        dispatch({ type: "LEAVE_WORKSPACE_SUCCESS" });
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: "LEAVE_WORKSPACE_ERROR", error });
      });
  };
};

export const deleteWorkspace = ({ uid, workspaceId }) => {
  return async (dispatch) => {
    dispatch({ type: "DELETE_WORKSPACE" });

    await deleteWorkspaceAndProjects({ uid, workspaceId })
      .then(() => {
        dispatch({ type: "DELETE_WORKSPACE_SUCCESS", workspaceId });
        dispatch({ type: "SET_WORKSPACE", activeWorkspaceId: null });
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: "DELETE_WORKSPACE_ERROR", error });
      });
  };
};
