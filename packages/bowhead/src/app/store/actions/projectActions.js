import { createProjectWithData, deleteProject } from '../../api/firestore'

export const resetCreateProjectState = () => {
  return dispatch => {
    dispatch({ type: "CREATE_PROJECT_ERROR_RESET" });
  };
};

export const createProject = ({ workspaceId, title, summary }) => {
  return async (dispatch) => {

    dispatch({ type: "CREATE_PROJECT" });

    await createProjectWithData({ workspaceId, title, summary })
      .then(() => {
        dispatch({ type: "CREATE_PROJECT_SUCCESS" });
      })
      .catch(error => {
        dispatch({ type: "CREATE_PROJECT_ERROR", error });
      });
  };
};

export const deleteProjectFromWorkspace = ({ projectId, workspaceId }) => {
  return async (dispatch) => {

    dispatch({ type: "DELETE_PROJECT" });

    await deleteProject({ projectId, workspaceId })
      .then(() => {
        dispatch({ type: "DELETE_PROJECT_SUCCESS" });
      })
      .catch(error => {
        dispatch({ type: "DELETE_PROJECT_ERROR", error });
      });
  };
};
