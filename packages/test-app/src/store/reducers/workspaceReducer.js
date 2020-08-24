const initState = {};

const workspaceReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_WORKSPACE":
      return {
        ...state,
        isCreatingWorkspace: true,
        createWorkspaceError: null,
      };
    case "CREATE_WORKSPACE_SUCCESS":
      return {
        ...state,
        isCreatingWorkspace: false,
        createWorkspaceError: null,
      };
    // catch any errors when creating projects to display notifications to users.
    case "CREATE_WORKSPACE_ERROR":
      return {
        ...state,
        isCreatingWorkspace: false,
        createWorkspaceError: "Error creating project"
      };
    case "CREATE_WORKSPACE_RESET":
      return {
        ...state,
        isCreatingWorkspace: false,
        createWorkspaceError: null,
      };

    case "LEAVE_WORKSPACE":
      return {
        ...state,
        isLeavingWorkspace: true,
        isLeavingWorkspaceError: null
      };
    case "LEAVE_WORKSPACE_SUCCESS":
      return {
        ...state,
        isLeavingWorkspace: false,
        isLeavingWorkspaceError: null
      };
    case "LEAVE_WORKSPACE_ERROR":
      return {
        ...state,
        isLeavingWorkspace: false,
        isLeavingWorkspaceError: action.error
      };


    case "DELETE_WORKSPACE":
      return {
        ...state,
        isDeletingWorkspace: true,
        isDeletingWorkspaceError: null
      };
    case "DELETE_WORKSPACE_SUCCESS":
      return {
        ...state,
        isDeletingWorkspace: false,
        isDeletingWorkspaceError: null
      };
    case "DELETE_WORKSPACE_ERROR":
      return {
        ...state,
        isDeletingWorkspace: false,
        isDeletingWorkspaceError: action.error
      };
    default:
      return state;
  }
};

export default workspaceReducer;
