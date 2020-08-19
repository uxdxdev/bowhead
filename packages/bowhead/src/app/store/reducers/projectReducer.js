const initState = {};

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT":
      return {
        ...state,
        isCreatingProject: true,
        createProjectError: null,
      };
    case "CREATE_PROJECT_SUCCESS":
      return {
        ...state,
        isCreatingProject: false,
        createProjectError: null,
      };
    // catch any errors when creating projects to display notifications to users.
    case "CREATE_PROJECT_ERROR":
      return {
        ...state,
        isCreatingProject: false,
        createProjectError: "Error creating project"
      };
    case "CREATE_PROJECT_ERROR_RESET":
      return {
        ...state,
        isCreatingProject: false,
        createProjectError: null,
      };
    case "DELETE_PROJECT":
      return { ...state, deleteProjectError: null, isDeletingProject: true };
    case "DELETE_PROJECT_SUCCESS":
      return { ...state, deleteProjectError: null, isDeletingProject: false };
    case "DELETE_PROJECT_ERROR":
      return {
        ...state,
        deleteProjectError: action.error,
        isDeletingProject: false
      };
    default:
      return state;
  }
};

export default projectReducer;
