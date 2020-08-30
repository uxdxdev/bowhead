import authSlice from "./authSlice";
import projectReducer from "./reducers/projectReducer";
import workspaceReducer from "./reducers/workspaceReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authSlice,
  project: projectReducer,
  workspace: workspaceReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
