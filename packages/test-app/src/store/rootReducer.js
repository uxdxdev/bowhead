import authSlice from "./authSlice";
import userSlice from "./userSlice";
import projectSlice from "./projectSlice";
import workspaceSlice from "./workspaceSlice";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  project: projectSlice,
  workspace: workspaceSlice,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
